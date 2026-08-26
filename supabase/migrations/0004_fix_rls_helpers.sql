-- ============================================================
-- OpenHRApp — Fix RLS Helper Functions
-- Replaces JWT app_metadata approach (requires Pro plan hook)
-- with direct profiles table lookup — works on free tier.
-- 0004_fix_rls_helpers.sql
-- ============================================================

-- Drop the 0003 auth hook trigger (not available on free plan)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.custom_access_token_hook(jsonb);

-- ============================================================
-- Replace helpers: query profiles directly via auth.uid()
-- security definer + set search_path prevents privilege escalation
-- ============================================================

create or replace function public.auth_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    ''
  )
$$;

create or replace function public.auth_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id
  from public.profiles
  where id = auth.uid()
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'SUPER_ADMIN' from public.profiles where id = auth.uid()),
    false
  )
$$;

-- ============================================================
-- Re-add auto profile creation on signup using a simpler trigger
-- that doesn't need supabase_auth_admin grants
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
