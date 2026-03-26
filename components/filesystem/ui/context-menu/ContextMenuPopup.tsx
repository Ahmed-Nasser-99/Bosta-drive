"use client";

import { useLayoutEffect, useState } from "react";
import type { ContextMenuState } from "./useContextMenu";

export type ContextMenuItem = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  /** Extra classes on the <li>, e.g. "lg:hidden" for mobile-only items. */
  className?: string;
};

type Props = {
  menu: ContextMenuState;
  items: ContextMenuItem[];
  popupRef: React.RefObject<HTMLUListElement | null>;
  onClose: () => void;
};

const MARGIN = 0;

export default function ContextMenuPopup({
  menu,
  items,
  popupRef,
  onClose,
}: Props) {
  const [adjusted, setAdjusted] = useState<{ x: number; y: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    if (!menu.open) {
      setAdjusted(null);
      return;
    }

    const el = popupRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x = menu.x;
    let y = menu.y;

    if (x + rect.width > vw - MARGIN) {
      x = Math.max(MARGIN, x - rect.width);
    }
    if (y + rect.height > vh - MARGIN) {
      y = Math.max(MARGIN, y - rect.height);
    }

    if (x !== menu.x || y !== menu.y) {
      setAdjusted({ x, y });
    }
  }, [menu.open, menu.x, menu.y, popupRef]);

  if (!menu.open || items.length === 0) return null;

  const pos = adjusted ?? { x: menu.x, y: menu.y };

  return (
    <ul
      ref={popupRef}
      className="fixed z-50 min-w-[180px] overflow-hidden rounded-xl border border-border bg-surface-2 py-1 shadow-lg shadow-black/10 dark:shadow-black/40"
      role="menu"
      style={{ left: pos.x, top: pos.y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item) => (
        <li key={item.label} role="none" className={item.className}>
          <button
            type="button"
            role="menuitem"
            className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition hover:bg-surface ${
              item.danger ? "text-bosta-red-500" : "text-foreground"
            }`}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              {item.icon}
            </span>
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
