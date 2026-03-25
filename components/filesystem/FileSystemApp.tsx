"use client";

import { FileSystemProvider } from "./context/FileSystemProvider";
import FileSystemInspectorPanel from "./ui/inspector";
import FileSystemShell from "./ui/FileSystemShell";

export default function FileSystemApp() {
  return (
    <FileSystemProvider>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="min-h-0 min-w-0 flex-1 overflow-auto">
          <FileSystemShell />
        </div>
        <FileSystemInspectorPanel />
      </div>
    </FileSystemProvider>
  );
}
