---
title: "Exporting Employee Data"
slug: exporting-employee-data
excerpt: "How to export your employee directory as CSV for data analysis or branded PDF for stakeholder sharing."
authorName: "Monirul Islam"
category: "Reports"
displayOrder: 72
publishedAt: "2026-03-13T06:06:48.878+00:00"
---

# Exporting Employee Data

OpenHRApp exports your employee directory in two formats: a **CSV** file for spreadsheets and analysis, and a **branded PDF** for sharing with people who just need to read it. Both come from the same place and both respect whatever you currently have on screen, which is the part that surprises people most often.

If you are looking to export attendance or leave figures rather than people, that is a different screen — see [generating reports](/how-to-use/generating-reports).

## What you can export depends on who you are

The export never contains more than the directory is already showing you, and the directory shows different people to different roles. This is the single most common reason an export comes out smaller than expected.

- **Admin and HR** see every employee in the organization. The page is titled *Organization Directory*.
- **Managers and team leads** see only people in the teams they lead, plus anyone whose line manager is set to them. The page is titled *My Team & Reports*.
- **Employees** see only their own teammates — people who share their team. The page is titled *My Teammates*.

Check the page title before you export. If it does not say *Organization Directory*, you are exporting a subset, and no export setting will widen it — the limit is your role, not the export.

## How to export

1. Open **Employee Directory** from the sidebar.
2. Optionally narrow the list. Search and filters apply to the export, so if you filter to one designation, that is what you get.
3. Use the **department selector** if you want specific departments rather than all of them. Selecting none is the same as selecting all.
4. Click **CSV** or **PDF**. The file is generated in your browser and downloads immediately — nothing is emailed and nothing is stored on a server.

Both buttons are disabled when the current selection contains nobody. If they look greyed out, your filters have excluded everyone; clear them and try again.

### What the file is called

The filename reflects your department selection, so exports taken on different days for different departments do not overwrite each other in your downloads folder:

- All departments — `OpenHRApp_Employee_Directory.csv`
- One department — `OpenHRApp_Finance_Directory.csv`
- Several — `OpenHRApp_3_Departments_Directory.csv`

## What is in the CSV?

Thirteen columns, in this order: Employee ID, Name, Email, Department, Designation, Role, Team, Status, Employment Type, Joining Date, Mobile, Location, and Work Type.

Three of those columns hold a fixed set of values, which matters if you are going to pivot or filter on them:

- **Status** is `ACTIVE`, `INACTIVE`, or `ON_LEAVE`.
- **Employment Type** is `PERMANENT`, `CONTRACT`, or `TEMPORARY`.
- **Work Type** is `OFFICE` or `FIELD`.

Empty cells mean the field was never filled in on that employee's record, not that the export failed. Team shows the team name rather than its internal ID, so the file is readable without cross-referencing anything.

### Will it open correctly in Excel?

Yes. The file is UTF-8 and carries a byte order mark, which is what tells Excel to read it as Unicode. Without that, names containing accented or non-Latin characters arrive as mojibake — *Ahmed Şahin* becoming *Ahmed Åžahin*. Google Sheets and LibreOffice handle it the same way.

Values containing a comma, a quotation mark, or a line break are quoted, and internal quotation marks are doubled, so an address like *12 Main St, Suite 4* stays in one cell instead of splitting across two.

One thing to watch: if your Employee IDs have leading zeros, Excel will strip them the moment it opens the file, because it decides the column is numeric. To keep them, use *Data → From Text/CSV* and set that column to Text rather than double-clicking the file.

## What is in the PDF?

The PDF is built for reading and handing over, not for analysis. It is landscape A4 and carries your organization's branding at the top — your logo, name, and address, exactly as set in [organization settings](/how-to-use/setting-up-organization). If you have not uploaded a logo yet, the header simply starts with your organization name.

Below the header you get a title naming what was exported and how many people it covers, then a summary block showing how many are active, how many are not, and a per-department count. That summary is often the only part a stakeholder reads.

Then comes the table — the same thirteen columns as the CSV, with the header row abbreviating *Employee ID* to *ID* and *Employment Type* to *Type* so the columns fit the page. Long values wrap rather than being cut off. Every page is footed with the generation timestamp and a page number, so a printed copy can be dated and checked for completeness later.

## Which format should I use?

Use **CSV** when the data is going somewhere else — a spreadsheet, a payroll import, a headcount pivot, another system. Use **PDF** when a person is going to read it: a board pack, an audit request, a department headcount for a manager who does not need the underlying file.

If you are not sure, export both. They are generated from the same selection, so they will always agree.

## Why is my export missing people?

In order of likelihood:

- **Your role limits the directory.** See the section above — this accounts for most cases.
- **A filter or search term is still active.** The export follows the screen. Clear everything and check the count.
- **A department selection is still applied** from an earlier export.
- **Inactive employees are genuinely included.** They are exported with status `INACTIVE` rather than dropped, so filter them out afterwards if you only want current staff — the summary block on the PDF gives you both counts.

## Before you share it

An employee export contains personal data: full names, work emails, mobile numbers, and locations. In most jurisdictions that makes the file itself subject to data protection rules the moment it lands in your downloads folder.

Two habits worth keeping. Export the narrowest set that answers the question — one department rather than the whole organization, if one department is what was asked for. And delete the file when you are finished with it, rather than leaving copies accumulating locally. The export takes seconds to regenerate; a stale copy of your entire staff directory sitting in a shared folder is a much longer-lived problem.

## Related guides

- [Managing employees](/how-to-use/managing-employees) — adding people and keeping the fields that appear in these exports up to date
- [Generating reports](/how-to-use/generating-reports) — exporting attendance and leave figures rather than people
- [Roles and permissions](/how-to-use/roles-and-permissions) — why different people see different directories
- [Employee directory](/features/employee-directory) — what the directory does
