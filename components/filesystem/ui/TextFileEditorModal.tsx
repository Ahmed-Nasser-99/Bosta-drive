"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFileSystem } from "../context/FileSystemProvider";
import type { FileSystemAction, FSFileNode } from "../context/fileSystemTypes";
import XIcon from "../../icons/XIcon";
import { dismissIconButton } from "@/components/ui/styles";
import { multilineInput, primaryButton, secondaryButton } from "./fileSystemStyles";

function EditorBody({
  fileNode,
  dispatch,
}: {
  fileNode: FSFileNode;
  dispatch: React.Dispatch<FileSystemAction>;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [draft, setDraft] = useState(fileNode.content);

  useEffect(() => {
    const t = window.setTimeout(() => textareaRef.current?.focus(), 0);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "CLOSE_TEXT_EDITOR" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dispatch]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          dispatch({ type: "CLOSE_TEXT_EDITOR" });
        }
      }}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface-2"
        role="dialog"
        aria-modal="true"
        aria-label={`Editing ${fileNode.name}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0 text-sm font-semibold text-foreground">
            {fileNode.name}
          </div>
          <button
            type="button"
            className={dismissIconButton}
            onClick={() => dispatch({ type: "CLOSE_TEXT_EDITOR" })}
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-3">
          <textarea
            ref={textareaRef}
            className={multilineInput}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-4 py-3">
          <button
            type="button"
            className={secondaryButton}
            onClick={() => dispatch({ type: "CLOSE_TEXT_EDITOR" })}
          >
            Cancel
          </button>
          <button
            type="button"
            className={primaryButton}
            onClick={() => {
              dispatch({
                type: "SAVE_TEXT_FILE",
                nodeId: fileNode.id,
                content: draft,
              });
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TextFileEditorModal() {
  const { state, dispatch } = useFileSystem();

  const fileNode = useMemo(() => {
    const id = state.editor.nodeId;
    if (!state.editor.open || !id) return null;
    const node = state.nodesById[id];
    if (!node || node.type !== "file") return null;
    return node as FSFileNode;
  }, [state.editor.nodeId, state.editor.open, state.nodesById]);

  if (!state.editor.open || !fileNode) return null;

  return <EditorBody key={fileNode.id} fileNode={fileNode} dispatch={dispatch} />;
}
