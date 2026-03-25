"use client";

import React, { Dispatch, useCallback, useMemo, useState } from "react";
import AddDocumentIcon from "@/components/icons/AddDocumentIcon";
import AddFolderIcon from "@/components/icons/AddFolderIcon";
import CopyIcon from "@/components/icons/CopyIcon";
import CutIcon from "@/components/icons/CutIcon";
import FolderIcon from "@/components/icons/FolderIcon";
import FileIcon from "@/components/icons/FileIcon";
import InfoIcon from "@/components/icons/InfoIcon";
import PasteIcon from "@/components/icons/PasteIcon";
import RenameIcon from "@/components/icons/RenameIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import { useFileSystem } from "../context/FileSystemProvider";
import type {
  Clipboard,
  FileSystemAction,
  FSDirNode,
  FSFileNode,
  FSNode,
} from "../context/fileSystemTypes";
import { useNavigateToFolder } from "../useNavigateToFolder";
import { buildDirPath } from "../utils";
import {
  ContextMenuPopup,
  useContextMenu,
  type ContextMenuItem,
} from "./context-menu";
import CreateItemFab from "./CreateItemFab";
import { DeleteFsItemConfirmModal, InspectorModal } from "./inspector";
import FileSystemBreadcrumb from "./FileSystemBreadcrumb";
import FileSystemEmptyState from "./FileSystemEmptyState";
import { sectionLabel } from "./fileSystemStyles";
import { FileSystemDirCard, FileSystemFileCard } from "./item-card";
import NameFsItemModal, { type NameModalMode } from "./NameFsItemModal";
import TextFileEditorModal from "./TextFileEditorModal";

const CREATE_FOLDER: NameModalMode = { action: "create", kind: "folder" };
const CREATE_FILE: NameModalMode = { action: "create", kind: "file" };

function buildBackgroundMenuItems(
  setNameModal: (mode: NameModalMode) => void,
  clipboard: Clipboard,
  onPaste: (targetDirId: string) => void,
  currentDirId: string,
): ContextMenuItem[] {
  const items: ContextMenuItem[] = [
    {
      label: "New folder",
      icon: <AddFolderIcon className="h-4 w-4" />,
      onClick: () => setNameModal(CREATE_FOLDER),
    },
    {
      label: "New file",
      icon: <AddDocumentIcon className="h-4 w-4" />,
      onClick: () => setNameModal(CREATE_FILE),
    },
  ];

  if (clipboard) {
    items.push({
      label: "Paste",
      icon: <PasteIcon className="h-4 w-4" />,
      onClick: () => onPaste(currentDirId),
    });
  }

  return items;
}

function buildNodeMenuItems(
  node: FSNode,
  navigateToFolder: (dirId: string) => void,
  dispatch: Dispatch<FileSystemAction>,
  setNameModal: (mode: NameModalMode) => void,
  setDeleteId: (id: string) => void,
  setDetailsId: (id: string) => void,
  onCopy: (nodeId: string) => void,
  onCut: (nodeId: string) => void,
  clipboard: Clipboard,
  onPaste: (targetDirId: string) => void,
): ContextMenuItem[] {
  const items: ContextMenuItem[] = [
    {
      label: node.type === "dir" ? "Open folder" : "Open file",
      icon:
        node.type === "dir" ? (
          <FolderIcon className="h-4 w-4" />
        ) : (
          <FileIcon className="h-4 w-4" />
        ),
      onClick: () => {
        if (node.type === "dir") {
          navigateToFolder(node.id);
        } else {
          dispatch({ type: "OPEN_TEXT_EDITOR", nodeId: node.id });
        }
      },
    },
    {
      label: "Details",
      icon: <InfoIcon className="h-4 w-4" />,
      onClick: () => setDetailsId(node.id),
      className: "lg:hidden",
    },
    {
      label: "Copy",
      icon: <CopyIcon className="h-4 w-4" />,
      onClick: () => onCopy(node.id),
    },
    {
      label: "Cut",
      icon: <CutIcon className="h-4 w-4" />,
      onClick: () => onCut(node.id),
    },
  ];

  if (node.type === "dir" && clipboard) {
    items.push({
      label: "Paste",
      icon: <PasteIcon className="h-4 w-4" />,
      onClick: () => onPaste(node.id),
    });
  }

  items.push(
    {
      label: "Rename",
      icon: <RenameIcon className="h-4 w-4" />,
      onClick: () => setNameModal({ action: "rename", nodeId: node.id }),
    },
    {
      label: "Delete",
      icon: <TrashIcon className="h-4 w-4" />,
      danger: true,
      onClick: () => setDeleteId(node.id),
    },
  );

  return items;
}

export default function FileSystemShell() {
  const { state, dispatch, clipboard, setClipboard, clearClipboard } =
    useFileSystem();
  const navigateToFolder = useNavigateToFolder();
  const [nameModal, setNameModal] = useState<NameModalMode | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const { menu, openMenu, closeMenu, popupRef } = useContextMenu();

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

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      const nodeEl = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-node-id]",
      );
      if (nodeEl) {
        const nodeId = nodeEl.getAttribute("data-node-id")!;
        dispatch({ type: "SELECT_NODE", nodeId });
        openMenu(e, { kind: "item", nodeId });
      } else {
        openMenu(e, { kind: "background" });
      }
    },
    [openMenu, dispatch],
  );

  const handleCardMenuOpen = useCallback(
    (nodeId: string, anchor: HTMLElement) => {
      dispatch({ type: "SELECT_NODE", nodeId });
      const rect = anchor.getBoundingClientRect();
      const syntheticEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
        clientX: rect.right,
        clientY: rect.bottom,
      } as React.MouseEvent;
      openMenu(syntheticEvent, { kind: "item", nodeId });
    },
    [openMenu, dispatch],
  );

  const handleCopy = useCallback(
    (nodeId: string) => setClipboard([nodeId], "copy"),
    [setClipboard],
  );

  const handleCut = useCallback(
    (nodeId: string) => setClipboard([nodeId], "cut"),
    [setClipboard],
  );

  const handlePaste = useCallback(
    (targetDirId: string) => {
      if (!clipboard) return;
      dispatch({
        type: "PASTE_NODES",
        op: clipboard.op,
        nodeIds: clipboard.nodeIds,
        targetDirId,
      });
      if (clipboard.op === "cut") clearClipboard();
    },
    [clipboard, dispatch, clearClipboard],
  );

  const contextMenuItems = useMemo((): ContextMenuItem[] => {
    if (!menu.open) return [];

    if (menu.target.kind === "background") {
      return buildBackgroundMenuItems(
        setNameModal,
        clipboard,
        handlePaste,
        state.currentDirId,
      );
    }

    const node = state.nodesById[menu.target.nodeId];
    if (!node) return [];

    return buildNodeMenuItems(
      node,
      navigateToFolder,
      dispatch,
      setNameModal,
      setDeleteId,
      setDetailsId,
      handleCopy,
      handleCut,
      clipboard,
      handlePaste,
    );
  }, [
    menu,
    state.nodesById,
    state.currentDirId,
    navigateToFolder,
    dispatch,
    clipboard,
    handleCopy,
    handleCut,
    handlePaste,
  ]);

  return (
    <div
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-6"
      onContextMenu={handleContextMenu}
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
          onAddFolder={() => setNameModal(CREATE_FOLDER)}
          onAddFile={() => setNameModal(CREATE_FILE)}
        />
      ) : (
        <>
          {dirs.length > 0 && (
            <div className="mt-6">
              <div className={sectionLabel}>Directories</div>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {dirs.map((dir) => (
                  <FileSystemDirCard
                    key={dir.id}
                    dir={dir}
                    onMenuOpen={handleCardMenuOpen}
                  />
                ))}
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-8">
              <div className={sectionLabel}>Files</div>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {files.map((file) => (
                  <FileSystemFileCard
                    key={file.id}
                    file={file}
                    onMenuOpen={handleCardMenuOpen}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ContextMenuPopup
        menu={menu}
        items={contextMenuItems}
        popupRef={popupRef}
        onClose={closeMenu}
      />

      <CreateItemFab
        onChoose={(kind) => setNameModal({ action: "create", kind })}
      />
      <TextFileEditorModal />
      <NameFsItemModal
        open={nameModal !== null}
        mode={nameModal ?? CREATE_FOLDER}
        onClose={() => setNameModal(null)}
      />
      <DeleteFsItemConfirmModal
        open={deleteId !== null}
        nodeId={deleteId}
        onClose={() => setDeleteId(null)}
      />
      <InspectorModal
        open={detailsId !== null}
        nodeId={detailsId}
        onClose={() => setDetailsId(null)}
      />
    </div>
  );
}
