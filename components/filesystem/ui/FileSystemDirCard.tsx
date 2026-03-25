"use client";

import React from "react";
import type { FSDirNode } from "../context/fileSystemTypes";
import { useFileSystem } from "../context/FileSystemProvider";
import FileSystemItemIcon from "./FileSystemItemIcon";
import FileSystemItemCard from "./FileSystemItemCard";
import { itemCardMeta, itemCardStack, itemCardTitle } from "./fileSystemStyles";

export default function FileSystemDirCard({ dir }: { dir: FSDirNode }) {
  const { state, dispatch } = useFileSystem();
  const selected = state.selectedNodeId === dir.id;
  const childCount = state.childrenByDirId[dir.id]?.length ?? 0;
  const itemsLabel =
    childCount === 1 ? "1 item" : `${childCount} items`;

  return (
    <FileSystemItemCard
      selected={selected}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: "SELECT_NODE", nodeId: dir.id });
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        dispatch({ type: "NAVIGATE_TO_DIR", dirId: dir.id });
      }}
    >
      <div className={itemCardStack}>
        <FileSystemItemIcon kind="dir" />
        <div className="w-full min-w-0">
          <div className={itemCardTitle}>{dir.name}</div>
          <div className={itemCardMeta}>{itemsLabel}</div>
        </div>
      </div>
    </FileSystemItemCard>
  );
}
