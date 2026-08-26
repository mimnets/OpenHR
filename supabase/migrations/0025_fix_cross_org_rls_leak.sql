-- ============================================================
-- OpenHR — SECURITY FIX: restore tenant isolation on leaves + attendance
-- 0025_fix_cross_org_rls_leak.sql
--
-- Migration 0014 added a bare `auth_role() in ('ADMIN','HR')` branch to the
-- SELECT policies on public.leaves and public.attendance. That branch carries
-- no organization predicate, so ANY user holding the ADMIN or HR role in ANY
-- organization could read every leave and attendance row in the database.
--
-- Impact when found: 168 accounts (162 ADMIN + 6 HR) across 163 organizations.
-- Symptom: an org's HR approval queue listed other companies' employees, with
-- live Approve/Reject controls.
--
-- Fix: drop the unscoped branch. Cross-organization visibility is reserved for
-- SUPER_ADMIN, which is what is_super_admin() already expresses. UPDATE, INSERT
-- and DELETE policies on both tables were already correctly org-scoped and are
-- deliberately left untouched.
-- ============================================================

drop policy if exists "attendance_select" on public.attendance;
create policy "attendance_select" on public.attendance for select using (
  public.is_super_admin()
  or organization_id = public.auth_org_id()
);

drop policy if exists "leaves_select" on public.leaves;
create policy "leaves_select" on public.leaves for select using (
  public.is_super_admin()
  or organization_id = public.auth_org_id()
);
