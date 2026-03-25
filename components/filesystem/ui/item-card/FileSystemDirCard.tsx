"use client";

import React from "react";
import type { FSDirNode } from "../../context/fileSystemTypes";
import { useFileSystem } from "../../context/FileSystemProvider";
import { useNavigateToFolder } from "../../useNavigateToFolder";
import {
  itemCardMeta,
  itemCardStack,
  itemCardTitle,
} from "../fileSystemStyles";
import FileSystemItemCard from "./FileSystemItemCard";
import FileSystemItemIcon from "./FileSystemItemIcon";

type Props = {
  dir: FSDirNode;
  onMenuOpen: (nodeId: string, anchor: HTMLElement) => void;
};

export default function FileSystemDirCard({ dir, onMenuOpen }: Props) {
  const { state, dispatch } = useFileSystem();
  const navigateToFolder = useNavigateToFolder();
  const selected = state.selectedNodeId === dir.id;
  const childCount = state.childrenByDirId[dir.id]?.length ?? 0;
  const itemsLabel = childCount === 1 ? "1 item" : `${childCount} items`;

  return (
    <FileSystemItemCard
      nodeId={dir.id}
      selected={selected}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: "SELECT_NODE", nodeId: dir.id });
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        navigateToFolder(dir.id);
      }}
      onMenuOpen={onMenuOpen}
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
