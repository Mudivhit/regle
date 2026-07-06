import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col gap-8 items-center py-24 px-4 animate-fade-in">
      <div className="space-y-6 text-center max-w-2xl mx-auto">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.1]">
          Regle
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mx-auto max-w-[540px] leading-relaxed">
          Build robust, scalable applications with a modern stack.
          Get started by editing this page.
        </p>
      </div>
      <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-border to-transparent my-4" />
    </div>
  );
}
