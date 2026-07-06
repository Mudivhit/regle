import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function ProfileContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <ProfileForm initialProfile={profile} />;
}

export default function ProfilePage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your public profile information.</p>
      </div>
      
      <Card className="glass border-white/10 dark:border-white/[0.06]">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>This information will be displayed publicly.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
            <ProfileContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
