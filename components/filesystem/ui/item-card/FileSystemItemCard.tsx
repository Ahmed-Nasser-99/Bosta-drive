"use client";

import React, { useCallback, useRef, useState } from "react";
import EllipsisVerticalIcon from "@/components/icons/EllipsisVerticalIcon";
import { focusRing } from "@/components/ui/styles";
import { itemCardClassName } from "../fileSystemStyles";
import { useFileSystem } from "../../context/FileSystemProvider";

// a custom data type for the drag and drop operation
export const DND_NODE_TYPE = "application/x-bosta-drive-node";

const DOUBLE_TAP_MS = 350;

type Props = {
  nodeId: string;
  selected: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDoubleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMenuOpen: (nodeId: string, anchor: HTMLElement) => void;
  children: React.ReactNode;
};

export default function FileSystemItemCard({
  nodeId,
  selected,
  onClick,
  onDoubleClick,
  onMenuOpen,
  children,
}: Props) {
  const lastTapRef = useRef(0);
  const { clipboard } = useFileSystem();
  const isCut = clipboard?.op === "cut" && clipboard.nodeIds.includes(nodeId);
  const [dragging, setDragging] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isMobile) {
        onDoubleClick?.(e);
        return;
      }

      const now = Date.now();
      if (onDoubleClick && now - lastTapRef.current < DOUBLE_TAP_MS) {
        lastTapRef.current = 0;
        onDoubleClick(e);
      } else {
        lastTapRef.current = now;
        onClick(e);
      }
    },
    [onClick, onDoubleClick],
  );

  const handleMenuClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      onMenuOpen(nodeId, e.currentTarget);
    },
    [nodeId, onMenuOpen],
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData(DND_NODE_TYPE, nodeId);
      e.dataTransfer.effectAllowed = "move";
      setDragging(true);
    },
    [nodeId],
  );

  const handleDragEnd = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <div
      className={`group/card relative transition-opacity${isCut || dragging ? " opacity-50" : ""}`}
      data-node-id={nodeId}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <button
        type="button"
        className={`${itemCardClassName(selected)} w-full`}
        onClick={handleClick}
      >
        {children}
      </button>
      <button
        type="button"
        className={`absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10 ${focusRing}`}
        aria-label="More actions"
        tabIndex={0}
        onClick={handleMenuClick}
      >
        <EllipsisVerticalIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
