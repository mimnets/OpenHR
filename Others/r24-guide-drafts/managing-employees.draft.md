---
title: "Managing Employees — Adding and Editing Staff"
slug: managing-employees
excerpt: "How admins add new employees, assign roles and departments, manage the employee directory, and export staff data."
authorName: "Monirul Islam"
category: "Employees"
displayOrder: 41
publishedAt: "2026-03-13T05:15:01.849+00:00"
---

# Managing Employees — Adding and Editing Staff

The employee directory is where people are added, edited, and connected to the teams and managers that make the rest of OpenHRApp work. Adding someone takes a minute; the fields that decide what they can see and who approves their leave are the ones worth getting right.

## Who can do what here

- **Admin and HR** — see everyone, and can add, edit and remove employees.
- **Managers** — see their own people and can view records, but cannot edit them.
- **Employees** — see their teammates only.

The page heading tells you which view you are in: *Organization Directory*, *My Team & Reports*, or *My Teammates*.

## Adding an employee

Open **Team Directory** and add a new employee. The fields divide into three groups by how much they matter downstream.

### Identity — who they are

Name, work email, employee ID, mobile, joining date. The **email** is what they sign in with, so a typo here means they cannot get in at all — check it before saving.

### Placement — where they sit

Department, designation, location, employment type (permanent, contract or temporary) and work type (office or field).

### The four that change behaviour

These are the ones people forget, and each has a visible consequence:

- **Role** — decides which screens they can open and whose records they see. See [roles and permissions](/how-to-use/roles-and-permissions).
- **Line manager** — decides who approves their leave. Left empty, every request goes straight to HR.
- **Team** — decides which colleagues they can see, and feeds manager visibility.
- **Shift** — decides what "late" means for them. Left empty, lateness cannot be calculated.

An employee created without these four still works, but leave routes to HR, they see nobody in the directory, and their attendance is never marked late. All four are invisible failures — nothing errors, the behaviour is just quietly wrong.

## Editing someone

Open their record, change what you need, and save. Changes take effect immediately.

Two that need thought before you make them:

- **Changing a role** changes what they can see straight away — including, when promoting someone to Manager or above, colleagues' contact details and attendance.
- **Changing a shift** changes how future attendance is judged. It does not retrospectively re-evaluate past days, so a shift corrected in March leaves January and February scored against the old one. Those days need correcting individually in [the attendance audit](/how-to-use/attendance-admin-audit) if it matters.

## Teams and line managers

These two are the most misunderstood part of the app, because they look similar and do different jobs.

- A **team** groups people and has a leader. Team members can see each other; the leader can see the team.
- A **line manager** is a person-to-person link. It decides leave approval and gives that manager visibility of that individual.

A manager sees someone if they lead a team that person is in, *or* if they are set as that person's line manager. Sharing a department does nothing on its own.

The common failure is a manager who reports "I cannot see my team". Nine times in ten neither link has been set, and their role is fine.

## Profile photos

Photos are uploaded here, on the employee's record — **employees cannot set their own**. Where there is no photo, OpenHRApp shows the first letter of the person's name.

Images are converted automatically on upload, so any common format is fine.

## Making someone inactive

When a person leaves, set their status to **Inactive** rather than deleting them. Their attendance history, leave records and reviews stay intact and keep making sense, which matters for payroll queries and anything you may be asked to evidence later.

Inactive employees still appear in exports, marked as such, so filter on status when you want current staff only.

## Common questions

### A new employee cannot sign in

Check the email on their record character by character. It is the most common cause by a wide margin.

### Their leave went to HR instead of their manager

They have no line manager set, or their department is configured to route to HR. Both are visible on the record and in your leave workflow settings.

### Can I import a list of employees?

Employees are added individually through this screen. For a large intake, add them in batches and set the four behavioural fields as you go rather than planning to sweep back through later — the sweep rarely happens.

### Can a manager edit their own team?

No. Viewing and editing are separated deliberately, so the person who manages someone is not also the person who can rewrite their record.

## Related guides

- [Setting up your organization](/how-to-use/setting-up-organization) — creating the teams and shifts you assign here
- [Roles and permissions](/how-to-use/roles-and-permissions) — what each role unlocks
- [Exporting employee data](/how-to-use/exporting-employee-data) — getting this list out
- [Understanding leave policies](/how-to-use/understanding-leave-policies) — how line managers affect routing
