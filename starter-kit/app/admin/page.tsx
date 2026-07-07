import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Activity } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ data: profiles }, { data: roles }, { data: activities }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("user_roles").select("*"),
    supabase.from("user_activity").select("*").order("created_at", { ascending: false }).limit(20)
  ]);

  const profilesWithRoles = profiles?.map(profile => ({
    ...profile,
    role: roles?.find(r => r.user_id === profile.id)?.role || "user"
  }));

  return (
    <div className="flex-1 w-full flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage users and oversee system activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass border-white/10 dark:border-white/[0.06]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Platform Users</CardTitle>
                <CardDescription>All registered users in the system.</CardDescription>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profilesWithRoles?.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                      {profile.avatar_url ? (
                        <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {profile.first_name || profile.last_name 
                          ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() 
                          : "Unnamed User"}
                      </p>
                      <p className="text-xs text-muted-foreground">{profile.id}</p>
                    </div>
                  </div>
                  <Badge variant={profile.role === "admin" ? "default" : "secondary"}>
                    {profile.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 dark:border-white/[0.06]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>System-wide action logs.</CardDescription>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities?.map((activity) => (
                <div key={activity.id} className="flex flex-col gap-1 border-l-2 border-primary/30 pl-4 py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm capitalize">{activity.action.replace(/_/g, ' ')}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground/80">
                      User {activity.user_id}
                    </span>
                  </p>
                </div>
              ))}
              {(!activities || activities.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
