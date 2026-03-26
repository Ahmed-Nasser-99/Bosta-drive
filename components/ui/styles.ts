export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export const dismissIconButton = `flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface ${focusRing}`;

export const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-black/5 dark:before:via-white/10 before:to-transparent";
