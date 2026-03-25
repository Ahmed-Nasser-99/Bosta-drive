"use client";

import FolderIcon from "../../icons/FolderIcon";
import FileIcon from "../../icons/FileIcon";

export default function FileSystemItemIcon({ kind }: { kind: "dir" | "file" }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bosta-red-50 text-bosta-red-500">
      {kind === "dir" ? <FolderIcon className="h-5 w-5" /> : <FileIcon className="h-5 w-5" />}
    </div>
  );
}
