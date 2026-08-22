---
title: "Attendance for Admins — Audit and Manual Entries"
slug: attendance-admin-audit
excerpt: "How admins can audit attendance records, edit clock-in times, create manual entries, and mark employees as absent."
authorName: "Monirul Islam"
category: "Attendance"
displayOrder: 23
publishedAt: "2026-03-13T04:56:33.949+00:00"
---

# Attendance for Admins — Audit and Manual Entries

The attendance audit is where administrators and HR see attendance across the organization, and the only place a record can be corrected. It is also the screen where the most damage can be done, so this guide covers the checks worth making before you change anything.

## Opening the audit

Go to **Attendance Audit** in the sidebar. It is available to Admin, HR and managers, but they do not see the same thing:

- **Admin and HR** — the whole organization. The heading reads *Attendance Audit*.
- **Managers** — only their own people. The heading reads *Team Attendance*.

Editing is **Admin and HR only**. Managers can review their team's attendance but cannot alter it, which keeps the person being measured and the person able to change the measurement separate.

## What you are looking at

One row per employee per day, not one row per punch. Multiple punches in a day are consolidated: the **earliest** check-in and the **latest** check-out become that day's record, and any remarks are joined together. See [understanding attendance logs](/how-to-use/understanding-attendance-logs) for the full rule.

Two consequences when auditing. Hours are the span from first punch to last, so **breaks are inside the total, not deducted**. And a 0.0 hours figure means one end of the day is missing, not that somebody worked no time.

## Filtering

You can narrow by employee, by department, and by date range. Filters combine, and — as with exports — **what you filter to is what you see**. Before concluding that somebody has no attendance for a period, widen the range and clear the employee filter.

For payroll, filter to the pay period and one department at a time. It is slower than pulling everything at once, and it makes an omission far easier to spot.

## Correcting a record

1. Find the day and open it.
2. Adjust the check-in, check-out or status.
3. Add a remark saying what you changed and why.
4. Save.

### Always write the remark

An attendance record is the evidence behind a payroll figure and, occasionally, behind a dispute. A corrected time with no explanation is indistinguishable from an error, and months later nobody — including you — will remember which it was.

"Employee confirmed 17:30 departure, forgot to check out" takes seconds to type and is the difference between a record that survives scrutiny and one that does not.

## Marking someone absent

Marking an absence creates a record with status **Absent** and no location data, since there was no punch to take one from.

Before doing it, check that the day is not covered by approved leave. An absence recorded over an approved leave day is wrong twice — it understates attendance and contradicts the leave record — and the two screens will disagree with each other permanently.

## Deleting a record

Deletion is permanent. There is no undo, no archive, and no recovery.

Almost every case that feels like deletion is actually a correction. A wrong time should be corrected; a duplicate is already consolidated into a single row and does not need removing; a day recorded for the wrong person should be corrected to the right one.

Genuine deletion cases are narrow — a test record from setting up the system, or an entry created against an employee who was never actually employed. If you are deleting something because the figure is inconvenient, stop: that is the exact scenario an audit trail exists to prevent.

## Location and selfie verification

Where your organization uses them, records carry the location captured at punch time and, where enabled, a selfie. Both are captured at the moment of the punch and cannot be added retrospectively.

Read them as supporting evidence rather than proof. A phone reporting a location a few hundred metres out is ordinary, especially indoors or in dense city centres — treat a small discrepancy as noise, and a person consistently punching from somewhere they have never worked as a conversation.

Note also that a record you create by hand has no location at all. That is expected, and it is another reason the remark matters.

## What to check each month

- **Days with a check-in and no check-out.** The most common data problem, and the one that quietly deflates hours.
- **Absences that overlap approved leave.** These should be leave, not absence.
- **Unexpected Late statuses.** Frequently a wrong shift assignment rather than lateness — check the employee's shift before raising it with them.
- **Employees with no records at all.** Usually someone who has not been shown how to check in.

## Common questions

### Why can't a manager fix their team's attendance?

Deliberate. The person who benefits from a record and the person able to change it should not be the same, and a manager's rating and their team's attendance are related closely enough to matter. Managers raise corrections with HR.

### Someone is marked Late but arrived on time

Check their assigned shift first. Late is calculated against shift start plus that shift's grace period, so a wrong shift produces wrong statuses across every day at once — fix the shift rather than the records.

### Can I bulk-edit a month?

No, records are corrected one at a time. That is slow by design: bulk attendance edits are the single easiest way to destroy the credibility of the underlying data.

## Related guides

- [Understanding attendance logs](/how-to-use/understanding-attendance-logs) — statuses and the consolidation rule
- [How to clock in and out](/how-to-use/how-to-clock-in-and-out) — what employees are doing
- [Generating reports](/how-to-use/generating-reports) — turning audited attendance into monthly figures
- [Roles and permissions](/how-to-use/roles-and-permissions) — who can edit and who can only look
