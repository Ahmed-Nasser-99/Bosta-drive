"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFileSystem } from "./context/FileSystemProvider";
import { folderIdFromPathname, pathnameForFolderId } from "./folderPathUtils";

/**
 * Keeps `currentDirId` in sync with the URL and fixes the URL when it points at
 * a removed folder (e.g. after delete).
 */
export default function FolderRouteSync() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, dispatch } = useFileSystem();
  const { rootId, currentDirId, nodesById } = state;

  useEffect(() => {
    const targetId = folderIdFromPathname(pathname, rootId);
    const node = nodesById[targetId];

    if (!node || node.type !== "dir") {
      let fixId = currentDirId;
      const cur = nodesById[fixId];
      if (!cur || cur.type !== "dir") fixId = rootId;
      router.replace(pathnameForFolderId(fixId, rootId));
      return;
    }

    if (currentDirId !== targetId) {
      dispatch({ type: "NAVIGATE_TO_DIR", dirId: targetId });
    }
  }, [pathname, rootId, currentDirId, nodesById, dispatch, router]);

  return null;
}
