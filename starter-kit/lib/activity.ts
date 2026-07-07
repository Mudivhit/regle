import { createClient } from "@/lib/supabase/server";

export async function logActivity(action: string, details?: Record<string, any>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    await supabase.from("user_activity").insert({
      user_id: user.id,
      action,
      details: details || {},
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
