"use client";

import { useFileSystem } from "../../context/FileSystemProvider";
import InspectorContent from "./InspectorContent";
import InspectorPanelHeader from "./InspectorPanelHeader";
import InspectorSkeleton from "./InspectorSkeleton";

export default function FileSystemInspectorPanel() {
  const { hydrated } = useFileSystem();

  return (
    <aside className="hidden w-full shrink-0 flex-col border-t border-border bg-surface-2 lg:flex lg:min-h-0 lg:w-80 lg:border-l lg:border-t-0">
      <InspectorPanelHeader />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {hydrated ? <InspectorContent /> : <InspectorSkeleton />}
      </div>
    </aside>
  );
}
