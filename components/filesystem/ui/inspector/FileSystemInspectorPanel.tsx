"use client";

import React, { useMemo, useState } from "react";
import { useFileSystem } from "../../context/FileSystemProvider";
import { useNavigateToFolder } from "../../useNavigateToFolder";
import { buildNodeDisplayPath, countDirContents } from "../../utils";
import NameFsItemModal, { type NameModalMode } from "../NameFsItemModal";
import DeleteFsItemConfirmModal from "./DeleteFsItemConfirmModal";
import InspectorActionBar from "./InspectorActionBar";
import InspectorEmptyState from "./InspectorEmptyState";
import InspectorFileSection from "./InspectorFileSection";
import InspectorItemHeader from "./InspectorItemHeader";
import InspectorMetadataSection from "./InspectorMetadataSection";
import InspectorPanelHeader from "./InspectorPanelHeader";
import { isFsFileNode } from "./nodeGuards";

export default function FileSystemInspectorPanel() {
  const { state, dispatch } = useFileSystem();
  const navigateToFolder = useNavigateToFolder();
  const [nameModal, setNameModal] = useState<NameModalMode | null>(null);
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

  const handleOpen = () => {
    if (!selected) return;
    if (selected.type === "dir") {
      navigateToFolder(selected.id);
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
                onOpen={handleOpen}
                onRename={() =>
                  setNameModal({ action: "rename", nodeId: selected.id })
                }
                onDelete={() => setDeleteId(selected.id)}
              />
            </div>
          )}
        </div>
      </aside>

      <NameFsItemModal
        open={nameModal !== null}
        mode={nameModal ?? { action: "create", kind: "folder" }}
        onClose={() => setNameModal(null)}
      />
      <DeleteFsItemConfirmModal
        open={deleteId !== null}
        nodeId={deleteId}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
}
