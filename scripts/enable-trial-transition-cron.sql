-- ============================================================
-- Enable the nightly ad-free-period transition
-- scripts/enable-trial-transition-cron.sql
--
-- Run this in the Supabase SQL Editor. It is NOT part of `supabase db push`:
-- cron.schedule() needs the project ref and the cron secret, neither of which
-- belongs in a committed migration.
--
-- ── Read this before running ────────────────────────────────────────────────
-- This job has never been scheduled, so a backlog exists. As of 2026-08-22,
-- 127 of 145 TRIAL organizations were already past trial_end_date. The very
-- first run therefore acts on a backlog, not on a normal daily cohort.
--
-- The Edge Function caps itself at TRIAL_TRANSITION_BATCH organizations per run
-- (default 10), so enabling this does NOT move all 127 at once. At the default
-- the backlog drains over about thirteen nights, ten emails at a time.
--
-- PREREQUISITES
--   1. The function is deployed with the AD_SUPPORTED behaviour:
--        npx supabase functions deploy cron-expire-trials
--      The older build set EXPIRED, which puts organizations into read-only
--      mode. Enabling the schedule against that build would disable 127
--      organizations in one night. Confirm the deploy first.
--   2. app.cron_secret is set and matches the function's CRON_SECRET.
--   3. Decide the batch size (see "Tuning" below) before the first run.
-- ============================================================

-- ── Step 1. Confirm the size of the backlog you are about to act on ─────────
-- Run this on its own first. The number it returns is how many organizations
-- will move to AD_SUPPORTED over the coming nights.
select
  count(*) filter (where subscription_status = 'TRIAL'
                     and trial_end_date is not null
                     and trial_end_date < now())              as overdue_now,
  count(*) filter (where subscription_status = 'TRIAL')       as trial_total,
  count(*) filter (where subscription_status = 'AD_SUPPORTED') as ad_supported,
  count(*) filter (where subscription_status = 'EXPIRED')      as expired_should_be_zero
from public.organizations;

-- ── Step 2. Schedule it ─────────────────────────────────────────────────────
-- Replace <PROJECT_REF> with the project ref (the subdomain of your Supabase
-- URL). Safe to re-run: the unschedule first removes any existing job.

select cron.unschedule('auto-expire-trials')
where exists (select 1 from cron.job where jobname = 'auto-expire-trials');

select cron.schedule(
  'auto-expire-trials',
  '0 0 * * *',                       -- daily, midnight UTC
  $$
  select net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/cron-expire-trials',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.cron_secret', true)
    ),
    body := '{}'::jsonb
  );
  $$
);

-- ── Step 3. Watch the first few runs ────────────────────────────────────────
-- The function logs `moved`, `remaining` and the estimated nights left, and
-- returns them in its JSON response. Check the function logs after the first
-- run rather than waiting for the whole backlog to drain.

select jobname, schedule, active from cron.job where jobname = 'auto-expire-trials';

-- Progress, run any time:
--   select subscription_status, count(*)
--     from public.organizations group by 1 order by 2 desc;

-- ============================================================
-- Tuning — set these on the FUNCTION, not here
--   Supabase Dashboard → Edge Functions → cron-expire-trials → Secrets
--
--   TRIAL_TRANSITION_BATCH   how many organizations move per run.
--                            Default 10. 127 backlog ÷ 10 ≈ 13 nights.
--                            Lower it to 5 to be gentler; raise it only once
--                            the first runs look right.
--
--   TRIAL_TRANSITION_PAUSED  set to 'true' to stop transitions immediately
--                            while leaving the 7/3/1-day reminders running.
--                            This is the switch to reach for mid-drain if
--                            something looks wrong — it takes effect on the
--                            next run and needs no redeploy and no unschedule.
--
-- To stop the job outright instead:
--   select cron.unschedule('auto-expire-trials');
-- ============================================================
