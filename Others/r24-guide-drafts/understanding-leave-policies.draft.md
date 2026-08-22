---
title: "Understanding Leave Policies"
slug: understanding-leave-policies
excerpt: "How leave types, balances, quotas, approval workflows, and holiday exclusions are configured in OpenHRApp."
authorName: "Monirul Islam"
category: "Leave"
displayOrder: 34
publishedAt: "2026-03-13T05:12:31.95+00:00"
---

# Understanding Leave Policies

Your leave policy is three separate things working together: the **types** of leave that exist, the **quota** each person gets of each type, and the **route** a request takes to get approved. Changing one does not change the others, and most confusion about leave comes from adjusting the wrong one.

## What leave types exist?

OpenHRApp ships with seven, split by whether they draw down a balance:

**Types with a balance** — these count against a quota:

- **Annual Leave**
- **Casual Leave**
- **Sick Leave**

**Types without a balance** — these are recorded but not counted down:

- **Maternity** and **Paternity** leave
- **Earned Leave**
- **Unpaid Leave**

The distinction is deliberate. Maternity leave is governed by statute and duration rather than by an annual allowance, and unpaid leave has no allowance by definition. Giving them a quota would imply a limit that does not exist.

Administrators can add custom leave types and decide for each whether it carries a balance — study leave, compassionate leave, and religious observance are common additions.

## How are quotas set?

Two levels, and the second overrides the first.

1. **Organization defaults** — a number of days per balance-carrying type, applied to everyone.
2. **Per-employee overrides** — a different number for one person, which replaces the default for them alone.

Overrides exist for the cases policy cannot express as a single number: a senior hire negotiating extra annual leave, someone on a phased return, a part-time contract. Set an override and that person's entitlement is theirs; leave it alone and they follow the organization default, including any later change to it.

Both are configured under **Organization & Setup** by an administrator.

### How is a remaining balance calculated?

Quota minus fully approved leave of that type. That is the whole formula, and the important word is **approved**.

Requests still moving through the approval chain are *not* deducted. Someone with 20 days of annual leave who has one 5-day request approved and another 5-day request awaiting HR will show **15 days remaining**, not 10 — even though only 10 are truly available if both go through.

Worth knowing before you plan around a number: check pending requests as well as the balance. It is also why a manager approving a request does not change the employee's balance — see [leave approval for managers](/how-to-use/leave-approval-for-managers).

## How does a request get routed?

When leave is submitted, OpenHRApp decides who sees it first:

1. If the employee's **department has a workflow set to HR or Admin**, the request goes straight to HR, skipping the manager entirely.
2. Otherwise, if the employee **has a line manager**, it goes to that manager.
3. If they have **no line manager**, it goes to HR — so a request is never left with nobody to action it.

After a manager approves, the request moves to HR rather than completing. HR or an administrator makes the final decision. A manager's rejection, by contrast, is final.

So a request passes through at most two stages, and always ends at HR or Admin.

### When should a department bypass managers?

Department workflows are useful where the manager stage adds nothing: a department whose head is already the HR lead, a small team where the manager and the approver are the same person, or a function where leave is scheduled centrally.

Be careful setting it more widely. The manager stage exists because the manager is the only person who knows whether the team can absorb the absence — HR can verify the balance but cannot see that half the team is already away that week. Bypassing it trades operational judgement for speed.

## How do holidays and weekends affect a request?

When an employee picks a start and end date, OpenHRApp counts only the days they would otherwise have worked. Two kinds of day are excluded automatically:

- **Non-working days** — taken from the employee's shift if they have one, otherwise from the organization's working-day configuration.
- **Public holidays** — from your holiday calendar.

The employee sees the breakdown as they choose the dates, so a request spanning a weekend and a public holiday shows exactly how many days it will actually cost them. Nobody has to compute it, and nobody loses allowance to a bank holiday.

Both calendars are configured under Organization & Setup, and the holiday list can be pre-populated for your country.

Keep the calendar current. A holiday added after leave was requested does not retrospectively alter that request, so the order of operations matters: set the year's holidays before the year starts, rather than as they arrive.

## Do unused days carry over?

No. Quotas are not automatically carried into a new year, and there is no accrual schedule that adds days monthly — the quota is the quota.

If your policy does carry days over, the mechanism is a per-employee override: set that person's quota to their entitlement plus whatever they carried. It is a manual step, which means it is worth doing deliberately at year end rather than assuming the system has done it.

## Setting a policy that works

- **Start from the statutory minimum** for your country and treat it as the floor.
- **Keep the type list short.** Every additional type is a decision an employee has to make correctly when applying, and mis-categorised leave is harder to fix than to prevent.
- **Decide whether sick leave should carry a balance.** A quota discourages people from recording short illnesses honestly; no quota loses you the ability to spot a pattern. Both are defensible — choose deliberately.
- **Set line managers before you need them.** Every employee without one routes to HR, and a policy that quietly sends everything to HR is not the policy you designed.

## Related guides

- [How to apply for leave](/how-to-use/how-to-apply-for-leave) — the employee's side
- [Custom leave types](/how-to-use/custom-leave-types) — adding your own
- [Leave approval for managers](/how-to-use/leave-approval-for-managers) — the first approval stage
- [Setting up your organization](/how-to-use/setting-up-organization) — working days and holidays
