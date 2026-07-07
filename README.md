# Regle — Agent-Friendly SaaS Starter Kit

Regle is a production-ready, highly opinionated **Next.js (App Router) + Supabase** starter kit designed specifically to be forked and extended by autonomous AI agents and human developers alike. It provides a robust foundation of Authentication, Role-Based Access Control (RBAC), UI components, and Database schema patterns so you can immediately begin building business logic.

---

## 🏗 Architecture & Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database & Auth:** Supabase (PostgreSQL) + `@supabase/ssr`
- **Styling:** Tailwind CSS + custom HSL CSS Variables + Glassmorphism
- **UI Components:** Radix UI primitives + custom shadcn-style wrappers
- **Validation:** Zod (Server & Client side)
- **Notifications & UI:** Sonner (Toasts), Lucide React (Icons)
- **Emails:** React Email

---

## 📂 Codebase Map

A strict separation of concerns is maintained. When extending the app, follow these conventions:

```text
/starter-kit
├── app/                      # Next.js App Router
│   ├── (public)/             # Public marketing pages
│   ├── auth/                 # Auth flows (login, signup, reset password)
│   ├── protected/            # Authenticated app shell (requires active session)
│   ├── actions/              # Next.js Server Actions (Database mutations)
│   └── api/                  # REST API routes (Webhooks, etc.)
├── components/               # React UI Components
│   ├── ui/                   # Reusable atomic UI components (Button, Input, Card)
│   └── (feature)/            # Feature-specific components (AuthButton, DashboardChart)
├── lib/                      # Utilities & Configuration
│   ├── supabase/             # Supabase client singletons (browser, server, proxy)
│   └── validations/          # Zod schema definitions
├── supabase/
│   ├── migrations/           # Sequential Postgres SQL migrations
│   └── config.toml           # Local Supabase configuration
└── middleware.ts             # Global request interceptor (handles Auth guards & Session refresh)
```

---

## 🗄 Database Schema & Auth Flow

The database leverages Postgres Triggers to keep data synchronized with Supabase Auth (`auth.users`).

### 1. Profiles (`public.profiles`)
- **Fields:** `id` (references `auth.users`), `first_name`, `last_name`, `bio`, `mobile_number`, `avatar_url`.
- **Automation:** A `SECURITY DEFINER` trigger (`on_auth_user_created`) automatically creates a profile row when a new user signs up. User metadata from the signup form is instantly synced here.

### 2. Role-Based Access Control (`public.user_roles`)
- **Fields:** `id`, `user_id`, `role` (enum: `admin`, `user`).
- **Automation:** A trigger auto-assigns the `user` role on signup. Another trigger (`sync_role_to_app_metadata`) injects the user's role directly into their JWT (JSON Web Token) under `app_metadata.role`. 
- **Benefit:** You do not need to query the database to check a user's role on the frontend; simply check the JWT claims via `supabase.auth.getUser()`.

### 3. Storage (`avatars`)
- A public Supabase Storage bucket. RLS policies ensure users can only upload/update their own avatars using their `auth.uid()`.

---

## 🎨 UI & Styling Conventions

- **Tailwind Variables:** Do not use hardcoded hex colors. Use the CSS variables defined in `app/globals.css` (e.g., `bg-background`, `text-primary`, `border-border`).
- **Glassmorphism:** Use the `.glass` utility class for sleek, blurred, semi-transparent card backgrounds.
- **Client vs Server:** Default to Server Components. Only add `"use client"` when hooks (`useState`, `useRouter`) or browser events (`onClick`) are strictly required.

---

## 🚀 Quickstart Guide

### 1. Environment Setup
Create `.env.local` inside the `starter-kit` directory:
```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
```

### 2. Database Initialization
Use the Supabase CLI to start the local database and apply all migrations automatically:
```bash
cd starter-kit
npx supabase start
```

### 3. Run the Development Server
```bash
npm install
npm run dev
```

---

## 🤖 Guidelines for AI Agents Extending this Kit

When tasked with adding new features, follow this workflow:

1. **Database First:** If the feature requires data storage, create a new sequential migration file in `supabase/migrations/` (e.g., `20260707XXXXXX_feature_name.sql`). Define the tables and strict Row-Level Security (RLS) policies immediately.
2. **Types Generation:** Run `npm run generate-types` to update `types/supabase.ts`.
3. **Data Fetching:** Fetch data in Server Components (`page.tsx`) using the server Supabase client (`createClient()` from `lib/supabase/server`). Pass the data down as props.
4. **Mutations:** Put mutation logic in Server Actions (`app/actions/`) and validate inputs aggressively using Zod.
5. **UI Construction:** Build modular components in `components/`. Reuse existing `components/ui/` primitives.

Keep it strict, keep it secure, and prioritize performance.