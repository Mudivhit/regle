import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p className="text-sm text-muted-foreground text-center">
          Error code: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{params.error}</code>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground text-center">
          An unspecified error occurred. Please try again.
        </p>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 auth-gradient-bg">
      <div className="relative z-10 w-full max-w-sm animate-slide-up">
        <Card className="glass glow border-white/10 dark:border-white/[0.06]">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Suspense>
              <ErrorContent searchParams={searchParams} />
            </Suspense>
            <div className="mt-6 text-center">
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
