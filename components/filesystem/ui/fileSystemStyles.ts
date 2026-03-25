import { focusRing } from "@/components/ui/styles";

const itemCardBase = `rounded-2xl border p-4 text-left shadow-sm transition ${focusRing}`;

const itemCardSelected = "border-primary bg-bosta-red-50";
const itemCardDefault = "border-border bg-surface-2 hover:bg-surface";

export function itemCardClassName(selected: boolean) {
  return `${itemCardBase} ${selected ? itemCardSelected : itemCardDefault}`;
}

export const sectionLabel =
  "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export const breadcrumbNavButton = `rounded-lg px-2 py-1 hover:bg-black/10 dark:hover:bg-white/10 ${focusRing}`;

/** Vertical stack: icon top-left, title + meta below (matches file browser cards). */
export const itemCardStack =
  "flex w-full min-w-0 flex-col items-start gap-2 text-left";

export const itemCardTitle = "truncate font-semibold text-foreground";

export const itemCardMeta = "text-xs text-muted-foreground";

export const multilineInput =
  "min-h-[40vh] w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary";

export const ghostButton =
  "rounded-lg px-2 py-1 text-sm text-muted-foreground hover:bg-surface";

export const secondaryButton =
  "rounded-xl border border-border bg-surface px-4 py-2 text-sm text-foreground hover:bg-surface-2";

export const primaryButton =
  "rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95";

export const dangerButton =
  "rounded-xl bg-bosta-red-700 px-4 py-2 text-sm font-semibold text-white hover:opacity-95";

export const panelIconButton = `inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground transition hover:bg-surface-2 hover:text-foreground disabled:pointer-events-none disabled:opacity-40 ${focusRing}`;

export const textInput =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary";

export const formLabel =
  "mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground";

export const fieldError = "mt-1.5 text-sm text-primary";

export const emptyStateActions =
  "mt-6 flex flex-wrap items-center justify-center gap-3";

export const fabRound =
  "flex shrink-0 items-center justify-center rounded-full shadow-lg transition";

export const subFab = `${fabRound} h-12 w-12 bg-surface-2 text-bosta-red-500 ring-1 ring-border hover:bg-bosta-red-50 dark:hover:bg-bosta-red-50/10 ${focusRing}`;

export const mainFab = `${fabRound} h-14 w-14 bg-primary text-white shadow-lg shadow-primary/25 hover:opacity-95 ${focusRing}`;

export const actionStackBase =
  "flex flex-col items-end gap-2 transition-all duration-200 ease-out";
