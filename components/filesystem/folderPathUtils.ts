/** Map URL pathname to the directory id (root id for `/`). */
export function folderIdFromPathname(pathname: string, rootId: string): string {
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  if (trimmed === "/") return rootId;
  const segment = trimmed.slice(1).split("/")[0];
  return segment ? decodeURIComponent(segment) : rootId;
}

export function pathnameForFolderId(folderId: string, rootId: string): string {
  return folderId === rootId ? "/" : `/${encodeURIComponent(folderId)}`;
}
