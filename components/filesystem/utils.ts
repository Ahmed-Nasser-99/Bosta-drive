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

/**
 * Starting from `nodeId`, traverse up the tree via `parentId` pointers until
 * the root (parentId === null) is reached. Each visited node is prepended to
 * the result so the returned array is ordered root-first, target-last.
 *
 * Used as the foundation for both display-path strings and breadcrumb chains.
 */
export function buildAncestorChain(
  nodesById: Record<string, FSNode>,
  nodeId: string
): FSNode[] {
  const chain: FSNode[] = [];
  let cur: FSNode | undefined = nodesById[nodeId];
  while (cur) {
    chain.unshift(cur);
    if (!cur.parentId) break;
    cur = nodesById[cur.parentId];
  }
  return chain;
}

/**
 * Build a human-readable absolute path string for any node.
 * e.g. "/My Computer/Documents/report.txt"
 *
 * Walks the ancestor chain and joins each node's name with "/".
 * Returns "—" when the node doesn't exist.
 */
export function buildNodeDisplayPath(
  nodesById: Record<string, FSNode>,
  nodeId: string
): string {
  const chain = buildAncestorChain(nodesById, nodeId);
  return chain.length > 0 ? `/${chain.map((n) => n.name).join("/")}` : "—";
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

/**
 * Build the breadcrumb chain for a directory — an array of `FSDirNode` objects
 * from the root down to `dirId`. Non-dir nodes (shouldn't happen in practice)
 * are filtered out so the result is always a clean folder path.
 */
export function buildDirPath(nodesById: Record<string, FSNode>, dirId: string): FSDirNode[] {
  return buildAncestorChain(nodesById, dirId).filter(
    (n): n is FSDirNode => n.type === "dir"
  );
}
