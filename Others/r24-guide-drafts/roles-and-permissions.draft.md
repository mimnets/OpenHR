---
title: "Roles and Permissions in OpenHRApp"
slug: roles-and-permissions
excerpt: "Complete guide to OpenHR's role-based access control — what Admin, HR, Manager, Team Lead, and Employee roles can access."
authorName: "Monirul Islam"
category: "Getting Started"
displayOrder: 12
publishedAt: "2026-03-13T05:25:29.881+00:00"
---

# Roles and Permissions in OpenHRApp

Almost every "why can't I see that?" question in OpenHRApp has the same answer: your role. Roles decide which screens appear in your sidebar, and — more importantly — *whose* records you see once you are on a screen. Two people can open the same page and see completely different things, and that is working as intended.

## The roles

- **Employee** — the default. Sees their own records and their immediate team.
- **Manager** and **Team Lead** — everything an employee has, plus the people they are responsible for.
- **HR** — organization-wide access to people, attendance, leave and reviews.
- **Admin** — everything HR has, plus organization configuration.
- **Super Admin** — the OpenHRApp platform operator, not a role inside your organization. They manage organizations, not your employees.

Your own role is shown on your profile, and only an administrator can change it.

## What each role can open

The sidebar only lists what your role can reach, so the fastest way to know what you have is to look at it.

- **Everyone** — Dashboard, My Profile, My Attendance, Leave, Announcements, Performance.
- **Managers and above** — Attendance Audit and Team Directory as well.
- **HR and Admin only** — Organization, Reports, Notifications and Settings.

If a screen is not in your sidebar, it is not hidden behind a setting — your role does not have it, and an administrator has to change your role to grant it.

## Who can see whose records?

This is the part that matters day to day. The same screen shows a different set of people depending on who opens it.

- **Employees** — the directory shows only their own team; attendance, leave and reviews show only their own records.
- **Managers and team leads** — people in teams they lead, plus anyone whose line manager is set to them. Not their whole department, and not colleagues at the same level.
- **HR and Admin** — everyone in the organization.

The heading on the page tells you which view you are in. The employee directory reads *Organization Directory*, *My Team & Reports*, or *My Teammates*; attendance reads *Attendance Audit*, *Team Attendance*, or *My Attendance History*. Checking the heading is quicker than counting rows.

### Why does my manager not see my records?

Because manager visibility comes from two specific fields, not from job titles or departments:

- the **team leader** of a team you belong to, or
- the person set as your **line manager**.

Someone can carry the Manager role and still see nobody, if no team names them as leader and nobody has them as line manager. Sharing a department is not enough. If a manager is missing people, the fix is almost always in those two fields rather than in their role — see [managing employees](/how-to-use/managing-employees).

## How roles change what a screen does

Role does not only filter rows; on some screens it changes the available actions.

- **Leave** — an employee applies. A manager approves for their own people, but that approval is not final: it passes the request to HR. Only HR or Admin completes it. See [leave approval for managers](/how-to-use/leave-approval-for-managers).
- **Performance reviews** — the employee writes the self-assessment, the manager reviews it, and HR finalises. Three different roles hold the same review at different stages.
- **Attendance** — everyone records their own. Only Admin and HR can correct a record, deliberately: a record you can edit yourself is not evidence of anything.
- **Employee records** — managers can view their people but not edit them. Creating employees, changing roles, assigning shifts and uploading photos are all Admin and HR.

## Can I have more than one role?

No. Each person holds exactly one role, and it applies across the whole application. There is no per-module permission — you cannot grant someone HR-level access to leave while keeping them an employee elsewhere.

In practice this means choosing the role by the widest thing a person needs to do. Someone who must approve leave for a team needs Manager even if that is the only management task they perform.

## What should a small organization use?

A common and workable setup:

- One or two **Admins** — usually the owner and one other person. Keep it small; Admin can change organization-wide configuration.
- **HR** for whoever runs people operations day to day. HR sees everything about people without being able to reconfigure the organization.
- **Manager** for anyone who approves leave or writes performance reviews — and make sure they are actually set as a team leader or line manager, or the role does nothing.
- **Employee** for everyone else.

Resist making everyone an Admin to avoid permission questions. Admin can see every salary and every attendance record in the organization, and the audit value of the whole system depends on that being a small group.

## Related guides

- [Managing employees](/how-to-use/managing-employees) — setting roles, teams and line managers
- [Setting up your organization](/how-to-use/setting-up-organization) — teams and departments
- [Leave approval for managers](/how-to-use/leave-approval-for-managers) — what a manager can and cannot finalise
- [Managing your profile and settings](/how-to-use/managing-profile-settings) — why some of your own fields are read-only
