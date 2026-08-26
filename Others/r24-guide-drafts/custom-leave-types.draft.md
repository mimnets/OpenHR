---
title: "Custom Leave Types and Special Leave"
slug: custom-leave-types
excerpt: "Understanding all leave types in OpenHRApp — Maternity, Paternity, Earned, Unpaid, half-day leave, and custom-configured types."
authorName: "Monirul Islam"
category: "Leave"
displayOrder: 35
publishedAt: "2026-03-13T05:50:51.585+00:00"
---

# Custom Leave Types and Special Leave

OpenHRApp ships with seven leave types, and administrators can add more. The setting that matters most when you create one is not its name or its colour — it is whether it carries a balance, because that decides whether the type counts down against an allowance or simply records that time was taken.

## The built-in types

**With a balance** — each has a quota and is deducted from it:

- **Annual Leave** — the main allowance, usually planned in advance.
- **Casual Leave** — short, often same-day absences.
- **Sick Leave** — illness.

**Without a balance** — recorded but never counted down:

- **Maternity** and **Paternity** — duration set per case, usually by statute.
- **Earned Leave** — accrued through extra work and managed manually.
- **Unpaid Leave** — no allowance exists by definition.

## What does "has balance" actually change?

Everything about how the type behaves.

A type **with** a balance gets a quota in your leave policy, shows a remaining figure to the employee, and is reduced when leave is fully approved. A type **without** one has no quota, no remaining figure, and no arithmetic — the request is recorded and that is all.

Choose by asking one question: *is there a fixed number of days per year?* If yes, give it a balance. If the duration is decided case by case — statutory maternity leave, unpaid time, compassionate leave — do not, because a quota implies a limit that does not exist and will be wrong for somebody.

Get it wrong in the generous direction and people see an allowance they do not have. Get it wrong the other way and legitimate leave appears to exhaust an allowance it should never have touched.

## Creating a type

1. Go to **Organization & Setup** and open the leave configuration.
2. Add a leave type.
3. Give it a **name** — this is what employees choose from, so use their words rather than a policy reference.
4. Pick a **colour**, used to distinguish it at a glance in lists and calendars.
5. Set **has balance**.
6. Save, then set the quota in your leave policy if it carries one.

Creating the type and setting the quota are two separate steps. A new balance-carrying type with no quota set shows zero days available, which looks like a bug and is not — see [understanding leave policies](/how-to-use/understanding-leave-policies).

### Types worth adding

- **Compassionate or bereavement leave** — usually without a balance.
- **Study or exam leave** — with a balance if your policy sets a limit.
- **Religious observance** — where your public holiday calendar cannot cover everyone.
- **Work from home**, if you record it as leave rather than attendance. Without a balance.

## How do half days work?

The total days field accepts halves, so **0.5** is a valid length and is deducted as half a day.

One limitation to know: **only Admin and HR can create a half-day record.** When an employee applies for leave themselves, the length is calculated from the dates they pick and comes out in whole days. So a half day is requested by asking, and entered on their behalf.

If half days are routine in your organization, tell people that route exists — otherwise they will book a whole day for a morning appointment, and the balance will be wrong all year.

## Editing and removing types

Types can be edited after creation, but think about existing records before you do.

- **Renaming** is safe — it is a label, and past requests follow the new name.
- **Changing the colour** is cosmetic.
- **Turning a balance on or off** changes how existing leave of that type is counted. Switching it on means past approved leave of that type begins drawing down the new quota, which can put someone straight into a negative-looking position.
- **Removing a type** that has been used leaves historical requests referring to something no longer offered. Stop offering it rather than deleting it, where you can.

The safest time to change any of this is the start of a leave year.

## Keeping the list short

Every type you add is a decision an employee has to get right at the moment they apply, and mis-categorised leave is much harder to fix than to prevent — it means correcting the record and adjusting two balances.

Before adding one, ask whether an existing type plus a sentence in the reason field would do. Five well-understood types beat twelve precise ones nobody can choose between.

## Related guides

- [Understanding leave policies](/how-to-use/understanding-leave-policies) — quotas, overrides and approval routing
- [How to apply for leave](/how-to-use/how-to-apply-for-leave) — what employees see when choosing a type
- [Leave approval for HR](/how-to-use/leave-approval-for-hr) — creating leave on someone's behalf
- [Setting up your organization](/how-to-use/setting-up-organization) — where leave configuration lives
