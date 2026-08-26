-- ============================================================
-- OpenHRApp — Let super admins create their own email templates
-- 0034_custom_email_templates.sql
--
-- 0029 shipped four templates and an UPDATE-only policy, so they could be
-- edited but not added to. Adds INSERT and DELETE so new templates can be
-- built in the dashboard and switched on later.
--
-- Also corrects the product name in the seeded rows. 0029 had already been
-- applied when the rename happened, so fixing the migration file alone would
-- have left the live rows still saying "OpenHR" — visible to customers in the
-- subject line.
-- ============================================================

-- ── Product name in the seeded content ──────────────────────────────────────
-- Collapse then expand, so running this twice cannot produce "OpenHRAppApp",
-- and a row an admin has already corrected by hand is left as it is.
update public.email_templates
set
  name             = replace(replace(name,             'OpenHRApp', 'OpenHR'), 'OpenHR', 'OpenHRApp'),
  description      = replace(replace(description,      'OpenHRApp', 'OpenHR'), 'OpenHR', 'OpenHRApp'),
  subject_template = replace(replace(subject_template, 'OpenHRApp', 'OpenHR'), 'OpenHR', 'OpenHRApp'),
  body_template    = replace(replace(body_template,    'OpenHRApp', 'OpenHR'), 'OpenHR', 'OpenHRApp'),
  ai_prompt        = replace(replace(ai_prompt,        'OpenHRApp', 'OpenHR'), 'OpenHR', 'OpenHRApp'),
  updated          = now()
where
  name             like '%OpenHR%'
  or description   like '%OpenHR%'
  or subject_template like '%OpenHR%'
  or body_template    like '%OpenHR%'
  or ai_prompt        like '%OpenHR%';

-- ── Creating and removing templates ─────────────────────────────────────────
drop policy if exists "email_templates_insert" on public.email_templates;
create policy "email_templates_insert" on public.email_templates
  for insert with check (public.is_super_admin());

drop policy if exists "email_templates_delete" on public.email_templates;
create policy "email_templates_delete" on public.email_templates
  for delete using (public.is_super_admin());

-- A template key ends up in email_sends as the deduplication key, so it has to
-- stay stable and URL-safe. Enforced here rather than trusted from the client.
alter table public.email_templates
  drop constraint if exists email_templates_key_format;
alter table public.email_templates
  add constraint email_templates_key_format
  check (key ~ '^[a-z][a-z0-9_]{2,49}$');

-- Deleting a template must not erase the record of what it sent. email_sends
-- has no foreign key to email_templates precisely so that history outlives the
-- template; this comment exists so nobody "helpfully" adds one later.
comment on table public.email_sends is
  'Delivery record. Deliberately has no FK to email_templates: the history of what was sent must survive the template being deleted.';
