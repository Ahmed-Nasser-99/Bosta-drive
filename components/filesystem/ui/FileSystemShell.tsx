"use client";

import React, { useMemo, useState } from "react";
import { useFileSystem } from "../context/FileSystemProvider";
import type { FSDirNode, FSFileNode } from "../context/fileSystemTypes";
import { buildDirPath } from "../utils";
import FileSystemBreadcrumb from "./FileSystemBreadcrumb";
import FileSystemEmptyState from "./FileSystemEmptyState";
import { FileSystemDirCard, FileSystemFileCard } from "./item-card";
import CreateFsItemModal, { type CreateFsItemKind } from "./CreateFsItemModal";
import { sectionLabel } from "./fileSystemStyles";
import TextFileEditorModal from "./TextFileEditorModal";

export default function FileSystemShell() {
  const { state, dispatch } = useFileSystem();
  const [createKind, setCreateKind] = useState<CreateFsItemKind | null>(null);

  const path = useMemo(
    () => buildDirPath(state.nodesById, state.currentDirId),
    [state.nodesById, state.currentDirId],
  );

  const ids = state.childrenByDirId[state.currentDirId] ?? [];
  const dirs = ids
    .map((id) => state.nodesById[id])
    .filter((n): n is FSDirNode => Boolean(n && n.type === "dir"));
  const files = ids
    .map((id) => state.nodesById[id])
    .filter((n): n is FSFileNode => Boolean(n && n.type === "file"));

  const isEmpty = dirs.length === 0 && files.length === 0;

  return (
    <div
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-6"
      onClick={() => dispatch({ type: "SELECT_NODE", nodeId: null })}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <FileSystemBreadcrumb path={path} />
        <div className="text-sm text-muted-foreground">
          {ids.length} {ids.length === 1 ? "item" : "items"}
        </div>
      </div>

      {isEmpty ? (
        <FileSystemEmptyState
          message="This folder is empty. Create a new folder or file to get started."
          onAddFolder={() => setCreateKind("folder")}
          onAddFile={() => setCreateKind("file")}
        />
      ) : (
        <>
          {dirs.length > 0 && (
            <div className="mt-6">
              <div className={sectionLabel}>Directories</div>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {dirs.map((dir) => (
                  <FileSystemDirCard key={dir.id} dir={dir} />
                ))}
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-8">
              <div className={sectionLabel}>Files</div>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {files.map((file) => (
                  <FileSystemFileCard key={file.id} file={file} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <TextFileEditorModal />
      <CreateFsItemModal
        open={createKind !== null}
        kind={createKind ?? "folder"}
        onClose={() => setCreateKind(null)}
      />
    </div>
  );
}
