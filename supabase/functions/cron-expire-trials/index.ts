// OpenHR — End of the ad-free period
// Schedule: 0 0 * * * (daily midnight UTC)
//
// 1. Finds orgs where subscription_status = 'TRIAL' and trial_end_date < now() →
//    sets AD_SUPPORTED. Emails the org admins.
// 2. Finds orgs whose ad-free period ends in exactly 7, 3, or 1 day(s) → sends a heads-up.
//
// This used to set EXPIRED, which sets isReadOnly in organization.service.ts and disables
// attendance punching, leave, announcements, org settings and performance reviews. That
// contradicted every public statement the product makes — the FAQ ("permanently free… no
// time limits, no feature gates"), the landing page, and the signup screen. TRIAL is an
// ad-free window, not a paid trial: nothing is taken away when it ends, ads simply start.
// EXPIRED still exists and still means read-only, but only a super admin can apply it now.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FROM_EMAIL = 'OpenHR <noreply@openhrapp.com>';

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function sendEmail(resendKey: string, to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`[cron-expire-trials] Resend error: ${res.status} ${err}`);
  }
}

Deno.serve(async (req: Request) => {
  const cronSecret = Deno.env.get('CRON_SECRET');
  const authHeader = req.headers.get('Authorization');
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return jsonResponse(401, { success: false, message: 'Unauthorized' });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const resendKey = Deno.env.get('RESEND_API_KEY');
  const admin = createClient(supabaseUrl, serviceKey);

  const now = new Date();
  let expired = 0;
  let reminded = 0;

  // ── 1. Expire overdue trials ────────────────────────────────────────────────
  const { data: expiredOrgs } = await admin
    .from('organizations')
    .select('id, name')
    .eq('subscription_status', 'TRIAL')
    .not('trial_end_date', 'is', null)
    .lt('trial_end_date', now.toISOString());

  for (const org of expiredOrgs ?? []) {
    if (org.name === '__SYSTEM__' || org.name === 'Platform') continue;

    await admin
      .from('organizations')
      .update({ subscription_status: 'AD_SUPPORTED', updated: now.toISOString() })
      .eq('id', org.id);

    expired++;
    console.log(`[cron-expire-trials] Org moved to ad-supported: ${org.name} (${org.id})`);

    if (!resendKey) continue;

    // Email org admins.
    const { data: admins } = await admin
      .from('profiles')
      .select('id, name, email')
      .eq('organization_id', org.id)
      .eq('role', 'ADMIN');

    for (const adm of admins ?? []) {
      if (!adm.email) {
        console.warn(`[cron-expire-trials] Admin ${adm.id} has no email in profiles — skipping`);
        continue;
      }

      await sendEmail(
        resendKey,
        adm.email,
        `Your ad-free period has ended — ${org.name}`,
        `<h2>Your ad-free period has ended</h2>
         <p>Dear ${adm.name || 'Admin'},</p>
         <p>The first 14 days for <strong>${org.name}</strong> are up, so you will start seeing
            ads in OpenHR from today.</p>
         <p><strong>Nothing else changes.</strong> OpenHRApp is free forever — every feature
            stays available, there are no employee limits, and nothing has been switched off.</p>
         <p>If you would rather not see ads, a donation removes them for your whole
            organization. Visit the Upgrade page in your account for details.</p>`,
      );

      // Bell notification.
      await admin.from('notifications').insert({
        user_id: adm.id,
        organization_id: org.id,
        type: 'SYSTEM',
        title: 'Ads are now on',
        message: 'Your 14-day ad-free period has ended. Every feature stays available — donate to remove ads.',
        is_read: false,
        priority: 'NORMAL',
        action_url: 'upgrade',
      });
    }
  }

  // ── 2. Trial expiry reminders: 7, 3, 1 days before ─────────────────────────
  const reminderDays = [7, 3, 1];

  for (const daysLeft of reminderDays) {
    const targetStart = new Date(now);
    targetStart.setUTCHours(0, 0, 0, 0);
    targetStart.setDate(targetStart.getDate() + daysLeft);

    const targetEnd = new Date(targetStart);
    targetEnd.setDate(targetEnd.getDate() + 1);

    const { data: reminderOrgs } = await admin
      .from('organizations')
      .select('id, name')
      .eq('subscription_status', 'TRIAL')
      .not('trial_end_date', 'is', null)
      .gte('trial_end_date', targetStart.toISOString())
      .lt('trial_end_date', targetEnd.toISOString());

    for (const org of reminderOrgs ?? []) {
      if (org.name === '__SYSTEM__' || org.name === 'Platform') continue;

      if (!resendKey) { reminded++; continue; }

      const { data: admins } = await admin
        .from('profiles')
        .select('id, name, email')
        .eq('organization_id', org.id)
        .eq('role', 'ADMIN');

      const isUrgent = daysLeft <= 3;
      const dayLabel = daysLeft === 1 ? 'day' : 'days';
      const subject = `Your ad-free period ends in ${daysLeft} ${dayLabel} — ${org.name}`;

      for (const adm of admins ?? []) {
        if (!adm.email) {
          console.warn(`[cron-expire-trials] Admin ${adm.id} has no email in profiles — skipping reminder`);
          continue;
        }

        await sendEmail(
          resendKey,
          adm.email,
          subject,
          `<h2>Your ad-free period is ending</h2>
           <p>Dear ${adm.name || 'Admin'},</p>
           <p>The ad-free period for <strong>${org.name}</strong> ends in
              <strong>${daysLeft} ${dayLabel}</strong>, after which you will start seeing ads.</p>
           <p><strong>You do not need to do anything.</strong> OpenHRApp stays free and every
              feature keeps working — this is not a trial that runs out.</p>
           <p>If you would prefer to stay ad-free, a donation removes ads for your whole
              organization. See the Upgrade page in your account.</p>`,
        );

        // Bell notification.
        await admin.from('notifications').insert({
          user_id: adm.id,
          organization_id: org.id,
          type: 'SYSTEM',
          title: `Ad-free period ends in ${daysLeft} ${dayLabel}`,
          message: `Ads start for ${org.name} in ${daysLeft} ${dayLabel}. Every feature stays available.`,
          is_read: false,
          priority: isUrgent ? 'HIGH' : 'NORMAL',
          action_url: 'upgrade',
        });

        reminded++;
      }
    }
  }

  console.log(`[cron-expire-trials] Done. expired=${expired} reminded=${reminded}`);
  return jsonResponse(200, { success: true, expired, reminded });
});
