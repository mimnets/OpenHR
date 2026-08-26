-- ============================================================
-- OpenHRApp — Registration rate limiting + email lookup index
-- 0027_registration_rate_limit.sql
--
-- /register is public and unauthenticated. Turnstile (added alongside this
-- migration) stops commodity bots; this stops a determined human or headless
-- browser creating organizations one at a time. Mirrors the existing
-- check_contact_rate_limit pattern from 0010.
--
-- Context: at the time of writing, 130 of 163 organizations had a single user
-- and zero activity, and 81 of 318 accounts had never confirmed their email.
-- ============================================================

create table if not exists public.registration_attempts (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  ip         text,
  succeeded  boolean not null default false,
  created    timestamptz not null default now()
);

create index if not exists registration_attempts_email_idx on public.registration_attempts (email, created desc);
create index if not exists registration_attempts_ip_idx    on public.registration_attempts (ip, created desc);

-- Locked down: only the service-role edge function touches this table.
alter table public.registration_attempts enable row level security;

-- The duplicate-email check in the register function looks up profiles by
-- email; without this it is a sequential scan on every registration.
--
-- Indexed on the bare column, not lower(email): the lookup is
-- `.eq('email', email)`, and a functional index on lower(email) would never be
-- used by that predicate. The register function lowercases the address before
-- storing and before querying, and every stored address is already lowercase,
-- so the plain index is both usable and correct. Dropped first because an
-- earlier revision created this name over lower(email), and
-- `create index if not exists` would silently keep the wrong one.
drop index if exists public.profiles_email_idx;
create index if not exists profiles_email_idx on public.profiles (email);

-- ── Rate-limit check ────────────────────────────────────────────────────────
-- Records the attempt and reports whether it should be allowed. Deliberately
-- VOLATILE (it writes) rather than STABLE like the contact-form equivalent.
create or replace function public.check_registration_rate_limit(
  p_email text,
  p_ip    text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_by_email int;
  v_by_ip    int;
begin
  select count(*) into v_by_email
  from public.registration_attempts
  where email = lower(p_email) and created > now() - interval '1 hour';

  select count(*) into v_by_ip
  from public.registration_attempts
  where p_ip is not null and ip = p_ip and created > now() - interval '1 hour';

  insert into public.registration_attempts (email, ip) values (lower(p_email), p_ip);

  -- 3 attempts/hour per address, 5 attempts/hour per IP. An IP allowance above
  -- the email allowance leaves room for shared office NAT while still capping
  -- bulk creation from one source.
  return v_by_email < 3 and (p_ip is null or v_by_ip < 5);
end;
$$;

-- Housekeeping: attempts older than 30 days carry no signal.
create or replace function public.prune_registration_attempts()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.registration_attempts where created < now() - interval '30 days';
$$;
