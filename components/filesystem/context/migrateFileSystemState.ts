import type { FileSystemState, FSNode } from "./fileSystemTypes";

/** Ensures nodes include createdAt (older localStorage payloads may omit it). */
export function migrateFileSystemState(state: FileSystemState): FileSystemState {
  const nodesById = { ...state.nodesById };
  let changed = false;
  for (const id of Object.keys(nodesById)) {
    const n = nodesById[id];
    if (!n) continue;
    const raw = n as FSNode & { createdAt?: unknown };
    if (typeof raw.createdAt !== "number") {
      nodesById[id] = { ...n, createdAt: n.modifiedAt };
      changed = true;
    }
  }
  return changed ? { ...state, nodesById } : state;
}
