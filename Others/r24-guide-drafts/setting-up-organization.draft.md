---
title: "Setting Up Your Organization"
slug: setting-up-organization
excerpt: "Complete admin guide to configuring departments, teams, shifts, GPS locations, leave policies, holidays, and workflows in OpenHRApp."
authorName: "Monirul Islam"
category: "Organization"
displayOrder: 51
publishedAt: "2026-03-13T05:17:05.144+00:00"
---

# Setting Up Your Organization

Organization & Setup is where the rules the rest of OpenHRApp follows are defined — who belongs where, what hours count, which days are holidays, and how leave gets approved. It is available to Admin and HR, and it is worth working through in order, because later sections depend on earlier ones.

## The order that saves rework

The nine tabs are not independent. Set them up in this order and nothing needs revisiting:

1. **Structure** — departments and designations
2. **Teams** — groups and their leaders
3. **Placement** — office locations
4. **Shifts** — working hours
5. **Workflow** — leave approval routing
6. **Leaves** — types and quotas
7. **Holidays** — the year's calendar
8. **Notifications** — what the organization sends
9. **System** — identity, timezone and currency

Teams need departments to exist. Workflow routing is defined per department. Employees cannot be assigned a shift or team that has not been created. Doing it out of order means going back.

## Structure — departments and designations

Departments group people and are what leave workflow routing is keyed on. Designations are job titles and are descriptive only — nothing behaves differently because of one.

Keep departments to real organizational units. A department created for one person is a department you will have to configure workflow for.

## Teams — and why they matter more than they look

A team has members and a **leader**, and it does two jobs: team members can see each other in the directory, and the leader gains visibility of everyone in it.

This is one of the two ways a manager gets to see anybody — the other is being set as someone's line manager. A manager with neither sees an empty screen regardless of their role, which is the single most common configuration complaint.

## Placement — office locations

Locations are defined with coordinates and a radius. When somebody clocks in nearby, their record shows the location name rather than raw coordinates.

Set the radius generously. GPS indoors is routinely out by a hundred metres or more, and a radius drawn tightly around the building produces a stream of punches that look like they came from outside it. The radius is there to make records readable, not to catch people.

## Shifts — the most consequential tab

A shift defines start and end times, working days, and the grace periods that decide lateness. Assigning it to an employee is what makes attendance measurable.

Each shift carries:

- **Start and end times**
- **Working days** — which also drives leave day counting for people on that shift
- **Late grace period** — minutes after the start before a punch counts as Late
- **Early-out grace period**
- **Earliest check-in** and an **automatic session close time** for forgotten check-outs

Set the grace period to something you would actually enforce. Zero minutes means a 09:00 shift marks 09:01 as late, every day, for everyone — which produces a lateness report nobody believes and therefore nobody uses.

## Workflow — leave approval routing

Per department, choose whether leave goes to the employee's manager first or straight to HR or Admin.

The manager stage exists because the manager is the only person who knows whether the team can absorb the absence. Route around it only where it genuinely adds nothing — see [understanding leave policies](/how-to-use/understanding-leave-policies).

## Leaves — types and quotas

Choose which leave types exist, whether each carries a balance, and how many days each is worth. Quotas can be overridden per employee for individually negotiated entitlements.

Creating a type and setting its quota are separate steps; a new balance-carrying type with no quota shows zero days available.

## Holidays

The public holiday calendar, which can be pre-populated for your country and then adjusted.

Set the year's holidays **before the year starts**. Holidays are excluded from leave day counts at the moment a request is made, so a holiday added later does not retrospectively refund anyone who already booked across it.

## Notifications

Which notification categories your organization sends, how often email goes out, and quiet hours. See [notification settings](/how-to-use/notification-settings).

## System

Organization name, country, address, logo, timezone and currency.

The **logo** appears on exported PDFs, so uploading one turns a plain table into something you can send outside the company. **Timezone** affects how times are recorded and interpreted — set it before people start clocking in, not after.

This tab is also where an administrator can opt the organization in to being featured on the OpenHRApp website, if you want to be.

## A minimum viable setup

If you want people working today:

1. Create your departments.
2. Create one default shift with realistic hours and a sensible grace period.
3. Set timezone and organization name under System.
4. Load this year's holidays.
5. Add employees, assigning role, team, line manager and shift as you go.

Locations, custom leave types and workflow routing can all wait. The four per-employee assignments cannot — they are what everything else reads.

## Related guides

- [Managing employees](/how-to-use/managing-employees) — assigning what you configure here
- [Understanding leave policies](/how-to-use/understanding-leave-policies) — quotas and routing in depth
- [Custom leave types](/how-to-use/custom-leave-types) — adding your own
- [Roles and permissions](/how-to-use/roles-and-permissions) — who can open this screen
