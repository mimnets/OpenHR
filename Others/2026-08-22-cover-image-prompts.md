# OpenHRApp — Cover Image Prompts

> Regenerated 2026-08-22. 23 articles still have no cover image
> — 1 blog post and 22 guides.
>
> **The palette changed.** These prompts use the Daylight palette the public
> pages now use (deep teal #1C6E7E on white), not the app indigo the previous
> sheet specified. Covers sit inside Daylight cards and link previews; an indigo
> cover on a teal page is the clash that had to be removed from the blog sidebar.
> Do not mix sheets — regenerate rather than reusing older prompts.

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

**Removing the Gemini watermark**

Gemini stamps its logo into the bottom-right corner. It cannot be prompted away, so the
plan is to generate the image with dead space there and crop it off. Each entry below
carries a second **watermark-safe** prompt that instructs the model to keep the bottom 15%
of the frame as plain background and leave the bottom-right corner completely empty.

The crop is a step you want regardless: 16:9 is 1.778:1 and link-preview cards want
1.91:1, so trimming about 7% off the bottom fixes the aspect ratio *and* takes the
watermark with it.

1. Generate with the watermark-safe prompt at the largest size offered (2048px+ long edge).
2. Crop **10% off the bottom** — comfortably more than the logo needs, and the reserved
   strip means nothing is lost. On a 2048 x 1152 image that is a 115px strip.
3. Resize the result to 1200 x 630, cropping a little from the right if needed. The subject
   is composed in the upper-left two thirds precisely so this is safe.

Any image editor does this. From the command line with ImageMagick:

```bash
# crop 10% off the bottom, then fit to 1200x630
magick in.png -gravity North -crop 100%x90% +repage \
  -resize 1200x630^ -gravity NorthWest -extent 1200x630 out.jpg
```

Verify the corner is clean before uploading — a cropped-but-still-visible logo is worse
than none, because it reads as a stock image.

---

## The Complete Guide to OpenHR: Free Open Source HR Software That Actually Works

- **Slug:** `openhr-complete-guide`
- **Kind:** post
- **Category:** —
- **Filename to save as:** `openhr-complete-guide.png`
- **Alt text:** Cover illustration for the OpenHRApp article "The Complete Guide to OpenHR: Free Open Source HR Software That Actually Works"

**Prompt**

```
Editorial cover illustration for a blog article titled "The Complete Guide to OpenHR: Free Open Source HR Software That Actually Works". Subject: an abstract workplace scene built from simple geometric shapes. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a blog article titled "The Complete Guide to OpenHR: Free Open Source HR Software That Actually Works". Subject: an abstract workplace scene built from simple geometric shapes. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Attendance for Admins — Audit and Manual Entries

- **Slug:** `attendance-admin-audit`
- **Kind:** guide
- **Category:** Attendance
- **Filename to save as:** `attendance-admin-audit.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Attendance for Admins — Audit and Manual Entries", Attendance

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Attendance for Admins — Audit and Manual Entries". Subject: a stylised clock face beside a location pin, or a simple check-in card being tapped. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Attendance for Admins — Audit and Manual Entries". Subject: a stylised clock face beside a location pin, or a simple check-in card being tapped. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Performance Reviews — For Managers

- **Slug:** `performance-review-for-managers`
- **Kind:** guide
- **Category:** Performance
- **Filename to save as:** `performance-review-for-managers.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Performance Reviews — For Managers", Performance

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Performance Reviews — For Managers". Subject: a growth curve rising across the frame beside a simple scorecard. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Performance Reviews — For Managers". Subject: a growth curve rising across the frame beside a simple scorecard. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Managing Employees — Adding and Editing Staff

- **Slug:** `managing-employees`
- **Kind:** guide
- **Category:** Employees
- **Filename to save as:** `managing-employees.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Managing Employees — Adding and Editing Staff", Employees

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Managing Employees — Adding and Editing Staff". Subject: a small grid of abstract profile cards, one gently lifted forward. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Managing Employees — Adding and Editing Staff". Subject: a small grid of abstract profile cards, one gently lifted forward. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Setting Up Your Organization

- **Slug:** `setting-up-organization`
- **Kind:** guide
- **Category:** Organization
- **Filename to save as:** `setting-up-organization.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Setting Up Your Organization", Organization

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Setting Up Your Organization". Subject: a clean org chart of connected nodes branching from a single root. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Setting Up Your Organization". Subject: a clean org chart of connected nodes branching from a single root. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Roles and Permissions in OpenHRApp

- **Slug:** `roles-and-permissions`
- **Kind:** guide
- **Category:** Getting Started
- **Filename to save as:** `roles-and-permissions.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Roles and Permissions in OpenHRApp", Getting Started

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Roles and Permissions in OpenHRApp". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Roles and Permissions in OpenHRApp". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## How to Apply for Leave

- **Slug:** `how-to-apply-for-leave`
- **Kind:** guide
- **Category:** Leave
- **Filename to save as:** `how-to-apply-for-leave.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "How to Apply for Leave", Leave

**Prompt**

```
Editorial cover illustration for a how-to guide titled "How to Apply for Leave". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "How to Apply for Leave". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Understanding Leave Policies

- **Slug:** `understanding-leave-policies`
- **Kind:** guide
- **Category:** Leave
- **Filename to save as:** `understanding-leave-policies.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Understanding Leave Policies", Leave

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Understanding Leave Policies". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Understanding Leave Policies". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Performance Reviews — Employee Self-Assessment

- **Slug:** `performance-review-self-assessment`
- **Kind:** guide
- **Category:** Performance
- **Filename to save as:** `performance-review-self-assessment.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Performance Reviews — Employee Self-Assessment", Performance

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Performance Reviews — Employee Self-Assessment". Subject: a growth curve rising across the frame beside a simple scorecard. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Performance Reviews — Employee Self-Assessment". Subject: a growth curve rising across the frame beside a simple scorecard. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Generating Reports

- **Slug:** `generating-reports`
- **Kind:** guide
- **Category:** Reports
- **Filename to save as:** `generating-reports.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Generating Reports", Reports

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Generating Reports". Subject: a simple bar and line chart on a document, an export arrow leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Generating Reports". Subject: a simple bar and line chart on a document, an export arrow leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Leave Approval — For Managers

- **Slug:** `leave-approval-for-managers`
- **Kind:** guide
- **Category:** Leave
- **Filename to save as:** `leave-approval-for-managers.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Leave Approval — For Managers", Leave

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Leave Approval — For Managers". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Leave Approval — For Managers". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Leave Approval — For HR and Admins

- **Slug:** `leave-approval-for-hr`
- **Kind:** guide
- **Category:** Leave
- **Filename to save as:** `leave-approval-for-hr.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Leave Approval — For HR and Admins", Leave

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Leave Approval — For HR and Admins". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Leave Approval — For HR and Admins". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Understanding Your Attendance Logs

- **Slug:** `understanding-attendance-logs`
- **Kind:** guide
- **Category:** Attendance
- **Filename to save as:** `understanding-attendance-logs.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Understanding Your Attendance Logs", Attendance

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Understanding Your Attendance Logs". Subject: a stylised clock face beside a location pin, or a simple check-in card being tapped. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Understanding Your Attendance Logs". Subject: a stylised clock face beside a location pin, or a simple check-in card being tapped. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Managing Your Profile and Settings

- **Slug:** `managing-profile-settings`
- **Kind:** guide
- **Category:** Settings
- **Filename to save as:** `managing-profile-settings.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Managing Your Profile and Settings", Settings

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Managing Your Profile and Settings". Subject: interlocking gears beside a row of toggle switches. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Managing Your Profile and Settings". Subject: interlocking gears beside a row of toggle switches. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Announcements — Viewing and Creating

- **Slug:** `announcements-guide`
- **Kind:** guide
- **Category:** Announcements
- **Filename to save as:** `announcements-guide.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Announcements — Viewing and Creating", Announcements

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Announcements — Viewing and Creating". Subject: a megaphone emitting soft concentric rings, a pinned notice card. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Announcements — Viewing and Creating". Subject: a megaphone emitting soft concentric rings, a pinned notice card. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Install OpenHRApp as an App (PWA) on Android and iOS

- **Slug:** `install-openhrapp-pwa`
- **Kind:** guide
- **Category:** Getting Started
- **Filename to save as:** `install-openhrapp-pwa.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Install OpenHRApp as an App (PWA) on Android and iOS", Getting Started

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Install OpenHRApp as an App (PWA) on Android and iOS". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Install OpenHRApp as an App (PWA) on Android and iOS". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Performance Reviews — HR Calibration

- **Slug:** `performance-reviews-hr-calibration`
- **Kind:** guide
- **Category:** Performance
- **Filename to save as:** `performance-reviews-hr-calibration.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Performance Reviews — HR Calibration", Performance

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Performance Reviews — HR Calibration". Subject: a growth curve rising across the frame beside a simple scorecard. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Performance Reviews — HR Calibration". Subject: a growth curve rising across the frame beside a simple scorecard. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Custom Leave Types and Special Leave

- **Slug:** `custom-leave-types`
- **Kind:** guide
- **Category:** Leave
- **Filename to save as:** `custom-leave-types.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Custom Leave Types and Special Leave", Leave

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Custom Leave Types and Special Leave". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Custom Leave Types and Special Leave". Subject: a calendar page with a few days softly highlighted, a paper plane leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Configuring Notification Settings

- **Slug:** `notification-settings`
- **Kind:** guide
- **Category:** Organization
- **Filename to save as:** `notification-settings.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Configuring Notification Settings", Organization

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Configuring Notification Settings". Subject: a clean org chart of connected nodes branching from a single root. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Configuring Notification Settings". Subject: a clean org chart of connected nodes branching from a single root. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Understanding the Dashboard

- **Slug:** `understanding-dashboard`
- **Kind:** guide
- **Category:** Getting Started
- **Filename to save as:** `understanding-dashboard.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Understanding the Dashboard", Getting Started

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Understanding the Dashboard". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Understanding the Dashboard". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Notifications — Bell Notifications and Admin Management

- **Slug:** `notifications-guide`
- **Kind:** guide
- **Category:** Settings
- **Filename to save as:** `notifications-guide.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Notifications — Bell Notifications and Admin Management", Settings

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Notifications — Bell Notifications and Admin Management". Subject: interlocking gears beside a row of toggle switches. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Notifications — Bell Notifications and Admin Management". Subject: interlocking gears beside a row of toggle switches. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Subscription and Upgrade Options

- **Slug:** `subscription-upgrade-options`
- **Kind:** guide
- **Category:** Getting Started
- **Filename to save as:** `subscription-upgrade-options.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Subscription and Upgrade Options", Getting Started

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Subscription and Upgrade Options". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Subscription and Upgrade Options". Subject: an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## Exporting Employee Data

- **Slug:** `exporting-employee-data`
- **Kind:** guide
- **Category:** Reports
- **Filename to save as:** `exporting-employee-data.png`
- **Alt text:** Cover illustration for the OpenHRApp guide "Exporting Employee Data", Reports

**Prompt**

```
Editorial cover illustration for a how-to guide titled "Exporting Employee Data". Subject: a simple bar and line chart on a document, an export arrow leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape.
```

<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>

```
Editorial cover illustration for a how-to guide titled "Exporting Employee Data". Subject: a simple bar and line chart on a document, an export arrow leaving the page. Flat vector editorial illustration, generous negative space, soft geometric shapes. Strict two-colour palette: deep teal #1C6E7E as the dominant colour, pale grey-green #DDE4E6 for fills, near-black teal #0E2A33 for line work, pure white #FFFFFF background. Use no third accent colour — no orange, no amber, no emerald, no indigo. One clear focal subject, calm and professional, no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. Composition weighted to the left third, leaving the right side open. 16:9 landscape. Generate at the largest resolution available (2048px or wider on the long edge). Reserve the bottom 15% of the frame as plain uninterrupted background with no detail, and keep the bottom-right corner completely empty — no subject, no line work, no texture crossing into it. The subject sits in the upper-left two thirds.
```

</details>

---

## After generating

Save each image as `<slug>.png` into one folder, then upload them all at once:

```
node --env-file=.env.cloud scripts/upload-cover-images.mjs ./covers          # dry run
node --env-file=.env.cloud scripts/upload-cover-images.mjs ./covers --apply  # write
```

The uploader matches files to articles by filename, so the slug in the filename
has to be exact. It reports anything it cannot match rather than guessing.
