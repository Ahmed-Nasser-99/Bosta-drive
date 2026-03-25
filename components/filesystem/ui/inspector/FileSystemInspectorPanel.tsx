"use client";

import React, { useMemo, useState } from "react";
import { useFileSystem } from "../../context/FileSystemProvider";
import { buildNodeDisplayPath, countDirContents } from "../../utils";
import DeleteFsItemConfirmModal from "./DeleteFsItemConfirmModal";
import InspectorActionBar from "./InspectorActionBar";
import InspectorEmptyState from "./InspectorEmptyState";
import InspectorFileSection from "./InspectorFileSection";
import InspectorItemHeader from "./InspectorItemHeader";
import InspectorMetadataSection from "./InspectorMetadataSection";
import InspectorPanelHeader from "./InspectorPanelHeader";
import { isFsFileNode } from "./nodeGuards";
import RenameFsItemModal from "./RenameFsItemModal";

export default function FileSystemInspectorPanel() {
  const { state, dispatch } = useFileSystem();
  const [renameId, setRenameId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const selected = useMemo(() => {
    const id = state.selectedNodeId;
    if (!id) return null;
    return state.nodesById[id] ?? null;
  }, [state.selectedNodeId, state.nodesById]);

  const displayPath = useMemo(() => {
    if (!selected) return "";
    return buildNodeDisplayPath(state.nodesById, selected.id);
  }, [selected, state.nodesById]);

  const dirCounts = useMemo(() => {
    if (!selected || selected.type !== "dir") return null;
    return countDirContents(state, selected.id);
  }, [selected, state]);

  const canMutate =
    selected && selected.id !== state.rootId && selected.parentId !== null;

  const handleOpen = () => {
    if (!selected) return;
    if (selected.type === "dir") {
      dispatch({ type: "NAVIGATE_TO_DIR", dirId: selected.id });
    } else {
      dispatch({ type: "OPEN_TEXT_EDITOR", nodeId: selected.id });
    }
  };

  return (
    <>
      <aside className="flex w-full shrink-0 flex-col border-t border-border bg-surface-2 lg:min-h-0 lg:w-80 lg:border-l lg:border-t-0">
        <InspectorPanelHeader />

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {!selected ? (
            <InspectorEmptyState />
          ) : (
            <div className="flex flex-col gap-5">
              <InspectorItemHeader node={selected} />

              <div className="h-px bg-border" aria-hidden />

              <InspectorMetadataSection
                node={selected}
                displayPath={displayPath}
                dirCounts={dirCounts}
              />

              {isFsFileNode(selected) ? (
                <InspectorFileSection file={selected} />
              ) : null}

              <div className="h-px bg-border" aria-hidden />

              <InspectorActionBar
                node={selected}
                canMutate={Boolean(canMutate)}
                onOpen={handleOpen}
                onRename={() => setRenameId(selected.id)}
                onDelete={() => setDeleteId(selected.id)}
              />
            </div>
          )}
        </div>
      </aside>

      <RenameFsItemModal
        open={renameId !== null}
        nodeId={renameId}
        onClose={() => setRenameId(null)}
      />
      <DeleteFsItemConfirmModal
        open={deleteId !== null}
        nodeId={deleteId}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
}
