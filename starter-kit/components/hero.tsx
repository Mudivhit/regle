export function Hero() {
  return (
    <div className="flex flex-col gap-8 items-center py-20 px-4">
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-primary">
          Starter Kit
        </h1>
        <p className="text-lg text-muted-foreground mx-auto max-w-[600px]">
          The fastest way to build robust, scalable applications with a modern stack. 
          Get started by editing this page.
        </p>
      </div>
      <div className="w-full max-w-xl p-[1px] bg-gradient-to-r from-transparent via-border to-transparent my-8" />
    </div>
  );
}
