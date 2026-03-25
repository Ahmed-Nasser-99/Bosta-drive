"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import AddDocumentIcon from "@/components/icons/AddDocumentIcon";
import AddFolderIcon from "@/components/icons/AddFolderIcon";
import PlusIcon from "@/components/icons/PlusIcon";
type CreateFsItemKind = "folder" | "file";
import { actionStackBase, mainFab, subFab } from "./fileSystemStyles";

type Props = {
  onChoose: (kind: CreateFsItemKind) => void;
};

export default function CreateItemFab({ onChoose }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [touchOpen, setTouchOpen] = useState(false);

  const closeTouch = useCallback(() => setTouchOpen(false), []);

  useEffect(() => {
    if (!touchOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closeTouch();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [touchOpen, closeTouch]);

  const openFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChoose("folder");
    closeTouch();
  };

  const openFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChoose("file");
    closeTouch();
  };

  const toggleMain = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) {
      setTouchOpen((o) => !o);
    }
  };

  const actionVisibility = touchOpen
    ? "max-md:pointer-events-auto max-md:translate-y-0 max-md:opacity-100"
    : "max-md:pointer-events-none max-md:translate-y-2 max-md:opacity-0";

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-6 z-40 max-lg:right-6 lg:right-86"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="group pointer-events-auto flex flex-col-reverse items-end gap-3">
        <button
          type="button"
          className={mainFab}
          aria-label={touchOpen ? "Close add menu" : "Add file or folder"}
          aria-expanded={touchOpen}
          aria-haspopup="true"
          onClick={toggleMain}
        >
          <PlusIcon
            className={`h-7 w-7 transition-transform duration-200 ${touchOpen ? "rotate-45 md:rotate-0" : ""}`}
          />
        </button>

        <div
          className={`${actionStackBase} ${actionVisibility} md:pointer-events-none md:translate-y-2 md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100`}
        >
          <button
            type="button"
            className={subFab}
            title="New folder"
            aria-label="New folder"
            onClick={openFolder}
          >
            <AddFolderIcon className="h-6 w-6" />
          </button>
          <button
            type="button"
            className={subFab}
            title="New file"
            aria-label="New file"
            onClick={openFile}
          >
            <AddDocumentIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
