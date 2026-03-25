"use client";

import React from "react";
import { itemCardClassName } from "../fileSystemStyles";

type Props = {
  nodeId: string;
  selected: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDoubleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
};

export default function FileSystemItemCard({
  nodeId,
  selected,
  onClick,
  onDoubleClick,
  children,
}: Props) {
  return (
    <button
      type="button"
      data-node-id={nodeId}
      className={itemCardClassName(selected)}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </button>
  );
}
