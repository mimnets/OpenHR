-- ============================================================
-- OpenHRApp — Auth Hook: Custom JWT Claims
-- Injects role + organization_id into app_metadata so RLS
-- helper functions (auth_role, auth_org_id) can read them
-- without a DB round-trip on every query.
-- 0003_auth_hooks.sql
-- ============================================================

-- Grant usage so the hook can query profiles
grant usage on schema public to supabase_auth_admin;
grant select on public.profiles to supabase_auth_admin;

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  profile_row record;
  claims      jsonb;
begin
  select role, organization_id
    into profile_row
    from public.profiles
   where id = (event->>'user_id')::uuid;

  claims := coalesce(event->'claims', '{}'::jsonb);

  if profile_row is not null then
    claims := jsonb_set(claims, '{app_metadata}',
      coalesce(claims->'app_metadata', '{}'::jsonb)
      || jsonb_build_object(
           'role',            profile_row.role,
           'organization_id', profile_row.organization_id
         )
    );
  end if;

  return jsonb_set(event, '{claims}', claims);
end;
$$;

-- Grant execute to auth system
grant execute on function public.custom_access_token_hook to supabase_auth_admin;

-- ============================================================
-- Register hook in auth.config
-- Run this in Supabase Dashboard → Auth → Hooks → Custom Access Token
-- OR via SQL:
-- ============================================================
-- NOTE: The SQL below works on self-hosted Supabase.
-- For Supabase Cloud, register via Dashboard → Auth → Hooks instead.
--
-- update auth.config
--   set custom_access_token_hook_uri = 'pg-functions://public/custom_access_token_hook'
-- where id = 1;

-- ============================================================
-- Auto-create profile row when a new auth user signs up
-- (Handles Edge Function registrations that create via admin API
-- and need a matching profile row)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only insert if no profile exists (idempotent)
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
