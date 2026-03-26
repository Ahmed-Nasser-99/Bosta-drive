import { shimmer } from "@/components/ui/styles";
import React from "react";

const InspectorSkeleton = () => {
  return (
    <div className="mt-6">
      <div
        className={`aspect-video w-full rounded-xl border border-border bg-base ${shimmer}`}
      ></div>
    </div>
  );
};

export default InspectorSkeleton;
