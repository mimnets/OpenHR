-- ============================================================
-- OpenHR — AI lifecycle email automation
-- 0029_ai_email_automation.sql
--
-- Templates a super admin can edit, an AI instruction per template, a send
-- ledger that doubles as the deduplication key, and a suppression list.
--
-- Every template ships INACTIVE. Nothing sends until a human turns it on, and
-- the reason is concrete: 81 of 318 accounts on this platform never confirmed
-- their email, and most came from the same unprotected signup form that
-- produced 130 ghost organizations. Mailing that backlog drives the bounce rate
-- up, and bounce rate decides whether openhrapp.com's real transactional mail
-- lands in an inbox or a spam folder. That reputation is slow to earn and slow
-- to repair, so the default is off.
-- ============================================================

-- ── Templates ───────────────────────────────────────────────────────────────
create table if not exists public.email_templates (
  id               uuid primary key default gen_random_uuid(),
  key              text not null unique,
  name             text not null,
  description      text,
  -- Who this template is for. The cron resolves each audience with its own query.
  audience         text not null check (audience in
                     ('UNCONFIRMED_ADMIN','NO_EMPLOYEES','NO_ATTENDANCE','TRIAL_ENDING')),
  -- Used verbatim when ai_enabled is false, and as the fallback whenever
  -- generation fails. A template that cannot send without the model is a
  -- template that stops working the day the provider has an outage.
  subject_template text not null,
  body_template    text not null,
  ai_enabled       boolean not null default true,
  -- The super admin's instruction to the model: tone, length, what to mention.
  ai_prompt        text,
  provider         text not null default 'openrouter'
                     check (provider in ('openrouter','deepseek','openai','anthropic')),
  model            text not null default 'deepseek/deepseek-chat-v3-0324:free',
  -- Days after the qualifying event to send each stage, e.g. {1,3,7}.
  send_after_days  int[] not null default '{1}',
  daily_cap        int  not null default 50 check (daily_cap between 1 and 500),
  is_active        boolean not null default false,
  created          timestamptz not null default now(),
  updated          timestamptz not null default now()
);

-- ── Send ledger ─────────────────────────────────────────────────────────────
-- The unique constraint is the whole point: a retry, an overlapping cron run or
-- a manual re-trigger can never send the same person the same stage twice.
create table if not exists public.email_sends (
  id                 uuid primary key default gen_random_uuid(),
  template_key       text not null,
  stage              int  not null,
  recipient_email    text not null,
  recipient_id       uuid,
  organization_id    uuid,
  status             text not null check (status in ('SENT','FAILED','SKIPPED','PREVIEW')),
  provider           text,
  model              text,
  subject            text,
  ai_used            boolean not null default false,
  error              text,
  created            timestamptz not null default now(),
  constraint email_sends_once unique (template_key, stage, recipient_email)
);

create index if not exists email_sends_created_idx  on public.email_sends (created desc);
create index if not exists email_sends_template_idx on public.email_sends (template_key, created desc);
create index if not exists email_sends_org_idx      on public.email_sends (organization_id);

-- ── Suppression list ────────────────────────────────────────────────────────
-- Checked before every send. A hard bounce or an unsubscribe is permanent
-- unless a human removes it.
create table if not exists public.email_suppressions (
  email    text primary key,
  reason   text not null check (reason in ('HARD_BOUNCE','UNSUBSCRIBED','COMPLAINT','MANUAL')),
  note     text,
  created  timestamptz not null default now()
);

-- ── RLS: super admin reads; the client never writes the delivery record ─────
alter table public.email_templates    enable row level security;
alter table public.email_sends        enable row level security;
alter table public.email_suppressions enable row level security;

drop policy if exists "email_templates_select" on public.email_templates;
create policy "email_templates_select" on public.email_templates
  for select using (public.is_super_admin());

-- Templates are the one thing a super admin edits directly from the dashboard.
drop policy if exists "email_templates_write" on public.email_templates;
create policy "email_templates_write" on public.email_templates
  for update using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists "email_sends_select" on public.email_sends;
create policy "email_sends_select" on public.email_sends
  for select using (public.is_super_admin());

drop policy if exists "email_suppressions_select" on public.email_suppressions;
create policy "email_suppressions_select" on public.email_suppressions
  for select using (public.is_super_admin());

drop policy if exists "email_suppressions_write" on public.email_suppressions;
create policy "email_suppressions_write" on public.email_suppressions
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- email_sends has no write policy on purpose: only the service-role cron
-- appends to it, so the delivery record cannot be edited from the dashboard.

-- ── Starter templates, all inactive ─────────────────────────────────────────
insert into public.email_templates
  (key, name, description, audience, subject_template, body_template, ai_prompt, send_after_days, daily_cap)
values
(
  'confirm_email',
  'Confirm your email',
  'For admins who registered but never clicked the confirmation link.',
  'UNCONFIRMED_ADMIN',
  'Confirm your email to finish setting up {{org_name}}',
  '<p>Hi {{admin_name}},</p><p>You started setting up <strong>{{org_name}}</strong> on OpenHR but have not confirmed your email address yet. Until you do, you will not be able to sign in.</p><p><a href="{{app_url}}">Open OpenHR</a></p>',
  'Write a short, warm reminder that the admin has not confirmed their email address yet. Two short paragraphs at most. Mention their organization name naturally. Do not invent features, deadlines or discounts. No exclamation marks. End with one clear action: confirm the email address.',
  '{1,3,7}',
  50
),
(
  'getting_started',
  'Getting started',
  'For organizations whose admin confirmed but who never added an employee.',
  'NO_EMPLOYEES',
  'Add your first employee to {{org_name}}',
  '<p>Hi {{admin_name}},</p><p><strong>{{org_name}}</strong> is set up, but there are no employees yet. Adding your team is what turns on attendance and leave.</p><p><a href="{{app_url}}">Add your team</a></p>',
  'Write a brief, practical nudge to add their first employee. Explain in one sentence why it matters: attendance and leave only work once people are added. Two short paragraphs. Plain and helpful, not salesy. No exclamation marks.',
  '{1,4}',
  50
),
(
  'how_to_use',
  'How to use OpenHR',
  'For organizations with employees but no attendance recorded yet.',
  'NO_ATTENDANCE',
  'How your team checks in on OpenHR',
  '<p>Hi {{admin_name}},</p><p>Your team is on <strong>{{org_name}}</strong> but nobody has checked in yet. Employees check in from their own dashboard; you can see everything under Attendance.</p><p><a href="{{app_url}}">Open OpenHR</a></p>',
  'Explain in plain language how employees check in and where the admin sees attendance. Three short paragraphs at most. Assume the reader is not technical. Do not describe features that are not mentioned in the fallback text.',
  '{3,10}',
  50
),
(
  'trial_ending',
  'Trial ending',
  'For organizations whose trial is about to end. Coordinate with cron-expire-trials before enabling.',
  'TRIAL_ENDING',
  'Your OpenHR trial for {{org_name}} ends soon',
  '<p>Hi {{admin_name}},</p><p>The trial for <strong>{{org_name}}</strong> ends on {{trial_end}}.</p><p><a href="{{app_url}}">Open OpenHR</a></p>',
  'Write a factual, unpushy note that the trial is ending, including the date. Two short paragraphs. Do not use urgency language, countdowns or pressure. State what happens next plainly.',
  '{3}',
  50
)
on conflict (key) do nothing;
