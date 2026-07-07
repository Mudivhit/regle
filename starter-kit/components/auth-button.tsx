import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { User } from "lucide-react";

export async function AuthButton() {
  const supabase = await createClient();

  // Fetch full user to get user_metadata
  const { data: { user } } = await supabase.auth.getUser();

  const firstName = user?.user_metadata?.first_name || "Dashboard";

  return user ? (
    <div className="flex items-center gap-3">
      <Link 
        href="/protected" 
        className="flex items-center gap-2 text-sm text-muted-foreground hover:bg-muted/50 p-1 pr-3 rounded-full transition-colors"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
          <User className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="hidden sm:inline font-medium text-foreground/80">{firstName}</span>
      </Link>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
