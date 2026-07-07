"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { profileSchema } from "@/lib/validations/profile";

export async function updateProfile(data: z.infer<typeof profileSchema>) {
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
    .upsert({
      id: userData.user.id,
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      mobile_number: parsed.data.mobile_number,
      bio: parsed.data.bio,
      avatar_url: parsed.data.avatar_url,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/protected/profile");
  return { success: true };
}
