"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AvatarUpload } from "@/components/avatar-upload";
import { Loader2 } from "lucide-react";
import { profileSchema } from "@/lib/validations/profile";

interface ProfileFormProps {
  initialProfile: {
    first_name: string | null;
    last_name: string | null;
    mobile_number: string | null;
    bio: string | null;
    avatar_url: string | null;
  } | null;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [firstName, setFirstName] = useState(initialProfile?.first_name || "");
  const [lastName, setLastName] = useState(initialProfile?.last_name || "");
  const [mobileNumber, setMobileNumber] = useState(initialProfile?.mobile_number || "");
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialProfile?.avatar_url || null);
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsPending(true);

    const formData = {
      first_name: firstName,
      last_name: lastName,
      mobile_number: mobileNumber,
      bio: bio,
      avatar_url: avatarUrl,
    };

    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string[]>);
      setIsPending(false);
      return;
    }

    try {
      const response = await updateProfile(formData);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
          />
          {errors.first_name && (
            <p className="text-xs text-destructive">{errors.first_name[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
          />
          {errors.last_name && (
            <p className="text-xs text-destructive">{errors.last_name[0]}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="mobileNumber">Mobile Number</Label>
        <Input
          id="mobileNumber"
          type="tel"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder="+1 (555) 000-0000"
        />
        {errors.mobile_number && (
          <p className="text-xs text-destructive">{errors.mobile_number[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us a little about yourself"
          rows={4}
        />
        {errors.bio && (
          <p className="text-xs text-destructive">{errors.bio[0]}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
