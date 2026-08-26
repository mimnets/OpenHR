-- ============================================================
-- OpenHRApp — Make the seeded email copy read like a person wrote it
-- 0037_natural_email_copy.sql
--
-- "Open OpenHRApp" was a bad button label and "Your OpenHRApp trial for
-- {{org_name}} ends soon" was a bad subject line. Two problems:
--
--   1. The brand already appears in the email header, so repeating it in the
--      button is redundant. The reader knows who sent it.
--   2. A button label should name the ACTION, not the tool. "Open your
--      dashboard" tells someone what happens when they click; "Open OpenHRApp"
--      tells them where they already know they are going.
--
-- Subjects now lead with the organization name, which is the part the reader
-- recognises in a crowded inbox, rather than burying it mid-sentence.
--
-- Still guarded so an edited template is never overwritten.
-- ============================================================

update public.email_templates
set subject_template = 'Confirm your email to finish setting up {{org_name}}',
    updated = now()
where key = 'confirm_email' and subject_template like '%OpenHR%';

update public.email_templates
set subject_template = '{{org_name}}: how your team checks in',
    body_template = replace(body_template, '>Open OpenHRApp<', '>Open your dashboard<'),
    updated = now()
where key = 'how_to_use' and (subject_template like '%OpenHR%' or body_template like '%Open OpenHRApp%');

update public.email_templates
set subject_template = '{{org_name}}: your trial ends on {{trial_end}}',
    body_template = replace(body_template, '>Open OpenHRApp<', '>Open your dashboard<'),
    updated = now()
where key = 'trial_ending' and (subject_template like '%OpenHR%' or body_template like '%Open OpenHRApp%');

-- Catch-all for any template still carrying the awkward label, including ones
-- created before this migration.
update public.email_templates
set body_template = replace(body_template, '>Open OpenHRApp<', '>Open your dashboard<'),
    updated = now()
where body_template like '%>Open OpenHRApp<%';
