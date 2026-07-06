import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 auth-gradient-bg">
      <div className="relative z-10 w-full max-w-sm animate-slide-up">
        <Card className="glass glow border-white/10 dark:border-white/[0.06]">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              You&apos;re all set!
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Check your email to confirm
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent a confirmation link to your email. Please check
              your inbox and click the link to activate your account.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                ← Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
