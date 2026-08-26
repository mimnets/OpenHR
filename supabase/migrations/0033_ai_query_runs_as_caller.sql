-- ============================================================
-- OpenHRApp — Run AI report queries as the caller, not as the owner
-- 0033_ai_query_runs_as_caller.sql
--
-- 0032 made ai_admin_query SECURITY DEFINER and tried to contain it by switching
-- to a stripped-down ai_readonly role. Two problems with that:
--
--   1. SET ROLE checks membership against the SESSION user, which inside a
--      SECURITY DEFINER function is still the PostgREST role — not the owner.
--      The switch would most likely have failed at runtime.
--   2. More importantly it was solving the problem the hard way. Running as the
--      owner means starting with superuser reach and clawing privileges back,
--      and anything clawed back imperfectly (auth.users, for one) is a hole.
--
-- SECURITY INVOKER inverts it. The query runs with exactly the caller's own
-- privileges, so the strongest thing a fully hijacked model can do is read what
-- that super admin could already read through the API. auth.users is not granted
-- to `authenticated` at all, so password hashes stay unreachable by
-- construction rather than by filtering.
--
-- The ai_reports views stay owner-owned and non-security_invoker, so they can
-- still aggregate across tenants. They are reachable only through this function:
-- PostgREST exposes public and graphql_public only, so ai_reports has no HTTP
-- surface of its own, and the function gates on is_super_admin().
-- ============================================================

-- The views are the only window; the caller needs to be able to look through it.
grant usage on schema ai_reports to authenticated;
grant select on all tables in schema ai_reports to authenticated;
alter default privileges in schema ai_reports grant select on tables to authenticated;

create or replace function public.ai_admin_query(p_sql text)
returns jsonb
language plpgsql
security invoker
set search_path = ai_reports, public, pg_temp
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

  -- One statement only.
  if position(';' in v_clean) > 0 then
    raise exception 'Only a single statement is allowed';
  end if;

  if v_clean !~* '^(select|with)\s' then
    raise exception 'Only SELECT queries are allowed';
  end if;

  -- Defence in depth, not the defence — the caller's own privileges are.
  -- Word-bounded so "Versatile Creation Ltd" does not trip the "create" rule.
  if v_clean ~* '\m(insert|update|delete|drop|alter|create|grant|revoke|truncate|copy|call|do|vacuum|reindex|refresh|listen|notify|prepare|lock|set|reset)\M' then
    raise exception 'Only read-only SELECT queries are allowed';
  end if;

  -- A generated query should never be able to sit on a connection.
  set local statement_timeout = '8s';

  execute format(
    'select coalesce(jsonb_agg(t), ''[]''::jsonb) from (select * from (%s) q limit 200) t',
    v_clean
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.ai_admin_query(text) from public;
grant execute on function public.ai_admin_query(text) to authenticated;

comment on function public.ai_admin_query(text) is
  'Runs a single read-only SELECT against the ai_reports views with the caller''s own privileges. SUPER_ADMIN only. Capped at 200 rows and an 8 second statement timeout.';

-- Retire the role from 0032. It was never load-bearing and an unused role that
-- looks like a security control is worse than no role at all.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'ai_readonly') then
    execute 'alter default privileges in schema ai_reports revoke select on tables from ai_readonly';
    execute 'revoke all on all tables in schema ai_reports from ai_readonly';
    execute 'revoke all on schema ai_reports from ai_readonly';
    execute 'revoke ai_readonly from postgres';
    execute 'drop role ai_readonly';
  end if;
end $$;
