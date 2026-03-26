import { shimmer } from "@/components/ui/styles";

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
    </div>
  );
}
