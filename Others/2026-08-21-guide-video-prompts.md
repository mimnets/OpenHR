# OpenHRApp — Guide Video Shot Lists

> Generated from the live guides. 28 guides, 190 clips of about 8s each.
> Clips are derived from each guide's own section headings, so the video follows the same
> steps as the written guide rather than inventing a parallel structure.

---

**How to use this file**

Each guide below is broken into clips of about 8 seconds. Generate them one at
a time, then cut them together in that order. Clips are short because current text-to-video
models cap out around 8 seconds per generation — asking one prompt for a
two-minute explainer produces drift, where the style wanders partway through and the result
cannot be cut with anything else.

**Output spec — the same for every clip:**

| Setting | Value | Why |
|---|---|---|
| Resolution | **1920 x 1080** | 16:9. Downscale for social later; never upscale. |
| Frame rate | 24 or 30 fps, **the same for every clip** | Mixing frame rates in one timeline causes visible judder at the cuts. |
| Clip length | ~8s | The practical ceiling for a coherent single generation. |
| On-screen text | **None generated** | All on-screen text is added in the editor. The negative prompt forbids generated lettering. |
| Audio | **None generated** | Add voiceover and music in the editor so they can be revised without regenerating. |

**Why the style block is repeated in every prompt.** Clips generated in separate calls drift
apart — different palette, different line weight, different camera energy — and drifting
clips cannot be cut together. The identical style block in every prompt is what makes the
takes match.

**Assembly**

1. Generate each clip, keeping the suggested filename so the sort order *is* the edit order.
2. Drop them on the timeline in order. Straight cuts; no transitions. Cross-dissolves on
   flat vector motion look like a mistake.
3. Record the voiceover first, then trim each clip to the narration rather than the reverse.
   Clips can be slowed slightly to fit; speeding them up reads as nervous.
4. Add on-screen text in the editor, using the **On screen** value given for each clip.
5. Burn in captions or ship a `.srt`. Most viewers watch muted, and caption text is
   indexable in a way that spoken audio is not.
6. Export H.264 MP4, 1080p, and keep it under about 100 MB so it can be hosted directly.

**After publishing.** A guide page with an embedded video can carry `VideoObject` structured
data — thumbnail, duration, upload date, and a description — which is what produces a video
thumbnail in search results. The prerender middleware already emits `TechArticle` for guides;
`VideoObject` would be an addition to it, not a replacement.

---

## Guides (28)

### 1. Welcome to OpenHRApp — Your First Steps

**Slug:** `welcome-to-openhrapp`  |  **Category:** Getting Started  |  **Clips:** 6  |  **Runtime:** ~0:48
**Guide URL:** https://openhrapp.com/how-to-use/welcome-to-openhrapp

#### Clip 1 — Hook

- **File:** `welcome-to-openhrapp-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Welcome to OpenHRApp — Your First Steps
- **Voiceover:** Complete guide to OpenHR's selfie-based attendance system with GPS location verification, office and factory clock-in modes.

```text
a path drawing itself forward, a checklist ticking its first item. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — What You Can Do with OpenHRApp

- **File:** `welcome-to-openhrapp-clip-02.mp4`
- **Purpose:** Covers the "What You Can Do with OpenHRApp" section of the written guide.
- **On screen (add in editor):** What You Can Do with OpenHRApp
- **Voiceover:** Track Attendance with Selfie Verification — Clock in and out using your device camera and GPS location. Supports both Office and Factory/Field modes with biometric selfie verification.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "What You Can Do with OpenHRApp", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — How OpenHRApp Works

- **File:** `welcome-to-openhrapp-clip-03.mp4`
- **Purpose:** Covers the "How OpenHRApp Works" section of the written guide.
- **On screen (add in editor):** How OpenHRApp Works
- **Voiceover:** Admin registers the organization on openhrapp.com and configures company structure. Employees log in and clock in/out daily using their device camera and GPS.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How OpenHRApp Works", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Your Role-Based Dashboard

- **File:** `welcome-to-openhrapp-clip-04.mp4`
- **Purpose:** Covers the "Your Role-Based Dashboard" section of the written guide.
- **On screen (add in editor):** Your Role-Based Dashboard
- **Voiceover:** When you log in, you see a personalized dashboard based on your role: Admin/HR Dashboard: Full organization stats, quick action buttons, global employee directory, and leave allocation overview.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Your Role-Based Dashboard", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Quick Actions Available on the Dashboard

- **File:** `welcome-to-openhrapp-clip-05.mp4`
- **Purpose:** Covers the "Quick Actions Available on the Dashboard" section of the written guide.
- **On screen (add in editor):** Quick Actions Available on the Dashboard
- **Voiceover:** Your dashboard includes shortcut buttons for common daily tasks: Office Check-In — Start an attendance session for office work.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Quick Actions Available on the Dashboard", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Close

- **File:** `welcome-to-openhrapp-clip-06.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/welcome-to-openhrapp
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 2. How to Clock In and Out

**Slug:** `how-to-clock-in-and-out`  |  **Category:** Attendance  |  **Clips:** 8  |  **Runtime:** ~1:04
**Guide URL:** https://openhrapp.com/how-to-use/how-to-clock-in-and-out

> Capped at 6 body clips. Not covered on video, so leave these to the written guide: _How Late Status Is Calculated_, _What Happens If You Forget to Clock Out — Auto-Close_, _Tips for Reliable Attendance Tracking_.

#### Clip 1 — Hook

- **File:** `how-to-clock-in-and-out-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** How to Clock In and Out
- **Voiceover:** A complete guide to clocking in and out of work using OpenHR's selfie and GPS-based attendance system.

```text
a stylised clock face and a location pin easing into frame and settling side by side. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Before You Start Clocking In

- **File:** `how-to-clock-in-and-out-clip-02.mp4`
- **Purpose:** Covers the "Before You Start Clocking In" section of the written guide.
- **On screen (add in editor):** Before You Start Clocking In
- **Voiceover:** Make sure you have: Camera access — Your browser will ask for camera permission. Allow it for selfie-based verification. Location access — GPS must be enabled on your device.  _(draft — from the guide; tighten for speech)_

```text
a short checklist assembling itself, each item ticking in turn, representing "Before You Start Clocking In". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Navigate to the Attendance Screen

- **File:** `how-to-clock-in-and-out-clip-03.mp4`
- **Purpose:** Covers the "Navigate to the Attendance Screen" section of the written guide.
- **On screen (add in editor):** Navigate to the Attendance Screen
- **Voiceover:** From your dashboard, you have two ways to start: Click the "Office Check-In" or "Factory Check-In" quick action button on your dashboard.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Navigate to the Attendance Screen", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Choose Your Attendance Mode — Office or Factory

- **File:** `how-to-clock-in-and-out-clip-04.mp4`
- **Purpose:** Covers the "Choose Your Attendance Mode — Office or Factory" section of the written guide.
- **On screen (add in editor):** Choose Your Attendance Mode — Office or Factory
- **Voiceover:** Office Mode — For regular office work. Your GPS location will be matched against configured office locations (geofencing).  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Choose Your Attendance Mode — Office or Factory", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Wait for Camera and GPS Verification

- **File:** `how-to-clock-in-and-out-clip-05.mp4`
- **Purpose:** Covers the "Wait for Camera and GPS Verification" section of the written guide.
- **On screen (add in editor):** Wait for Camera and GPS Verification
- **Voiceover:** The attendance screen shows: A live camera feed in a circular frame (front-facing camera by default). A "Face Ready" indicator at the top when the camera is active (green, pulsing).  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Wait for Camera and GPS Verification", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — How to Clock In with Selfie Verification

- **File:** `how-to-clock-in-and-out-clip-06.mp4`
- **Purpose:** Covers the "How to Clock In with Selfie Verification" section of the written guide.
- **On screen (add in editor):** How to Clock In with Selfie Verification
- **Voiceover:** Once both camera and GPS are ready: Review your location tag — make sure it shows the correct office or area. For Factory mode, enter your remarks (factory name, project details, etc.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Clock In with Selfie Verification", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Step 6 — How to Clock Out and End Your Session

- **File:** `how-to-clock-in-and-out-clip-07.mp4`
- **Purpose:** Covers the "How to Clock Out and End Your Session" section of the written guide.
- **On screen (add in editor):** How to Clock Out and End Your Session
- **Voiceover:** When your work is done: Go back to the Attendance page (or click "Finish Session" from the dashboard). The button now shows "Check Out" instead of "Check In.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Clock Out and End Your Session", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 8 — Close

- **File:** `how-to-clock-in-and-out-clip-08.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/how-to-clock-in-and-out
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 3. Understanding Your Attendance Logs

**Slug:** `understanding-attendance-logs`  |  **Category:** Attendance  |  **Clips:** 6  |  **Runtime:** ~0:48
**Guide URL:** https://openhrapp.com/how-to-use/understanding-attendance-logs

#### Clip 1 — Hook

- **File:** `understanding-attendance-logs-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Understanding Your Attendance Logs
- **Voiceover:** How to view your personal attendance history, understand attendance status badges, and read consolidated daily records.

```text
a stylised clock face and a location pin easing into frame and settling side by side. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — How to Access Your Attendance History

- **File:** `understanding-attendance-logs-clip-02.mp4`
- **Purpose:** Covers the "How to Access Your Attendance History" section of the written guide.
- **On screen (add in editor):** How to Access Your Attendance History
- **Voiceover:** Navigate to "My Attendance History" from the sidebar menu. This shows your personal attendance records sorted by date.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Access Your Attendance History", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Understanding Each Attendance Record Field

- **File:** `understanding-attendance-logs-clip-03.mp4`
- **Purpose:** Covers the "Understanding Each Attendance Record Field" section of the written guide.
- **On screen (add in editor):** Understanding Each Attendance Record Field
- **Voiceover:** Each record displays the following information:  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Understanding Each Attendance Record Field", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — How Multiple Punches in a Day Are Consolidated

- **File:** `understanding-attendance-logs-clip-04.mp4`
- **Purpose:** Covers the "How Multiple Punches in a Day Are Consolidated" section of the written guide.
- **On screen (add in editor):** How Multiple Punches in a Day Are Consolidated
- **Voiceover:** If you clock in and out multiple times on the same day (e.g.  _(draft — from the guide; tighten for speech)_

```text
a lightbulb shape brightening softly while small accent marks radiate outward, representing "How Multiple Punches in a Day Are Consolidated". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — How to Sort and Filter Your Logs

- **File:** `understanding-attendance-logs-clip-05.mp4`
- **Purpose:** Covers the "How to Sort and Filter Your Logs" section of the written guide.
- **On screen (add in editor):** How to Sort and Filter Your Logs
- **Voiceover:** You can sort records by date — newest first or oldest first — using the sort toggle. This makes it easy to find specific days or review recent attendance.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Sort and Filter Your Logs", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Close

- **File:** `understanding-attendance-logs-clip-06.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/understanding-attendance-logs
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 4. Attendance for Admins — Audit and Manual Entries

**Slug:** `attendance-admin-audit`  |  **Category:** Attendance  |  **Clips:** 8  |  **Runtime:** ~1:04
**Guide URL:** https://openhrapp.com/how-to-use/attendance-admin-audit

#### Clip 1 — Hook

- **File:** `attendance-admin-audit-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Attendance for Admins — Audit and Manual Entries
- **Voiceover:** How admins can audit attendance records, edit clock-in times, create manual entries, and mark employees as absent.

```text
a stylised clock face and a location pin easing into frame and settling side by side. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Viewing All Employee Attendance Records

- **File:** `attendance-admin-audit-clip-02.mp4`
- **Purpose:** Covers the "Viewing All Employee Attendance Records" section of the written guide.
- **On screen (add in editor):** Viewing All Employee Attendance Records
- **Voiceover:** Navigate to Attendance Audit from the sidebar. This shows attendance records for all employees in your organization.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Viewing All Employee Attendance Records", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Filtering Attendance Records by Employee, Department, or Date

- **File:** `attendance-admin-audit-clip-03.mp4`
- **Purpose:** Covers the "Filtering Attendance Records by Employee, Department, or Date" section of the written guide.
- **On screen (add in editor):** Filtering Attendance Records by Employee, Department, or Date
- **Voiceover:** Use the filters to narrow down the records: Employee name or ID — Search for a specific person Department — Filter by department (Admin/HR only) Date range — View records within a specific period Status — Filter by PRESENT, LATE, ABSENT, etc.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Filtering Attendance Records by Employee, Department, or Date", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — How to Edit an Attendance Record

- **File:** `attendance-admin-audit-clip-04.mp4`
- **Purpose:** Covers the "How to Edit an Attendance Record" section of the written guide.
- **On screen (add in editor):** How to Edit an Attendance Record
- **Voiceover:** Click on any record to open the detail modal.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Edit an Attendance Record", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — How to Mark an Employee as Absent

- **File:** `attendance-admin-audit-clip-05.mp4`
- **Purpose:** Covers the "How to Mark an Employee as Absent" section of the written guide.
- **On screen (add in editor):** How to Mark an Employee as Absent
- **Voiceover:** Click the "Mark Absent" button (Admin only) to create a manual absence record: Select the employee from the dropdown. Choose the date of absence.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Mark an Employee as Absent", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — Deleting Attendance Records

- **File:** `attendance-admin-audit-clip-06.mp4`
- **Purpose:** Covers the "Deleting Attendance Records" section of the written guide.
- **On screen (add in editor):** Deleting Attendance Records
- **Voiceover:** Admins can permanently delete attendance records. A confirmation dialog is shown before deletion. Use this carefully — deleted records cannot be recovered.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Deleting Attendance Records", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Step 6 — GPS Location Verification for Attendance

- **File:** `attendance-admin-audit-clip-07.mp4`
- **Purpose:** Covers the "GPS Location Verification for Attendance" section of the written guide.
- **On screen (add in editor):** GPS Location Verification for Attendance
- **Voiceover:** Each attendance record shows the exact GPS coordinates captured during clock-in. Click the coordinates to open the location in Google Maps for verification — useful for confirming field/factory attendance.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "GPS Location Verification for Attendance", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 8 — Close

- **File:** `attendance-admin-audit-clip-08.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/attendance-admin-audit
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 5. How to Apply for Leave

**Slug:** `how-to-apply-for-leave`  |  **Category:** Leave  |  **Clips:** 8  |  **Runtime:** ~1:04
**Guide URL:** https://openhrapp.com/how-to-use/how-to-apply-for-leave

> Capped at 6 body clips. Not covered on video, so leave these to the written guide: _Tips for Leave Applications_.

#### Clip 1 — Hook

- **File:** `how-to-apply-for-leave-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** How to Apply for Leave
- **Voiceover:** Step-by-step guide to applying for leave in OpenHR — check your balance, submit a request, and track the approval status.

```text
a calendar page turning gently, a few days softening into highlight. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Step 1: Check Your Leave Balance

- **File:** `how-to-apply-for-leave-clip-02.mp4`
- **Purpose:** Covers the "Step 1: Check Your Leave Balance" section of the written guide.
- **On screen (add in editor):** Step 1: Check Your Leave Balance
- **Voiceover:** Go to the Leave page from the sidebar.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Step 1: Check Your Leave Balance", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Step 2: Submit a Leave Request

- **File:** `how-to-apply-for-leave-clip-03.mp4`
- **Purpose:** Covers the "Step 2: Submit a Leave Request" section of the written guide.
- **On screen (add in editor):** Step 2: Submit a Leave Request
- **Voiceover:** Click the "Apply Leave" button on the Leave page. A form will open asking for: Leave Type — Select from Annual, Casual, or Sick leave.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Step 2: Submit a Leave Request", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — How OpenHR Calculates Leave Days Automatically

- **File:** `how-to-apply-for-leave-clip-04.mp4`
- **Purpose:** Covers the "How OpenHR Calculates Leave Days Automatically" section of the written guide.
- **On screen (add in editor):** How OpenHR Calculates Leave Days Automatically
- **Voiceover:** As you select your dates, the system automatically calculates the total working days: Weekends are excluded — Based on your shift's working days (e.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How OpenHR Calculates Leave Days Automatically", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Step 3: Review and Submit Your Leave Application

- **File:** `how-to-apply-for-leave-clip-05.mp4`
- **Purpose:** Covers the "Step 3: Review and Submit Your Leave Application" section of the written guide.
- **On screen (add in editor):** Step 3: Review and Submit Your Leave Application
- **Voiceover:** Before submitting, verify: Your balance is sufficient (the system will block you if it's not) The dates and leave type are correct Your reason clearly explains the absence Click Submit to send your request into the approval workflow.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "Step 3: Review and Submit Your Leave Application". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — Step 4: Track Your Leave Request Status

- **File:** `how-to-apply-for-leave-clip-06.mp4`
- **Purpose:** Covers the "Step 4: Track Your Leave Request Status" section of the written guide.
- **On screen (add in editor):** Step 4: Track Your Leave Request Status
- **Voiceover:** After submitting, your request appears in the Application History section on the Leave page.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Step 4: Track Your Leave Request Status", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Step 6 — How the Leave Approval Workflow Works

- **File:** `how-to-apply-for-leave-clip-07.mp4`
- **Purpose:** Covers the "How the Leave Approval Workflow Works" section of the written guide.
- **On screen (add in editor):** How the Leave Approval Workflow Works
- **Voiceover:** Your request follows the approval workflow configured by your organization: Manager Review — Your line manager evaluates and either approves (forwarding to HR) or rejects.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "How the Leave Approval Workflow Works". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 8 — Close

- **File:** `how-to-apply-for-leave-clip-08.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/how-to-apply-for-leave
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 6. Leave Approval — For Managers

**Slug:** `leave-approval-for-managers`  |  **Category:** Leave  |  **Clips:** 6  |  **Runtime:** ~0:48
**Guide URL:** https://openhrapp.com/how-to-use/leave-approval-for-managers

#### Clip 1 — Hook

- **File:** `leave-approval-for-managers-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Leave Approval — For Managers
- **Voiceover:** How managers review, approve, or reject leave requests from direct reports in OpenHR's multi-step approval workflow.

```text
a calendar page turning gently, a few days softening into highlight. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Accessing Pending Leave Requests

- **File:** `leave-approval-for-managers-clip-02.mp4`
- **Purpose:** Covers the "Accessing Pending Leave Requests" section of the written guide.
- **On screen (add in editor):** Accessing Pending Leave Requests
- **Voiceover:** Go to the Leave page. You'll see the "Manager Approval Hub" section showing: A list of leave requests with status PENDING\MANAGER from your team members.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Accessing Pending Leave Requests", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Reviewing a Leave Request

- **File:** `leave-approval-for-managers-clip-03.mp4`
- **Purpose:** Covers the "Reviewing a Leave Request" section of the written guide.
- **On screen (add in editor):** Reviewing a Leave Request
- **Voiceover:** Click "Evaluate" on any pending request to open the review modal: Employee's reason for the leave is displayed (read-only).  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "Reviewing a Leave Request". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Approving or Rejecting Leave

- **File:** `leave-approval-for-managers-clip-04.mp4`
- **Purpose:** Covers the "Approving or Rejecting Leave" section of the written guide.
- **On screen (add in editor):** Approving or Rejecting Leave
- **Voiceover:** You have two options: Approve & Forward — Approves the request at the manager level and forwards it to HR for final verification.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Approving or Rejecting Leave", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Best Practices for Leave Approvals

- **File:** `leave-approval-for-managers-clip-05.mp4`
- **Purpose:** Covers the "Best Practices for Leave Approvals" section of the written guide.
- **On screen (add in editor):** Best Practices for Leave Approvals
- **Voiceover:** Review requests within 24 hours to avoid delays. Check team coverage before approving — make sure critical work is covered.  _(draft — from the guide; tighten for speech)_

```text
a lightbulb shape brightening softly while small accent marks radiate outward, representing "Best Practices for Leave Approvals". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Close

- **File:** `leave-approval-for-managers-clip-06.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/leave-approval-for-managers
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 7. Leave Approval — For HR and Admins

**Slug:** `leave-approval-for-hr`  |  **Category:** Leave  |  **Clips:** 7  |  **Runtime:** ~0:56
**Guide URL:** https://openhrapp.com/how-to-use/leave-approval-for-hr

#### Clip 1 — Hook

- **File:** `leave-approval-for-hr-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Leave Approval — For HR and Admins
- **Voiceover:** How HR and Admin users verify, approve, reject, and manage leave records with admin override capabilities.

```text
a calendar page turning gently, a few days softening into highlight. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — HR Leave Administration Panel

- **File:** `leave-approval-for-hr-clip-02.mp4`
- **Purpose:** Covers the "HR Leave Administration Panel" section of the written guide.
- **On screen (add in editor):** HR Leave Administration Panel
- **Voiceover:** Go to the Leave page.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "HR Leave Administration Panel", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Pending Leave Approval Tab

- **File:** `leave-approval-for-hr-clip-03.mp4`
- **Purpose:** Covers the "Pending Leave Approval Tab" section of the written guide.
- **On screen (add in editor):** Pending Leave Approval Tab
- **Voiceover:** Shows all requests waiting for your action: PENDING\HR requests (green badge) — Already approved by the manager, waiting for your verification.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "Pending Leave Approval Tab". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — All Leaves Tab — Complete Leave Records

- **File:** `leave-approval-for-hr-clip-04.mp4`
- **Purpose:** Covers the "All Leaves Tab — Complete Leave Records" section of the written guide.
- **On screen (add in editor):** All Leaves Tab — Complete Leave Records
- **Voiceover:** A comprehensive view of all leave records in the organization: Search by employee name, leave type, or status. View full leave history with status, dates, and duration.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "All Leaves Tab — Complete Leave Records", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — How to Create Leave Records Manually

- **File:** `leave-approval-for-hr-clip-05.mp4`
- **Purpose:** Covers the "How to Create Leave Records Manually" section of the written guide.
- **On screen (add in editor):** How to Create Leave Records Manually
- **Voiceover:** Admins can create leave records on behalf of employees: Click the "Add Leave" button. Select the employee from the dropdown.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Create Leave Records Manually", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — Admin Override — Processing Stuck Leave Requests

- **File:** `leave-approval-for-hr-clip-06.mp4`
- **Purpose:** Covers the "Admin Override — Processing Stuck Leave Requests" section of the written guide.
- **On screen (add in editor):** Admin Override — Processing Stuck Leave Requests
- **Voiceover:** If a leave request is stuck at PENDING\MANAGER (manager hasn't responded), you can: Click "Review" on the request. The modal shows as an "Admin Override" action.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Admin Override — Processing Stuck Leave Requests", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Close

- **File:** `leave-approval-for-hr-clip-07.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/leave-approval-for-hr
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 8. Understanding Leave Policies

**Slug:** `understanding-leave-policies`  |  **Category:** Leave  |  **Clips:** 7  |  **Runtime:** ~0:56
**Guide URL:** https://openhrapp.com/how-to-use/understanding-leave-policies

#### Clip 1 — Hook

- **File:** `understanding-leave-policies-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Understanding Leave Policies
- **Voiceover:** How leave types, balances, quotas, approval workflows, and holiday exclusions are configured in OpenHRApp.

```text
a calendar page turning gently, a few days softening into highlight. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Leave Types Available in OpenHR

- **File:** `understanding-leave-policies-clip-02.mp4`
- **Purpose:** Covers the "Leave Types Available in OpenHR" section of the written guide.
- **On screen (add in editor):** Leave Types Available in OpenHR
- **Voiceover:** OpenHR supports 7 built-in leave types: Employees can apply for Annual, Casual, and Sick leave through the self-service form.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Leave Types Available in OpenHR", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Default Leave Allocations and Quotas

- **File:** `understanding-leave-policies-clip-03.mp4`
- **Purpose:** Covers the "Default Leave Allocations and Quotas" section of the written guide.
- **On screen (add in editor):** Default Leave Allocations and Quotas
- **Voiceover:** Your organization has default quotas: Annual Leave: typically 15 days/year Casual Leave: typically 10 days/year Sick Leave: typically 14 days/year These defaults are set by your Admin/HR in Organization Settings Leaves.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Default Leave Allocations and Quotas", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Per-Employee Custom Leave Allocations

- **File:** `understanding-leave-policies-clip-04.mp4`
- **Purpose:** Covers the "Per-Employee Custom Leave Allocations" section of the written guide.
- **On screen (add in editor):** Per-Employee Custom Leave Allocations
- **Voiceover:** HR can set custom allocations for specific employees. For example, a senior employee might get 20 Annual Leave days instead of the default 15.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Per-Employee Custom Leave Allocations", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — How the Leave Approval Workflow Routes Requests

- **File:** `understanding-leave-policies-clip-05.mp4`
- **Purpose:** Covers the "How the Leave Approval Workflow Routes Requests" section of the written guide.
- **On screen (add in editor):** How the Leave Approval Workflow Routes Requests
- **Voiceover:** Each department has a configured approval path: Standard: Employee → Manager → HR → Approved Direct to HR: Employee → HR → Approved (manager step skipped) The workflow is configured per department in Organization Settings Workflow.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "How the Leave Approval Workflow Routes Requests". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — How Holidays and Weekends Affect Leave Calculations

- **File:** `understanding-leave-policies-clip-06.mp4`
- **Purpose:** Covers the "How Holidays and Weekends Affect Leave Calculations" section of the written guide.
- **On screen (add in editor):** How Holidays and Weekends Affect Leave Calculations
- **Voiceover:** When calculating leave days: Weekends (based on your shift schedule) are automatically excluded. Public/company holidays (managed in Organization Settings Holidays) are automatically excluded.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How Holidays and Weekends Affect Leave Calculations", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Close

- **File:** `understanding-leave-policies-clip-07.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/understanding-leave-policies
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 9. Managing Employees — Adding and Editing Staff

**Slug:** `managing-employees`  |  **Category:** Employees  |  **Clips:** 8  |  **Runtime:** ~1:04
**Guide URL:** https://openhrapp.com/how-to-use/managing-employees

> Capped at 6 body clips. Not covered on video, so leave these to the written guide: _Exporting Employee Data as CSV or PDF_, _Deleting an Employee Account_, _Employee Directory Visibility by Role_.

#### Clip 1 — Hook

- **File:** `managing-employees-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Managing Employees — Adding and Editing Staff
- **Voiceover:** How admins add new employees, assign roles and departments, manage the employee directory, and export staff data.

```text
a small grid of abstract profile cards assembling one by one. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Accessing the Employee Directory

- **File:** `managing-employees-clip-02.mp4`
- **Purpose:** Covers the "Accessing the Employee Directory" section of the written guide.
- **On screen (add in editor):** Accessing the Employee Directory
- **Voiceover:** Go to Employees from the sidebar menu. You'll see a grid of employee cards with search functionality. What you see depends on your role and permissions.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Accessing the Employee Directory", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — How to Add a New Employee

- **File:** `managing-employees-clip-03.mp4`
- **Purpose:** Covers the "How to Add a New Employee" section of the written guide.
- **On screen (add in editor):** How to Add a New Employee
- **Voiceover:** Click "Provision New User" to open the employee creation form.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Add a New Employee", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — How to Edit an Employee Profile

- **File:** `managing-employees-clip-04.mp4`
- **Purpose:** Covers the "How to Edit an Employee Profile" section of the written guide.
- **On screen (add in editor):** How to Edit an Employee Profile
- **Voiceover:** Click on any employee card to view their profile. Click "Edit" to modify any field. Common edits: Changing department or team assignment Updating role (e.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Edit an Employee Profile", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Assigning Teams and Line Managers

- **File:** `managing-employees-clip-05.mp4`
- **Purpose:** Covers the "Assigning Teams and Line Managers" section of the written guide.
- **On screen (add in editor):** Assigning Teams and Line Managers
- **Voiceover:** When you assign an employee to a team: The team's leader is automatically set as their line manager You can override this by manually selecting a different line manager Team assignment determines which manager sees their leave requests  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Assigning Teams and Line Managers", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — Uploading Employee Profile Photos

- **File:** `managing-employees-clip-06.mp4`
- **Purpose:** Covers the "Uploading Employee Profile Photos" section of the written guide.
- **On screen (add in editor):** Uploading Employee Profile Photos
- **Voiceover:** Click the avatar area in the employee form to upload a profile picture. Supported formats: JPEG, PNG, WebP. Images are automatically converted to WebP for efficient storage.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Uploading Employee Profile Photos", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Step 6 — Searching and Filtering the Employee Directory

- **File:** `managing-employees-clip-07.mp4`
- **Purpose:** Covers the "Searching and Filtering the Employee Directory" section of the written guide.
- **On screen (add in editor):** Searching and Filtering the Employee Directory
- **Voiceover:** Use the search bar at the top to find employees by: Name Employee ID Designation Email address Results update in real-time with a 300ms delay for smooth searching.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Searching and Filtering the Employee Directory", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 8 — Close

- **File:** `managing-employees-clip-08.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/managing-employees
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 10. Setting Up Your Organization

**Slug:** `setting-up-organization`  |  **Category:** Organization  |  **Clips:** 8  |  **Runtime:** ~1:04
**Guide URL:** https://openhrapp.com/how-to-use/setting-up-organization

> Capped at 6 body clips. Not covered on video, so leave these to the written guide: _7\. Holidays — Company Holiday Calendar_, _8\. Notifications — Notification Settings_, _9\. System — Application-Level Settings_.

#### Clip 1 — Hook

- **File:** `setting-up-organization-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Setting Up Your Organization
- **Voiceover:** Complete admin guide to configuring departments, teams, shifts, GPS locations, leave policies, holidays, and workflows in OpenHRApp.

```text
connected nodes growing outward from a single root into a tidy chart. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — 1\. Structure — Departments and Designations

- **File:** `setting-up-organization-clip-02.mp4`
- **Purpose:** Covers the "1\. Structure — Departments and Designations" section of the written guide.
- **On screen (add in editor):** 1\. Structure — Departments and Designations
- **Voiceover:** Departments: Add departments like "Engineering," "Sales," "HR," "Finance" Departments are used for employee assignment, leave workflow routing, and report filtering Designations: Add job titles like "Software Engineer," "HR Manager," "Accountant" Designations appear on employee profiles and reports Click "Add" to create, or use the edit/delete icons on existing items.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "1\. Structure — Departments and Designations", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — 2\. Teams — Creating and Managing Teams

- **File:** `setting-up-organization-clip-03.mp4`
- **Purpose:** Covers the "2\. Teams — Creating and Managing Teams" section of the written guide.
- **On screen (add in editor):** 2\. Teams — Creating and Managing Teams
- **Voiceover:** Create teams within departments: Click "Add Team" Enter a team name (e.g.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "2\. Teams — Creating and Managing Teams", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — 3\. Placement — Office Locations with GPS Geofencing

- **File:** `setting-up-organization-clip-04.mp4`
- **Purpose:** Covers the "3\. Placement — Office Locations with GPS Geofencing" section of the written guide.
- **On screen (add in editor):** 3\. Placement — Office Locations with GPS Geofencing
- **Voiceover:** Define your physical office locations for GPS-based attendance verification: Click "Add Location" Enter the location name (e.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "3\. Placement — Office Locations with GPS Geofencing", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — 4\. Shifts — Work Schedule Configuration

- **File:** `setting-up-organization-clip-05.mp4`
- **Purpose:** Covers the "4\. Shifts — Work Schedule Configuration" section of the written guide.
- **On screen (add in editor):** 4\. Shifts — Work Schedule Configuration
- **Voiceover:** Configure work schedules for your organization: Click "Add Shift" Set the shift name (e.g.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "4\. Shifts — Work Schedule Configuration", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — 5\. Workflow — Leave Approval Routing

- **File:** `setting-up-organization-clip-06.mp4`
- **Purpose:** Covers the "5\. Workflow — Leave Approval Routing" section of the written guide.
- **On screen (add in editor):** 5\. Workflow — Leave Approval Routing
- **Voiceover:** Configure how leave requests are routed per department: Select a department Choose the approver role: Manager, Team Lead, Admin, or HR Save This determines whether leave requests go through the manager first or directly to HR.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "5\. Workflow — Leave Approval Routing". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Step 6 — 6\. Leaves — Leave Policy and Allocations

- **File:** `setting-up-organization-clip-07.mp4`
- **Purpose:** Covers the "6\. Leaves — Leave Policy and Allocations" section of the written guide.
- **On screen (add in editor):** 6\. Leaves — Leave Policy and Allocations
- **Voiceover:** Global Defaults: Set the standard leave allocation for all employees: Annual Leave: e.g., 15 days Casual Leave: e.g., 10 days Sick Leave: e.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "6\. Leaves — Leave Policy and Allocations", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 8 — Close

- **File:** `setting-up-organization-clip-08.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/setting-up-organization
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 11. Generating Reports

**Slug:** `generating-reports`  |  **Category:** Reports  |  **Clips:** 8  |  **Runtime:** ~1:04
**Guide URL:** https://openhrapp.com/how-to-use/generating-reports

> Capped at 6 body clips. Not covered on video, so leave these to the written guide: _Smart Report Calculations_.

#### Clip 1 — Hook

- **File:** `generating-reports-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Generating Reports
- **Voiceover:** How to generate attendance and leave reports in OpenHRApp, export as CSV or PDF, and email summaries to stakeholders.

```text
a bar chart rising column by column, a line sweeping across above it. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Accessing the Reports Page

- **File:** `generating-reports-clip-02.mp4`
- **Purpose:** Covers the "Accessing the Reports Page" section of the written guide.
- **On screen (add in editor):** Accessing the Reports Page
- **Voiceover:** Navigate to Reports from the sidebar menu. You'll see two tabs: Generator and Columns. Reports are available to Admin, HR, and Manager roles.  _(draft — from the guide; tighten for speech)_

```text
a document sliding out of a container with a download arrow tracing downward, representing "Accessing the Reports Page". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Available Report Types

- **File:** `generating-reports-clip-03.mp4`
- **Purpose:** Covers the "Available Report Types" section of the written guide.
- **On screen (add in editor):** Available Report Types
- **Voiceover:** Choose from 4 report types:  _(draft — from the guide; tighten for speech)_

```text
a document sliding out of a container with a download arrow tracing downward, representing "Available Report Types". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — How to Configure and Generate a Report

- **File:** `generating-reports-clip-04.mp4`
- **Purpose:** Covers the "How to Configure and Generate a Report" section of the written guide.
- **On screen (add in editor):** How to Configure and Generate a Report
- **Voiceover:** Select Report Type — Choose Attendance, Absent, Late, or Leave. Select Departments — Use the multi-select to choose which departments to include.  _(draft — from the guide; tighten for speech)_

```text
a document sliding out of a container with a download arrow tracing downward, representing "How to Configure and Generate a Report". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Exporting Reports to CSV

- **File:** `generating-reports-clip-05.mp4`
- **Purpose:** Covers the "Exporting Reports to CSV" section of the written guide.
- **On screen (add in editor):** Exporting Reports to CSV
- **Voiceover:** Click "Export CSV" to download the report as a CSV file.  _(draft — from the guide; tighten for speech)_

```text
a document sliding out of a container with a download arrow tracing downward, representing "Exporting Reports to CSV". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — Emailing Reports to Stakeholders

- **File:** `generating-reports-clip-06.mp4`
- **Purpose:** Covers the "Emailing Reports to Stakeholders" section of the written guide.
- **On screen (add in editor):** Emailing Reports to Stakeholders
- **Voiceover:** Click "Email Summary" to send the report to the specified recipients.  _(draft — from the guide; tighten for speech)_

```text
a document sliding out of a container with a download arrow tracing downward, representing "Emailing Reports to Stakeholders". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Step 6 — Configuring Report Columns

- **File:** `generating-reports-clip-07.mp4`
- **Purpose:** Covers the "Configuring Report Columns" section of the written guide.
- **On screen (add in editor):** Configuring Report Columns
- **Voiceover:** Switch to the Columns tab to choose which fields to include in your report: Employee ID, Full Name, Entry Date, Status Type Clock In / Clock Out times GPS Address, Latitude / Longitude Notes / Remarks Toggle columns on/off based on what you need.  _(draft — from the guide; tighten for speech)_

```text
a document sliding out of a container with a download arrow tracing downward, representing "Configuring Report Columns". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 8 — Close

- **File:** `generating-reports-clip-08.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/generating-reports
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 12. Managing Your Profile and Settings

**Slug:** `managing-profile-settings`  |  **Category:** Settings  |  **Clips:** 7  |  **Runtime:** ~0:56
**Guide URL:** https://openhrapp.com/how-to-use/managing-profile-settings

#### Clip 1 — Hook

- **File:** `managing-profile-settings-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Managing Your Profile and Settings
- **Voiceover:** How to view your employee profile, update your name and email, change your password, and customize your app theme.

```text
interlocking gears beginning to turn, toggles switching in sequence. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Viewing Your Employee Profile

- **File:** `managing-profile-settings-clip-02.mp4`
- **Purpose:** Covers the "Viewing Your Employee Profile" section of the written guide.
- **On screen (add in editor):** Viewing Your Employee Profile
- **Voiceover:** Navigate to Settings from the sidebar.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Viewing Your Employee Profile", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Updating Your Personal Information

- **File:** `managing-profile-settings-clip-03.mp4`
- **Purpose:** Covers the "Updating Your Personal Information" section of the written guide.
- **On screen (add in editor):** Updating Your Personal Information
- **Voiceover:** You can update: Full Name — Your display name across the system Work Email — Your email address Click "Save" after making changes.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Updating Your Personal Information", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — How to Change Your Password

- **File:** `managing-profile-settings-clip-04.mp4`
- **Purpose:** Covers the "How to Change Your Password" section of the written guide.
- **On screen (add in editor):** How to Change Your Password
- **Voiceover:** Scroll to the Security section. Enter your new password (minimum 8 characters). Confirm the password. Click "Update Password.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Change Your Password", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Customizing Your App Theme

- **File:** `managing-profile-settings-clip-05.mp4`
- **Purpose:** Covers the "Customizing Your App Theme" section of the written guide.
- **On screen (add in editor):** Customizing Your App Theme
- **Voiceover:** Customize the app's appearance using the Theme Selector: Choose from 14 color themes to change the app's accent color across all pages.  _(draft — from the guide; tighten for speech)_

```text
toggles and sliders adjusting one after another in a neat column, representing "Customizing Your App Theme". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — Contacting Support

- **File:** `managing-profile-settings-clip-06.mp4`
- **Purpose:** Covers the "Contacting Support" section of the written guide.
- **On screen (add in editor):** Contacting Support
- **Voiceover:** Need help? Use the Contact Support form at the bottom of the Settings page: Your name and email are pre-filled. Enter a subject for your query.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Contacting Support", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Close

- **File:** `managing-profile-settings-clip-07.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/managing-profile-settings
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 13. Roles and Permissions in OpenHRApp

**Slug:** `roles-and-permissions`  |  **Category:** Getting Started  |  **Clips:** 5  |  **Runtime:** ~0:40
**Guide URL:** https://openhrapp.com/how-to-use/roles-and-permissions

#### Clip 1 — Hook

- **File:** `roles-and-permissions-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Roles and Permissions in OpenHRApp
- **Voiceover:** Complete guide to OpenHR's role-based access control — what Admin, HR, Manager, Team Lead, and Employee roles can access.

```text
a path drawing itself forward, a checklist ticking its first item. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Available Roles in OpenHR

- **File:** `roles-and-permissions-clip-02.mp4`
- **Purpose:** Covers the "Available Roles in OpenHR" section of the written guide.
- **On screen (add in editor):** Available Roles in OpenHR
- **Voiceover:** [No prose under this heading — write one or two sentences for "Available Roles in OpenHR".]

```text
an abstract flat-vector sequence illustrating "Available Roles in OpenHR", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Complete Permission Matrix

- **File:** `roles-and-permissions-clip-03.mp4`
- **Purpose:** Covers the "Complete Permission Matrix" section of the written guide.
- **On screen (add in editor):** Complete Permission Matrix
- **Voiceover:** [No prose under this heading — write one or two sentences for "Complete Permission Matrix".]

```text
an abstract flat-vector sequence illustrating "Complete Permission Matrix", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Key Access Rules to Understand

- **File:** `roles-and-permissions-clip-04.mp4`
- **Purpose:** Covers the "Key Access Rules to Understand" section of the written guide.
- **On screen (add in editor):** Key Access Rules to Understand
- **Voiceover:** Managers can only see employees in their teams and their direct reports. They cannot access other departments. Employees can see their teammates but cannot edit anyone's information.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Key Access Rules to Understand", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Close

- **File:** `roles-and-permissions-clip-05.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/roles-and-permissions
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 14. Install OpenHRApp as an App (PWA) on Android and iOS

**Slug:** `install-openhrapp-pwa`  |  **Category:** Getting Started  |  **Clips:** 8  |  **Runtime:** ~1:04
**Guide URL:** https://openhrapp.com/how-to-use/install-openhrapp-pwa

> Capped at 6 body clips. Not covered on video, so leave these to the written guide: _How to Uninstall the PWA_.

#### Clip 1 — Hook

- **File:** `install-openhrapp-pwa-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Install OpenHRApp as an App (PWA) on Android and iOS
- **Voiceover:** Install OpenHRApp on your phone or desktop as a Progressive Web App (PWA) — no app store download required.

```text
a path drawing itself forward, a checklist ticking its first item. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — What is a Progressive Web App (PWA)?

- **File:** `install-openhrapp-pwa-clip-02.mp4`
- **Purpose:** Covers the "What is a Progressive Web App (PWA)?" section of the written guide.
- **On screen (add in editor):** What is a Progressive Web App (PWA)?
- **Voiceover:** A Progressive Web App is a website that behaves like a native mobile app.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "What is a Progressive Web App (PWA)?", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Installing OpenHRApp on Android (Chrome)

- **File:** `install-openhrapp-pwa-clip-03.mp4`
- **Purpose:** Covers the "Installing OpenHRApp on Android (Chrome)" section of the written guide.
- **On screen (add in editor):** Installing OpenHRApp on Android (Chrome)
- **Voiceover:** Open Google Chrome on your Android device. Navigate to your organization's OpenHR URL (e.g., https://openhrapp.com). Log in with your credentials.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Installing OpenHRApp on Android (Chrome)", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Installing OpenHRApp on iPhone / iPad (Safari)

- **File:** `install-openhrapp-pwa-clip-04.mp4`
- **Purpose:** Covers the "Installing OpenHRApp on iPhone / iPad (Safari)" section of the written guide.
- **On screen (add in editor):** Installing OpenHRApp on iPhone / iPad (Safari)
- **Voiceover:** Open Safari on your iPhone or iPad (this only works in Safari, not Chrome or Firefox on iOS). Navigate to your organization's OpenHRApp URL.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Installing OpenHRApp on iPhone / iPad (Safari)", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Installing OpenHRApp on Desktop (Chrome / Edge)

- **File:** `install-openhrapp-pwa-clip-05.mp4`
- **Purpose:** Covers the "Installing OpenHRApp on Desktop (Chrome / Edge)" section of the written guide.
- **On screen (add in editor):** Installing OpenHRApp on Desktop (Chrome / Edge)
- **Voiceover:** Open Google Chrome or Microsoft Edge on your computer. Navigate to your OpenHRApp URL and log in. Look for the install icon (a small + or monitor icon) in the address bar on the right side.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Installing OpenHRApp on Desktop (Chrome / Edge)", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — Using OpenHRApp as an Installed App

- **File:** `install-openhrapp-pwa-clip-06.mp4`
- **Purpose:** Covers the "Using OpenHRApp as an Installed App" section of the written guide.
- **On screen (add in editor):** Using OpenHRApp as an Installed App
- **Voiceover:** Once installed, OpenHRApp behaves like any other app on your device: Launch it from your home screen or app drawer — no need to open a browser first.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Using OpenHRApp as an Installed App", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Step 6 — Troubleshooting PWA Installation Issues

- **File:** `install-openhrapp-pwa-clip-07.mp4`
- **Purpose:** Covers the "Troubleshooting PWA Installation Issues" section of the written guide.
- **On screen (add in editor):** Troubleshooting PWA Installation Issues
- **Voiceover:** [No prose under this heading — write one or two sentences for "Troubleshooting PWA Installation Issues".]

```text
a single shape briefly turning amber then resolving back to blue as a check mark settles beside it, representing "Troubleshooting PWA Installation Issues". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 8 — Close

- **File:** `install-openhrapp-pwa-clip-08.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/install-openhrapp-pwa
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 15. Performance Reviews — Employee Self-Assessment

**Slug:** `performance-review-self-assessment`  |  **Category:** Performance  |  **Clips:** 8  |  **Runtime:** ~1:04
**Guide URL:** https://openhrapp.com/how-to-use/performance-review-self-assessment

> Capped at 6 body clips. Not covered on video, so leave these to the written guide: _Downloading Your Review as PDF_, _Past Reviews — Your Review History_.

#### Clip 1 — Hook

- **File:** `performance-review-self-assessment-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Performance Reviews — Employee Self-Assessment
- **Voiceover:** How to complete your self-assessment in OpenHRApp — rate competencies, add comments, and submit for manager review.

```text
a growth curve drawing itself across the frame beside a scorecard. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — How the Performance Review Process Works

- **File:** `performance-review-self-assessment-clip-02.mp4`
- **Purpose:** Covers the "How the Performance Review Process Works" section of the written guide.
- **On screen (add in editor):** How the Performance Review Process Works
- **Voiceover:** The review process has three stages: Self-Assessment — You rate yourself on each competency and add comments (this guide).  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "How the Performance Review Process Works". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Checking for Active Review Cycles

- **File:** `performance-review-self-assessment-clip-03.mp4`
- **Purpose:** Covers the "Checking for Active Review Cycles" section of the written guide.
- **On screen (add in editor):** Checking for Active Review Cycles
- **Voiceover:** Navigate to Performance from the sidebar menu. You'll see one of the following: Active Cycle — A review cycle is currently open.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "Checking for Active Review Cycles". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — How to Complete Your Self-Assessment

- **File:** `performance-review-self-assessment-clip-04.mp4`
- **Purpose:** Covers the "How to Complete Your Self-Assessment" section of the written guide.
- **On screen (add in editor):** How to Complete Your Self-Assessment
- **Voiceover:** When a review cycle is active: You'll see a list of competencies configured by your organization (e.g., Agility, Collaboration, Customer Focus, Innovation Mindset).  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Complete Your Self-Assessment", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Submitting Your Self-Assessment

- **File:** `performance-review-self-assessment-clip-05.mp4`
- **Purpose:** Covers the "Submitting Your Self-Assessment" section of the written guide.
- **On screen (add in editor):** Submitting Your Self-Assessment
- **Voiceover:** Once you've rated all competencies and added your comments: Click "Submit Self-Assessment". Your review status changes from DRAFT to SELF\REVIEW\SUBMITTED.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Submitting Your Self-Assessment", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — Viewing Your Manager's Feedback

- **File:** `performance-review-self-assessment-clip-06.mp4`
- **Purpose:** Covers the "Viewing Your Manager's Feedback" section of the written guide.
- **On screen (add in editor):** Viewing Your Manager's Feedback
- **Voiceover:** After your manager completes their review: Your status changes to MANAGER\REVIEWED. You can see your manager's ratings and comments alongside your own self-assessment.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Viewing Your Manager's Feedback", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Step 6 — When the Review Is Complete

- **File:** `performance-review-self-assessment-clip-07.mp4`
- **Purpose:** Covers the "When the Review Is Complete" section of the written guide.
- **On screen (add in editor):** When the Review Is Complete
- **Voiceover:** When HR completes the review: Your status changes to COMPLETED. You can see the final overall rating and HR remarks. The completed review is archived in your Past Reviews section.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "When the Review Is Complete". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 8 — Close

- **File:** `performance-review-self-assessment-clip-08.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/performance-review-self-assessment
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 16. Performance Reviews — For Managers

**Slug:** `performance-review-for-managers`  |  **Category:** Performance  |  **Clips:** 6  |  **Runtime:** ~0:48
**Guide URL:** https://openhrapp.com/how-to-use/performance-review-for-managers

#### Clip 1 — Hook

- **File:** `performance-review-for-managers-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Performance Reviews — For Managers
- **Voiceover:** How managers review employee self-assessments, provide competency ratings and feedback, and submit for HR calibration.

```text
a growth curve drawing itself across the frame beside a scorecard. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Accessing Pending Employee Reviews

- **File:** `performance-review-for-managers-clip-02.mp4`
- **Purpose:** Covers the "Accessing Pending Employee Reviews" section of the written guide.
- **On screen (add in editor):** Accessing Pending Employee Reviews
- **Voiceover:** Navigate to Performance from the sidebar. In the Manager Review section, you'll see: A list of your direct reports who have submitted their self-assessments (status: SELF\REVIEW\SUBMITTED).  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "Accessing Pending Employee Reviews". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — How to Review an Employee's Performance

- **File:** `performance-review-for-managers-clip-03.mp4`
- **Purpose:** Covers the "How to Review an Employee's Performance" section of the written guide.
- **On screen (add in editor):** How to Review an Employee's Performance
- **Voiceover:** Click on an employee's review card to open the review form: View Self-Assessment — See the employee's self-ratings and comments for each competency.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "How to Review an Employee's Performance". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Submitting Your Manager Review

- **File:** `performance-review-for-managers-clip-04.mp4`
- **Purpose:** Covers the "Submitting Your Manager Review" section of the written guide.
- **On screen (add in editor):** Submitting Your Manager Review
- **Voiceover:** Once you've completed all ratings: Click "Submit Manager Review". The review status changes to MANAGER\REVIEWED. HR is notified that the review is ready for final calibration.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "Submitting Your Manager Review". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Tips for Effective Manager Reviews

- **File:** `performance-review-for-managers-clip-05.mp4`
- **Purpose:** Covers the "Tips for Effective Manager Reviews" section of the written guide.
- **On screen (add in editor):** Tips for Effective Manager Reviews
- **Voiceover:** Be specific — reference actual projects, deliverables, or incidents. Be balanced — acknowledge strengths while constructively addressing areas for improvement.  _(draft — from the guide; tighten for speech)_

```text
a lightbulb shape brightening softly while small accent marks radiate outward, representing "Tips for Effective Manager Reviews". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Close

- **File:** `performance-review-for-managers-clip-06.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/performance-review-for-managers
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 17. Performance Reviews — HR Calibration

**Slug:** `performance-reviews-hr-calibration`  |  **Category:** Performance  |  **Clips:** 6  |  **Runtime:** ~0:48
**Guide URL:** https://openhrapp.com/how-to-use/performance-reviews-hr-calibration

#### Clip 1 — Hook

- **File:** `performance-reviews-hr-calibration-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Performance Reviews — HR Calibration
- **Voiceover:** How HR calibrates performance reviews, assigns final overall ratings, manages review cycles, and completes the process.

```text
a growth curve drawing itself across the frame beside a scorecard. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Accessing Reviews for HR Calibration

- **File:** `performance-reviews-hr-calibration-clip-02.mp4`
- **Purpose:** Covers the "Accessing Reviews for HR Calibration" section of the written guide.
- **On screen (add in editor):** Accessing Reviews for HR Calibration
- **Voiceover:** Navigate to Performance from the sidebar. In the HR Calibration section, you'll see reviews with status MANAGER\REVIEWED that are waiting for your input.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "Accessing Reviews for HR Calibration". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — How to Calibrate a Performance Review

- **File:** `performance-reviews-hr-calibration-clip-03.mp4`
- **Purpose:** Covers the "How to Calibrate a Performance Review" section of the written guide.
- **On screen (add in editor):** How to Calibrate a Performance Review
- **Voiceover:** Open a review to see: Employee's Self-Assessment — Their self-ratings and comments. Manager's Review — The manager's ratings and feedback.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "How to Calibrate a Performance Review". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Completing and Finalizing the Review

- **File:** `performance-reviews-hr-calibration-clip-04.mp4`
- **Purpose:** Covers the "Completing and Finalizing the Review" section of the written guide.
- **On screen (add in editor):** Completing and Finalizing the Review
- **Voiceover:** Review both self-assessment and manager ratings side by side. Add HR Final Remarks — Your overall assessment and any calibration notes.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "Completing and Finalizing the Review". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Managing Review Cycles (Admin/HR)

- **File:** `performance-reviews-hr-calibration-clip-05.mp4`
- **Purpose:** Covers the "Managing Review Cycles (Admin/HR)" section of the written guide.
- **On screen (add in editor):** Managing Review Cycles (Admin/HR)
- **Voiceover:** Admins can manage review cycles from the Performance page: Create Cycle — Set up a new review cycle with name, type (Quarterly, Mid-Year, Annual), start/end dates, and review window dates.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "Managing Review Cycles (Admin/HR)". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Close

- **File:** `performance-reviews-hr-calibration-clip-06.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/performance-reviews-hr-calibration
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 18. Announcements — Viewing and Creating

**Slug:** `announcements-guide`  |  **Category:** Announcements  |  **Clips:** 6  |  **Runtime:** ~0:48
**Guide URL:** https://openhrapp.com/how-to-use/announcements-guide

#### Clip 1 — Hook

- **File:** `announcements-guide-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Announcements — Viewing and Creating
- **Voiceover:** How to view organization announcements in OpenHRApp, and how Admins can create, target, and manage company-wide communications.

```text
a megaphone emitting slow concentric rings that widen and fade. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Viewing Company Announcements

- **File:** `announcements-guide-clip-02.mp4`
- **Purpose:** Covers the "Viewing Company Announcements" section of the written guide.
- **On screen (add in editor):** Viewing Company Announcements
- **Voiceover:** Navigate to Announcements from the sidebar menu.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Viewing Company Announcements", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — How to Create Announcements (Admin/HR Only)

- **File:** `announcements-guide-clip-03.mp4`
- **Purpose:** Covers the "How to Create Announcements (Admin/HR Only)" section of the written guide.
- **On screen (add in editor):** How to Create Announcements (Admin/HR Only)
- **Voiceover:** If you're an Admin or HR user (see Roles and Permissions): Click the "Create Announcement" button. Fill in the form: Title — A clear, concise headline (required).  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Create Announcements (Admin/HR Only)", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Editing and Deleting Announcements

- **File:** `announcements-guide-clip-04.mp4`
- **Purpose:** Covers the "Editing and Deleting Announcements" section of the written guide.
- **On screen (add in editor):** Editing and Deleting Announcements
- **Voiceover:** Click the edit icon on any announcement to update its title, content, priority, target audience, or expiry. Click the delete icon to permanently remove an announcement.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Editing and Deleting Announcements", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Tips for Effective Announcements

- **File:** `announcements-guide-clip-05.mp4`
- **Purpose:** Covers the "Tips for Effective Announcements" section of the written guide.
- **On screen (add in editor):** Tips for Effective Announcements
- **Voiceover:** Use URGENT priority sparingly — reserve it for critical updates like policy changes, emergency notices, or system downtime.  _(draft — from the guide; tighten for speech)_

```text
a lightbulb shape brightening softly while small accent marks radiate outward, representing "Tips for Effective Announcements". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Close

- **File:** `announcements-guide-clip-06.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/announcements-guide
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 19. Notifications — Bell Notifications and Admin Management

**Slug:** `notifications-guide`  |  **Category:** Settings  |  **Clips:** 8  |  **Runtime:** ~1:04
**Guide URL:** https://openhrapp.com/how-to-use/notifications-guide

#### Clip 1 — Hook

- **File:** `notifications-guide-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Notifications — Bell Notifications and Admin Management
- **Voiceover:** How OpenHRApp's bell and email notification system works, what events trigger notifications, and how admins manage them.

```text
interlocking gears beginning to turn, toggles switching in sequence. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Understanding the Notification Bell

- **File:** `notifications-guide-clip-02.mp4`
- **Purpose:** Covers the "Understanding the Notification Bell" section of the written guide.
- **On screen (add in editor):** Understanding the Notification Bell
- **Voiceover:** You'll see a bell icon in the top header bar. A red badge shows your unread notification count. Click the bell to see your recent notifications.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Understanding the Notification Bell", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Complete Notification Trigger Matrix

- **File:** `notifications-guide-clip-03.mp4`
- **Purpose:** Covers the "Complete Notification Trigger Matrix" section of the written guide.
- **On screen (add in editor):** Complete Notification Trigger Matrix
- **Voiceover:** [No prose under this heading — write one or two sentences for "Complete Notification Trigger Matrix".]

```text
an abstract flat-vector sequence illustrating "Complete Notification Trigger Matrix", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Admin Notification Management

- **File:** `notifications-guide-clip-04.mp4`
- **Purpose:** Covers the "Admin Notification Management" section of the written guide.
- **On screen (add in editor):** Admin Notification Management
- **Voiceover:** Admins and HR can access the Notifications page from the sidebar to send and manage notifications.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Admin Notification Management", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — How to Send Custom Notifications

- **File:** `notifications-guide-clip-05.mp4`
- **Purpose:** Covers the "How to Send Custom Notifications" section of the written guide.
- **On screen (add in editor):** How to Send Custom Notifications
- **Voiceover:** Click "Send Notification" to open the form. Select the notification type (Announcement, Leave, Attendance, Review, System).  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Send Custom Notifications", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — Viewing Notification History

- **File:** `notifications-guide-clip-06.mp4`
- **Purpose:** Covers the "Viewing Notification History" section of the written guide.
- **On screen (add in editor):** Viewing Notification History
- **Voiceover:** See all notifications sent across the organization (up to 100 most recent). Search notifications by title or message content.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Viewing Notification History", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Step 6 — Managing and Deleting Notifications

- **File:** `notifications-guide-clip-07.mp4`
- **Purpose:** Covers the "Managing and Deleting Notifications" section of the written guide.
- **On screen (add in editor):** Managing and Deleting Notifications
- **Voiceover:** Delete individual notifications by clicking the delete button on each card. Delete all notifications at once using the "Delete All" button (confirmation required).  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Managing and Deleting Notifications", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 8 — Close

- **File:** `notifications-guide-clip-08.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/notifications-guide
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 20. Theme Customization

**Slug:** `theme-customization`  |  **Category:** Settings  |  **Clips:** 5  |  **Runtime:** ~0:40
**Guide URL:** https://openhrapp.com/how-to-use/theme-customization

#### Clip 1 — Hook

- **File:** `theme-customization-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Theme Customization
- **Voiceover:** Personalize OpenHRApp with 14 color themes, dark mode, light mode, and system preference — saved across devices.

```text
interlocking gears beginning to turn, toggles switching in sequence. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Choosing a Color Theme

- **File:** `theme-customization-clip-02.mp4`
- **Purpose:** Covers the "Choosing a Color Theme" section of the written guide.
- **On screen (add in editor):** Choosing a Color Theme
- **Voiceover:** Navigate to Settings from the sidebar. In the Theme section, you'll see a grid of 14 available color themes.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Choosing a Color Theme", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Switching Between Light Mode, Dark Mode, and System Preference

- **File:** `theme-customization-clip-03.mp4`
- **Purpose:** Covers the "Switching Between Light Mode, Dark Mode, and System Preference" section of the written guide.
- **On screen (add in editor):** Switching Between Light Mode, Dark Mode, and System Preference
- **Voiceover:** Use the mode toggle to switch between: Light Mode — Bright background with dark text. Best for well-lit environments. Dark Mode — Dark background with light text.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Switching Between Light Mode, Dark Mode, and System Preference", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Organization Default Theme (Super Admin)

- **File:** `theme-customization-clip-04.mp4`
- **Purpose:** Covers the "Organization Default Theme (Super Admin)" section of the written guide.
- **On screen (add in editor):** Organization Default Theme (Super Admin)
- **Voiceover:** Super Admins can set a default theme for the entire organization. When a new user logs in for the first time, they'll see the organization's default theme.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Organization Default Theme (Super Admin)", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Close

- **File:** `theme-customization-clip-05.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/theme-customization
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 21. Custom Leave Types and Special Leave

**Slug:** `custom-leave-types`  |  **Category:** Leave  |  **Clips:** 6  |  **Runtime:** ~0:48
**Guide URL:** https://openhrapp.com/how-to-use/custom-leave-types

#### Clip 1 — Hook

- **File:** `custom-leave-types-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Custom Leave Types and Special Leave
- **Voiceover:** Understanding all leave types in OpenHRApp — Maternity, Paternity, Earned, Unpaid, half-day leave, and custom-configured types.

```text
a calendar page turning gently, a few days softening into highlight. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Standard Employee Leave Types

- **File:** `custom-leave-types-clip-02.mp4`
- **Purpose:** Covers the "Standard Employee Leave Types" section of the written guide.
- **On screen (add in editor):** Standard Employee Leave Types
- **Voiceover:** These are the leave types employees can apply for through the self-service form:  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Standard Employee Leave Types", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Special Leave Types (Admin-Created)

- **File:** `custom-leave-types-clip-03.mp4`
- **Purpose:** Covers the "Special Leave Types (Admin-Created)" section of the written guide.
- **On screen (add in editor):** Special Leave Types (Admin-Created)
- **Voiceover:** These types are typically created by Admin/HR on behalf of employees:  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Special Leave Types (Admin-Created)", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — How Half-Day Leave Works

- **File:** `custom-leave-types-clip-04.mp4`
- **Purpose:** Covers the "How Half-Day Leave Works" section of the written guide.
- **On screen (add in editor):** How Half-Day Leave Works
- **Voiceover:** OpenHR supports half-day leave. When an Admin or HR creates a leave record manually, the total days field can be set to decimal values like 0.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How Half-Day Leave Works", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — How to Create Custom Leave Types (Admin Only)

- **File:** `custom-leave-types-clip-05.mp4`
- **Purpose:** Covers the "How to Create Custom Leave Types (Admin Only)" section of the written guide.
- **On screen (add in editor):** How to Create Custom Leave Types (Admin Only)
- **Voiceover:** Admins can create entirely new leave types from Organization Settings: Navigate to Organization from the sidebar. Go to the Leaves tab.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How to Create Custom Leave Types (Admin Only)", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Close

- **File:** `custom-leave-types-clip-06.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/custom-leave-types
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 22. Configuring Notification Settings

**Slug:** `notification-settings`  |  **Category:** Organization  |  **Clips:** 6  |  **Runtime:** ~0:48
**Guide URL:** https://openhrapp.com/how-to-use/notification-settings

#### Clip 1 — Hook

- **File:** `notification-settings-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Configuring Notification Settings
- **Voiceover:** How to configure email notifications, enable or disable notification types, set up SMTP, and manage notification retention.

```text
connected nodes growing outward from a single root into a tidy chart. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Accessing Notification Settings

- **File:** `notification-settings-clip-02.mp4`
- **Purpose:** Covers the "Accessing Notification Settings" section of the written guide.
- **On screen (add in editor):** Accessing Notification Settings
- **Voiceover:** Navigate to Organization from the sidebar, then click the Notifications tab.  _(draft — from the guide; tighten for speech)_

```text
toggles and sliders adjusting one after another in a neat column, representing "Accessing Notification Settings". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Configuring Which Email Notifications Are Sent

- **File:** `notification-settings-clip-03.mp4`
- **Purpose:** Covers the "Configuring Which Email Notifications Are Sent" section of the written guide.
- **On screen (add in editor):** Configuring Which Email Notifications Are Sent
- **Voiceover:** The notification system automatically sends emails for: Leave events — Submission confirmations, approval/rejection notices, workflow forwards Attendance events — Late check-in alerts, absent notifications, checkout reminders, daily summaries Review events — Cycle open/close, submission confirmations, deadline reminders Each email includes the relevant details (employee name, dates, status) and is sent to the appropriate parties based on the event type.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Configuring Which Email Notifications Are Sent", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Notification Retention and Cleanup

- **File:** `notification-settings-clip-04.mp4`
- **Purpose:** Covers the "Notification Retention and Cleanup" section of the written guide.
- **On screen (add in editor):** Notification Retention and Cleanup
- **Voiceover:** The system automatically cleans up old notifications: Bell notifications are retained for 30 days and then automatically deleted by the nightly cleanup job.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Notification Retention and Cleanup", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Email Delivery and SMTP Configuration

- **File:** `notification-settings-clip-05.mp4`
- **Purpose:** Covers the "Email Delivery and SMTP Configuration" section of the written guide.
- **On screen (add in editor):** Email Delivery and SMTP Configuration
- **Voiceover:** Emails are sent through PocketBase's configured SMTP settings. The admin should ensure: SMTP is configured in PocketBase admin panel (Settings Mail settings).  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Email Delivery and SMTP Configuration", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Close

- **File:** `notification-settings-clip-06.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/notification-settings
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 23. Understanding the Dashboard

**Slug:** `understanding-dashboard`  |  **Category:** Getting Started  |  **Clips:** 6  |  **Runtime:** ~0:48
**Guide URL:** https://openhrapp.com/how-to-use/understanding-dashboard

#### Clip 1 — Hook

- **File:** `understanding-dashboard-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Understanding the Dashboard
- **Voiceover:** A detailed tour of OpenHRApp's role-based dashboard — what each widget shows for Employees, Managers, and Admins.

```text
a path drawing itself forward, a checklist ticking its first item. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Employee Dashboard — Your Personal Overview

- **File:** `understanding-dashboard-clip-02.mp4`
- **Purpose:** Covers the "Employee Dashboard — Your Personal Overview" section of the written guide.
- **On screen (add in editor):** Employee Dashboard — Your Personal Overview
- **Voiceover:** As an Employee, your dashboard shows: Quick Actions — Buttons for Office Check-In, Factory Check-In, Finish Session, and Apply for Leave.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Employee Dashboard — Your Personal Overview", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Manager Dashboard — Team Oversight

- **File:** `understanding-dashboard-clip-03.mp4`
- **Purpose:** Covers the "Manager Dashboard — Team Oversight" section of the written guide.
- **On screen (add in editor):** Manager Dashboard — Team Oversight
- **Voiceover:** As a Manager, you see everything an Employee sees, plus: Team Attendance Summary — How many of your direct reports are present, late, or absent today.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Manager Dashboard — Team Oversight", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Admin/HR Dashboard — Organization-Wide View

- **File:** `understanding-dashboard-clip-04.mp4`
- **Purpose:** Covers the "Admin/HR Dashboard — Organization-Wide View" section of the written guide.
- **On screen (add in editor):** Admin/HR Dashboard — Organization-Wide View
- **Voiceover:** As an Admin or HR user, you see the full organizational picture: Organization-Wide Stats — Total employees, today's attendance rate, pending leave requests, active review cycles.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Admin/HR Dashboard — Organization-Wide View", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Tips for Using Your Dashboard Effectively

- **File:** `understanding-dashboard-clip-05.mp4`
- **Purpose:** Covers the "Tips for Using Your Dashboard Effectively" section of the written guide.
- **On screen (add in editor):** Tips for Using Your Dashboard Effectively
- **Voiceover:** Use the quick action buttons to save time — they take you directly to the clock-in screen or leave form. Check your dashboard at the start of each workday to see any pending approvals or important announcements.  _(draft — from the guide; tighten for speech)_

```text
a lightbulb shape brightening softly while small accent marks radiate outward, representing "Tips for Using Your Dashboard Effectively". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Close

- **File:** `understanding-dashboard-clip-06.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/understanding-dashboard
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 24. Subscription and Upgrade Options

**Slug:** `subscription-upgrade-options`  |  **Category:** Getting Started  |  **Clips:** 7  |  **Runtime:** ~0:56
**Guide URL:** https://openhrapp.com/how-to-use/subscription-upgrade-options

#### Clip 1 — Hook

- **File:** `subscription-upgrade-options-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Subscription and Upgrade Options
- **Voiceover:** OpenHRApp's subscription model explained — Trial, Donation tiers, Ad-Supported free tier, and what happens when your trial expires.

```text
a path drawing itself forward, a checklist ticking its first item. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Understanding OpenHRApp Subscription States

- **File:** `subscription-upgrade-options-clip-02.mp4`
- **Purpose:** Covers the "Understanding OpenHRApp Subscription States" section of the written guide.
- **On screen (add in editor):** Understanding OpenHRApp Subscription States
- **Voiceover:** [No prose under this heading — write one or two sentences for "Understanding OpenHRApp Subscription States".]

```text
an abstract flat-vector sequence illustrating "Understanding OpenHRApp Subscription States", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — What Happens When Your Trial Expires

- **File:** `subscription-upgrade-options-clip-03.mp4`
- **Purpose:** Covers the "What Happens When Your Trial Expires" section of the written guide.
- **On screen (add in editor):** What Happens When Your Trial Expires
- **Voiceover:** When your trial expires, your account switches to read-only mode: You can still view all your data — attendance logs, leave history, employee records.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "What Happens When Your Trial Expires", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Upgrade Option 1: Donate (Support Open Source)

- **File:** `subscription-upgrade-options-clip-04.mp4`
- **Purpose:** Covers the "Upgrade Option 1: Donate (Support Open Source)" section of the written guide.
- **On screen (add in editor):** Upgrade Option 1: Donate (Support Open Source)
- **Voiceover:** Support the project with a one-time donation and get full access: How donation activation works: Choose a donation tier. Make your payment via Ko-fi, Buy Me a Coffee, or PayPal.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Upgrade Option 1: Donate (Support Open Source)", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Upgrade Option 2: Extend Your Trial

- **File:** `subscription-upgrade-options-clip-05.mp4`
- **Purpose:** Covers the "Upgrade Option 2: Extend Your Trial" section of the written guide.
- **On screen (add in editor):** Upgrade Option 2: Extend Your Trial
- **Voiceover:** Need more time to evaluate? Request a trial extension: Select an extension reason (evaluating features, budget approval, setup in progress, training team, non-profit organization, educational institution, or other).  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Upgrade Option 2: Extend Your Trial", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — Upgrade Option 3: Ad-Supported (Free Forever)

- **File:** `subscription-upgrade-options-clip-06.mp4`
- **Purpose:** Covers the "Upgrade Option 3: Ad-Supported (Free Forever)" section of the written guide.
- **On screen (add in editor):** Upgrade Option 3: Ad-Supported (Free Forever)
- **Voiceover:** Get full feature access for free with non-intrusive ads: Ads are shown in the sidebar and dashboard areas only. No ads in critical workflows — attendance clock-in/out remains completely ad-free.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Upgrade Option 3: Ad-Supported (Free Forever)", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Close

- **File:** `subscription-upgrade-options-clip-07.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/subscription-upgrade-options
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 25. Exporting Employee Data

**Slug:** `exporting-employee-data`  |  **Category:** Reports  |  **Clips:** 6  |  **Runtime:** ~0:48
**Guide URL:** https://openhrapp.com/how-to-use/exporting-employee-data

#### Clip 1 — Hook

- **File:** `exporting-employee-data-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Exporting Employee Data
- **Voiceover:** How to export your employee directory as CSV for data analysis or branded PDF for stakeholder sharing.

```text
a bar chart rising column by column, a line sweeping across above it. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — How to Export from the Employee Directory

- **File:** `exporting-employee-data-clip-02.mp4`
- **Purpose:** Covers the "How to Export from the Employee Directory" section of the written guide.
- **On screen (add in editor):** How to Export from the Employee Directory
- **Voiceover:** Navigate to Employees from the sidebar. You'll find export options at the top of the page.  _(draft — from the guide; tighten for speech)_

```text
a document sliding out of a container with a download arrow tracing downward, representing "How to Export from the Employee Directory". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — CSV Export — For Data Analysis

- **File:** `exporting-employee-data-clip-03.mp4`
- **Purpose:** Covers the "CSV Export — For Data Analysis" section of the written guide.
- **On screen (add in editor):** CSV Export — For Data Analysis
- **Voiceover:** Click "Export CSV" to download a spreadsheet containing: Employee ID Full Name Email Department Designation Role Team Status (Active/Inactive) Joining Date Contact Information The CSV file can be opened in Excel, Google Sheets, or any spreadsheet application for data analysis and reporting.  _(draft — from the guide; tighten for speech)_

```text
a document sliding out of a container with a download arrow tracing downward, representing "CSV Export — For Data Analysis". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — PDF Export — For Stakeholder Sharing

- **File:** `exporting-employee-data-clip-04.mp4`
- **Purpose:** Covers the "PDF Export — For Stakeholder Sharing" section of the written guide.
- **On screen (add in editor):** PDF Export — For Stakeholder Sharing
- **Voiceover:** Click "Export PDF" to generate a formatted document that includes: Your organization's logo and name at the top A summary table with total employee count, department breakdown Employee listing with all key fields Generation date for record-keeping The PDF is ideal for printing or sharing with stakeholders who need an official employee roster with organization branding.  _(draft — from the guide; tighten for speech)_

```text
a document sliding out of a container with a download arrow tracing downward, representing "PDF Export — For Stakeholder Sharing". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Tips for Employee Data Export

- **File:** `exporting-employee-data-clip-05.mp4`
- **Purpose:** Covers the "Tips for Employee Data Export" section of the written guide.
- **On screen (add in editor):** Tips for Employee Data Export
- **Voiceover:** Use search filters before exporting to narrow down to specific departments or roles. PDF exports include organization branding automatically — no manual formatting needed.  _(draft — from the guide; tighten for speech)_

```text
a lightbulb shape brightening softly while small accent marks radiate outward, representing "Tips for Employee Data Export". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Close

- **File:** `exporting-employee-data-clip-06.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/exporting-employee-data
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 26. Performance Reviews — HR Calibration

**Slug:** `performance-review-hr-calibration`  |  **Category:** Performance Reviews  |  **Clips:** 6  |  **Runtime:** ~0:48
**Guide URL:** https://openhrapp.com/how-to-use/performance-review-hr-calibration

#### Clip 1 — Hook

- **File:** `performance-review-hr-calibration-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Performance Reviews — HR Calibration
- **Voiceover:** How HR calibrates performance reviews, assigns final overall ratings, manages review cycles, and completes the process.

```text
a growth curve drawing itself across the frame beside a scorecard. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — Accessing Reviews for HR Calibration

- **File:** `performance-review-hr-calibration-clip-02.mp4`
- **Purpose:** Covers the "Accessing Reviews for HR Calibration" section of the written guide.
- **On screen (add in editor):** Accessing Reviews for HR Calibration
- **Voiceover:** Navigate to Performance from the sidebar. In the HR Calibration section, you'll see reviews with status MANAGER\REVIEWED that are waiting for your input.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "Accessing Reviews for HR Calibration". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — How to Calibrate a Performance Review

- **File:** `performance-review-hr-calibration-clip-03.mp4`
- **Purpose:** Covers the "How to Calibrate a Performance Review" section of the written guide.
- **On screen (add in editor):** How to Calibrate a Performance Review
- **Voiceover:** Open a review to see: Employee's Self-Assessment — Their self-ratings and comments. Manager's Review — The manager's ratings and feedback.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "How to Calibrate a Performance Review". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Completing and Finalizing the Review

- **File:** `performance-review-hr-calibration-clip-04.mp4`
- **Purpose:** Covers the "Completing and Finalizing the Review" section of the written guide.
- **On screen (add in editor):** Completing and Finalizing the Review
- **Voiceover:** Review both self-assessment and manager ratings side by side. Add HR Final Remarks — Your overall assessment and any calibration notes.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "Completing and Finalizing the Review". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Managing Review Cycles (Admin/HR)

- **File:** `performance-review-hr-calibration-clip-05.mp4`
- **Purpose:** Covers the "Managing Review Cycles (Admin/HR)" section of the written guide.
- **On screen (add in editor):** Managing Review Cycles (Admin/HR)
- **Voiceover:** Admins can manage review cycles from the Performance page: Create Cycle — Set up a new review cycle with name, type (Quarterly, Mid-Year, Annual), start/end dates, and review window dates.  _(draft — from the guide; tighten for speech)_

```text
a card passing between two abstract figures and receiving a check mark, representing "Managing Review Cycles (Admin/HR)". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Close

- **File:** `performance-review-hr-calibration-clip-06.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/performance-review-hr-calibration
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 27. Welcome to OpenHR — Your First Steps

**Slug:** `welcome-to-openhr`  |  **Category:** Getting Started  |  **Clips:** 6  |  **Runtime:** ~0:48
**Guide URL:** https://openhrapp.com/how-to-use/welcome-to-openhr

#### Clip 1 — Hook

- **File:** `welcome-to-openhr-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Welcome to OpenHR — Your First Steps
- **Voiceover:** Get started with OpenHR — the free open source HR management system for attendance tracking, leave management, and employee directory.

```text
a path drawing itself forward, a checklist ticking its first item. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — What You Can Do with OpenHR

- **File:** `welcome-to-openhr-clip-02.mp4`
- **Purpose:** Covers the "What You Can Do with OpenHR" section of the written guide.
- **On screen (add in editor):** What You Can Do with OpenHR
- **Voiceover:** Track Attendance with Selfie Verification — Clock in and out using your device camera and GPS location. Supports both Office and Factory/Field modes with biometric selfie verification.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "What You Can Do with OpenHR", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — How OpenHR Works

- **File:** `welcome-to-openhr-clip-03.mp4`
- **Purpose:** Covers the "How OpenHR Works" section of the written guide.
- **On screen (add in editor):** How OpenHR Works
- **Voiceover:** Admin registers the organization on openhrapp.com and configures company structure. Employees log in and clock in/out daily using their device camera and GPS.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "How OpenHR Works", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Your Role-Based Dashboard

- **File:** `welcome-to-openhr-clip-04.mp4`
- **Purpose:** Covers the "Your Role-Based Dashboard" section of the written guide.
- **On screen (add in editor):** Your Role-Based Dashboard
- **Voiceover:** When you log in, you see a personalized dashboard based on your role: Admin/HR Dashboard: Full organization stats, quick action buttons, global employee directory, and leave allocation overview.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Your Role-Based Dashboard", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Quick Actions Available on the Dashboard

- **File:** `welcome-to-openhr-clip-05.mp4`
- **Purpose:** Covers the "Quick Actions Available on the Dashboard" section of the written guide.
- **On screen (add in editor):** Quick Actions Available on the Dashboard
- **Voiceover:** Your dashboard includes shortcut buttons for common daily tasks: Office Check-In — Start an attendance session for office work.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Quick Actions Available on the Dashboard", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Close

- **File:** `welcome-to-openhr-clip-06.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/welcome-to-openhr
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---

### 28. Install OpenHR as an App (PWA) on Android and iOS

**Slug:** `install-openhr-pwa`  |  **Category:** Getting Started  |  **Clips:** 8  |  **Runtime:** ~1:04
**Guide URL:** https://openhrapp.com/how-to-use/install-openhr-pwa

> Capped at 6 body clips. Not covered on video, so leave these to the written guide: _How to Uninstall the PWA_.

#### Clip 1 — Hook

- **File:** `install-openhr-pwa-clip-01.mp4`
- **Purpose:** State the problem the guide solves. Earns the next five seconds.
- **On screen (add in editor):** Install OpenHR as an App (PWA) on Android and iOS
- **Voiceover:** Install OpenHR on your phone or desktop as a Progressive Web App (PWA) — no app store download required.

```text
a path drawing itself forward, a checklist ticking its first item. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 2 — Step 1 — What is a Progressive Web App (PWA)?

- **File:** `install-openhr-pwa-clip-02.mp4`
- **Purpose:** Covers the "What is a Progressive Web App (PWA)?" section of the written guide.
- **On screen (add in editor):** What is a Progressive Web App (PWA)?
- **Voiceover:** A Progressive Web App is a website that behaves like a native mobile app.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "What is a Progressive Web App (PWA)?", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 3 — Step 2 — Installing OpenHR on Android (Chrome)

- **File:** `install-openhr-pwa-clip-03.mp4`
- **Purpose:** Covers the "Installing OpenHR on Android (Chrome)" section of the written guide.
- **On screen (add in editor):** Installing OpenHR on Android (Chrome)
- **Voiceover:** Open Google Chrome on your Android device. Navigate to your organization's OpenHR URL (e.g., https://hr.yourcompany.com).  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Installing OpenHR on Android (Chrome)", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 4 — Step 3 — Installing OpenHR on iPhone / iPad (Safari)

- **File:** `install-openhr-pwa-clip-04.mp4`
- **Purpose:** Covers the "Installing OpenHR on iPhone / iPad (Safari)" section of the written guide.
- **On screen (add in editor):** Installing OpenHR on iPhone / iPad (Safari)
- **Voiceover:** Open Safari on your iPhone or iPad (this only works in Safari, not Chrome or Firefox on iOS). Navigate to your organization's OpenHR URL.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Installing OpenHR on iPhone / iPad (Safari)", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 5 — Step 4 — Installing OpenHR on Desktop (Chrome / Edge)

- **File:** `install-openhr-pwa-clip-05.mp4`
- **Purpose:** Covers the "Installing OpenHR on Desktop (Chrome / Edge)" section of the written guide.
- **On screen (add in editor):** Installing OpenHR on Desktop (Chrome / Edge)
- **Voiceover:** Open Google Chrome or Microsoft Edge on your computer. Navigate to your OpenHR URL and log in. Look for the install icon (a small + or monitor icon) in the address bar on the right side.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Installing OpenHR on Desktop (Chrome / Edge)", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 6 — Step 5 — Using OpenHR as an Installed App

- **File:** `install-openhr-pwa-clip-06.mp4`
- **Purpose:** Covers the "Using OpenHR as an Installed App" section of the written guide.
- **On screen (add in editor):** Using OpenHR as an Installed App
- **Voiceover:** Once installed, OpenHR behaves like any other app on your device: Launch it from your home screen or app drawer — no need to open a browser first.  _(draft — from the guide; tighten for speech)_

```text
an abstract flat-vector sequence illustrating "Using OpenHR as an Installed App", one clear action unfolding in the centre of frame. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 7 — Step 6 — Troubleshooting PWA Installation Issues

- **File:** `install-openhr-pwa-clip-07.mp4`
- **Purpose:** Covers the "Troubleshooting PWA Installation Issues" section of the written guide.
- **On screen (add in editor):** Troubleshooting PWA Installation Issues
- **Voiceover:** [No prose under this heading — write one or two sentences for "Troubleshooting PWA Installation Issues".]

```text
a single shape briefly turning amber then resolving back to blue as a check mark settles beside it, representing "Troubleshooting PWA Installation Issues". Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

#### Clip 8 — Close

- **File:** `install-openhr-pwa-clip-08.mp4`
- **Purpose:** Send the viewer to the written guide, which carries the detail.
- **On screen (add in editor):** openhrapp.com/how-to-use/install-openhr-pwa
- **Voiceover:** Full step-by-step instructions are in the written guide — link below.

```text
the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third. Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. Strict palette: muted slate blue #4a6fa5 dominant, pale blue #d4e4f7 fills, deep slate #1e293b line work, off-white #f1f5f9 background. Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — a gentle push in or a slow lateral drift, never a whip pan or an orbit. Motion is calm and continuous, one idea per shot. 16:9 landscape, 8 seconds, seamless loop-safe start and end.
```

**Negative prompt (same for every clip in this guide):**

```text
no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface chrome, no real device screens, no recognisable faces, no fast cuts within the clip, no camera shake, no lens flare, no neon colours, no crowds, no clutter
```

---
