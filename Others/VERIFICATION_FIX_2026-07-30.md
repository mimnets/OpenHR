# Email Verification Fix — July 2026

## Problem

Admin adds an employee → employee receives "Confirm Your Signup" email → clicks link → email confirmed → redirected to OpenHR → **can sign in once** (auto-session from redirect) → signs out → tries to sign in with email + password → **"Account not verified. Please check your email."** → clicks "Resend Link" → toast says sent → **no email arrives.**

## Root Cause

`profiles.verified` was never set to `true` when the email was confirmed. Supabase Auth's built-in handler only updates `auth.users.email_confirmed_at` — it does not touch the `profiles` table. The application's `verifyEmailToken()` only called `verifyOtp()` without updating `profiles.verified`, and there was no database trigger to bridge the gap.

**The full chain:**
1. `create-employee` edge function creates user with `email_confirm: false` + `verified: false`
2. Supabase sends "Confirm Your Signup" email via Resend SMTP
3. User clicks link → Supabase handler confirms `auth.users.email_confirmed_at`
4. Redirect to app with token → `VerifyAccount` component calls `verifyOtp` (which succeeds) but never updates `profiles.verified`
5. User signs out, tries password login → `auth.service.ts:48` checks `profile.verified` → `false` → returns "Account not verified"
6. "Resend Link" calls `supabase.auth.resend({ type: 'signup', email })` → Supabase returns success without sending because email is already confirmed

## Bugs Fixed

| # | Bug | Severity | Fix |
|---|-----|----------|-----|
| 1 | `profiles.verified` never synced from `auth.users.email_confirmed_at` | Critical | DB trigger `on_auth_user_email_confirmed` |
| 2 | `verifyEmailToken()` used `type: 'email'` instead of `type: 'signup'` for OTP | High | Changed to `type: 'signup'` |
| 3 | `verifyEmailToken()` didn't update `profiles.verified = true` | High | Added client-side update after `verifyOtp` |
| 4 | `resendVerificationEmail()` silently fails for already-confirmed emails | High | Added `email_confirmed_at` check before resend |
| 5 | "Confirm Your Signup" template was unprofessional | Medium | New template in Supabase Dashboard |
| 6 | Existing confirmed users stuck with `verified=false` | Medium | Backfill SQL in migration |

## Files Changed

| File | Change |
|------|--------|
| `supabase/migrations/0022_sync_verified_on_email_confirm.sql` | **NEW** — DB trigger + backfill |
| `src/services/verification.service.ts` | Fix OTP type, add profile update, fallback check, improve resend |
| `src/services/hrService.ts` | Route `requestVerificationEmail` to `verificationService.resendVerificationEmail` |
| `src/pages/Login.tsx` | Use result message from improved resend, auto-clear error on already-verified |

## Migration 0022 — Database Trigger

**File:** `supabase/migrations/0022_sync_verified_on_email_confirm.sql`

Creates a PostgreSQL trigger on `auth.users` that fires when `email_confirmed_at` transitions from NULL to non-NULL. The trigger automatically sets `profiles.verified = true` for the corresponding profile.

Also includes a **backfill** that fixes all existing users who already confirmed their email but are stuck with `verified = false`.

### How to apply

**Option 1 — Supabase CLI:**
```bash
supabase db push
```

**Option 2 — Manual SQL:**
Run the migration SQL directly in the Supabase SQL Editor (Dashboard → SQL Editor).

### Verify the fix

```sql
-- Should return 0 (no stuck users)
SELECT COUNT(*) FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email_confirmed_at IS NOT NULL AND p.verified = false;
```

## Email Template Update (Manual)

The "Confirm Your Signup" email template must be updated in the Supabase Dashboard:

**Navigation:** Supabase Dashboard → Authentication → Email Templates → **Confirm Signup**

### New Subject
```
Welcome to OpenHR — Verify Your Email
```

### New HTML Body
See the full HTML in `Others/VERIFICATION_FIX_2026-07-30.md` appendix, or copy from the plan file at `.claude/plans/peppy-orbiting-treehouse.md`.

The key changes from the default template:
- **Subject**: "Welcome to OpenHR — Verify Your Email" instead of "Confirm Your Signup"
- **Header**: Gradient purple header with "Welcome to OpenHR" branding
- **Body**: Contextual message — "Your administrator has created an account for you"
- **CTA**: "Verify Your Email Address" button (not "Confirm Your Signup")
- **Info box**: Yellow note about 24-hour expiry
- **Footer**: Professional footer with support email

## Manual Testing Checklist

- [ ] Create a new employee via admin panel → email arrives with subject "Welcome to OpenHR — Verify Your Email"
- [ ] Click confirmation link in email → redirected to OpenHR with verification success
- [ ] Sign out → sign in with email + password → **succeeds** (no "Account not verified" error)
- [ ] For an existing stuck user: after running migration backfill, they can log in
- [ ] Click "Resend Link" on an already-verified account → shows "Your account is already verified" toast
- [ ] Run verification query → 0 stuck users

---

## Appendix: Email Template HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 0">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center">
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 8px">Welcome to OpenHR</h1>
              <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0">Your organization has set up your account</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px">
              <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 24px">
                Hi {{ .Email }},
              </p>
              <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 32px">
                Your administrator has created an account for you on <strong>OpenHR</strong> — the modern HR management platform. To get started, please verify your email address by clicking the button below.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:32px">
                    <a href="{{ .ConfirmationURL }}" style="display:inline-block;background-color:#4f46e5;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:10px;text-align:center">
                      Verify Your Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback URL -->
              <p style="color:#94a3b8;font-size:12px;line-height:1.5;margin:0 0 24px">
                If the button above doesn't work, copy and paste this URL into your browser:
              </p>
              <p style="background-color:#f1f5f9;padding:12px 16px;border-radius:8px;font-size:12px;color:#64748b;word-break:break-all;margin:0 0 32px;font-family:monospace">
                {{ .ConfirmationURL }}
              </p>

              <!-- Info box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fefce8;border:1px solid #fde68a;border-radius:10px;padding:16px;margin-bottom:24px">
                <tr>
                  <td style="color:#92400e;font-size:13px;line-height:1.5">
                    <strong>Note:</strong> This verification link expires in <strong>24 hours</strong>. If you didn't expect this email, you can safely ignore it — your account won't be created until you verify.
                  </td>
                </tr>
              </table>

              <p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:0">
                Need help? Contact your organization administrator or reach us at
                <a href="mailto:support@openhrapp.com" style="color:#4f46e5;text-decoration:none">support@openhrapp.com</a>.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0">
              <p style="color:#94a3b8;font-size:11px;margin:0 0 4px">
                <strong>OpenHR</strong> — Modern HR Management
              </p>
              <p style="color:#cbd5e1;font-size:11px;margin:0">
                This email was sent by <a href="https://www.openhrapp.com" style="color:#4f46e5;text-decoration:none">openhrapp.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```
