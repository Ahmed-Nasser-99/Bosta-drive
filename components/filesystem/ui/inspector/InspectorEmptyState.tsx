"use client";

export default function InspectorEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <div className="rounded-2xl border border-dashed border-border bg-surface px-4 py-8 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Nothing selected</p>
        <p className="mt-2 max-w-56">
          Click a file or folder in the main area to see its properties,
          preview, and actions here.
        </p>
      </div>
    </div>
  );
}
