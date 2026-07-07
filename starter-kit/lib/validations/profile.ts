import { z } from "zod";

export const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters").max(50),
  last_name: z.string().min(2, "Last name must be at least 2 characters").max(50),
  mobile_number: z.string().optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  avatar_url: z.string().url().nullable().optional(),
});
