
# OpenHR Firebase Setup Playbook

This document outlines the mandatory steps to configure the Firebase backend for the OpenHR HRMS.

## 1. Project Creation
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `OpenHR-OrganizationName`.

## 2. Authentication Setup
1. Click **Build > Authentication > Get Started**.
2. Enable **Email/Password**.

## 3. Firestore Database (CRITICAL: Security Rules)
The error **"Missing or insufficient permissions"** occurs if your rules are too restrictive. Paste the following rules into **Build > Firestore Database > Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 1. HELPER: Check if user is an Admin
    // Using exists() before get() prevents errors if the profile is not yet created.
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/employees/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/employees/$(request.auth.uid)).data.role == 'ADMIN';
    }

    // 2. EMPLOYEES COLLECTION
    match /employees/{userId} {
      // Any authenticated user can read profiles (Directory access)
      allow read: if request.auth != null;
      
      // Allow users to create their own initial profile (Auto-provisioning)
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Allow users to update themselves OR allow Admins to update anyone
      allow update: if request.auth != null && (request.auth.uid == userId || isAdmin());
      
      // Only Admins can delete personnel
      allow delete: if isAdmin();
    }

    // 3. SETTINGS & CONFIG
    match /settings/{docId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }

    // 4. ATTENDANCE & LEAVES
    match /attendance/{id} {
      allow read: if request.auth != null && (resource.data.employeeId == request.auth.uid || isAdmin());
      allow create: if request.auth != null && request.resource.data.employeeId == request.auth.uid;
      allow update, delete: if isAdmin();
    }
    
    match /leaves/{id} {
      allow read: if request.auth != null && (resource.data.employeeId == request.auth.uid || isAdmin());
      allow create: if request.auth != null && request.resource.data.employeeId == request.auth.uid;
      // Allow update if Admin/HR or if it's the manager (for status changes)
      allow update: if request.auth != null && (isAdmin() || resource.data.employeeId == request.auth.uid); 
      allow delete: if isAdmin();
    }
  }
}
```

## 4. Web App Integration
1. Go to **Project Settings** (Gear icon).
2. Under **Your apps**, click the **</> (Web)** icon.
3. Register the app and copy the `firebaseConfig`.
4. Paste these values into the **Settings** page of OpenHR.

## 5. Troubleshooting Bootstrap
If "Claim Admin Role" fails:
1. Ensure you have published the Rules above in the Firebase Console.
2. Check that your email matches `VITE_BOOTSTRAP_ADMIN_EMAIL` in the `.env` file.
3. If using the Manual Setup, ensure the "Designated Bootstrap Email" field in Settings matches your login email.
