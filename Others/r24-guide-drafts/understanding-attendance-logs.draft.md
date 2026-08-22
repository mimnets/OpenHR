---
title: "Understanding Your Attendance Logs"
slug: understanding-attendance-logs
excerpt: "How to view your personal attendance history, understand attendance status badges, and read consolidated daily records."
authorName: "OpenHRApp Team"
category: "Attendance"
displayOrder: 22
publishedAt: "2026-02-17T06:44:34.193+00:00"
---

# Understanding Your Attendance Logs

Your attendance history is the record of when you started and finished work each day. It is what leave balances, payroll and any later dispute are all built on, so it is worth understanding exactly how OpenHRApp turns your check-ins into the rows you see.

## How to open your attendance history

Go to **Attendance Logs** in the sidebar. The heading tells you which view you are in:

- **My Attendance History** — your own records. This is what every employee sees.
- **Team Attendance** — a manager looking at their team.
- **Attendance Audit** — an admin or HR user looking at the whole organization.

Managers and admins can switch between their own history and the wider view; employees only ever see their own.

## Why is there one row per day when I punched several times?

Because the list is **consolidated**. Every punch you make is stored, but the screen groups them into one row per person per day rather than showing each punch separately.

Within a day the rule is simple and worth memorising:

- **Check-in is your earliest punch of the day.** A later check-in never replaces an earlier one.
- **Check-out is your latest punch of the day.** A later check-out always replaces an earlier one.
- **Remarks are joined together**, separated by a vertical bar, so no note is lost.

This is often called first-in / last-out. If you check in at 09:00, step out at 13:00, come back at 14:00 and leave at 18:00, your row shows **09:00 – 18:00**, not two separate blocks. It is the shape most payroll and compliance processes expect, and it means an extra punch cannot accidentally shorten your recorded day.

The consequence to be aware of: **breaks are not deducted**. The hours figure is the span from first punch to last, so a long lunch is inside your total rather than removed from it.

## What each field means

- **Date** — the working day the record belongs to.
- **Check-In** — your earliest punch that day, or a dash if none was recorded.
- **Check-Out** — your latest punch that day, or a dash if you never checked out.
- **Hours** — check-out minus check-in, to one decimal place. It shows `0.0` when either end is missing, so an incomplete day is visibly incomplete rather than quietly counted as zero-length.
- **Status** — see below.
- **Remarks** — any notes attached to the punches, joined together.

## What do the status badges mean?

- **Present** — you checked in on time, or within your shift's grace period.
- **Late** — your first check-in was after your shift start *plus* the grace period.
- **Absent** — no attendance was recorded for a day you were expected.
- **Leave** — an approved leave request covers the day, so it is not counted as absence.
- **Early Out** — you checked out before your shift was due to end.
- **Half Day** — the day is recorded as a half day.

### How is "late" actually decided?

Purely by comparison against your assigned shift, in whole minutes. If your shift starts at 09:00 with a 10-minute grace period, a 09:10 check-in is **Present** and 09:11 is **Late**. The grace period is set per shift by your administrator, not per person, so two people on different shifts can punch at the same moment and get different statuses.

If you have no shift assigned, there is nothing to be late against and the record stays Present. You can see which shift you are on in [your profile](/how-to-use/managing-profile-settings).

## Sorting and filtering

The list is newest first by default. You can narrow it by date range to pull a particular month, which is the usual way to check a payroll period, and admins and managers can additionally filter by employee in the wider views.

Whatever you filter to is what you see — so if a day looks missing, widen the range before assuming the record is gone.

## A day looks wrong. What should I do?

Work through these in order, because the first two explain most cases:

- **No check-out and 0.0 hours.** You almost certainly forgot to check out. The day is not lost — an administrator can correct it.
- **Marked Late when you arrived on time.** Check which shift you are assigned to. Being on the wrong shift is a far more common cause than a mis-recorded punch.
- **The day is missing entirely.** Check your date filter first. If it is genuinely absent, the punch did not reach the server — this can happen if you checked in with no connection and closed the app before it synced.
- **An unexpected extra day.** Consolidation groups by calendar date, so a punch just after midnight belongs to the new day, not the shift you were finishing.

Employees cannot edit their own attendance, by design — a record you can change yourself is not evidence of anything. Corrections go through an administrator, who can amend the record; the change is theirs to make and theirs to justify.

## Who can see your attendance?

Your own records are visible to you, to your manager, and to admin and HR users. Other employees cannot see them. Managers see the people they manage rather than the whole organization, and the audit view is limited to admin and HR.

## Related guides

- [How to clock in and out](/how-to-use/how-to-clock-in-and-out) — making the punches this page records
- [Attendance audit for admins](/how-to-use/attendance-admin-audit) — reviewing and correcting records across the organization
- [Generating reports](/how-to-use/generating-reports) — turning attendance into monthly figures
- [Attendance tracking](/features/attendance-tracking) — how the feature works
