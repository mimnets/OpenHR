-- ============================================================
-- OpenHRApp — Organization hygiene report
-- 0028_org_hygiene_report.sql
--
-- Backs the super-admin spam review screen. At the time of writing, 130 of 163
-- organizations had a single user and no activity at all — the residue of a
-- registration endpoint that ran for months with no bot protection.
--
-- Exists as one RPC rather than per-organization counts from the client, which
-- would be several hundred round-trips. SECURITY DEFINER so it can aggregate
-- across every tenant, with an explicit SUPER_ADMIN guard — without that guard
-- the definer rights would hand any authenticated user a cross-tenant census.
-- ============================================================

create or replace function public.org_hygiene_report()
returns table (
  org_id              uuid,
  org_name            text,
  org_created         timestamptz,
  org_country         text,
  org_subscription    text,
  org_trial_end       timestamptz,
  org_is_demo         boolean,
  user_count          int,
  unverified_count    int,
  attendance_count    int,
  leave_count         int,
  settings_count      int,
  admin_email         text,
  last_activity       timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_super_admin() then
    raise exception 'Only SUPER_ADMIN may run the organization hygiene report'
      using errcode = '42501';
  end if;

  return query
  with u as (
    select p.organization_id as oid,
           count(*)::int as n,
           count(*) filter (where p.verified is not true)::int as unv
    from public.profiles p
    where p.organization_id is not null
    group by p.organization_id
  ), a as (
    select t.organization_id as oid, count(*)::int as n, max(t.created) as last_at
    from public.attendance t
    where t.organization_id is not null
    group by t.organization_id
  ), l as (
    select v.organization_id as oid, count(*)::int as n, max(v.created) as last_at
    from public.leaves v
    where v.organization_id is not null
    group by v.organization_id
  ), s as (
    select st.organization_id as oid, count(*)::int as n
    from public.settings st
    where st.organization_id is not null
    group by st.organization_id
  ), adm as (
    -- The founding admin: earliest ADMIN profile in the organization.
    select distinct on (p.organization_id) p.organization_id as oid, p.email as email
    from public.profiles p
    where p.role = 'ADMIN' and p.organization_id is not null
    order by p.organization_id, p.created
  )
  select
    o.id,
    o.name,
    o.created,
    o.country,
    o.subscription_status,
    o.trial_end_date,
    coalesce(o.is_demo, false),
    coalesce(u.n, 0),
    coalesce(u.unv, 0),
    coalesce(a.n, 0),
    coalesce(l.n, 0),
    coalesce(s.n, 0),
    adm.email,
    -- GREATEST ignores nulls, so an org with only one kind of activity still
    -- reports the date it actually has.
    greatest(a.last_at, l.last_at)
  from public.organizations o
  left join u   on u.oid   = o.id
  left join a   on a.oid   = o.id
  left join l   on l.oid   = o.id
  left join s   on s.oid   = o.id
  left join adm on adm.oid = o.id
  order by o.created desc;
end;
$$;

revoke all on function public.org_hygiene_report() from public;
grant execute on function public.org_hygiene_report() to authenticated;
