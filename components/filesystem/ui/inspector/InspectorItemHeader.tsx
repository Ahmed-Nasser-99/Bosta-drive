"use client";

import type { FSNode } from "../../context/fileSystemTypes";
import FileSystemItemIcon from "../item-card/FileSystemItemIcon";

type Props = { node: FSNode };

export default function InspectorItemHeader({ node }: Props) {
  return (
    <div className="flex items-start gap-3">
      <FileSystemItemIcon kind={node.type === "dir" ? "dir" : "file"} />
      <div className="min-w-0 flex-1 pt-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {node.type === "dir" ? "Folder" : "File"}
        </p>
        <p className="mt-1 wrap-break-word text-base font-semibold leading-snug text-foreground">
          {node.name}
        </p>
      </div>
    </div>
  );
}
