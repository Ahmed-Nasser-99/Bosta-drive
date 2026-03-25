"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ContextMenuTarget =
  | { kind: "background" }
  | { kind: "item"; nodeId: string };

export type ContextMenuState = {
  open: boolean;
  x: number;
  y: number;
  target: ContextMenuTarget;
};

const CLOSED: ContextMenuState = {
  open: false,
  x: 0,
  y: 0,
  target: { kind: "background" },
};

export function useContextMenu() {
  const [menu, setMenu] = useState<ContextMenuState>(CLOSED);
  const popupRef = useRef<HTMLUListElement | null>(null);

  const openMenu = useCallback(
    (e: React.MouseEvent, target: ContextMenuTarget) => {
      e.preventDefault();
      e.stopPropagation();
      setMenu({ open: true, x: e.clientX, y: e.clientY, target });
    },
    []
  );

  const closeMenu = useCallback(() => setMenu(CLOSED), []);

  useEffect(() => {
    if (!menu.open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (popupRef.current?.contains(e.target as Node)) return;
      closeMenu();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    const onScroll = () => closeMenu();

    window.addEventListener("mousedown", onPointerDown, true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("mousedown", onPointerDown, true);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [menu.open, closeMenu]);

  return { menu, openMenu, closeMenu, popupRef };
}
