-- ============================================================
-- OpenHR — Sync profiles.verified when email is confirmed
-- When a user clicks the confirmation link, Supabase Auth sets
-- auth.users.email_confirmed_at but nothing propagates that to
-- public.profiles.verified.  This trigger closes that gap so
-- the login gate (auth.service.ts:48) no longer blocks users
-- whose email is already confirmed.
-- 0022_sync_verified_on_email_confirm.sql
-- ============================================================

-- Function: set verified=true when email_confirmed_at transitions
-- from NULL to a timestamp (first-time confirmation).
create or replace function public.set_verified_on_email_confirm()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.email_confirmed_at is null and new.email_confirmed_at is not null then
    update public.profiles
       set verified = true
     where id = new.id
       and verified = false;
  end if;
  return new;
end;
$$;

-- Trigger on auth.users — follows the same pattern as the
-- on_auth_user_email_change trigger in migration 0013.
drop trigger if exists on_auth_user_email_confirmed on auth.users;
create trigger on_auth_user_email_confirmed
  after update of email_confirmed_at on auth.users
  for each row
  when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
  execute function public.set_verified_on_email_confirm();

-- Backfill: fix existing users who already confirmed their email
-- but are stuck with verified = false.  This is a one-time repair
-- that brings the data into a consistent state.
update public.profiles p
   set verified = true
  from auth.users u
 where p.id = u.id
   and u.email_confirmed_at is not null
   and p.verified = false;
