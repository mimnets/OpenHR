---
title: "Configuring Notification Settings"
slug: notification-settings
excerpt: "How to configure email notifications, enable or disable notification types, set up SMTP, and manage notification retention."
authorName: "Monirul Islam"
category: "Organization"
displayOrder: 52
publishedAt: "2026-03-13T05:57:39.203+00:00"
---

# Configuring Notification Settings

Notifications in OpenHRApp are controlled at two levels. Your organization decides which categories exist at all, and each person decides which of those they want to hear about. Understanding that split explains most confusion about why someone is or is not being notified.

## The two levels, and which one you need

- **Organization settings** — an administrator turns whole categories on or off, sets how often email goes out, and defines quiet hours. This applies to everyone.
- **Personal settings** — each person mutes categories they do not want, from the notification bell.

The organization level wins. If an administrator disables a category, nobody receives it and no personal setting can bring it back. Within the categories that remain enabled, each person is free to silence whatever they like.

## How do I open organization notification settings?

You need to be an administrator. Go to **Organization & Setup** in the sidebar, then the **Notifications** tab. Everything below is on that screen.

## Which categories can be switched on or off?

Five apply to a normal organization:

- **Announcements** — noticeboard and company-wide announcements.
- **Leave Requests** — submissions, approvals and rejections.
- **Attendance** — check-in reminders, late alerts, missed check-outs.
- **Performance Reviews** — review cycle updates and assessment notifications.
- **System** — system alerts, maintenance and administrative messages.

Two further categories — new registration alerts and upgrade requests — belong to the platform rather than to your organization, and are not something an organization administrator needs to manage.

Think carefully before disabling **Leave Requests** or **Attendance**. Those are the two categories carrying notifications people act on: an approver who is not told about a request will not approve it, and the request simply waits. Announcements and System are the usual candidates if the volume is too high.

## How often does email go out?

One setting for the organization, with four options:

- **Immediate** — an email per event, as it happens. Best where leave needs approving quickly.
- **Daily Digest** — one email a day collecting everything. The usual choice; it cuts volume sharply without losing anything.
- **Weekly Digest** — one email a week. Suitable for small or slow-moving teams.
- **Off** — no email at all. In-app notifications still appear on the bell.

**Off does not mean silent.** It stops email only. People still see notifications when they open the app — which is the point worth making to anyone who says they stopped being told about things after email was disabled.

## What are quiet hours?

Quiet hours suppress notifications during a window you choose — typically overnight. Switch them on and set a start and end time.

This exists for a real reason. Attendance reminders and late alerts are generated on a schedule, and without quiet hours an organization spanning several time zones will send them into someone's night. If your team works one set of hours in one place, quiet hours matter less; if it does not, they matter a great deal.

The window crosses midnight in the way you would expect: a start of 20:00 and an end of 08:00 covers the night, not the working day between them.

## How do I mute a category just for myself?

Open the **notification bell** in the top bar. Each category can be muted individually, and you can set your own email frequency there too.

This is per person and does not affect anyone else. It is also the right answer when one individual finds a category noisy — muting it for them is better than disabling it for the whole organization, which is a change that quietly affects people who were relying on it.

## Somebody is not receiving notifications

Work down this list:

- **Is the category enabled for the organization?** Check the Notifications tab first. This is the most common cause and the easiest to overlook, because it affects everyone at once.
- **Has that person muted it?** Ask them to check the bell.
- **Is email set to Off, or to a digest?** On a weekly digest, an email about a leave request may legitimately be six days away. In-app notifications are unaffected.
- **Do quiet hours cover the time it was sent?**
- **Is their work email correct?** Check their profile — an old address is a common cause after someone changes name or role.

## How long are notifications kept?

Notifications are cleared automatically after a retention period so the list stays useful rather than becoming an archive. That period is a platform-level setting managed by the OpenHRApp team, not something each organization configures, and the options run from a week to ninety days with thirty days as the standard.

The practical consequence: **do not treat the notification list as a record.** It is a prompt to act, not evidence. Leave approvals, attendance records and review outcomes are all stored in their own sections and are unaffected by notification cleanup.

## Related guides

- [Managing your profile and settings](/how-to-use/managing-profile-settings) — muting categories for yourself
- [Announcements](/how-to-use/announcements-guide) — the category that generates the most notifications
- [Leave approval for managers](/how-to-use/leave-approval-for-managers) — what happens when leave notifications are disabled
- [Setting up your organization](/how-to-use/setting-up-organization) — the rest of the organization settings
