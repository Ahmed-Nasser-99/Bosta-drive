"use client";

import React from "react";
import type { FSFileNode } from "../../context/fileSystemTypes";
import { useFileSystem } from "../../context/FileSystemProvider";
import { formatFsItemDate } from "../../utils";
import { itemCardMeta, itemCardStack, itemCardTitle } from "../fileSystemStyles";
import FileSystemItemCard from "./FileSystemItemCard";
import FileSystemItemIcon from "./FileSystemItemIcon";

export default function FileSystemFileCard({ file }: { file: FSFileNode }) {
  const { state, dispatch } = useFileSystem();
  const selected = state.selectedNodeId === file.id;

  return (
    <FileSystemItemCard
      nodeId={file.id}
      selected={selected}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: "SELECT_NODE", nodeId: file.id });
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        dispatch({ type: "OPEN_TEXT_EDITOR", nodeId: file.id });
      }}
    >
      <div className={itemCardStack}>
        <FileSystemItemIcon kind="file" />
        <div className="w-full min-w-0">
          <div className={itemCardTitle}>{file.name}</div>
          <div className={itemCardMeta}>{formatFsItemDate(file.modifiedAt)}</div>
        </div>
      </div>
    </FileSystemItemCard>
  );
}
