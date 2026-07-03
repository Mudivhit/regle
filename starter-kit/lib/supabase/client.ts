import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  // Client-only: In GitHub Codespaces, the browser cannot reach 127.0.0.1 directly.
  // We rewrite the URL to use the Codespaces port-forwarded hostname instead.
  // Server-side code (server.ts, proxy.ts) intentionally uses the env var as-is
  // because the Next.js server process runs in the same container and can reach localhost.
  if (typeof window !== "undefined" && window.location.hostname.includes(".app.github.dev")) {
    const port = new URL(supabaseUrl).port || "54321";
    supabaseUrl = `https://${window.location.hostname.replace(/\-\d+\./, `-${port}.`)}`;
  }

  return createBrowserClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
