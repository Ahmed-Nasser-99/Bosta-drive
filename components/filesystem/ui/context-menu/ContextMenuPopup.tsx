"use client";

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

export default function ContextMenuPopup({
  menu,
  items,
  popupRef,
  onClose,
}: Props) {
  if (!menu.open || items.length === 0) return null;

  return (
    <ul
      ref={popupRef}
      className="fixed z-50 min-w-[180px] overflow-hidden rounded-xl border border-border bg-surface-2 py-1 shadow-lg shadow-black/10 dark:shadow-black/40"
      role="menu"
      style={{ left: menu.x, top: menu.y }}
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
