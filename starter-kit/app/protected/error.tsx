"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ProtectedErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">An unexpected error occurred in the dashboard.</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
