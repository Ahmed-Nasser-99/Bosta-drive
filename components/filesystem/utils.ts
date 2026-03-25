import type { FSDirNode, FSNode } from "./context/fileSystemTypes";

/** Stable display format for file cards (en-US), avoids locale surprises. */
export function formatFsItemDate(modifiedAt: number): string {
  if (modifiedAt <= 0) return "—";
  return new Date(modifiedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function nameExistsAmongSiblings(
  nodesById: Record<string, FSNode>,
  childrenByDirId: Record<string, string[]>,
  parentDirId: string,
  candidateName: string
): boolean {
  const ids = childrenByDirId[parentDirId] ?? [];
  const norm = candidateName.trim().toLowerCase();
  return ids.some((id) => {
    const n = nodesById[id];
    return Boolean(n && n.name.trim().toLowerCase() === norm);
  });
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
