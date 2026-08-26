-- ============================================================
-- OpenHRApp — Give the seeded templates a real call to action
-- 0036_seed_templates_with_buttons.sql
--
-- The seeded bodies ended with a bare text link, which is why a test send read
-- as an unstyled note rather than as a product email. Replaces the trailing
-- link with a button.
--
-- A button is stored as an ordinary anchor carrying data-btn. It survives
-- sanitising, stays a working link if the styling is ever dropped, and reads
-- correctly to a screen reader; the send path turns it into the table-based
-- construction email clients need.
--
-- Guarded on `not like '%data-btn%'` so a template an admin has already edited
-- and given a button is left alone. Editing customer-facing copy out from under
-- someone is worse than leaving an old default in place.
-- ============================================================

update public.email_templates
set body_template = '<p>Hi {{admin_name}},</p>'
  || '<p>You started setting up <strong>{{org_name}}</strong> on OpenHRApp but have not confirmed your email address yet. Until you do, you will not be able to sign in.</p>'
  || '<p><a href="{{app_url}}" data-btn="teal">Confirm my email</a></p>'
  || '<p>If you did not create this account, you can ignore this message and nothing further will happen.</p>',
    updated = now()
where key = 'confirm_email' and body_template not like '%data-btn%';

update public.email_templates
set body_template = '<p>Hi {{admin_name}},</p>'
  || '<p><strong>{{org_name}}</strong> is set up, but there are no employees on it yet. Attendance and leave only start working once your team is added.</p>'
  || '<p><a href="{{app_url}}" data-btn="teal">Add your team</a></p>'
  || '<p>You can add people one at a time, or import a list if you have one.</p>',
    updated = now()
where key = 'getting_started' and body_template not like '%data-btn%';

update public.email_templates
set body_template = '<p>Hi {{admin_name}},</p>'
  || '<p>Your team is on <strong>{{org_name}}</strong>, but nobody has checked in yet. Here is how it works:</p>'
  || '<ul><li>Employees check in and out from their own dashboard.</li>'
  || '<li>You see everything as it happens under Attendance.</li>'
  || '<li>Late arrivals are worked out from the office hours you set.</li></ul>'
  || '<p><a href="{{app_url}}" data-btn="blue">Open OpenHRApp</a></p>',
    updated = now()
where key = 'how_to_use' and body_template not like '%data-btn%';

update public.email_templates
set body_template = '<p>Hi {{admin_name}},</p>'
  || '<p>The trial for <strong>{{org_name}}</strong> ends on {{trial_end}}. Your data stays exactly where it is either way.</p>'
  || '<p><a href="{{app_url}}" data-btn="amber">Open OpenHRApp</a></p>',
    updated = now()
where key = 'trial_ending' and body_template not like '%data-btn%';
