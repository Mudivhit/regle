"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings, User, Menu, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const baseNavigation = [
  { name: "Dashboard", href: "/protected", icon: LayoutDashboard },
  { name: "Profile", href: "/protected/profile", icon: User },
  { name: "Settings", href: "/protected/settings", icon: Settings },
];

function NavItems({ isMobile, isAdmin }: { isMobile?: boolean; isAdmin?: boolean }) {
  const pathname = usePathname();
  
  const navigation = [...baseNavigation];
  if (isAdmin) {
    navigation.push({ name: "Admin Panel", href: "/admin", icon: ShieldAlert });
  }

  return (
    <>
      {navigation.map((item) => {
        const isActive = item.href === "/protected" 
          ? pathname === item.href 
          : pathname.startsWith(item.href);
        
        const linkProps = {
          href: item.href,
          "aria-current": isActive ? ("page" as const) : undefined,
          className: cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )
        };

        const content = (
          <>
            <item.icon
              className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}
              aria-hidden="true"
            />
            {item.name}
          </>
        );

        if (isMobile) {
          return (
            <SheetClose asChild key={item.name}>
              <Link {...linkProps}>{content}</Link>
            </SheetClose>
          );
        }

        return (
          <Link key={item.name} {...linkProps}>{content}</Link>
        );
      })}
    </>
  );
}

export function AppSidebar({ isAdmin }: { isAdmin?: boolean }) {
  return (
    <div className="flex w-64 flex-col border-r border-border/40 bg-background/50 backdrop-blur-md hidden md:flex sticky top-14 h-[calc(100vh-3.5rem)]">
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="flex-1 space-y-1">
          <NavItems isAdmin={isAdmin} />
        </nav>
      </div>
    </div>
  );
}

export function MobileNav({ isAdmin }: { isAdmin?: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 pt-10">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="flex flex-col space-y-1">
          <NavItems isMobile isAdmin={isAdmin} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
