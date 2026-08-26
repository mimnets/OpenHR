---
title: "Understanding the Dashboard"
slug: understanding-dashboard
excerpt: "A detailed tour of OpenHRApp's role-based dashboard — what each widget shows for Employees, Managers, and Admins."
authorName: "Monirul Islam"
category: "Getting Started"
displayOrder: 14
publishedAt: "2026-03-13T06:00:36.264+00:00"
---

# Understanding the Dashboard

The dashboard is the first screen after signing in, and it is not the same screen for everyone. What it shows is chosen by your role — an employee sees their own day, a manager sees their team, an administrator sees the organization. This guide covers what each version shows and what the numbers on it actually mean.

## Why does my dashboard look different from a colleague's?

Because OpenHRApp builds a different dashboard per role rather than hiding parts of a shared one. There are three:

- **Employee** — your own attendance, leave and team.
- **Manager** — the above, plus the people you are responsible for.
- **Admin and HR** — the organization.

If a figure you expect is missing, it is a role difference rather than a setting. See [roles and permissions](/how-to-use/roles-and-permissions).

## The employee dashboard

Built around two questions: where do I stand today, and what is coming?

- **Your current attendance state** — whether you have an open session, and your check-in time if so. This is the fastest way to notice you never checked out yesterday.
- **Your leave balance**, per type that carries one, alongside how much you have used.
- **Your team**, and who approves your requests. Worth a glance early on — if the approver shown is not who you expect, your line manager is set wrong and every request will route to the wrong person.
- **The next public holiday**, from your organization's calendar.
- **Recent announcements.**

### Why does my leave balance not match what I have booked?

Because the balance counts only **fully approved** leave. A request still moving through approval has not been deducted, so a pending request makes the balance look larger than the number you will actually end up with.

Check pending requests alongside the balance before planning around it — see [understanding leave policies](/how-to-use/understanding-leave-policies).

## The manager dashboard

Everything on the employee dashboard, plus your team:

- **How many of your team are present today**, against the team size.
- **Leave allocation across the team**, so you can see where the balances stand before approving more.
- **Requests waiting on you.**

"Your team" means members of teams you lead plus anyone whose line manager is set to you — not your department. A manager seeing a smaller team than expected almost always has a gap in those two fields rather than a dashboard problem.

The present-today count is drawn from attendance recorded so far, so early in the morning it will legitimately be low. Read it as the day progresses rather than at nine o'clock.

## The admin and HR dashboard

The same shape at organization scale — headcount, who is present today, leave allocation across the organization, and pending items.

Two cautions when reading it:

- **Present today counts records, not people at desks.** Somebody who forgot to check in is indistinguishable from somebody absent. Persistent low numbers usually mean a training gap rather than an attendance problem.
- **Organization-wide leave figures hide distribution.** Plenty of allowance remaining across the company is compatible with one team having none. The figure is a starting point for a question, not an answer.

## How current are the numbers?

They are calculated when the dashboard loads, from the same records the detail screens use. Refresh the page after making a change to see it reflected, and expect today's attendance figures to move throughout the day as people check in and out.

Nothing on the dashboard is a separate stored total, so it cannot drift out of step with the underlying records — if a number looks wrong, the record behind it is wrong, and that is where to look.

## Using it well

- **Employees** — glance at your attendance state at the end of the day, not the start. That is when a missing check-out is still easy to explain.
- **Managers** — clear pending approvals from here rather than waiting for someone to chase. A request sitting with you also blocks the HR stage behind it.
- **Admin and HR** — treat a sudden change in present-today as a question about the data first and about people second.

## Common questions

### My dashboard shows no team

You are not assigned to one. Team membership is set by an administrator, and without it the team figures have nothing to count.

### The approver shown is wrong

Your line manager needs changing, which an administrator or HR does on your employee record. Correct it before submitting leave, not after — routing is decided when the request is created.

### Can I customise the dashboard?

No. The layout is fixed per role, which is what makes it possible to tell someone "look at the top left" and have that mean the same thing for both of you.

## Related guides

- [Welcome to OpenHRApp](/how-to-use/welcome-to-openhrapp) — first steps after signing in
- [Understanding attendance logs](/how-to-use/understanding-attendance-logs) — the records behind the attendance figures
- [Understanding leave policies](/how-to-use/understanding-leave-policies) — how balances are calculated
- [Roles and permissions](/how-to-use/roles-and-permissions) — why your dashboard differs
