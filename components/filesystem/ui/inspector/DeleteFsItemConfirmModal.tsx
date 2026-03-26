"use client";

import { useEffect, useId } from "react";
import Modal from "@/components/ui/Modal";
import { useFileSystem } from "../../context/FileSystemProvider";
import { collectSubtreeIds } from "../../utils";
import { dangerButton, secondaryButton } from "../fileSystemStyles";

type Props = {
  open: boolean;
  nodeId: string | null;
  onClose: () => void;
  onCloseInspector?: () => void;
};

export default function DeleteFsItemConfirmModal({
  open,
  nodeId,
  onClose,
  onCloseInspector,
}: Props) {
  const { state, dispatch } = useFileSystem();
  const dialogTitleId = useId();
  const node = nodeId ? state.nodesById[nodeId] : undefined;

  useEffect(() => {
    if (open && nodeId && !state.nodesById[nodeId]) onClose();
  }, [open, nodeId, state.nodesById, onClose]);

  const handleConfirm = () => {
    if (!nodeId || !node || nodeId === state.rootId) return;
    dispatch({ type: "DELETE_NODE", nodeId });
    onClose();
    onCloseInspector();
  };

  if (!node) return null;

  const isDir = node.type === "dir";
  const label = isDir ? "folder" : "file";
  const subtreeCount = isDir ? collectSubtreeIds(state, node.id).size : 1;
  const extra =
    isDir && subtreeCount > 1
      ? " Everything inside this folder will be removed as well."
      : "";

  return (
    <Modal open={open} onClose={onClose} aria-labelledby={dialogTitleId}>
      <Modal.Header>
        <h2
          id={dialogTitleId}
          className="min-w-0 flex-1 pr-2 text-sm font-semibold"
        >
          Delete {label}?
        </h2>
      </Modal.Header>
      <Modal.Body>
        <p className="text-sm text-foreground">
          You are about to delete{" "}
          <span className="font-semibold break-all">{node.name}</span>.{extra}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          This action is not reversible. Your data will be removed from this
          browser only (local mock storage), but you will not be able to undo it
          here.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className={secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={dangerButton}
            onClick={handleConfirm}
          >
            Delete permanently
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
