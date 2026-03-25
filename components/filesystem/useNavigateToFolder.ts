"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useFileSystem } from "./context/FileSystemProvider";
import { pathnameForFolderId } from "./folderPathUtils";

/** Push a history entry so back/forward matches folder navigation. */
export function useNavigateToFolder() {
  const router = useRouter();
  const { state } = useFileSystem();

  return useCallback(
    (dirId: string) => {
      router.push(pathnameForFolderId(dirId, state.rootId));
    },
    [router, state.rootId],
  );
}
