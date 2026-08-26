// OpenHR — AI email preview / test send
//
// Super admin only. Renders a template for a real (or sample) recipient, runs
// the configured model over the super admin's instruction, and returns the
// result. Optionally sends it — but only ever to the caller's own address, so
// no amount of clicking around in the dashboard can put a test message in a
// customer's inbox.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generate, availableProviders, LlmProvider } from '../_shared/llm.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FROM_EMAIL = 'OpenHR <noreply@openhrapp.com>';
const APP_URL = 'https://openhrapp.com';

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/** Very small mustache: {{name}} only. Anything unknown becomes an empty string. */
function render(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, k) => vars[k] ?? '');
}

const SYSTEM_PROMPT = [
  'You write short transactional emails for OpenHR, an HR and attendance product.',
  'Return ONLY a JSON object with exactly two string keys: "subject" and "body_html".',
  'body_html must be simple HTML using only <p>, <strong>, <em>, <a>, <ul>, <li>. No styles, no scripts, no images, no head or body tags.',
  'Never invent features, prices, deadlines, statistics or discounts. If you are unsure whether something exists, leave it out.',
  'Never fabricate a link. Use only the URL given to you, exactly as given.',
  'Write plainly. No marketing superlatives, no exclamation marks, no pressure language.',
].join(' ');

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { message: 'Method not allowed' });

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json(401, { message: 'Missing Authorization header' });

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: { user: caller }, error: authErr } =
    await admin.auth.getUser(authHeader.replace('Bearer ', ''));
  if (authErr || !caller) return json(401, { message: 'Invalid token' });

  const { data: callerProfile } = await admin
    .from('profiles').select('role, name, email').eq('id', caller.id).maybeSingle();
  if (callerProfile?.role !== 'SUPER_ADMIN') {
    return json(403, { message: 'Only SUPER_ADMIN can preview automated email' });
  }

  try {
    const body = await req.json();
    const templateKey = String(body.templateKey ?? '');
    const mode = body.mode === 'test-send' ? 'test-send' : 'preview';
    if (!templateKey) return json(400, { message: 'templateKey is required' });

    const { data: tpl } = await admin
      .from('email_templates').select('*').eq('key', templateKey).maybeSingle();
    if (!tpl) return json(404, { message: `No template named ${templateKey}` });

    // A real organization matching this template's audience makes the preview
    // honest. Falling back to placeholders is better than refusing to render.
    const { data: sampleOrg } = await admin
      .from('organizations').select('id, name, trial_end_date').limit(1).maybeSingle();
    const { data: sampleAdmin } = sampleOrg
      ? await admin.from('profiles').select('name').eq('organization_id', sampleOrg.id)
          .eq('role', 'ADMIN').limit(1).maybeSingle()
      : { data: null };

    const vars: Record<string, string> = {
      org_name:   sampleOrg?.name ?? 'Acme Ltd',
      admin_name: sampleAdmin?.name ?? callerProfile.name ?? 'there',
      app_url:    APP_URL,
      trial_end:  sampleOrg?.trial_end_date
        ? new Date(sampleOrg.trial_end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'the end of the trial',
    };

    // Deterministic fallback. Also what actually ships if generation fails.
    let subject = render(tpl.subject_template, vars);
    let html    = render(tpl.body_template, vars);
    let aiUsed  = false;
    let aiError: string | null = null;

    if (tpl.ai_enabled && tpl.ai_prompt) {
      const userPrompt = [
        `Instruction from the sender: ${tpl.ai_prompt}`,
        '',
        'Facts you may use (do not add any others):',
        `- Organization name: ${vars.org_name}`,
        `- Recipient first name: ${vars.admin_name}`,
        `- The only link you may use: ${vars.app_url}`,
        `- Trial end date (only if relevant): ${vars.trial_end}`,
        '',
        'For reference, the plain version of this email says:',
        `Subject: ${subject}`,
        html,
      ].join('\n');

      const result = await generate({
        provider: tpl.provider as LlmProvider,
        model: tpl.model,
        system: SYSTEM_PROMPT,
        user: userPrompt,
      });

      if (result.ok && result.text) {
        try {
          // Models often wrap JSON in a code fence despite instructions.
          const cleaned = result.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
          const parsed = JSON.parse(cleaned);
          if (typeof parsed.subject === 'string' && typeof parsed.body_html === 'string') {
            subject = parsed.subject.trim();
            html = parsed.body_html.trim();
            aiUsed = true;
          } else {
            aiError = 'Model returned JSON without subject/body_html — using the plain version.';
          }
        } catch {
          aiError = 'Model did not return valid JSON — using the plain version.';
        }
      } else {
        aiError = result.error ?? 'Generation failed — using the plain version.';
      }
    }

    let sent = false;
    if (mode === 'test-send') {
      const resendKey = Deno.env.get('RESEND_API_KEY');
      const to = callerProfile.email ?? caller.email;
      if (!resendKey) return json(500, { message: 'RESEND_API_KEY is not configured' });
      if (!to) return json(400, { message: 'Your account has no email address to send a test to' });

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [to],
          subject: `[TEST] ${subject}`,
          html: `${html}<hr><p style="color:#6b7280;font-size:12px">Test send from the OpenHR dashboard. Template: ${tpl.key}. Not sent to any customer.</p>`,
        }),
      });
      if (!res.ok) {
        return json(502, { message: `Resend ${res.status}: ${(await res.text()).slice(0, 200)}` });
      }
      sent = true;

      await admin.from('email_sends').insert({
        template_key: tpl.key,
        stage: -1,                 // -1 marks a test, so it never blocks a real stage
        recipient_email: `test:${to}:${Date.now()}`,
        recipient_id: caller.id,
        status: 'PREVIEW',
        provider: tpl.provider,
        model: tpl.model,
        subject,
        ai_used: aiUsed,
      });
    }

    return json(200, {
      subject,
      html,
      aiUsed,
      aiError,
      sent,
      sentTo: sent ? (callerProfile.email ?? caller.email) : null,
      provider: tpl.provider,
      model: tpl.model,
      availableProviders: availableProviders(),
      sampleVars: vars,
    });
  } catch (err) {
    console.error('[ai-email-preview]', err);
    return json(500, { message: 'Internal error: ' + (err as Error).message });
  }
});
