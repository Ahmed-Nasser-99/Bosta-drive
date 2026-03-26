"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type {
  Clipboard,
  ClipboardOp,
  FileSystemAction,
  FileSystemState,
} from "./fileSystemTypes";
import { fileSystemReducer } from "./fileSystemReducer";
import { createInitialFileSystemState } from "./initialState";
import { migrateFileSystemState } from "./migrateFileSystemState";

const STORAGE_KEY = "bosta_drive_fs";

type CtxValue = {
  state: FileSystemState;
  dispatch: React.Dispatch<FileSystemAction>;
  clipboard: Clipboard;
  setClipboard: (nodeIds: string[], op: ClipboardOp) => void;
  clearClipboard: () => void;
  hydrated: boolean;
};

const FileSystemContext = createContext<CtxValue | null>(null);

export function safeParseState(raw: string): FileSystemState | null {
  try {
    const parsed = JSON.parse(raw) as FileSystemState;
    if (!parsed || parsed.version !== 1) return null;
    if (!parsed.nodesById || !parsed.childrenByDirId) return null;
    if (!parsed.rootId || !parsed.currentDirId) return null;
    return migrateFileSystemState(parsed);
  } catch {
    return null;
  }
}

export function FileSystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(
    fileSystemReducer,
    createInitialFileSystemState(),
  );
  const [clipboard, setClipboardRaw] = useState<Clipboard>(null);
  const skipNextPersist = useRef(false);

  const hydratedRef = useRef(false);
  const hydratedListeners = useRef(new Set<() => void>());
  const subscribeHydrated = useCallback((cb: () => void) => {
    hydratedListeners.current.add(cb);
    return () => { hydratedListeners.current.delete(cb); };
  }, []);
  const getHydrated = useCallback(() => hydratedRef.current, []);
  const hydrated = useSyncExternalStore(subscribeHydrated, getHydrated, () => false);

  const setClipboard = useCallback(
    (nodeIds: string[], op: ClipboardOp) =>
      setClipboardRaw({ op, nodeIds }),
    []
  );
  const clearClipboard = useCallback(() => setClipboardRaw(null), []);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? safeParseState(raw) : null;
    if (parsed) {
      skipNextPersist.current = true;
      dispatch({ type: "HYDRATE_STATE", state: parsed });
    }
    hydratedRef.current = true;
    for (const cb of hydratedListeners.current) cb();
  }, []);

  useEffect(() => {
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <FileSystemContext.Provider value={{ state, dispatch, clipboard, setClipboard, clearClipboard, hydrated }}>
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystem() {
  const ctx = useContext(FileSystemContext);
  if (!ctx)
    throw new Error("useFileSystem must be used within FileSystemProvider");
  return ctx;
}
