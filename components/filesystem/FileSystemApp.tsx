"use client";

import { useCallback, useRef } from "react";
import FolderRouteSync from "./FolderRouteSync";
import FileSystemShell from "./ui/FileSystemShell";
import FileSystemSkeleton from "./ui/FileSystemSkeleton";
import { useFileSystem } from "./context/FileSystemProvider";
import { useContextMenu } from "./ui/context-menu";

const LONG_PRESS_MS = 500;
const LONG_PRESS_MOVE_TOLERANCE = 10;

function FileSystemApp() {
  const { dispatch, hydrated } = useFileSystem();
  const { menu, openMenuAt, closeMenu, popupRef } = useContextMenu();

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const longPressFiredRef = useRef(false);
  const touchStartRef = useRef<{
    x: number;
    y: number;
    target: HTMLElement;
  } | null>(null);

  const resolveAndOpen = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const nodeEl = el.closest<HTMLElement>("[data-node-id]");
      if (nodeEl) {
        const nodeId = nodeEl.getAttribute("data-node-id")!;
        dispatch({ type: "SELECT_NODE", nodeId });
        openMenuAt(x, y, { kind: "item", nodeId });
      } else {
        openMenuAt(x, y, { kind: "background" });
      }
    },
    [dispatch, openMenuAt],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      clearTimeout(longPressTimerRef.current);
      touchStartRef.current = null;
      resolveAndOpen(e.target as HTMLElement, e.clientX, e.clientY);
    },
    [resolveAndOpen],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const target = e.target as HTMLElement;
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, target };
      longPressFiredRef.current = false;

      longPressTimerRef.current = setTimeout(() => {
        if (!touchStartRef.current) return;
        longPressFiredRef.current = true;
        const { x, y, target: el } = touchStartRef.current;
        resolveAndOpen(el, x, y);
      }, LONG_PRESS_MS);
    },
    [resolveAndOpen],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    if (
      Math.abs(dx) > LONG_PRESS_MOVE_TOLERANCE ||
      Math.abs(dy) > LONG_PRESS_MOVE_TOLERANCE
    ) {
      clearTimeout(longPressTimerRef.current);
      touchStartRef.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    clearTimeout(longPressTimerRef.current);
    touchStartRef.current = null;
    if (longPressFiredRef.current) {
      e.preventDefault();
      longPressFiredRef.current = false;
    }
  }, []);

  if (!hydrated) return <FileSystemSkeleton />;

  return (
    <div
      className="min-h-0 flex-1 overflow-auto"
      onClick={() => dispatch({ type: "SELECT_NODE", nodeId: null })}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <FolderRouteSync />
      <FileSystemShell
        menu={menu}
        openMenuAt={openMenuAt}
        closeMenu={closeMenu}
        popupRef={popupRef}
      />
    </div>
  );
}

export default FileSystemApp;
