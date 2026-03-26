"use client";

import React, { useCallback, useState } from "react";
import type { FSDirNode } from "../../context/fileSystemTypes";
import { useFileSystem } from "../../context/FileSystemProvider";
import { useNavigateToFolder } from "../../useNavigateToFolder";
import { itemCardMeta, itemCardStack, itemCardTitle } from "../fileSystemStyles";
import FileSystemItemCard, { DND_NODE_TYPE } from "./FileSystemItemCard";
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
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes(DND_NODE_TYPE)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes(DND_NODE_TYPE)) {
      e.preventDefault();
      setDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const draggedId = e.dataTransfer.getData(DND_NODE_TYPE);
      if (!draggedId || draggedId === dir.id) return;
      dispatch({
        type: "PASTE_NODES",
        op: "cut",
        nodeIds: [draggedId],
        targetDirId: dir.id,
      });
    },
    [dir.id, dispatch],
  );

  return (
    <div
      className={`rounded-2xl transition ${dragOver ? "ring-2 ring-primary" : ""}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
    </div>
  );
}
