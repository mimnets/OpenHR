-- ============================================================
-- OpenHRApp — AI admin reporting: curated views + a contained query runner
-- 0032_ai_admin_reports.sql
--
-- Lets a super admin ask questions in plain English and have a model turn them
-- into a read-only query, so they can find the organizations and addresses worth
-- targeting before switching an email template on.
--
-- The threat model is the point. Organization names and email addresses are
-- written by whoever registered, and they are fed to the model as data — so the
-- model must be assumed steerable. The containment is therefore NOT the prompt
-- and NOT the keyword filter; it is a Postgres role that is physically incapable
-- of doing anything except SELECT from four views:
--
--   * ai_readonly holds no privileges anywhere else in the database.
--   * The runner switches to that role before executing anything.
--   * The views are owned by postgres and are NOT security_invoker, so they are
--     the only window ai_readonly has onto the real tables.
--   * A statement timeout and a hard row cap bound the blast radius.
--
-- Worst realistic case if the model is fully hijacked: it reads data the super
-- admin can already read, slowly, 200 rows at a time.
-- ============================================================

create schema if not exists ai_reports;

-- ── Curated views ───────────────────────────────────────────────────────────
-- Deliberately denormalised and pre-aggregated. The model writes better SQL
-- against four obvious views than against fifteen normalised tables, and a
-- narrow surface is easier to reason about than a wide one.

create or replace view ai_reports.organizations as
with u as (
  select organization_id oid, count(*)::int n,
         count(*) filter (where verified is not true)::int unverified
  from public.profiles where organization_id is not null group by organization_id
), a as (
  select organization_id oid, count(*)::int n, max(created) last_at
  from public.attendance where organization_id is not null group by organization_id
), l as (
  select organization_id oid, count(*)::int n
  from public.leaves where organization_id is not null group by organization_id
), s as (
  select organization_id oid, count(*)::int n
  from public.settings where organization_id is not null group by organization_id
), adm as (
  select distinct on (organization_id)
         organization_id oid, email, name, verified
  from public.profiles where role = 'ADMIN' and organization_id is not null
  order by organization_id, created
)
select
  o.id                                as organization_id,
  o.name                              as organization_name,
  o.country,
  o.subscription_status,
  o.created                           as registered_at,
  o.trial_end_date,
  coalesce(o.is_demo, false)          as is_demo,
  adm.email                           as admin_email,
  adm.name                            as admin_name,
  coalesce(adm.verified, false)       as admin_email_confirmed,
  coalesce(u.n, 0)                    as user_count,
  coalesce(u.unverified, 0)           as unconfirmed_user_count,
  coalesce(a.n, 0)                    as attendance_count,
  coalesce(l.n, 0)                    as leave_count,
  coalesce(s.n, 0)                    as settings_count,
  a.last_at                           as last_attendance_at,
  (coalesce(a.n,0) = 0 and coalesce(l.n,0) = 0) as never_used,
  (now()::date - o.created::date)     as days_since_registration
from public.organizations o
left join u   on u.oid   = o.id
left join a   on a.oid   = o.id
left join l   on l.oid   = o.id
left join s   on s.oid   = o.id
left join adm on adm.oid = o.id;

create or replace view ai_reports.people as
select
  p.id              as profile_id,
  p.organization_id,
  o.name            as organization_name,
  p.name,
  p.email,
  p.role,
  p.status,
  coalesce(p.verified, false) as email_confirmed,
  p.department,
  p.designation,
  p.created         as joined_at
from public.profiles p
left join public.organizations o on o.id = p.organization_id;

create or replace view ai_reports.email_history as
select
  es.template_key,
  es.stage,
  es.recipient_email,
  es.organization_id,
  o.name as organization_name,
  es.status,
  es.provider,
  es.model,
  es.subject,
  es.ai_used,
  es.error,
  es.created as sent_at
from public.email_sends es
left join public.organizations o on o.id = es.organization_id;

create or replace view ai_reports.email_suppressions as
select email, reason, note, created as suppressed_at
from public.email_suppressions;

-- ── The contained role ──────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'ai_readonly') then
    create role ai_readonly nologin;
  end if;
end $$;

-- Grant exactly this and nothing else.
grant usage on schema ai_reports to ai_readonly;
grant select on all tables in schema ai_reports to ai_readonly;
alter default privileges in schema ai_reports grant select on tables to ai_readonly;

-- The runner is SECURITY DEFINER, so it starts as the owner. It must be able to
-- become ai_readonly before executing anything the model wrote.
grant ai_readonly to postgres;

-- ── The query runner ────────────────────────────────────────────────────────
create or replace function public.ai_admin_query(p_sql text)
returns jsonb
language plpgsql
security definer
set search_path = ai_reports, pg_temp
as $$
declare
  v_clean  text := btrim(coalesce(p_sql, ''), E' \t\n\r;');
  v_result jsonb;
begin
  if not public.is_super_admin() then
    raise exception 'Only SUPER_ADMIN may run report queries' using errcode = '42501';
  end if;

  if v_clean = '' then
    raise exception 'No query supplied';
  end if;

  -- One statement only. Stops the classic "; drop ..." tail even though the
  -- role could not execute it anyway.
  if position(';' in v_clean) > 0 then
    raise exception 'Only a single statement is allowed';
  end if;

  if v_clean !~* '^(select|with)\s' then
    raise exception 'Only SELECT queries are allowed';
  end if;

  -- A defence in depth, not the defence. Word-bounded so an organization called
  -- "Versatile Creation Ltd" does not trip the "create" rule.
  if v_clean ~* '\m(insert|update|delete|drop|alter|create|grant|revoke|truncate|copy|call|do|vacuum|reindex|refresh|listen|notify|prepare|lock|set|reset)\M' then
    raise exception 'Only read-only SELECT queries are allowed';
  end if;

  -- Bound the cost before handing over control.
  set local statement_timeout = '8s';
  set local role ai_readonly;

  execute format(
    'select coalesce(jsonb_agg(t), ''[]''::jsonb) from (select * from (%s) q limit 200) t',
    v_clean
  ) into v_result;

  reset role;
  return v_result;
exception
  when others then
    -- Always drop privileges back, then re-raise for the caller to surface.
    reset role;
    raise;
end;
$$;

revoke all on function public.ai_admin_query(text) from public;
grant execute on function public.ai_admin_query(text) to authenticated;

comment on function public.ai_admin_query(text) is
  'Runs a single read-only SELECT against the ai_reports views as the ai_readonly role. SUPER_ADMIN only. Capped at 200 rows and an 8 second timeout.';
