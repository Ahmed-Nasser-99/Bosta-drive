"use client";

import FolderRouteSync from "./FolderRouteSync";
import FileSystemShell from "./ui/FileSystemShell";
import FileSystemSkeleton from "./ui/FileSystemSkeleton";
import { useFileSystem } from "./context/FileSystemProvider";

function FileSystemApp() {
  const { dispatch, hydrated } = useFileSystem();

  if (!hydrated) return <FileSystemSkeleton />;

  return (
    <>
      <FolderRouteSync />
      <div
        className="flex min-h-0 flex-1 flex-col lg:flex-row"
        onClick={() => dispatch({ type: "SELECT_NODE", nodeId: null })}
      >
        <FileSystemShell />
      </div>
    </>
  );
}

export default FileSystemApp;
