import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  avatar_url: z.string().nullable().optional(),
});
