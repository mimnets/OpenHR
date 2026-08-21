# OpenHRApp — Cover Image Prompts

> Generated from the live database. 27 of 47 articles have no cover image.
> Every shared link to those falls back to the site default, which is why they look generic.
>
> Prompts are built from each article title, category, and excerpt against one shared house
> style, so the finished covers read as a single set rather than 47 unrelated pictures.

---

**Output spec — the same for every image:**

| Setting | Value | Why |
|---|---|---|
| Dimensions | **1200 x 630** (or 1920 x 1080) | Both are the 1.91:1 / 16:9 ratio link-preview cards expect. Below 600 x 315 the card degrades to a small square thumbnail. |
| Format to generate | **PNG or JPEG** | Either is fine — do not hand-convert. |
| Format actually stored | **JPEG**, automatically | `convertFileToJpeg(file, 0.85, 1920)` runs on every cover upload (`blog.service.ts`, `tutorial.service.ts`), re-encoding to JPEG at quality 0.85 and capping the long edge at 1920px. PNG transparency is composited onto white first, because JPEG has no alpha channel and transparent pixels would otherwise turn black. |
| Do not upload WebP | — | Facebook, LinkedIn, X, and WhatsApp do not render WebP in link previews. Shipping WebP is the exact bug that made every shared OpenHR link show a blank card. The conversion above protects you, but generating WebP wastes a step. |
| Text in image | **None** | Cards crop unpredictably and overlay their own title. Text baked into the image gets cut in half. |
| Safe area | Keep the subject in the **left two thirds** | The right side is where crops and overlays land. |

**Alt text matters.** Each entry below carries a suggested `alt` value. Set it when
uploading rather than leaving it blank: it is read by screen readers and is one of the
few remaining places to state what a page is about in plain language.

---

## Needs a cover (27)

### 1. The Complete Guide to OpenHR: Free Open Source HR Software That Actually Works

**Slug:** `openhr-complete-guide`  |  **Type:** post  |  **Category:** —
**Save as:** `openhr-cover-openhr-complete-guide.jpg`
**Alt text:** Cover illustration for the OpenHRApp article "The Complete Guide to OpenHR: Free Open Source HR Software That Actually Works"

**Prompt:**

```text
Editorial cover illustration for a blog article titled "The Complete Guide to OpenHR: Free Open Source HR Software That Actually Works". Subject: an abstract workplace scene built from simple geometric shapes. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 2. Understanding Your Attendance Logs

**Slug:** `understanding-attendance-logs`  |  **Type:** guide  |  **Category:** Attendance
**Save as:** `openhr-cover-understanding-attendance-logs.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Understanding Your Attendance Logs", Attendance

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Understanding Your Attendance Logs". Subject: a stylised clock face beside a location pin, or a simple check-in card being tapped. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 3. Attendance for Admins — Audit and Manual Entries

**Slug:** `attendance-admin-audit`  |  **Type:** guide  |  **Category:** Attendance
**Save as:** `openhr-cover-attendance-admin-audit.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Attendance for Admins — Audit and Manual Entries", Attendance

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Attendance for Admins — Audit and Manual Entries". Subject: a stylised clock face beside a location pin, or a simple check-in card being tapped. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 4. How to Apply for Leave

**Slug:** `how-to-apply-for-leave`  |  **Type:** guide  |  **Category:** Leave
**Save as:** `openhr-cover-how-to-apply-for-leave.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "How to Apply for Leave", Leave

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "How to Apply for Leave". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 5. Leave Approval — For Managers

**Slug:** `leave-approval-for-managers`  |  **Type:** guide  |  **Category:** Leave
**Save as:** `openhr-cover-leave-approval-for-managers.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Leave Approval — For Managers", Leave

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Leave Approval — For Managers". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 6. Leave Approval — For HR and Admins

**Slug:** `leave-approval-for-hr`  |  **Type:** guide  |  **Category:** Leave
**Save as:** `openhr-cover-leave-approval-for-hr.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Leave Approval — For HR and Admins", Leave

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Leave Approval — For HR and Admins". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 7. Understanding Leave Policies

**Slug:** `understanding-leave-policies`  |  **Type:** guide  |  **Category:** Leave
**Save as:** `openhr-cover-understanding-leave-policies.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Understanding Leave Policies", Leave

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Understanding Leave Policies". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 8. Managing Employees — Adding and Editing Staff

**Slug:** `managing-employees`  |  **Type:** guide  |  **Category:** Employees
**Save as:** `openhr-cover-managing-employees.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Managing Employees — Adding and Editing Staff", Employees

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Managing Employees — Adding and Editing Staff". Subject: a small grid of abstract profile cards, one gently lifted forward. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 9. Setting Up Your Organization

**Slug:** `setting-up-organization`  |  **Type:** guide  |  **Category:** Organization
**Save as:** `openhr-cover-setting-up-organization.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Setting Up Your Organization", Organization

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Setting Up Your Organization". Subject: a clean org chart of connected nodes branching from a single root. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 10. Generating Reports

**Slug:** `generating-reports`  |  **Type:** guide  |  **Category:** Reports
**Save as:** `openhr-cover-generating-reports.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Generating Reports", Reports

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Generating Reports". Subject: a simple bar and line chart on a document, an export arrow leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 11. Managing Your Profile and Settings

**Slug:** `managing-profile-settings`  |  **Type:** guide  |  **Category:** Settings
**Save as:** `openhr-cover-managing-profile-settings.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Managing Your Profile and Settings", Settings

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Managing Your Profile and Settings". Subject: interlocking gears beside a row of toggle switches. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 12. Roles and Permissions in OpenHRApp

**Slug:** `roles-and-permissions`  |  **Type:** guide  |  **Category:** Getting Started
**Save as:** `openhr-cover-roles-and-permissions.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Roles and Permissions in OpenHRApp", Getting Started

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Roles and Permissions in OpenHRApp". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 13. Install OpenHRApp as an App (PWA) on Android and iOS

**Slug:** `install-openhrapp-pwa`  |  **Type:** guide  |  **Category:** Getting Started
**Save as:** `openhr-cover-install-openhrapp-pwa.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Install OpenHRApp as an App (PWA) on Android and iOS", Getting Started

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Install OpenHRApp as an App (PWA) on Android and iOS". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 14. Performance Reviews — Employee Self-Assessment

**Slug:** `performance-review-self-assessment`  |  **Type:** guide  |  **Category:** Performance
**Save as:** `openhr-cover-performance-review-self-assessment.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Performance Reviews — Employee Self-Assessment", Performance

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Performance Reviews — Employee Self-Assessment". Subject: a growth curve rising across the frame beside a simple scorecard. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 15. Performance Reviews — For Managers

**Slug:** `performance-review-for-managers`  |  **Type:** guide  |  **Category:** Performance
**Save as:** `openhr-cover-performance-review-for-managers.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Performance Reviews — For Managers", Performance

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Performance Reviews — For Managers". Subject: a growth curve rising across the frame beside a simple scorecard. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 16. Performance Reviews — HR Calibration

**Slug:** `performance-reviews-hr-calibration`  |  **Type:** guide  |  **Category:** Performance
**Save as:** `openhr-cover-performance-reviews-hr-calibration.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Performance Reviews — HR Calibration", Performance

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Performance Reviews — HR Calibration". Subject: a growth curve rising across the frame beside a simple scorecard. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 17. Announcements — Viewing and Creating

**Slug:** `announcements-guide`  |  **Type:** guide  |  **Category:** Announcements
**Save as:** `openhr-cover-announcements-guide.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Announcements — Viewing and Creating", Announcements

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Announcements — Viewing and Creating". Subject: a megaphone emitting soft concentric rings, a pinned notice card. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 18. Notifications — Bell Notifications and Admin Management

**Slug:** `notifications-guide`  |  **Type:** guide  |  **Category:** Settings
**Save as:** `openhr-cover-notifications-guide.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Notifications — Bell Notifications and Admin Management", Settings

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Notifications — Bell Notifications and Admin Management". Subject: interlocking gears beside a row of toggle switches. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 19. Theme Customization

**Slug:** `theme-customization`  |  **Type:** guide  |  **Category:** Settings
**Save as:** `openhr-cover-theme-customization.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Theme Customization", Settings

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Theme Customization". Subject: interlocking gears beside a row of toggle switches. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 20. Custom Leave Types and Special Leave

**Slug:** `custom-leave-types`  |  **Type:** guide  |  **Category:** Leave
**Save as:** `openhr-cover-custom-leave-types.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Custom Leave Types and Special Leave", Leave

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Custom Leave Types and Special Leave". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 21. Configuring Notification Settings

**Slug:** `notification-settings`  |  **Type:** guide  |  **Category:** Organization
**Save as:** `openhr-cover-notification-settings.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Configuring Notification Settings", Organization

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Configuring Notification Settings". Subject: a clean org chart of connected nodes branching from a single root. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 22. Understanding the Dashboard

**Slug:** `understanding-dashboard`  |  **Type:** guide  |  **Category:** Getting Started
**Save as:** `openhr-cover-understanding-dashboard.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Understanding the Dashboard", Getting Started

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Understanding the Dashboard". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 23. Subscription and Upgrade Options

**Slug:** `subscription-upgrade-options`  |  **Type:** guide  |  **Category:** Getting Started
**Save as:** `openhr-cover-subscription-upgrade-options.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Subscription and Upgrade Options", Getting Started

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Subscription and Upgrade Options". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 24. Exporting Employee Data

**Slug:** `exporting-employee-data`  |  **Type:** guide  |  **Category:** Reports
**Save as:** `openhr-cover-exporting-employee-data.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Exporting Employee Data", Reports

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Exporting Employee Data". Subject: a simple bar and line chart on a document, an export arrow leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 25. Performance Reviews — HR Calibration

**Slug:** `performance-review-hr-calibration`  |  **Type:** guide  |  **Category:** Performance Reviews
**Save as:** `openhr-cover-performance-review-hr-calibration.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Performance Reviews — HR Calibration", Performance Reviews

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Performance Reviews — HR Calibration". Subject: a five-point rating scale and a growth curve rising across the frame. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 26. Welcome to OpenHR — Your First Steps

**Slug:** `welcome-to-openhr`  |  **Type:** guide  |  **Category:** Getting Started
**Save as:** `openhr-cover-welcome-to-openhr.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Welcome to OpenHR — Your First Steps", Getting Started

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Welcome to OpenHR — Your First Steps". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---

### 27. Install OpenHR as an App (PWA) on Android and iOS

**Slug:** `install-openhr-pwa`  |  **Type:** guide  |  **Category:** Getting Started
**Save as:** `openhr-cover-install-openhr-pwa.jpg`
**Alt text:** Cover illustration for the OpenHRApp guide "Install OpenHR as an App (PWA) on Android and iOS", Getting Started

**Prompt:**

```text
Editorial cover illustration for a how-to guide titled "Install OpenHR as an App (PWA) on Android and iOS". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict palette: muted slate blue #4a6fa5 as the dominant colour, pale blue #d4e4f7 for fills, deep slate #1e293b for line work, off-white #f1f5f9 background. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

**Negative prompt:**

```text
no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, no drop shadows, nothing cropped at the right edge
```

---


## Already has a cover (20)

| Slug | Type | Current cover |
|---|---|---|
| `the-ultimate-no-install-hrms-high-precision-attendance-without-the-app-store-headache` | post | blog-covers/1784526349489.webp |
| `complete-guide-openhrapp` | post | blog-covers/1784468468197.webp |
| `why-we-built-openhrapp` | post | blog-covers/1784364896712.webp |
| `choosing-hr-software-small-business` | post | blog-covers/1784368678455.webp |
| `building-effective-performance-review-process` | post | blog-covers/1784469333785.webp |
| `getting-started-with-openhrapp` | post | blog-covers/1784524281204.webp |
| `hr-compliance-mistakes-to-avoid` | post | blog-covers/1784550286774.webp |
| `employee-attendance-tracking-guide` | post | blog-covers/1784550937725.webp |
| `leave-management-best-practices` | post | blog-covers/1784552288959.webp |
| `how-selfie-attendance-works` | post | blog-covers/1784605105271.webp |
| `openhrapp-performance-review-guide` | post | blog-covers/1784607888969.webp |
| `managing-leave-with-openhrapp` | post | blog-covers/1784631051452.webp |
| `openhrapp-reports-analytics-guide` | post | blog-covers/1784697172235.webp |
| `rise-of-open-source-hr-software` | post | blog-covers/1784783714523.webp |
| `remote-work-hr-policies` | post | blog-covers/1784866005830.webp |
| `employee-privacy-workplace-surveillance` | post | blog-covers/1784866653767.webp |
| `day-in-life-hr-teams-openhrapp` | post | blog-covers/1784867458025.webp |
| `openhrapp-vs-commercial-hrms-comparison` | post | blog-covers/1784868930150.webp |
| `welcome-to-openhrapp` | guide | tutorial-covers/screenshot_2026_03_01_154923_px2ge8jmkr.png |
| `how-to-clock-in-and-out` | guide | tutorial-covers/how_to_clock_in_and_out_f6x9x0zyxb.jpg |
