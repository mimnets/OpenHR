-- ============================================================
-- OpenHRApp — More audiences for lifecycle email
-- 0035_more_email_audiences.sql
--
-- 0029 shipped four audiences, which is enough to prove the mechanism and not
-- enough to plan around. Adds five more, each of which the daily job resolves
-- with its own query.
--
-- Every audience still excludes the demo organization, still runs through the
-- suppression list, still obeys the per-template daily cap, and still cannot
-- send the same person the same stage twice. Widening the audience list does
-- not widen any of that.
-- ============================================================

alter table public.email_templates
  drop constraint if exists email_templates_audience_check;

alter table public.email_templates
  add constraint email_templates_audience_check check (audience in (
    -- Original four
    'UNCONFIRMED_ADMIN',  -- admin registered, never confirmed the address
    'NO_EMPLOYEES',       -- confirmed, but never added anyone
    'NO_ATTENDANCE',      -- has employees, nobody has ever checked in
    'TRIAL_ENDING',       -- trial still running; stage counts days REMAINING

    -- Added here
    'WELCOME',            -- confirmed and set up; stage counts days since registering
    'TRIAL_EXPIRED',      -- trial end date has passed and they are still on TRIAL
    'SETUP_INCOMPLETE',   -- no settings ever saved, so onboarding was abandoned
    'DORMANT',            -- was active once; stage counts days since last activity
    'ACTIVE_ENGAGED'      -- healthy and in use; for product news and tips
  ));

comment on column public.email_templates.audience is
  'Which group the daily job resolves for this template. For TRIAL_ENDING the stage counts days REMAINING before the trial ends; for DORMANT it counts days since last activity; for everything else it counts days since the qualifying event.';
