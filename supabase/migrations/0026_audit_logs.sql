-- ============================================================
-- OpenHR — Tamper-resistant audit trail
-- 0026_audit_logs.sql
--
-- Written after an incident in which two leave requests in one organization
-- were moved to REJECTED and it was impossible to determine who did it: the
-- database held no actor column and no history, so the only forensic evidence
-- was which remarks column happened to be non-null.
--
-- The trigger fires inside the database, so it records the actor even when the
-- write arrives straight from PostgREST, and it cannot be skipped by a client
-- that forgets to call a logging helper.
-- ============================================================

create table if not exists public.audit_logs (
  id              uuid primary key default gen_random_uuid(),
  occurred_at     timestamptz not null default now(),
  actor_id        uuid,                    -- auth.uid(); null for service-role/cron writes
  actor_role      text,                    -- caller's profiles.role at write time
  actor_org_id    uuid,                    -- caller's organization_id at write time
  organization_id uuid,                    -- organization the affected row belongs to
  table_name      text not null,
  record_id       text not null,
  action          text not null check (action in ('INSERT','UPDATE','DELETE')),
  changed_fields  text[],                  -- populated on UPDATE only
  old_data        jsonb,
  new_data        jsonb
);

create index if not exists audit_logs_org_time_idx    on public.audit_logs (organization_id, occurred_at desc);
create index if not exists audit_logs_record_idx      on public.audit_logs (table_name, record_id, occurred_at desc);
create index if not exists audit_logs_actor_idx       on public.audit_logs (actor_id, occurred_at desc);

-- ── Generic row auditor ─────────────────────────────────────────────────────
-- security definer so it can always write to audit_logs regardless of the
-- caller's own privileges; search_path pinned to prevent hijacking.
create or replace function public.fn_audit_row()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old      jsonb := case when TG_OP = 'INSERT' then null else to_jsonb(OLD) end;
  v_new      jsonb := case when TG_OP = 'DELETE' then null else to_jsonb(NEW) end;
  v_changed  text[];
  v_org      uuid;
  v_actor    uuid := auth.uid();
  v_role     text;
  v_actorg   uuid;
  v_recid    text;
begin
  -- Identify the row and its tenant from the FULL images, before any narrowing
  -- below: id and organization_id rarely change, so they are absent from a diff.
  -- `organizations` itself has no organization_id column — its own id is the
  -- tenant key.
  if TG_TABLE_NAME = 'organizations' then
    v_org := coalesce((v_new ->> 'id')::uuid, (v_old ->> 'id')::uuid);
  else
    v_org := coalesce((v_new ->> 'organization_id')::uuid, (v_old ->> 'organization_id')::uuid);
  end if;

  v_recid := coalesce(v_new ->> 'id', v_old ->> 'id');

  -- On UPDATE, record only the fields that actually differ, and store only
  -- those fields' values rather than both full rows. Two reasons: no-op writes
  -- (refresh loops, idempotent saves) are dropped entirely, and on a
  -- high-volume table like attendance a diff is a fraction of the row size.
  -- INSERT and DELETE keep the full row — there is no diff to take, and those
  -- are the cases where you want the whole record.
  if TG_OP = 'UPDATE' then
    select array_agg(key order by key) into v_changed
    from jsonb_each(v_new)
    where v_new -> key is distinct from v_old -> key;

    if v_changed is null then
      return NEW;
    end if;

    v_old := (select jsonb_object_agg(k, v_old -> k) from unnest(v_changed) as k);
    v_new := (select jsonb_object_agg(k, v_new -> k) from unnest(v_changed) as k);
  end if;

  if v_actor is not null then
    select role, organization_id into v_role, v_actorg
    from public.profiles where id = v_actor;
  end if;

  insert into public.audit_logs (
    actor_id, actor_role, actor_org_id, organization_id,
    table_name, record_id, action, changed_fields, old_data, new_data
  ) values (
    v_actor,
    coalesce(v_role, 'SERVICE_ROLE'),
    v_actorg,
    v_org,
    TG_TABLE_NAME,
    v_recid,
    TG_OP,
    v_changed,
    v_old,
    v_new
  );

  return case when TG_OP = 'DELETE' then OLD else NEW end;
end;
$$;

-- ── Attach to the tables that carry decisions or access ─────────────────────
do $$
declare t text;
begin
  foreach t in array array['leaves','attendance','profiles','organizations','settings']
  loop
    execute format('drop trigger if exists trg_audit_%1$s on public.%1$I', t);
    execute format(
      'create trigger trg_audit_%1$s after insert or update or delete on public.%1$I
         for each row execute function public.fn_audit_row()', t);
  end loop;
end $$;

-- ── Read access: own org's admins, or SUPER_ADMIN. Nobody writes directly. ──
alter table public.audit_logs enable row level security;

drop policy if exists "audit_logs_select" on public.audit_logs;
create policy "audit_logs_select" on public.audit_logs for select using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);

-- No INSERT/UPDATE/DELETE policies: with RLS enabled and no permissive policy,
-- every direct client write is rejected. The security-definer trigger is the
-- only writer, and nobody can rewrite history through the API.

-- ── Retention ───────────────────────────────────────────────────────────────
-- Audit value decays; storage cost does not. Trim to 24 months by default.
-- Schedule alongside the other pg_cron jobs, or call manually.
create or replace function public.prune_audit_logs(p_keep_months int default 24)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare v_deleted bigint;
begin
  delete from public.audit_logs
  where occurred_at < now() - make_interval(months => p_keep_months);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;
