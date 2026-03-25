"use client";

import React, { useCallback, useRef } from "react";
import EllipsisVerticalIcon from "@/components/icons/EllipsisVerticalIcon";
import { focusRing } from "@/components/ui/styles";
import { itemCardClassName } from "../fileSystemStyles";

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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
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

  return (
    <div className="group/card relative" data-node-id={nodeId}>
      <button
        type="button"
        className={`${itemCardClassName(selected)} w-full`}
        onClick={handleClick}
      >
        {children}
      </button>
      <button
        type="button"
        className={`absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10 ${focusRing} `}
        aria-label="More actions"
        tabIndex={0}
        onClick={handleMenuClick}
      >
        <EllipsisVerticalIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
