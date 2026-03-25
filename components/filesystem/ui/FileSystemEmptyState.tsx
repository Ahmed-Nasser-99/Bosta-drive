"use client";

import AddDocumentIcon from "../../icons/AddDocumentIcon";
import AddFolderIcon from "../../icons/AddFolderIcon";
import FolderIcon from "../../icons/FolderIcon";
import { emptyStateActions, primaryButton } from "./fileSystemStyles";

type Props = {
  message: string;
  onAddFolder: () => void;
  onAddFile: () => void;
};

export default function FileSystemEmptyState({
  message,
  onAddFolder,
  onAddFile,
}: Props) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bosta-red-50 text-bosta-red-200">
        <FolderIcon className="h-7 w-7" />
      </div>
      <p className="max-w-xs text-sm text-muted-foreground">{message}</p>
      <div className={emptyStateActions}>
        <button
          type="button"
          className={`inline-flex items-center gap-2 ${primaryButton}`}
          onClick={(e) => {
            e.stopPropagation();
            onAddFolder();
          }}
        >
          <AddFolderIcon className="h-5 w-5 shrink-0" />
          New folder
        </button>
        <button
          type="button"
          className={`inline-flex items-center gap-2 ${primaryButton}`}
          onClick={(e) => {
            e.stopPropagation();
            onAddFile();
          }}
        >
          <AddDocumentIcon className="h-5 w-5 shrink-0" />
          New file
        </button>
      </div>
    </div>
  );
}
