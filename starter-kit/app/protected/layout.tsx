import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AppSidebar, MobileNav } from "@/components/app-sidebar";
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
            <MobileNav />
            <Link
              href="/"
              className="text-sm font-bold tracking-tight text-foreground transition-colors hover:text-primary"
            >
              Regle
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Suspense>
              <AuthButton />
            </Suspense>
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
