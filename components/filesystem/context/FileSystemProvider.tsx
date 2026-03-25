"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import type { FileSystemAction, FileSystemState } from "./fileSystemTypes";
import { fileSystemReducer } from "./fileSystemReducer";
import { createInitialFileSystemState } from "./initialState";
import { migrateFileSystemState } from "./migrateFileSystemState";

const STORAGE_KEY = "bosta_drive_fs";

type CtxValue = {
  state: FileSystemState;
  dispatch: React.Dispatch<FileSystemAction>;
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
  const skipNextPersist = useRef(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? safeParseState(raw) : null;
    if (parsed) {
      skipNextPersist.current = true;
      dispatch({ type: "HYDRATE_STATE", state: parsed });
    }
  }, []);

  useEffect(() => {
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <FileSystemContext.Provider value={{ state, dispatch }}>
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
