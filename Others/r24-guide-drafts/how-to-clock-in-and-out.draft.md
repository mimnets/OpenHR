---
title: "How to Clock In and Out"
slug: how-to-clock-in-and-out
excerpt: "A complete guide to clocking in and out of work using OpenHR's selfie and GPS-based attendance system.
"
authorName: "Monirul Islam"
category: "Attendance"
displayOrder: 21
publishedAt: "2026-02-17T05:43:32.089+00:00"
---

# How to Clock In and Out

Clocking in records the start of your working day, along with where you were and — where your organization uses it — a selfie taken at that moment. This guide covers the everyday flow, the permissions you need to grant once, and what to do when something does not work.

## Before your first check-in

Two browser permissions are requested the first time, and both are one-off:

- **Camera** — for the selfie, where your organization requires one.
- **Location** — to record where the punch happened.

Grant them when asked. If you dismiss the prompt it does not come back on its own, and you will have to re-enable them in your browser's site settings for OpenHRApp — usually via the padlock icon in the address bar.

Both require a secure connection, which the live site always has. They will not work over plain HTTP.

## Clocking in

1. Open **Attendance**.
2. Choose your **duty type** — Office or Factory.
3. Wait for the camera and location to become ready.
4. Take the selfie.
5. Confirm.

The time is recorded when the punch is saved, not when you opened the screen, so a slow camera does not make you late.

### Office or Factory — does it matter?

Yes, more than the labels suggest. **Lateness is only calculated for Office punches.** A Factory punch is always recorded as Present regardless of the time, and is tagged with a `[FACTORY]` marker in the remarks.

That is deliberate — shift-based factory work is not measured against a fixed office start time — but it means choosing the wrong one changes your record. If you are unsure which applies to you, ask before your first punch rather than after a month of them.

## Clocking out

Return to Attendance at the end of the day and check out. Your recorded hours run from your first punch to your last, so this is the half that decides whether the day counts properly.

### What if I forget to check out?

The day is recorded with a check-in, no check-out, and **0.0 hours**. Nothing is lost, but nothing is calculated either, and it will not fix itself.

The system closes forgotten sessions automatically rather than leaving them open indefinitely, and adds a remark saying it did so — that remark is the visible sign that the time was not recorded by you. Ask an administrator to correct the actual departure time; only Admin and HR can edit a record, which is why it is worth mentioning the same day while you still remember it.

Building the habit of checking out is much easier than the correction workflow.

## Location and geofencing

Your position is captured at punch time and stored with the record. Where your organization has configured office locations with a radius, your punch is matched against them so the record shows a recognisable place name rather than raw coordinates.

Location accuracy varies, and a reading a few hundred metres off is normal indoors, in basements, or between tall buildings. That is expected and is not treated as dishonesty — see [attendance audit](/how-to-use/attendance-admin-audit) for how administrators are advised to read it.

## What the selfie is for

It ties the punch to a person. Without it, a recorded check-in only proves that someone with your password was at a location — the practice of one colleague punching in for another is exactly what the photo prevents.

It is taken at the moment of the punch and cannot be added or replaced afterwards. Photos are stored with the attendance record and visible to those who can view your attendance: you, your manager, and Admin and HR.

## When something does not work

### The camera does not start

- Check the padlock icon in your address bar and confirm camera access is allowed.
- Close other apps or tabs using the camera — most devices only allow one at a time.
- On an installed app on iPhone or iPad, permissions are stricter than in the browser. If it works in Safari but not in the installed app, grant it again there.

### Location will not resolve

- Allow location for the site, then reload.
- Move near a window. Indoor readings are slow and sometimes fail entirely.
- Turn on device location services if they are off system-wide — a site permission cannot override that.

### I am marked Late but I arrived on time

Check your assigned shift on [your profile](/how-to-use/managing-profile-settings) before anything else. Lateness is measured against your shift's start time plus its grace period, so a wrong shift produces wrong statuses on every day at once. Fixing the shift is the fix; correcting individual days is not.

### I punched twice by mistake

No harm done. Multiple punches in a day are consolidated into one record using the earliest check-in and the latest check-out, so an extra punch cannot shorten your day.

## Related guides

- [Understanding your attendance logs](/how-to-use/understanding-attendance-logs) — reading what your punches produced
- [Installing OpenHRApp](/how-to-use/install-openhrapp-pwa) — clocking in from your home screen
- [Managing your profile](/how-to-use/managing-profile-settings) — checking your assigned shift
- [Attendance tracking](/features/attendance-tracking) — how the feature works
