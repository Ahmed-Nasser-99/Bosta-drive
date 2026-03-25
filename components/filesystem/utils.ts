import type { FileSystemState, FSDirNode, FSNode } from "./context/fileSystemTypes";

/** Stable display format for file cards (en-US), avoids locale surprises. */
export function formatFsItemDate(modifiedAt: number): string {
  if (modifiedAt <= 0) return "—";
  return new Date(modifiedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatFsItemDateTime(ts: number): string {
  if (ts <= 0) return "—";
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function nameExistsAmongSiblings(
  nodesById: Record<string, FSNode>,
  childrenByDirId: Record<string, string[]>,
  parentDirId: string,
  candidateName: string,
  excludeNodeId?: string | null
): boolean {
  const ids = childrenByDirId[parentDirId] ?? [];
  const norm = candidateName.trim().toLowerCase();
  return ids.some((id) => {
    if (excludeNodeId && id === excludeNodeId) return false;
    const n = nodesById[id];
    return Boolean(n && n.name.trim().toLowerCase() === norm);
  });
}

export function buildNodeDisplayPath(
  nodesById: Record<string, FSNode>,
  nodeId: string
): string {
  const names: string[] = [];
  let cur: FSNode | undefined = nodesById[nodeId];
  while (cur) {
    names.unshift(cur.name);
    if (!cur.parentId) break;
    cur = nodesById[cur.parentId];
  }
  return names.length > 0 ? `/${names.join("/")}` : "—";
}

export function countDirContents(
  state: FileSystemState,
  dirId: string
): { folders: number; files: number } {
  const ids = state.childrenByDirId[dirId] ?? [];
  let folders = 0;
  let files = 0;
  for (const id of ids) {
    const n = state.nodesById[id];
    if (!n) continue;
    if (n.type === "dir") folders += 1;
    else files += 1;
  }
  return { folders, files };
}

export function countTextFileLines(content: string): number {
  if (!content) return 0;
  return content.split(/\r?\n/).length;
}

const PREVIEW_MAX_LINES = 8;

export function getFileContentPreview(content: string): string {
  const lines = content.split(/\r?\n/);
  const head = lines.slice(0, PREVIEW_MAX_LINES);
  const out = head.join("\n");
  if (lines.length > PREVIEW_MAX_LINES) return `${out}\n…`;
  return out || "(empty file)";
}

export function collectSubtreeIds(
  state: FileSystemState,
  rootId: string
): Set<string> {
  const out = new Set<string>();
  const walk = (id: string) => {
    const n = state.nodesById[id];
    if (!n || out.has(id)) return;
    out.add(id);
    if (n.type === "dir") {
      for (const childId of state.childrenByDirId[id] ?? []) walk(childId);
    }
  };
  walk(rootId);
  return out;
}

export function resolveCurrentDirAfterDelete(
  state: FileSystemState,
  deleted: Set<string>
): string {
  let cur = state.currentDirId;
  while (deleted.has(cur)) {
    const n = state.nodesById[cur];
    if (!n?.parentId) return state.rootId;
    cur = n.parentId;
  }
  return cur;
}

export function buildDirPath(nodesById: Record<string, FSNode>, dirId: string) {
  const path: FSDirNode[] = [];
  let cur: FSDirNode | undefined =
    nodesById[dirId] && nodesById[dirId].type === "dir"
      ? (nodesById[dirId] as FSDirNode)
      : undefined;

  while (cur) {
    path.unshift(cur);
    if (!cur.parentId) break;
    const parent = nodesById[cur.parentId];
    cur = parent && parent.type === "dir" ? (parent as FSDirNode) : undefined;
  }

  return path;
}
