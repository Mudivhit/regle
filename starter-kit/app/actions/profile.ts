"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  avatar_url: z.string().nullable().optional(),
});

export async function updateProfile(data: { full_name: string; avatar_url: string | null }) {
  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Invalid data provided";
    return { error: errorMessage };
  }

  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      avatar_url: parsed.data.avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userData.user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/protected/profile");
  return { success: true };
}
