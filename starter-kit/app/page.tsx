import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Navigation */}
        <nav className="w-full flex justify-center border-b border-border/40 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
          <div className="w-full max-w-5xl flex justify-between items-center h-14 px-5">
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

        {/* Main content */}
        <main className="flex-1 flex flex-col gap-20 max-w-5xl p-5 w-full">
          <Hero />
        </main>

        {/* Footer */}
        <footer className="w-full flex items-center justify-center border-t border-border/40 text-xs text-muted-foreground py-8">
          <p>Built with Next.js & Supabase</p>
        </footer>
      </div>
    </div>
  );
}
