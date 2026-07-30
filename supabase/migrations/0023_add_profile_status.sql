-- ============================================================
-- OpenHR — Add status column to profiles
-- Enables employee lifecycle management: ACTIVE / INACTIVE / ON_LEAVE
-- 0023_add_profile_status.sql
-- ============================================================

-- Add status column with check constraint
alter table public.profiles
  add column if not exists status text not null default 'ACTIVE'
  check (status in ('ACTIVE', 'INACTIVE', 'ON_LEAVE'));

-- Backfill: all existing rows already default to 'ACTIVE' via the column default,
-- but explicitly set it for clarity in case the column was added without a default
-- in a prior partial run.
update public.profiles set status = 'ACTIVE' where status is null;

-- Index for filtering by status in employee directory queries
create index if not exists idx_profiles_status on public.profiles(organization_id, status);
