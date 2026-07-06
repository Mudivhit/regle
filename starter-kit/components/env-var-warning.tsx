import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

export function EnvVarWarning() {
  return (
    <div className="flex gap-3 items-center">
      <Badge variant={"outline"} className="gap-1.5 font-normal border-amber-500/30 text-amber-600 dark:text-amber-400">
        <AlertTriangle className="h-3 w-3" />
        Env vars required
      </Badge>
      <div className="flex gap-2">
        <Button size="sm" variant={"outline"} disabled>
          Sign in
        </Button>
        <Button size="sm" variant={"default"} disabled>
          Sign up
        </Button>
      </div>
    </div>
  );
}
