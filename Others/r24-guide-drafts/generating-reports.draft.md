---
title: "Generating Reports"
slug: generating-reports
excerpt: "How to generate attendance and leave reports in OpenHRApp, export as CSV or PDF, and email summaries to stakeholders."
authorName: "Monirul Islam"
category: "Reports"
displayOrder: 71
publishedAt: "2026-03-13T05:18:27.239+00:00"
---

# Generating Reports

Reports turn day-to-day attendance and leave records into figures you can act on — a monthly summary for payroll, a lateness pattern worth a conversation, an absence list for a department. This guide covers what is available, how to configure a report, and how to read the output without drawing the wrong conclusion.

Reports are available to **Admin and HR**. For exporting the people list rather than their attendance, see [exporting employee data](/how-to-use/exporting-employee-data).

## What you can report on

- **Attendance** — the full record for a period.
- **Late** — filtered to days marked Late.
- **Absent** — filtered to days marked Absent.
- **Leave** — leave taken across the period.
- **Summary** — one row per employee, aggregated.

The first four are detail: one row per record. Summary is the one to reach for at month end, because it compresses the whole period into a line per person.

## Generating one

1. Open **Reports**.
2. Choose the report type.
3. Set the **date range**.
4. Narrow by **department** or a specific **employee** if you want to.
5. Generate.

Filters combine, so a department filter and an employee filter together will return only that employee, and only if they are in that department. If a report comes back emptier than expected, clear the filters before concluding anything.

### Choosing which columns appear

Detail reports let you select the columns you want, including employee ID, name, date, status, clock in and out, GPS address, latitude and longitude, and remarks.

Turn off what you do not need. A report going to a department head does not need coordinates, and a spreadsheet with ten columns is harder to read than one with five. Leave the coordinates on when you are actually investigating a location question, and off the rest of the time.

## What the summary report contains

One row per employee: employee ID, name, department, designation, working days, present, absent, late, leave, half days, and an attendance percentage.

The percentage is present days over working days for the period. Two things it does not know:

- **A missing check-out does not reduce it.** Someone who checked in every day but never checked out still counts as present — their hours are wrong, but their percentage is fine.
- **It cannot tell absence from a missing punch.** A person who worked and forgot to clock in is indistinguishable from one who did not come.

Treat a low figure as a question rather than a finding. Check [the attendance audit](/how-to-use/attendance-admin-audit) before raising it with anyone.

## Exporting

Reports export to **CSV** for spreadsheets, and to **PDF** for sharing. The PDF carries your organization's logo and address, so it can go outside the company as it is — upload a logo under Organization & Setup if you have not.

The CSV quotes values containing commas or quotation marks, so free-text remarks survive intact.

## Emailing a report

Reports can be sent by email to stakeholders, and recent send activity is shown on the screen with a status against each — sent, pending, or failed.

Check that list after sending anything that matters. A failed send is visible there and nowhere else; the report will not tell you it did not arrive.

## Reading reports well

- **Run to a whole pay period.** A range ending mid-week produces a working-days figure nobody can reconcile against payroll.
- **Check the late report against shifts first.** A cluster of lateness in one team is more often a wrong shift assignment than a behaviour problem, and the report cannot tell the difference.
- **Cross-check absences against leave.** Approved leave should show as leave; an absence over an approved leave day means the two records disagree and one needs fixing.
- **Look at a person before a percentage.** A single number over a month hides the shape of it — five consecutive missing days mean something different from five scattered ones.

## Common questions

### The report is empty

Almost always the date range or a leftover filter. Widen the range, clear the department and employee filters, and try again.

### Working days looks wrong for someone

Working days come from that person's shift where they have one, and from the organization configuration otherwise. Somebody on a different shift pattern will legitimately show a different figure from a colleague over the same dates.

### Can I schedule a report to run automatically?

Reports are generated when you ask for them. For a recurring need, run it on the same day each month rather than expecting it to arrive.

### Numbers do not match the attendance screen

Compare the date ranges first, and check whether one view has a filter the other does not. Both read the same records, so a genuine mismatch means one of them is filtered.

## Related guides

- [Attendance audit](/how-to-use/attendance-admin-audit) — correcting the records behind the figures
- [Understanding attendance logs](/how-to-use/understanding-attendance-logs) — what each status means
- [Exporting employee data](/how-to-use/exporting-employee-data) — exporting people rather than attendance
- [Reports and analytics](/features/reports-analytics) — how the feature works
