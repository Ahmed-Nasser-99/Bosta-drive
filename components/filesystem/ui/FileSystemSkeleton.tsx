const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-black/5 dark:before:via-white/10 before:to-transparent";

export default function FileSystemSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* Shell Area */}
      <div className="min-h-0 min-w-0 flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          {/* Breadcrumbs & Item Count */}
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className={`h-6 w-48 rounded bg-muted ${shimmer}`}></div>
            <div className={`h-4 w-16 rounded bg-muted ${shimmer}`}></div>
          </div>

          {/* Folders Skeleton */}
          <div className="mt-6">
            <div className={`mb-3 h-4 w-24 rounded bg-muted ${shimmer}`}></div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-[68px] rounded-xl border border-border bg-base ${shimmer}`}
                ></div>
              ))}
            </div>
          </div>

          {/* Files Skeleton */}
          <div className="mt-8">
            <div className={`mb-3 h-4 w-24 rounded bg-muted ${shimmer}`}></div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-[140px] rounded-xl border border-border bg-base ${shimmer}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inspector Panel Skeleton */}
      <div className="hidden w-80 shrink-0 flex-col overflow-y-auto border-t border-border bg-surface lg:flex lg:border-l lg:border-t-0 p-4">
        {/* Preview aspect ratio block */}
        <div
          className={`mb-4 aspect-video w-full rounded-xl border border-border bg-base ${shimmer}`}
        ></div>
        {/* Title */}
        <div className={`mb-6 h-6 w-3/4 rounded bg-muted ${shimmer}`}></div>
        {/* Details tags */}
        <div className="space-y-3">
          <div className={`h-4 w-1/2 rounded bg-muted ${shimmer}`}></div>
          <div className={`h-4 w-full rounded bg-muted ${shimmer}`}></div>
          <div className={`h-4 w-2/3 rounded bg-muted ${shimmer}`}></div>
        </div>
      </div>
    </div>
  );
}
