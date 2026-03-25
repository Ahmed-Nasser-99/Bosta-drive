"use client";

import { useId } from "react";
import Modal from "@/components/ui/Modal";
import InspectorContent from "./InspectorContent";

type Props = {
  open: boolean;
  nodeId: string | null;
  onClose: () => void;
};

export default function InspectorModal({ open, nodeId, onClose }: Props) {
  const titleId = useId();

  return (
    <Modal
      open={open}
      onClose={onClose}
      panelClassName="max-w-md"
      aria-labelledby={titleId}
    >
      <Modal.Header>
        <h2
          id={titleId}
          className="min-w-0 flex-1 truncate text-sm font-semibold"
        >
          Details
        </h2>
      </Modal.Header>
      <Modal.Body>
        <InspectorContent nodeId={nodeId} onAfterAction={onClose} />
      </Modal.Body>
    </Modal>
  );
}
