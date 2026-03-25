export type FSNodeType = "dir" | "file";

export type FSNode = FSDirNode | FSFileNode;

export type FSFileKind = "text";

type BaseNode = {
  id: string;
  name: string;
  parentId: string | null;
  modifiedAt: number;
};

export type FSDirNode = BaseNode & {
  type: "dir";
};

export type FSFileNode = BaseNode & {
  type: "file";
  kind: FSFileKind;
  content: string;
};

export type FileSystemState = {
  version: 1;
  rootId: string;
  currentDirId: string;
  selectedNodeId: string | null;
  editor: { open: boolean; nodeId: string | null };
  nodesById: Record<string, FSNode>;
  childrenByDirId: Record<string, string[]>;
};

export type FileSystemAction =
  | { type: "HYDRATE_STATE"; state: FileSystemState }
  | { type: "NAVIGATE_TO_DIR"; dirId: string }
  | { type: "SELECT_NODE"; nodeId: string | null }
  | { type: "OPEN_TEXT_EDITOR"; nodeId: string }
  | { type: "CLOSE_TEXT_EDITOR" }
  | { type: "SAVE_TEXT_FILE"; nodeId: string; content: string }
  | { type: "ADD_FOLDER"; parentDirId: string; name: string }
  | { type: "ADD_TEXT_FILE"; parentDirId: string; name: string };
