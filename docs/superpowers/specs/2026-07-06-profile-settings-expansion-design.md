# Profile & Settings Expansion Design

## 1. Overview
Expand the user dashboard to include a fully functional Settings page and an enhanced Profile page. This includes adding user bios, notification preferences, email/password reset functionality, and a robust Role-Based Access Control (RBAC) system.

## 2. Architecture & Data Flow

### 2.1 System Roles (RBAC)
*   **Architecture:** We will use **JWT Custom Claims**. The user's role (e.g., `user`, `admin`) will be stored in Supabase Auth's `app_metadata`.
*   **Database Integration:** 
    *   Create a `user_roles` table (mapping `user_id` to `role`).
    *   Create a Supabase Postgres function & trigger: Whenever a role is inserted/updated in `user_roles`, it automatically updates the `app_metadata` of the corresponding user in the `auth.users` table.
*   **Frontend Consumption:** Next.js can read the role synchronously from the Supabase session cookie without any database queries.
*   **RLS Policies:** Future tables can be secured simply by checking `auth.jwt()->'app_metadata'->>'role'`.

### 2.2 Profile Enhancements
*   **Database:** 
    *   Add `bio` (`text`) and `mobile_number` (`text`) columns to `public.profiles`.
    *   Replace the existing `full_name` column with `first_name` and `last_name` (`text`).
*   **Data Flow:** The existing `ProfileForm` will be updated to include inputs for first name, last name, mobile number, and a Textarea for the bio. Zod schema will validate all inputs. 
*   **Role Display:** The profile UI will fetch the user's role from their session and display it as a read-only badge (e.g., "Admin").

### 2.3 Settings Enhancements
*   **Database:** Create a `user_settings` table (mapping `user_id` to `marketing_emails` and `security_emails` booleans).
*   **Data Flow - Notifications:** Form toggles will update the `user_settings` table via a Server Action.
*   **Data Flow - Auth Updates:** 
    *   **Email Change:** Use `supabase.auth.updateUser({ email: newEmail })`. This triggers a confirmation email to both the old and new email addresses.
    *   **Password Change:** Use `supabase.auth.updateUser({ password: newPassword })`.

## 3. UI Components

### 3.1 Profile Page (`/protected/profile`)
*   **AvatarUpload:** (Existing)
*   **First & Last Name Inputs:** (Replaces full name)
*   **Mobile Number Input:** (New)
*   **Bio Textarea:** (New)
*   **Role Badge:** (New - Read-only)

### 3.2 Settings Page (`/protected/settings`)
Split into distinct Card sections:
*   **Account Security Card:**
    *   Change Email Form (Input + Submit Button).
    *   Change Password Form (Input + Submit Button).
*   **Notifications Card:**
    *   Toggle switch for Marketing Emails.
    *   Toggle switch for Security Alerts (Disabled/Locked to ON for safety).

## 4. Error Handling
*   **Validation:** All forms will use Zod schemas to ensure strong client-side and server-side validation (e.g., password strength, bio length).
*   **Auth Errors:** Supabase auth errors (e.g., "Email already in use") will be caught in the Server Actions and displayed via Sonner toasts on the frontend.
*   **RLS:** Ensure `user_settings` and `user_roles` have strict RLS policies so users can only read/update their own settings, and ONLY admins can update `user_roles`.

## 5. Testing
*   Verify JWT claims update correctly when a role is changed in the database.
*   Verify bio and settings persist after page refresh.
*   Verify password update succeeds and logs the user out (if configured to do so) or maintains session securely.
