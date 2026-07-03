# Next.js SaaS Starter Kit

This is a modern, minimal SaaS starter kit built with Next.js, Tailwind CSS, and Supabase.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker (required if you want to run Supabase locally)

## Getting Started

### 1. Configure Environment Variables

Create a `.env.local` file in the root of the project by copying the example file:

```bash
cp .env.example .env.local
```

*(Note: We've already added placeholder local credentials into `.env.local` for you).*

### 2. Running the Frontend (UI Only)

If you only want to view and edit the frontend components without a working database:

1. Ensure `.env.local` has placeholder values for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (these are required to prevent the app from crashing on startup).
2. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Database-dependent actions (like login) will fail, but the UI will render properly.

### 3. Running with Local Database (Supabase)

To run the full stack including the local database and authentication, you need Docker running on your machine.

1. Start the local Supabase environment:

```bash
npx supabase start
```
*(Note: This spins up about 13 heavy Docker containers. Ensure your system has sufficient RAM/CPU resources (e.g., at least 4 Cores and 8GB RAM), otherwise the startup health checks may time out, especially in cloud VM environments).*

2. Once Supabase has started, it will output your local `API URL` and `anon key`. Verify that your `.env.local` matches these values (or run `npx supabase status` to fetch them again).
3. Start the Next.js development server:

```bash
npm run dev
```

### Stopping Services

To stop the Next.js frontend server, press `Ctrl + C` in the terminal.

To cleanly stop the local Supabase Docker containers, run:

```bash
npx supabase stop
```

## Features
- **Clean SaaS UI:** Pre-configured with a modern, minimalistic design system.
- **Authentication:** Pre-built login, signup, and password reset flows via Supabase Auth.
- **Database:** Ready to connect to Postgres via Supabase.
