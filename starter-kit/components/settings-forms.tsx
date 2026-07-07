"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { updateEmail, updatePassword, updateNotifications } from "@/app/actions/settings";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsForms({ 
  currentEmail, 
  settings 
}: { 
  currentEmail: string; 
  settings: any; 
}) {
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const [marketing, setMarketing] = useState(settings?.marketing_emails ?? true);
  
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    try {
      const res = await updateEmail(email);
      if (res.error) toast.error(res.error);
      else toast.success(res.message);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setIsPasswordLoading(true);
    try {
      const res = await updatePassword(password);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Password updated successfully.");
        setPassword("");
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleMarketingToggle = async (checked: boolean) => {
    setMarketing(checked);
    setIsSettingsLoading(true);
    try {
      const res = await updateNotifications(checked);
      if (res.error) {
        toast.error(res.error);
        setMarketing(!checked);
      } else {
        toast.success("Notification preferences updated.");
      }
    } finally {
      setIsSettingsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Update your email and password.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-3">
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <Button type="submit" disabled={isEmailLoading || email === currentEmail}>
                {isEmailLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
              </Button>
            </div>
          </form>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
            <Label htmlFor="password">New Password</Label>
            <div className="flex gap-3">
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <Button type="submit" disabled={isPasswordLoading || !password}>
                {isPasswordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your email preferences.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="marketing" 
              checked={marketing} 
              onCheckedChange={handleMarketingToggle} 
              disabled={isSettingsLoading}
            />
            <Label htmlFor="marketing" className="font-normal cursor-pointer text-sm">
              Receive marketing and product updates
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="security" 
              checked={true} 
              disabled 
            />
            <Label htmlFor="security" className="font-normal text-muted-foreground text-sm">
              Receive security alerts (required)
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
