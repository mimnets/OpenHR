# OpenHR Development Playbook & Technical Reference

This document serves as a historical and technical audit of the development of the **OpenHR HRMS**. It is designed for future engineers and stakeholders to understand the "Why" behind the architectural choices and the sequence of prompts that shaped the current system.

---

## 1. Project Genesis (The Vision)
**Objective**: Build a comprehensive HR Management System tailored for mid-size organizations (100-500 employees) with a specific focus on **Bangladesh-based compliance** (Labor Code 2006).

---

## 2. Environment Variable Setup (.env)
The application handles configuration through two layers: **Environment Variables** (High Priority) and **Local UI Setup** (Fallback). 

### Creating your .env file:
1. Create a file named `.env` in the root directory.
2. Fill in the following mandatory keys using the `VITE_` prefix:

| Key | Description |
|-----|-------------|
| `VITE_FIREBASE_API_KEY` | Your Firebase Web SDK API Key. |
| `VITE_FIREBASE_PROJECT_ID` | Your unique Firebase Project ID. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain. |
| `VITE_BOOTSTRAP_ADMIN_EMAIL` | The authorized email that will become the first ADMIN. |
| `VITE_GOOGLE_CLIENT_ID` | OAuth2 Client ID for Google Drive Cloud Sync. |
| `VITE_EMAIL_RELAY_URL` | Endpoint for the HR Communication Relay API. |

---

## 3. Initial Setup & "Zero-Config" Workflow
The system is designed to detect its environment automatically on boot.

### Common Login Issues & Fixes:
1. **"ReferenceError: process is not defined"**: This occurred when attempting to access environment variables directly in a browser context. This has been fixed with the `safeGetEnv` utility in all services.
2. **Missing Firebase Config**: If the `.env` variables are not correctly set, the app will redirect to a **Manual Configuration** screen. Settings entered here are saved to browser `localStorage`.
3. **Admin User Not in Auth**: Before logging in as the bootstrap admin, you **must manually create the user** in your Firebase Console under Authentication.

### Admin Bootstrap Steps:
1. **Designation**: Ensure `VITE_BOOTSTRAP_ADMIN_EMAIL` is set in your `.env` (e.g., `sabbir@vclbd.net`).
2. **Account Creation**: In your Firebase Console, manually add this user under Authentication.
3. **First Login**: Sign in to the OpenHR portal using this email.
4. **Activation**: Look for the indigo **"Claim Admin Role"** banner at the top of the dashboard. Click it to initialize the organization records in Firestore.

---

## 4. Architectural Decisions
### Security & Privacy
- **Client-Side Auth**: We utilize Firebase Authentication for secure session management.
- **Data Isolation**: Firestore rules ensure that Employees can only see their own logs.
- **Biometric Validation**: Attendance punches require both GPS and a verified selfie.

---

**Developed with ❤️ for OpenHR Solutions.**
*Document Version: 1.0.7*