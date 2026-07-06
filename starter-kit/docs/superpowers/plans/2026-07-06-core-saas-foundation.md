# Core SaaS Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish end-to-end type safety, form validation, and a robust application shell layout for the protected dashboard.

**Architecture:** 
- Use Supabase CLI to generate TypeScript definitions for the database.
- Use Zod for schema validation on all authentication forms to ensure robust data entry.
- Implement a responsive Sidebar and Header layout for the `/protected` routes to serve as the main application shell.

**Tech Stack:** Next.js, Supabase, Tailwind CSS, Zod, Lucide React

## Global Constraints

- Must adhere to the existing neutral design system (slate/white, glassmorphism utilities).
- UI components must be accessible and responsive.
- All forms must display validation errors inline below the inputs.
- No changes to the billing/subscription flow in this phase.

---

### Task 1: Generate Supabase Database Types

**Files:**
- Create: `types/supabase.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: Existing Supabase project configuration.
- Produces: `Database` type export in `types/supabase.ts` for use in the client/server Supabase clients.

- [ ] **Step 1: Install Supabase CLI as dev dependency**

```bash
npm install -D supabase
```

- [ ] **Step 2: Add type generation script to package.json**

Modify `package.json:3-8` to include:
```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "generate-types": "npx supabase gen types typescript --project-id \"$SUPABASE_PROJECT_ID\" --schema public > types/supabase.ts"
  },
```

- [ ] **Step 3: Create types directory and placeholder file**

```bash
mkdir -p types
echo 'export type Database = any;' > types/supabase.ts
```
*(Note: We create a placeholder because generating actual types requires the user's specific Supabase Project ID which we don't have hardcoded. The placeholder allows the build to succeed while providing the structure).*

- [ ] **Step 4: Update Supabase clients to use the Database type**

Modify `lib/supabase/client.ts` to import and use the `Database` type:
```typescript
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
```

Modify `lib/supabase/server.ts` to import and use the `Database` type:
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
```

- [ ] **Step 5: Run tests/build to verify passing**

Run: `npm run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json types/supabase.ts lib/supabase/client.ts lib/supabase/server.ts
git commit -m "chore: setup supabase database types"
```

---

### Task 2: Implement Zod Validation for Login Form

**Files:**
- Modify: `components/login-form.tsx`
- Modify: `package.json`

**Interfaces:**
- Consumes: User input from Login Form.
- Produces: Validated email/password before passing to Supabase.

- [ ] **Step 1: Install zod**

```bash
npm install zod
```

- [ ] **Step 2: Add Zod schema to login-form.tsx**

Add to the top of `components/login-form.tsx` (after imports):
```typescript
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
```

- [ ] **Step 3: Update login-form.tsx to use Zod validation**

Modify the `handleLogin` function to validate inputs:
```typescript
  const [validationErrors, setValidationErrors] = useState<{email?: string, password?: string}>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setValidationErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });
      // ... rest of the existing try/catch
```

- [ ] **Step 4: Display validation errors in the UI**

Modify the email input area to show `validationErrors.email` if it exists.
Modify the password input area to show `validationErrors.password` if it exists.

```tsx
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    id="email"
                    // ... existing props
                  />
                </div>
                {validationErrors.email && <p className="text-xs text-destructive">{validationErrors.email}</p>}
              </div>
```
*(Do the same for password)*

- [ ] **Step 5: Run tests/build to verify passing**

Run: `npm run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json components/login-form.tsx
git commit -m "feat: add zod validation to login form"
```

---

### Task 3: Implement Zod Validation for Signup Form

**Files:**
- Modify: `components/sign-up-form.tsx`

**Interfaces:**
- Consumes: User input from Signup Form.
- Produces: Validated form data.

- [ ] **Step 1: Add Zod schema to sign-up-form.tsx**

Add to the top:
```typescript
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  repeatPassword: z.string(),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords do not match",
  path: ["repeatPassword"],
});
```

- [ ] **Step 2: Update sign-up-form.tsx to use Zod validation**

Add `validationErrors` state and update `handleSignUp`:
```typescript
  const [validationErrors, setValidationErrors] = useState<{email?: string, password?: string, repeatPassword?: string}>({});

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    const result = signUpSchema.safeParse({ email, password, repeatPassword });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setValidationErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        repeatPassword: fieldErrors.repeatPassword?.[0],
      });
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        // ... rest
```

- [ ] **Step 3: Display validation errors in the UI**

Add error `<p className="text-xs text-destructive">` tags below `email`, `password`, and `repeatPassword` inputs just like in Task 2.

- [ ] **Step 4: Run tests/build to verify passing**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/sign-up-form.tsx
git commit -m "feat: add zod validation to signup form"
```

---

### Task 4: Create App Shell (Sidebar & Layout) for Protected Routes

**Files:**
- Create: `components/app-sidebar.tsx`
- Modify: `app/protected/layout.tsx`

**Interfaces:**
- Consumes: `app/protected/layout.tsx` to wrap content.

- [ ] **Step 1: Create the Sidebar Component**

Create `components/app-sidebar.tsx`:
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings, User } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/protected", icon: LayoutDashboard },
  { name: "Profile", href: "/protected/profile", icon: User },
  { name: "Settings", href: "/protected/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border/40 bg-background/50 backdrop-blur-md hidden md:flex">
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update Protected Layout to use Sidebar**

Modify `app/protected/layout.tsx` to include the sidebar in a flex layout.
```tsx
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AppSidebar } from "@/components/app-sidebar";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="w-full flex justify-center border-b border-border/40 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="w-full max-w-7xl flex justify-between items-center h-14 px-5">
          <div className="flex gap-5 items-center">
            <Link
              href="/"
              className="text-sm font-bold tracking-tight text-foreground transition-colors hover:text-primary"
            >
              Regle
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </div>
      </nav>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <AppSidebar />
        <main className="flex-1 flex flex-col p-6 lg:p-8 w-full overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run tests/build to verify passing**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/app-sidebar.tsx app/protected/layout.tsx
git commit -m "feat: add app shell sidebar layout for protected routes"
```

---

### Task 5: Create Placeholder Profile & Settings Pages

**Files:**
- Create: `app/protected/profile/page.tsx`
- Create: `app/protected/settings/page.tsx`

**Interfaces:**
- Produces: New routes accessible from the sidebar.

- [ ] **Step 1: Create Profile Page**

```tsx
// app/protected/profile/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your public profile information.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>This information will be displayed publicly.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Profile editing functionality coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Create Settings Page**

```tsx
// app/protected/settings/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Preferences</CardTitle>
          <CardDescription>Update your email, password, and notification settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Settings functionality coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Run tests/build to verify passing**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/protected/profile/page.tsx app/protected/settings/page.tsx
git commit -m "feat: add profile and settings placeholder pages"
```
