"use client";

import FolderRouteSync from "./FolderRouteSync";
import FileSystemShell from "./ui/FileSystemShell";
import FileSystemSkeleton from "./ui/FileSystemSkeleton";
import { useFileSystem } from "./context/FileSystemProvider";

function FileSystemApp() {
  const { dispatch, hydrated } = useFileSystem();

  if (!hydrated) return <FileSystemSkeleton />;

  return (
    <div
      className="min-h-0 flex-1 overflow-auto"
      onClick={() => dispatch({ type: "SELECT_NODE", nodeId: null })}
    >
      <FolderRouteSync />
      <FileSystemShell />
    </div>
  );
}

export default FileSystemApp;
