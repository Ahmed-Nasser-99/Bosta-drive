"use client";

import RenameIcon from "@/components/icons/RenameIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import type { FSNode } from "../../context/fileSystemTypes";
import { panelIconButton, primaryButton } from "../fileSystemStyles";

type Props = {
  node: FSNode;
  onOpen: () => void;
  onRename: () => void;
  onDelete: () => void;
};

export default function InspectorActionBar({
  node,
  onOpen,
  onRename,
  onDelete,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className={`${primaryButton} flex w-full items-center justify-center`}
        onClick={onOpen}
      >
        {node.type === "dir" ? "Open folder" : "Open file"}
      </button>
      <div className="flex justify-center gap-2">
        <button
          type="button"
          className={panelIconButton}
          title="Rename"
          aria-label="Rename"
          onClick={onRename}
        >
          <RenameIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          className={panelIconButton}
          title="Delete"
          aria-label="Delete"
          onClick={onDelete}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
