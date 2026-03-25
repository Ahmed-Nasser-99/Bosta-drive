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
import { isFsFileNode } from "./nodeGuards";

type Props = {
  /** When provided, only this specific node is shown (no empty state). */
  nodeId?: string | null;
  /** Called after an "Open" / navigate action so the parent can close a modal. */
  onAfterAction?: () => void;
};

export default function InspectorContent({ nodeId, onAfterAction }: Props) {
  const { state, dispatch } = useFileSystem();
  const navigateToFolder = useNavigateToFolder();
  const [nameModal, setNameModal] = useState<NameModalMode | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const selected = useMemo(() => {
    const id = nodeId !== undefined ? nodeId : state.selectedNodeId;
    if (!id) return null;
    return state.nodesById[id] ?? null;
  }, [nodeId, state.selectedNodeId, state.nodesById]);

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
    onAfterAction?.();
  };

  const handleRename = () => {
    if (!selected) return;
    setNameModal({ action: "rename", nodeId: selected.id });
  };

  const handleDelete = () => {
    if (!selected) return;
    setDeleteId(selected.id);
  };

  return (
    <>
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
            onRename={handleRename}
            onDelete={handleDelete}
          />
        </div>
      )}

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
