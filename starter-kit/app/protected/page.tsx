import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon, Shield, Code2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return JSON.stringify(data.claims, null, 2);
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 animate-fade-in">
      {/* Info banner */}
      <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/10 p-4 text-sm text-foreground/80">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Shield className="h-4 w-4 text-primary" />
        </div>
        <p>
          This is a protected page — only authenticated users can access it.
        </p>
      </div>

      {/* User details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Code2 className="h-5 w-5 text-primary" />
            Your user details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono p-4 rounded-lg bg-muted/50 border border-border/50 max-h-48 overflow-auto">
            <Suspense fallback={<span className="text-muted-foreground">Loading…</span>}>
              <UserDetails />
            </Suspense>
          </pre>
        </CardContent>
      </Card>

      {/* Next steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <InfoIcon className="h-5 w-5 text-primary" />
            Next steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
              <span>Create a Supabase table and configure Row Level Security policies.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
              <span>Fetch data from your table using the Supabase client.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
              <span>Build your app&apos;s features on top of Supabase Auth and Database.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
