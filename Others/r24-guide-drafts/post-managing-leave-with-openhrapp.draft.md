---
title: "Managing Employee Leave with OpenHRApp"
slug: managing-leave-with-openhrapp
excerpt: "A practical guide to using OpenHRApp's leave management system. Learn how employees apply for leave, how managers approve requests, and how HR can configure policies to match your organization."
authorName: "OpenHRApp Team"
category: "Feature Guide"
publishedAt: "2026-01-13T10:41:00+00:00"
---

# Managing Employee Leave with OpenHRApp

OpenHRApp's leave management system handles the entire lifecycle — from application to approval to balance tracking — with minimal administrative overhead. This guide walks through how each role uses the leave system and how to configure it for your organization.

## How do employees apply for leave?

The leave application process is designed to take less than a minute. Here is how it works:

1. Navigate to Leave from the sidebar.
2. You will see your leave dashboard, which displays your current balances for each leave type, your recent leave history, and the team calendar.
3. Click Apply for Leave to open the application form.
4. Fill in:Leave Type — Select from the types your organization has configured (Annual, Sick, Casual, etc.).
5. Dates — Choose your start and end dates using the date picker. The system automatically calculates the total number of days, excluding weekends and holidays.
6. Half-Day Option — If you only need a half day, toggle this option and select morning or afternoon.
7. Reason — Optional but recommended. A brief note helps your manager understand the context.
8. Submit the application.

You will receive an email confirmation that your application has been submitted. You can track the status of all your applications from the Leave page.

### How is a leave balance calculated?

Your leave dashboard shows, for each leave type:

- Total allowance — Your annual entitlement.
- Used days — How many days you have taken this year.
- Remaining days — How many days you still have available.

This updates in real time — when a leave request is approved, your balance is deducted automatically.

### Can an employee change or cancel a request?

Requests cannot be edited or withdrawn once submitted. If your plans change, ask your approver to reject the request with a note, then submit corrected dates. This is deliberate: a request that can be altered after approval is no longer a reliable record of what was agreed. If the leave was already approved, ask HR to amend the record — only HR and Admin can do so, and the change is attributed to them.

## What does a manager actually decide?

Managers receive an email notification when a team member submits a leave request. The email includes the employee's name, leave type, dates, and reason — everything needed to make a decision in seconds.

From the Leave page, managers can:

1. View pending requests — All leave requests awaiting your approval are listed at the top.
2. Check team availability — The team calendar shows who else is on leave during the requested dates. This helps you identify potential coverage gaps before approving or rejecting.
3. Approve or reject — One click to approve, or reject with an optional remark explaining why (e.g., "Two other team members are already on leave that week. Could you reschedule to the following week?").

The employee is notified immediately of your decision.

### What should managers watch for?

- Respond within 24 hours. Employees often need to make plans around leave approvals. A quick response shows respect for their time.
- Use rejection remarks constructively. If you must reject a request, explain why clearly and suggest alternatives if possible.
- Check the calendar before approving. A brief glance at team availability prevents the awkward situation of discovering a coverage gap after approving.

## How do you configure leave policies?

HR administrators have full control over the leave system. All configuration is done from the Organization page.

### Which leave types should carry a balance?

Go to Organization > Leaves. Here you can:

- Add, edit, or remove leave types — Customize the list to match your organization's actual policies.
- Configure annual allowances — Set the default number of days per year for each leave type.
- Enable or disable balance tracking — Some leave types (like Maternity Leave or Bereavement Leave) may not need a tracked balance — they are granted as needed.
- Set carry-over rules — For leave types with tracked balances, specify whether unused days carry over to the next year, and if so, the maximum number of days that can be carried over.

### How does a request get routed?

Go to Organization > Workflow to configure how leave requests are routed:

- Department-level settings — For each department, specify the approver role: Manager (the employee's direct manager approves) or HR/Admin (skip the manager, go directly to HR).
- Manager bypass — If an employee does not have a line manager assigned, their requests automatically go to HR/Admin.
- Auto-approval — For certain leave types (like Casual Leave under 2 days), you can configure auto-approval to skip the manual review entirely.

### How do you give one person a different allowance?

If individual employees have different leave allowances (e.g., a senior executive with extra annual leave, or a part-time employee with prorated leave), you can set per-employee overrides. These override the default allowance for the selected leave types.

### How do you report on leave?

HR can generate leave reports from the Reports page:

- Leave utilization by employee — How many days each employee has taken, organized by leave type.
- Leave utilization by department — Which departments are using the most leave? Are there patterns of high leave usage that might indicate workload or morale issues?
- Leave balance summary — Remaining balances for all employees, useful for year-end planning.
- Export to CSV — All reports can be exported for payroll processing or further analysis.

## How do you see who is away?

There is no calendar view. Managers see approved and pending leave for their own people on the Leave page, and the dashboard shows how many of the team are present today. For a view across a whole period, run a leave report for the date range you care about — see the reports guide. What the leave list shows:

- Employee name (but not leave type or reason — maintaining privacy).
- Date range of the absence.
- Color coding by leave type (optional, configurable).

Managers and HR see the calendar for their team or the entire organization. Employees see their own approved leave and, optionally, their team members' leave dates.

The calendar is particularly useful for:

- Spotting coverage gaps before they happen.
- Planning project timelines around team availability.
- Identifying patterns (e.g., multiple people in the same team taking leave during the same week every month).

## How are the awkward cases handled?

### What happens when leave spans a weekend or holiday?

When an employee selects a date range, OpenHR automatically calculates the number of working days — excluding weekends and holidays. For example, if an employee takes Monday through the following Monday (8 calendar days) and the weekend falls in between, only 6 working days are deducted from their balance.

### Can you book half a day?

Half days are supported, but not through the employee request form — dates picked by an employee always produce whole days. An Admin or HR user enters the record directly, where the total days field accepts 0.5. So a half day is arranged by asking rather than by booking. Half-day leave is useful for medical appointments, school events, or other short-duration personal needs.

### How many approvals does a request need?

For organizations that require both manager and HR approval, the workflow is sequential:

1. Employee submits → Manager reviews.
2. Manager approves → HR reviews.
3. HR approves → Leave is confirmed.

At each step, all relevant parties are notified by email.

### What about leave during a notice period?

When an employee is serving their notice period, leave requests may follow different rules (e.g., requiring HR approval regardless of the standard workflow). OpenHR supports role-based routing rules that can be configured to handle this scenario.

## Conclusion

OpenHR's leave management system handles the entire leave lifecycle — from one-click employee applications to automated balance tracking to comprehensive HR reporting. It adapts to your organization's policies, not the other way around. And like everything in OpenHR, it is completely free.

Further Reading

- [Leave Management Best Practices for Growing Teams](/blog/leave-management-best-practices) — Design leave policies that scale: accruals, carry-over, team calendars, and multi-department rules.
- [Getting Started with OpenHRApp: A Step-by-Step Setup Guide](/blog/getting-started-with-openhrapp) — Configure your organization's leave types, workflows, and policies from scratch.

*Set up your leave policies in OpenHRApp today. Free, no limits, no per-user fees. [Get started](/).*
