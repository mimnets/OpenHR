-- ============================================================
-- OpenHRApp — Row Level Security Policies
-- Mirrors PocketBase listRule / viewRule / createRule / updateRule / deleteRule
-- 0002_rls_policies.sql
-- ============================================================

-- ============================================================
-- HELPER: query caller's role + org directly from profiles table
-- (free-tier compatible — no custom JWT hook required)
-- ============================================================
create or replace function public.auth_role()
returns text language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), '')
$$;

create or replace function public.auth_org_id()
returns uuid language sql stable security definer set search_path = public as $$
  select organization_id from public.profiles where id = auth.uid()
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'SUPER_ADMIN' from public.profiles where id = auth.uid()), false)
$$;

-- ============================================================
-- ORGANIZATIONS
-- PB: listRule = @request.auth.role = "SUPER_ADMIN" || id = @request.auth.organization_id
-- ============================================================
alter table public.organizations enable row level security;

create policy "organizations_select" on public.organizations for select using (
  public.is_super_admin() or id = public.auth_org_id()
);
create policy "organizations_insert" on public.organizations for insert with check (
  public.is_super_admin()
);
create policy "organizations_update" on public.organizations for update using (
  public.is_super_admin() or id = public.auth_org_id()
);
create policy "organizations_delete" on public.organizations for delete using (
  public.is_super_admin()
);

-- ============================================================
-- PROFILES
-- PB: listRule = @request.auth.role = "SUPER_ADMIN" || organization_id = @request.auth.organization_id
-- ============================================================
alter table public.profiles enable row level security;

create policy "profiles_select" on public.profiles for select using (
  public.is_super_admin()
  or organization_id = public.auth_org_id()
  or id = auth.uid()
);
create policy "profiles_insert" on public.profiles for insert with check (
  public.is_super_admin()
  or organization_id = public.auth_org_id()
);
create policy "profiles_update" on public.profiles for update using (
  public.is_super_admin()
  or organization_id = public.auth_org_id()
);
create policy "profiles_delete" on public.profiles for delete using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);

-- ============================================================
-- TEAMS
-- ============================================================
alter table public.teams enable row level security;

create policy "teams_select" on public.teams for select using (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "teams_insert" on public.teams for insert with check (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);
create policy "teams_update" on public.teams for update using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);
create policy "teams_delete" on public.teams for delete using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);

-- ============================================================
-- SHIFTS
-- ============================================================
alter table public.shifts enable row level security;

create policy "shifts_select" on public.shifts for select using (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "shifts_insert" on public.shifts for insert with check (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);
create policy "shifts_update" on public.shifts for update using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);
create policy "shifts_delete" on public.shifts for delete using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);

-- ============================================================
-- ATTENDANCE
-- ============================================================
alter table public.attendance enable row level security;

create policy "attendance_select" on public.attendance for select using (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "attendance_insert" on public.attendance for insert with check (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "attendance_update" on public.attendance for update using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR','MANAGER'))
);
create policy "attendance_delete" on public.attendance for delete using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);

-- ============================================================
-- LEAVES
-- ============================================================
alter table public.leaves enable row level security;

create policy "leaves_select" on public.leaves for select using (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "leaves_insert" on public.leaves for insert with check (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "leaves_update" on public.leaves for update using (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "leaves_delete" on public.leaves for delete using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
alter table public.announcements enable row level security;

create policy "announcements_select" on public.announcements for select using (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "announcements_insert" on public.announcements for insert with check (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR','MANAGER'))
);
create policy "announcements_update" on public.announcements for update using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR','MANAGER'))
);
create policy "announcements_delete" on public.announcements for delete using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
alter table public.notifications enable row level security;

create policy "notifications_select" on public.notifications for select using (
  public.is_super_admin()
  or user_id = auth.uid()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);
create policy "notifications_insert" on public.notifications for insert with check (
  auth.uid() is not null
);
create policy "notifications_update" on public.notifications for update using (
  public.is_super_admin() or user_id = auth.uid()
);
create policy "notifications_delete" on public.notifications for delete using (
  public.is_super_admin()
  or user_id = auth.uid()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);

-- ============================================================
-- SETTINGS
-- ============================================================
alter table public.settings enable row level security;

create policy "settings_select" on public.settings for select using (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "settings_insert" on public.settings for insert with check (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);
create policy "settings_update" on public.settings for update using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);
create policy "settings_delete" on public.settings for delete using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() = 'ADMIN')
);

-- ============================================================
-- REVIEW CYCLES
-- ============================================================
alter table public.review_cycles enable row level security;

create policy "review_cycles_select" on public.review_cycles for select using (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "review_cycles_insert" on public.review_cycles for insert with check (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);
create policy "review_cycles_update" on public.review_cycles for update using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);
create policy "review_cycles_delete" on public.review_cycles for delete using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() = 'ADMIN')
);

-- ============================================================
-- PERFORMANCE REVIEWS
-- ============================================================
alter table public.performance_reviews enable row level security;

create policy "perf_reviews_select" on public.performance_reviews for select using (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "perf_reviews_insert" on public.performance_reviews for insert with check (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "perf_reviews_update" on public.performance_reviews for update using (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "perf_reviews_delete" on public.performance_reviews for delete using (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);

-- ============================================================
-- UPGRADE REQUESTS
-- PB: listRule = SUPER_ADMIN || organization_id = auth.organization_id
-- ============================================================
alter table public.upgrade_requests enable row level security;

create policy "upgrade_requests_select" on public.upgrade_requests for select using (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "upgrade_requests_insert" on public.upgrade_requests for insert with check (
  auth.uid() is not null
);
create policy "upgrade_requests_update" on public.upgrade_requests for update using (
  public.is_super_admin()
);
create policy "upgrade_requests_delete" on public.upgrade_requests for delete using (
  public.is_super_admin()
);

-- ============================================================
-- BLOG POSTS (public read, SUPER_ADMIN write)
-- ============================================================
alter table public.blog_posts enable row level security;

create policy "blog_posts_select" on public.blog_posts for select using (
  status = 'PUBLISHED' or public.is_super_admin() or auth.uid() is not null
);
create policy "blog_posts_insert" on public.blog_posts for insert with check (
  public.is_super_admin()
);
create policy "blog_posts_update" on public.blog_posts for update using (
  public.is_super_admin()
);
create policy "blog_posts_delete" on public.blog_posts for delete using (
  public.is_super_admin()
);

-- ============================================================
-- TUTORIALS (public read, SUPER_ADMIN write)
-- ============================================================
alter table public.tutorials enable row level security;

create policy "tutorials_select" on public.tutorials for select using (
  status = 'PUBLISHED' or public.is_super_admin() or auth.uid() is not null
);
create policy "tutorials_insert" on public.tutorials for insert with check (
  public.is_super_admin()
);
create policy "tutorials_update" on public.tutorials for update using (
  public.is_super_admin()
);
create policy "tutorials_delete" on public.tutorials for delete using (
  public.is_super_admin()
);

-- ============================================================
-- SHOWCASE ORGANIZATIONS (public read)
-- ============================================================
alter table public.showcase_organizations enable row level security;

create policy "showcase_orgs_select" on public.showcase_organizations for select using (true);
create policy "showcase_orgs_write" on public.showcase_organizations for all using (
  public.is_super_admin()
);

-- ============================================================
-- SOCIAL LINKS (public read)
-- ============================================================
alter table public.social_links enable row level security;

create policy "social_links_select" on public.social_links for select using (true);
create policy "social_links_write" on public.social_links for all using (
  public.is_super_admin()
);

-- ============================================================
-- GUIDE HELP LINKS (public read)
-- ============================================================
alter table public.guide_help_links enable row level security;

create policy "guide_help_links_select" on public.guide_help_links for select using (true);
create policy "guide_help_links_write" on public.guide_help_links for all using (
  public.is_super_admin()
);

-- ============================================================
-- CONTENT IMAGES (authenticated read/write)
-- ============================================================
alter table public.content_images enable row level security;

create policy "content_images_select" on public.content_images for select using (
  auth.uid() is not null
);
create policy "content_images_insert" on public.content_images for insert with check (
  auth.uid() is not null
);
create policy "content_images_update" on public.content_images for update using (
  public.is_super_admin()
);
create policy "content_images_delete" on public.content_images for delete using (
  public.is_super_admin()
);

-- ============================================================
-- REPORTS QUEUE
-- ============================================================
alter table public.reports_queue enable row level security;

create policy "reports_queue_select" on public.reports_queue for select using (
  public.is_super_admin() or organization_id = public.auth_org_id()
);
create policy "reports_queue_insert" on public.reports_queue for insert with check (
  public.is_super_admin()
  or (organization_id = public.auth_org_id() and public.auth_role() in ('ADMIN','HR'))
);
create policy "reports_queue_update" on public.reports_queue for update using (
  public.is_super_admin()
);
create policy "reports_queue_delete" on public.reports_queue for delete using (
  public.is_super_admin()
);
