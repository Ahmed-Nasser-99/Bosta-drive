"use client";

import React from "react";
import type { FSDirNode } from "../context/fileSystemTypes";
import { useNavigateToFolder } from "../useNavigateToFolder";
import { breadcrumbNavButton } from "./fileSystemStyles";

export default function FileSystemBreadcrumb({ path }: { path: FSDirNode[] }) {
  const navigateToFolder = useNavigateToFolder();

  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      {path.map((node, idx) => (
        <React.Fragment key={node.id}>
          {idx > 0 ? <span aria-hidden="true">›</span> : null}
          <button
            type="button"
            className={
              breadcrumbNavButton +
              " " +
              (idx === path.length - 1 ? "font-semibold text-foreground" : "")
            }
            onClick={(e) => {
              e.stopPropagation();
              navigateToFolder(node.id);
            }}
          >
            {node.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
