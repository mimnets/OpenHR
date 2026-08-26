-- ============================================================
-- OpenHRApp — Initial Schema Migration
-- Migrated from PocketBase → Supabase (PostgreSQL)
-- 0001_initial_schema.sql
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for text search on names/emails

-- ============================================================
-- ORGANIZATIONS (no FK deps — create first)
-- ============================================================
create table public.organizations (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  country     text not null default 'BD',
  address     text,
  logo        text,                                        -- storage path
  subscription_status text not null default 'TRIAL'
                check (subscription_status in ('TRIAL','ACTIVE','EXPIRED','SUSPENDED','AD_SUPPORTED')),
  trial_end_date      timestamptz,
  subscription_expires timestamptz,
  ad_consent  boolean default false,
  created     timestamptz not null default now(),
  updated     timestamptz not null default now()
);

create index idx_organizations_subscription_status on public.organizations(subscription_status);

-- ============================================================
-- PROFILES (extends auth.users 1-to-1)
-- PocketBase "users" collection
-- ============================================================
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  name            text,
  role            text not null default 'EMPLOYEE'
                  check (role in ('SUPER_ADMIN','ADMIN','HR','MANAGER','EMPLOYEE')),
  employee_id     text,
  designation     text,
  department      text,
  line_manager_id uuid references public.profiles(id) on delete set null,
  team_id         uuid,                                    -- FK added after teams table
  shift_id        uuid,                                    -- FK added after shifts table
  avatar          text,                                    -- storage path
  verified        boolean default false,
  employment_type text,
  work_type       text,
  joining_date    date,
  salary          numeric,
  mobile          text,
  emergency_contact text,
  location        text,
  created         timestamptz not null default now(),
  updated         timestamptz not null default now()
);

create index idx_profiles_organization_id on public.profiles(organization_id);
create index idx_profiles_role on public.profiles(role);
create index idx_profiles_employee_id on public.profiles(organization_id, employee_id);

-- ============================================================
-- TEAMS
-- ============================================================
create table public.teams (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name            text not null,
  department      text,
  leader_id       uuid references public.profiles(id) on delete set null,
  created         timestamptz not null default now(),
  updated         timestamptz not null default now()
);

create index idx_teams_organization_id on public.teams(organization_id);

-- Add FK now that teams table exists
alter table public.profiles
  add constraint fk_profiles_team_id foreign key (team_id) references public.teams(id) on delete set null;

-- ============================================================
-- SHIFTS
-- ============================================================
create table public.shifts (
  id                    uuid primary key default uuid_generate_v4(),
  organization_id       uuid not null references public.organizations(id) on delete cascade,
  name                  text not null,
  start_time            time not null,
  end_time              time not null,
  late_grace_period     integer default 0,                -- minutes
  early_out_grace_period integer default 0,              -- minutes
  earliest_check_in     time,
  auto_session_close_time time,
  working_days          text[] default array['MON','TUE','WED','THU','FRI'],
  is_default            boolean default false,
  created               timestamptz not null default now(),
  updated               timestamptz not null default now()
);

create index idx_shifts_organization_id on public.shifts(organization_id);

-- Add FK now that shifts table exists
alter table public.profiles
  add constraint fk_profiles_shift_id foreign key (shift_id) references public.shifts(id) on delete set null;

-- ============================================================
-- ATTENDANCE
-- ============================================================
create table public.attendance (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id     text not null,                           -- denormalized ID string (PB pattern)
  employee_name   text,
  date            date not null,
  check_in        timestamptz,
  check_out       timestamptz,
  status          text default 'PRESENT'
                  check (status in ('PRESENT','ABSENT','LATE','HALF_DAY','HOLIDAY','LEAVE','REMOTE')),
  duty_type       text,
  location        text,
  latitude        double precision,
  longitude       double precision,
  selfie          text,                                    -- storage path
  remarks         text,
  reconcile       boolean default false,
  created         timestamptz not null default now(),
  updated         timestamptz not null default now()
);

create index idx_attendance_organization_id on public.attendance(organization_id);
create index idx_attendance_employee_date on public.attendance(organization_id, employee_id, date);
create index idx_attendance_date on public.attendance(organization_id, date);

-- ============================================================
-- LEAVES
-- ============================================================
create table public.leaves (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id     text not null,
  employee_name   text,
  line_manager_id text,
  applied_date    date,
  start_date      date not null,
  end_date        date not null,
  total_days      numeric default 1,
  type            text not null,
  reason          text,
  status          text not null default 'PENDING_MANAGER'
                  check (status in ('PENDING_MANAGER','PENDING_HR','APPROVED','REJECTED','CANCELLED')),
  manager_remarks text,
  approver_remarks text,
  created         timestamptz not null default now(),
  updated         timestamptz not null default now()
);

create index idx_leaves_organization_id on public.leaves(organization_id);
create index idx_leaves_employee_id on public.leaves(organization_id, employee_id);
create index idx_leaves_status on public.leaves(organization_id, status);
create index idx_leaves_start_date on public.leaves(organization_id, start_date);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
create table public.announcements (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  author_id       uuid references public.profiles(id) on delete set null,
  author_name     text,
  title           text not null,
  content         text,
  items           jsonb,
  priority        text default 'NORMAL'
                  check (priority in ('LOW','NORMAL','HIGH','URGENT')),
  target_roles    text[],
  expires_at      timestamptz,
  response        text,
  created         timestamptz not null default now(),
  updated         timestamptz not null default now()
);

create index idx_announcements_organization_id on public.announcements(organization_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table public.notifications (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id         uuid references public.profiles(id) on delete cascade,
  type            text not null,
  title           text not null,
  message         text,
  is_read         boolean default false,
  priority        text default 'NORMAL'
                  check (priority in ('LOW','NORMAL','HIGH','URGENT')),
  reference_id    text,
  reference_type  text,
  action_url      text,
  metadata        jsonb,
  items           jsonb,
  created         timestamptz not null default now(),
  updated         timestamptz not null default now()
);

create index idx_notifications_user_id on public.notifications(user_id, is_read);
create index idx_notifications_organization_id on public.notifications(organization_id);

-- ============================================================
-- SETTINGS (key-value per org)
-- ============================================================
create table public.settings (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  key             text not null,
  value           text,
  created         timestamptz not null default now(),
  updated         timestamptz not null default now(),
  unique (organization_id, key)
);

create index idx_settings_organization_key on public.settings(organization_id, key);

-- ============================================================
-- REVIEW CYCLES
-- ============================================================
create table public.review_cycles (
  id                uuid primary key default uuid_generate_v4(),
  organization_id   uuid not null references public.organizations(id) on delete cascade,
  name              text not null,
  cycle_type        text,
  start_date        date,
  end_date          date,
  review_start_date date,
  review_end_date   date,
  is_active         boolean default true,
  created           timestamptz not null default now(),
  updated           timestamptz not null default now()
);

create index idx_review_cycles_organization_id on public.review_cycles(organization_id);

-- ============================================================
-- PERFORMANCE REVIEWS
-- ============================================================
create table public.performance_reviews (
  id                  uuid primary key default uuid_generate_v4(),
  organization_id     uuid not null references public.organizations(id) on delete cascade,
  cycle_id            uuid references public.review_cycles(id) on delete set null,
  employee_id         text not null,
  employee_name       text,
  line_manager_id     text,
  manager_name        text,
  status              text default 'PENDING',
  submitted_at        timestamptz,
  completed_at        timestamptz,
  finalized_by        text,
  self_ratings        jsonb,
  manager_ratings     jsonb,
  manager_reviewed_at timestamptz,
  hr_overall_rating   text,
  hr_final_remarks    text,
  rating              text,
  competency          jsonb,
  active_competencies jsonb,
  comment             text,
  -- attendance summary snapshot
  present_days        integer,
  absent_days         integer,
  late_days           integer,
  early_out_days      integer,
  attendance_percentage numeric,
  annual_leave_taken  integer,
  casual_leave_taken  integer,
  sick_leave_taken    integer,
  leave_summary_json  jsonb,
  created             timestamptz not null default now(),
  updated             timestamptz not null default now()
);

create index idx_perf_reviews_organization_id on public.performance_reviews(organization_id);
create index idx_perf_reviews_cycle_id on public.performance_reviews(cycle_id);
create index idx_perf_reviews_employee_id on public.performance_reviews(organization_id, employee_id);

-- ============================================================
-- UPGRADE REQUESTS
-- ============================================================
create table public.upgrade_requests (
  id                  uuid primary key default uuid_generate_v4(),
  organization_id     uuid not null references public.organizations(id) on delete cascade,
  request_type        text not null
                      check (request_type in ('DONATION','TRIAL_EXTENSION','AD_SUPPORTED')),
  status              text not null default 'PENDING'
                      check (status in ('PENDING','APPROVED','REJECTED')),
  donation_amount     numeric,
  donation_tier       text,
  donation_reference  text,
  donation_screenshot text,                               -- storage path
  extension_reason    text,
  extension_days      integer,
  admin_notes         text,
  processed_by        uuid references public.profiles(id) on delete set null,
  processed_at        timestamptz,
  created             timestamptz not null default now(),
  updated             timestamptz not null default now()
);

create index idx_upgrade_requests_organization_id on public.upgrade_requests(organization_id);
create index idx_upgrade_requests_status on public.upgrade_requests(status);

-- ============================================================
-- BLOG POSTS (public, no org isolation)
-- ============================================================
create table public.blog_posts (
  id          uuid primary key default uuid_generate_v4(),
  author_id   uuid references public.profiles(id) on delete set null,
  author_name text,
  title       text not null,
  content     text,
  excerpt     text,
  cover_image text,                                       -- storage path
  slug        text unique not null,
  status      text default 'DRAFT'
              check (status in ('DRAFT','PUBLISHED','ARCHIVED')),
  published_at timestamptz,
  created     timestamptz not null default now(),
  updated     timestamptz not null default now()
);

create index idx_blog_posts_slug on public.blog_posts(slug);
create index idx_blog_posts_status on public.blog_posts(status);

-- ============================================================
-- TUTORIALS
-- ============================================================
create table public.tutorials (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  content       text,
  excerpt       text,
  cover_image   text,
  slug          text unique not null,
  status        text default 'DRAFT'
                check (status in ('DRAFT','PUBLISHED','ARCHIVED')),
  category      text,
  author_name   text,
  parent_id     uuid references public.tutorials(id) on delete set null,
  display_order integer default 0,
  published_at  timestamptz,
  created       timestamptz not null default now(),
  updated       timestamptz not null default now()
);

create index idx_tutorials_slug on public.tutorials(slug);
create index idx_tutorials_category on public.tutorials(category);

-- ============================================================
-- SHOWCASE ORGANIZATIONS (public landing page)
-- ============================================================
create table public.showcase_organizations (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  tagline       text,
  logo          text,
  country       text,
  industry      text,
  website_url   text,
  is_active     boolean default true,
  display_order integer default 0,
  created       timestamptz not null default now(),
  updated       timestamptz not null default now()
);

-- ============================================================
-- SOCIAL LINKS (public footer links)
-- ============================================================
create table public.social_links (
  id            uuid primary key default uuid_generate_v4(),
  platform      text not null,
  url           text not null,
  is_active     boolean default true,
  display_order integer default 0,
  created       timestamptz not null default now(),
  updated       timestamptz not null default now()
);

-- ============================================================
-- GUIDE HELP LINKS (in-app help)
-- ============================================================
create table public.guide_help_links (
  id            uuid primary key default uuid_generate_v4(),
  key           text unique not null,
  value         text,
  created       timestamptz not null default now(),
  updated       timestamptz not null default now()
);

-- ============================================================
-- CONTENT IMAGES (rich text editor uploads)
-- ============================================================
create table public.content_images (
  id          uuid primary key default uuid_generate_v4(),
  image       text not null,                              -- storage path
  alt_text    text,
  uploaded_by text,
  created     timestamptz not null default now(),
  updated     timestamptz not null default now()
);

-- ============================================================
-- REPORTS QUEUE (bulk email / async jobs)
-- ============================================================
create table public.reports_queue (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade,
  type            text,
  status          text default 'PENDING'
                  check (status in ('PENDING','PROCESSING','SENT','FAILED')),
  recipient_email text,
  subject         text,
  message         text,
  error_message   text,
  sent_at         timestamptz,
  created         timestamptz not null default now(),
  updated         timestamptz not null default now()
);

create index idx_reports_queue_status on public.reports_queue(status);
create index idx_reports_queue_organization_id on public.reports_queue(organization_id);

-- ============================================================
-- updated_at auto-maintenance trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated = now();
  return new;
end;
$$;

-- Apply trigger to every table that has an `updated` column
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'organizations','profiles','teams','shifts','attendance','leaves',
    'announcements','notifications','settings','review_cycles',
    'performance_reviews','upgrade_requests','blog_posts','tutorials',
    'showcase_organizations','social_links','guide_help_links',
    'content_images','reports_queue'
  ]
  loop
    execute format(
      'create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      tbl, tbl
    );
  end loop;
end;
$$;
