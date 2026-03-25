"use client";

import React from "react";
import type { FSDirNode } from "../context/fileSystemTypes";
import { useFileSystem } from "../context/FileSystemProvider";
import { breadcrumbNavButton } from "./fileSystemStyles";

export default function FileSystemBreadcrumb({ path }: { path: FSDirNode[] }) {
  const { dispatch } = useFileSystem();

  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      {path.map((node, idx) => (
        <React.Fragment key={node.id}>
          {idx > 0 ? <span aria-hidden="true">›</span> : null}
          <button
            type="button"
            className={breadcrumbNavButton}
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "NAVIGATE_TO_DIR", dirId: node.id });
            }}
          >
            {node.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
