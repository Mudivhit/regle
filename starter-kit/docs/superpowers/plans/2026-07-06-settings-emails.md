# Settings & Transactional Emails Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the User Profiles table, Settings/Profile update pages, Avatar uploads via Supabase Storage, Global Toasts, and Transactional Emails setup.

**Architecture:** 
- Next.js Server Actions for Profile Updates.
- Supabase SQL Migrations for new Tables, Triggers, and Storage Buckets.
- `sonner` for toast notifications.
- `react-email` and `resend` (or Supabase custom SMTP) for emails.

**Tech Stack:** Next.js, Supabase, Tailwind CSS, Zod, Sonner, React Email.

---

### Task 1: Add User Profile Table & Auth Trigger

**Files:**
- Create: `supabase/migrations/<timestamp>_user_profiles.sql`
- Modify: `types/supabase.ts` (regenerated)

**Interfaces:**
- Consumes: Supabase Auth.
- Produces: A `profiles` table synced with `auth.users`.

- [ ] **Step 1: Create SQL Migration for Profiles and Trigger**
Run `npx supabase migration new user_profiles` and add SQL to create a `profiles` table (id UUID references auth.users, full_name text, avatar_url text, updated_at timestamp) and a trigger function that inserts into `public.profiles` on `auth.users` insert. Enable RLS on `profiles`.

- [ ] **Step 2: Apply Migration to Local DB**
Run `npx supabase db reset` or `npx supabase migration up` to apply locally.

- [ ] **Step 3: Regenerate Supabase Types**
Run `npm run generate-types`.

- [ ] **Step 4: Commit**
Commit the migration and updated types.

---

### Task 2: Implement Global Toasts (Sonner)

**Files:**
- Modify: `app/layout.tsx` (or `app/protected/layout.tsx`)
- Modify: `package.json`

**Interfaces:**
- Consumes: User actions across the app.
- Produces: Toast notifications.

- [ ] **Step 1: Install Sonner**
Run `npx shadcn@latest add sonner`. (This will install sonner and add the Toaster component).

- [ ] **Step 2: Add Toaster to Root Layout**
Import and render `<Toaster />` in the root `app/layout.tsx`.

- [ ] **Step 3: Test Toaster Integration**
Add a toast to the `handleLogin` or `handleSignUp` functions to test.

- [ ] **Step 4: Commit**
Commit the Sonner installation and layout updates.

---

### Task 3: Setup Avatar Storage Bucket & Policies

**Files:**
- Create: `supabase/migrations/<timestamp>_avatar_storage.sql`

**Interfaces:**
- Consumes: Supabase Storage.
- Produces: A public bucket named `avatars` with RLS policies allowing authenticated users to upload their own images.

- [ ] **Step 1: Create SQL Migration for Storage**
Run `npx supabase migration new avatar_storage`.
Add SQL to insert an `avatars` bucket into `storage.buckets`. Create policies for `storage.objects` allowing select (public) and insert/update/delete (auth users matching `auth.uid() = owner`).

- [ ] **Step 2: Apply Migration to Local DB**
Run `npx supabase migration up`.

- [ ] **Step 3: Commit**
Commit the migration file.

---

### Task 4: Build Profile & Settings Page Functionality

**Files:**
- Modify: `app/protected/profile/page.tsx`
- Create: `app/actions/profile.ts`
- Create: `components/avatar-upload.tsx`

**Interfaces:**
- Consumes: Supabase client, `profiles` table, `avatars` storage bucket.
- Produces: A functional form to update profile info and avatar.

- [ ] **Step 1: Create Avatar Upload Component**
Build a component using a hidden `<input type="file" />` that uploads to Supabase storage and returns the public URL.

- [ ] **Step 2: Create Server Actions for Profile Updates**
Create a server action to update the user's `full_name` and `avatar_url` in the `profiles` table.

- [ ] **Step 3: Connect the Profile Form**
Update the placeholder `/protected/profile` page to fetch the current user's profile and use a client component form (with Zod validation) to submit updates via the Server Action. Show a success toast via `sonner`.

- [ ] **Step 4: Commit**
Commit the new components and page updates.

---

### Task 5: Integrate React Email (Transactional Emails)

**Files:**
- Create: `emails/WelcomeEmail.tsx`
- Create: `emails/ResetPasswordEmail.tsx`

**Interfaces:**
- Consumes: React Email package.
- Produces: Ready-to-use email templates.

- [ ] **Step 1: Install Dependencies**
Run `npm install react-email @react-email/components -E`.

- [ ] **Step 2: Create Email Templates**
Create beautiful, branded Welcome and Password Reset templates using React Email components.

- [ ] **Step 3: (Optional) Setup Resend API Endpoint**
We can create an API route (`/api/send-email`) or just document how to configure Supabase to use an external SMTP / Webhook with these templates. For now, create the templates.

- [ ] **Step 4: Commit**
Commit the email templates.
