"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "@/components/avatar-upload";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { profileSchema } from "@/lib/validations/profile";

interface ProfileFormProps {
  initialProfile: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialProfile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialProfile?.avatar_url || null);
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<{ full_name?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsPending(true);

    const result = profileSchema.safeParse({ full_name: fullName });
    if (!result.success) {
      setErrors({ full_name: result.error.flatten().fieldErrors.full_name?.[0] });
      setIsPending(false);
      return;
    }

    try {
      const response = await updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl,
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Label>Avatar</Label>
        <AvatarUpload url={avatarUrl} onUpload={(url) => setAvatarUrl(url)} />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
        />
        {errors.full_name && (
          <p className="text-xs text-destructive">{errors.full_name}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
