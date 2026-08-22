-- Showcase consent — Addendum 4, §5b.
--
-- An organization's name and logo may appear in the showcase on the public landing page only
-- if an ADMIN of that organization has explicitly opted in. Consent is recorded, not assumed:
-- when someone asks in a year why a given organization's name is on the homepage, the answer
-- has to be a row rather than a memory.
--
-- Everything here defaults to off, so applying this migration changes nothing visible. The
-- public read path (a view over the opted-in rows) is deliberately NOT created yet — it lands
-- with the showcase component itself, once there are consents to show.

alter table organizations
  -- The opt-in itself. False for every existing organization.
  add column if not exists show_on_landing boolean not null default false,
  -- When consent was most recently given. Deliberately NOT cleared on withdrawal: we want to
  -- be able to answer "were they ever opted in, and when".
  add column if not exists landing_consent_at timestamptz,
  -- Who recorded it and how — 'admin opt-in' from the app, or a note from a super admin who
  -- obtained permission another way (email, contract). Free text on purpose; this is an audit
  -- breadcrumb for a human, not something the app branches on.
  add column if not exists landing_consent_note text;

comment on column organizations.show_on_landing is
  'ADMIN opt-in to show this organization''s name and logo in the public landing-page showcase. Withdrawable at any time from Organization & Setup → System.';
comment on column organizations.landing_consent_at is
  'When showcase consent was last granted. Retained after withdrawal as an audit record.';
comment on column organizations.landing_consent_note is
  'How consent was obtained, for consents recorded by a super admin rather than self-serve.';

-- Only an ADMIN of the organization may set the flag, and never for a demo org.
-- The existing update policy on organizations already restricts writes to the caller's own
-- organization; this adds the role and demo constraints specific to the consent columns.
create or replace function enforce_showcase_consent()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.show_on_landing is distinct from old.show_on_landing then
    -- A demo organization is not a customer and must never be showcased.
    if coalesce(new.is_demo, false) then
      raise exception 'A demo organization cannot be shown in the showcase';
    end if;

    -- Super admins (no organization_id of their own) may always record consent obtained
    -- out of band. Otherwise the caller must be an ADMIN of this organization.
    if not exists (
      select 1 from profiles p
       where p.id = auth.uid()
         and (
           p.role = 'SUPER_ADMIN'
           or (p.role = 'ADMIN' and p.organization_id = new.id)
         )
    ) then
      raise exception 'Only an ADMIN of this organization may change showcase consent';
    end if;

    -- Stamp the grant. Withdrawal leaves the previous timestamp in place.
    if new.show_on_landing then
      new.landing_consent_at := now();
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_showcase_consent on organizations;
create trigger trg_enforce_showcase_consent
  before update on organizations
  for each row
  execute function enforce_showcase_consent();
