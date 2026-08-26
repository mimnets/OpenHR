// OpenHR — AI lifecycle email sender
// Schedule: 0 9 * * * (daily, 09:00 UTC)
//
// Walks every ACTIVE template, resolves its audience, works out which stage
// each recipient is due, generates copy from the super admin's instruction, and
// sends. Inactive templates are skipped, and every template ships inactive.
//
// Three things keep this from becoming a spam cannon:
//   1. email_sends has a unique (template, stage, recipient) constraint, so a
//      retry or an overlapping run can never send the same stage twice.
//   2. Every send checks the suppression list first.
//   3. Each template has a daily cap.
//
// Supports ?dryRun=1 to resolve and generate without sending anything.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generate, LlmProvider } from '../_shared/llm.ts';
import { signUnsubscribe } from '../_shared/unsubscribe.ts';

const FROM_EMAIL = 'OpenHR <noreply@openhrapp.com>';
const APP_URL = 'https://openhrapp.com';

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}

function render(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, k) => vars[k] ?? '');
}

const SYSTEM_PROMPT = [
  'You write short transactional emails for OpenHR, an HR and attendance product.',
  'Return ONLY a JSON object with exactly two string keys: "subject" and "body_html".',
  'body_html must be simple HTML using only <p>, <strong>, <em>, <a>, <ul>, <li>. No styles, scripts, images, head or body tags.',
  'Never invent features, prices, deadlines, statistics or discounts. If unsure whether something exists, leave it out.',
  'Never fabricate a link. Use only the URL given to you, exactly as given.',
  'Write plainly. No marketing superlatives, no exclamation marks, no pressure language.',
].join(' ');

const DAY_MS = 86_400_000;
const daysSince = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / DAY_MS);
const daysUntil = (iso: string) => Math.floor((new Date(iso).getTime() - Date.now()) / DAY_MS);

interface Candidate {
  email: string;
  profileId: string | null;
  orgId: string | null;
  orgName: string;
  adminName: string;
  trialEnd: string | null;
  /** Days since the qualifying event — or days until, for TRIAL_ENDING. */
  age: number;
}

Deno.serve(async (req: Request) => {
  // Same three-way guard the other cron functions use:
  //   1. pg_net internal call — Authorization: Bearer <CRON_SECRET> (bypasses Kong)
  //   2. External call with the service-role key
  //   3. External call with x-cron-secret, when Kong needs the anon key in Authorization
  const cronSecret = Deno.env.get('CRON_SECRET');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const authHeader = req.headers.get('Authorization') || '';
  const cronHeader = req.headers.get('x-cron-secret');

  const isCronSecret = cronSecret && (authHeader === `Bearer ${cronSecret}` || cronHeader === cronSecret);
  const isServiceRole = serviceRoleKey && authHeader === `Bearer ${serviceRoleKey}`;

  if (!isCronSecret && !isServiceRole) {
    return json(401, { success: false, message: 'Unauthorized' });
  }

  const dryRun = new URL(req.url).searchParams.get('dryRun') === '1';

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey && !dryRun) {
    return json(500, { success: false, message: 'RESEND_API_KEY is not configured' });
  }

  const { data: templates } = await admin
    .from('email_templates').select('*').eq('is_active', true);

  if (!templates?.length) {
    return json(200, { success: true, message: 'No active templates — nothing to do.', sent: 0 });
  }

  // One read of the suppression list beats one query per recipient.
  const { data: suppRows } = await admin.from('email_suppressions').select('email');
  const suppressed = new Set((suppRows ?? []).map((r: { email: string }) => r.email.toLowerCase()));

  const summary: Record<string, unknown>[] = [];
  let totalSent = 0, totalSkipped = 0, totalFailed = 0;

  for (const tpl of templates) {
    const stages: number[] = tpl.send_after_days ?? [];
    const candidates = await resolveAudience(admin, tpl.audience);
    let sent = 0, skipped = 0, failed = 0;

    for (const c of candidates) {
      if (sent >= tpl.daily_cap) { skipped++; continue; }

      // Which stage is this recipient due today? Exact match only — a missed
      // day is a missed stage rather than a burst of catch-up mail.
      const stage = stages.find((d) => d === c.age);
      if (stage === undefined) { skipped++; continue; }

      if (!c.email || suppressed.has(c.email.toLowerCase())) { skipped++; continue; }

      // Belt and braces alongside the unique constraint: cheaper to check than
      // to generate copy and then have the insert reject it.
      const { data: already } = await admin
        .from('email_sends').select('id')
        .eq('template_key', tpl.key).eq('stage', stage).eq('recipient_email', c.email)
        .maybeSingle();
      if (already) { skipped++; continue; }

      const vars: Record<string, string> = {
        org_name: c.orgName,
        admin_name: c.adminName,
        app_url: APP_URL,
        trial_end: c.trialEnd
          ? new Date(c.trialEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          : '',
      };

      let subject = render(tpl.subject_template, vars);
      let html    = render(tpl.body_template, vars);
      let aiUsed  = false;

      if (tpl.ai_enabled && tpl.ai_prompt) {
        const result = await generate({
          provider: tpl.provider as LlmProvider,
          model: tpl.model,
          system: SYSTEM_PROMPT,
          user: [
            `Instruction from the sender: ${tpl.ai_prompt}`,
            '',
            'Facts you may use (do not add any others):',
            `- Organization name: ${vars.org_name}`,
            `- Recipient first name: ${vars.admin_name}`,
            `- The only link you may use: ${vars.app_url}`,
            vars.trial_end ? `- Trial end date: ${vars.trial_end}` : '',
            '',
            'For reference, the plain version says:',
            `Subject: ${subject}`,
            html,
          ].filter(Boolean).join('\n'),
        });

        if (result.ok && result.text) {
          try {
            const cleaned = result.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
            const parsed = JSON.parse(cleaned);
            if (typeof parsed.subject === 'string' && typeof parsed.body_html === 'string') {
              subject = parsed.subject.trim();
              html = parsed.body_html.trim();
              aiUsed = true;
            }
          } catch {
            console.warn(`[lifecycle] ${tpl.key}: model output was not JSON, using plain template`);
          }
        } else {
          console.warn(`[lifecycle] ${tpl.key}: generation failed — ${result.error}`);
        }
      }

      const unsubToken = await signUnsubscribe(c.email, cronSecret);
      const unsubUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/email-unsubscribe?token=${unsubToken}`;
      const fullHtml =
        `${html}<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">` +
        `<p style="color:#6b7280;font-size:12px;line-height:1.5">` +
        `You are receiving this because you created an OpenHR account. ` +
        `<a href="${unsubUrl}" style="color:#6b7280">Unsubscribe</a>.</p>`;

      if (dryRun) {
        summary.push({ template: tpl.key, stage, to: c.email, subject, aiUsed, dryRun: true });
        sent++;
        continue;
      }

      let ok = false, errMsg: string | null = null;
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [c.email],
            subject,
            html: fullHtml,
            headers: {
              'List-Unsubscribe': `<${unsubUrl}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          }),
        });
        ok = res.ok;
        if (!ok) errMsg = `Resend ${res.status}: ${(await res.text()).slice(0, 200)}`;
      } catch (e) {
        errMsg = e instanceof Error ? e.message : String(e);
      }

      await admin.from('email_sends').insert({
        template_key: tpl.key,
        stage,
        recipient_email: c.email,
        recipient_id: c.profileId,
        organization_id: c.orgId,
        status: ok ? 'SENT' : 'FAILED',
        provider: tpl.provider,
        model: tpl.model,
        subject,
        ai_used: aiUsed,
        error: errMsg,
      });

      if (ok) { sent++; } else { failed++; console.error(`[lifecycle] ${tpl.key} -> ${c.email}: ${errMsg}`); }
    }

    totalSent += sent; totalSkipped += skipped; totalFailed += failed;
    summary.push({ template: tpl.key, audience: tpl.audience, candidates: candidates.length, sent, skipped, failed });
    console.log(`[lifecycle] ${tpl.key}: sent=${sent} skipped=${skipped} failed=${failed}`);
  }

  return json(200, { success: true, dryRun, sent: totalSent, skipped: totalSkipped, failed: totalFailed, summary });
});

// ── Audience resolution ─────────────────────────────────────────────────────
// Each audience answers a different question, so each gets its own query rather
// than one clever generic one.
async function resolveAudience(admin: any, audience: string): Promise<Candidate[]> {
  const out: Candidate[] = [];

  const { data: orgs } = await admin
    .from('organizations')
    .select('id, name, created, trial_end_date, is_demo')
    .neq('is_demo', true);
  if (!orgs?.length) return out;

  const orgIds = orgs.map((o: any) => o.id);

  const { data: profiles } = await admin
    .from('profiles')
    .select('id, name, email, role, verified, organization_id, created')
    .in('organization_id', orgIds);

  const byOrg = new Map<string, any[]>();
  for (const p of profiles ?? []) {
    if (!byOrg.has(p.organization_id)) byOrg.set(p.organization_id, []);
    byOrg.get(p.organization_id)!.push(p);
  }

  // Which organizations have ever recorded attendance. One query, not one per org.
  const { data: attRows } = await admin
    .from('attendance').select('organization_id').in('organization_id', orgIds).limit(20000);
  const orgsWithAttendance = new Set((attRows ?? []).map((r: any) => r.organization_id));

  for (const org of orgs) {
    const members = byOrg.get(org.id) ?? [];
    const adminProfile = members.find((p: any) => p.role === 'ADMIN');
    if (!adminProfile?.email) continue;

    const base = {
      email: adminProfile.email,
      profileId: adminProfile.id,
      orgId: org.id,
      orgName: org.name ?? 'your organization',
      // First name only — "Hi Mohammed" reads better than the full legal name.
      adminName: (adminProfile.name ?? '').trim().split(/\s+/)[0] || 'there',
      trialEnd: org.trial_end_date ?? null,
    };

    switch (audience) {
      case 'UNCONFIRMED_ADMIN':
        if (adminProfile.verified !== true) {
          out.push({ ...base, age: daysSince(adminProfile.created ?? org.created) });
        }
        break;

      case 'NO_EMPLOYEES':
        if (adminProfile.verified === true && members.length <= 1) {
          out.push({ ...base, age: daysSince(org.created) });
        }
        break;

      case 'NO_ATTENDANCE':
        if (adminProfile.verified === true && members.length > 1 && !orgsWithAttendance.has(org.id)) {
          out.push({ ...base, age: daysSince(org.created) });
        }
        break;

      case 'TRIAL_ENDING':
        // Counted forwards, not backwards: `age` here is days remaining, so a
        // stage of 3 means "three days before the trial ends".
        if (org.trial_end_date) {
          const left = daysUntil(org.trial_end_date);
          if (left >= 0) out.push({ ...base, age: left });
        }
        break;
    }
  }

  return out;
}
