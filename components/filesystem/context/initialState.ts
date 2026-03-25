import type { FileSystemState } from "./fileSystemTypes";

export const BOOTSTRAP_ROOT_ID = "fs-root-bootstrap";

export function createInitialFileSystemState(): FileSystemState {
  const rootId = BOOTSTRAP_ROOT_ID;

  return {
    version: 1,
    rootId,
    currentDirId: rootId,
    selectedNodeId: null,
    editor: { open: false, nodeId: null },
    nodesById: {
      [rootId]: {
        id: rootId,
        type: "dir",
        name: "My Computer",
        parentId: null,
        createdAt: 0,
        modifiedAt: 0,
      },
    },
    childrenByDirId: {
      [rootId]: [],
    },
  };
}
