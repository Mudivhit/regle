"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { full_name: string; avatar_url: string | null }) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userData.user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/protected/profile");
  return { success: true };
}
