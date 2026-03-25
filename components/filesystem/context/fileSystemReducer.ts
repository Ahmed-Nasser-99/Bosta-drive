import { v4 as uuidv4 } from "uuid";
import type {
  FileSystemAction,
  FileSystemState,
  FSDirNode,
  FSFileNode,
  FSNode,
} from "./fileSystemTypes";

function isFile(node: FSNode): node is FSFileNode {
  return node.type === "file";
}

export function fileSystemReducer(
  state: FileSystemState,
  action: FileSystemAction
): FileSystemState {
  switch (action.type) {
    case "HYDRATE_STATE":
      return action.state;

    case "NAVIGATE_TO_DIR": {
      const node = state.nodesById[action.dirId];
      if (!node || node.type !== "dir") return state;
      return {
        ...state,
        currentDirId: action.dirId,
        selectedNodeId: null,
        editor: { open: false, nodeId: null },
      };
    }

    case "SELECT_NODE":
      return { ...state, selectedNodeId: action.nodeId };

    case "OPEN_TEXT_EDITOR": {
      const node = state.nodesById[action.nodeId];
      if (!node || !isFile(node)) return state;
      return {
        ...state,
        selectedNodeId: action.nodeId,
        editor: { open: true, nodeId: action.nodeId },
      };
    }

    case "CLOSE_TEXT_EDITOR":
      return { ...state, editor: { open: false, nodeId: null } };

    case "SAVE_TEXT_FILE": {
      const node = state.nodesById[action.nodeId];
      if (!node || !isFile(node)) return state;
      const updated: FSFileNode = {
        ...node,
        content: action.content,
        modifiedAt: Date.now(),
      };
      return {
        ...state,
        nodesById: { ...state.nodesById, [action.nodeId]: updated },
        editor: { open: false, nodeId: null },
      };
    }

    case "ADD_FOLDER": {
      const parent = state.nodesById[action.parentDirId];
      if (!parent || parent.type !== "dir") return state;
      const name = action.name.trim();
      if (!name) return state;
      const id = uuidv4();
      const now = Date.now();
      const newDir: FSDirNode = {
        id,
        type: "dir",
        name,
        parentId: action.parentDirId,
        modifiedAt: now,
      };
      const siblings = state.childrenByDirId[action.parentDirId] ?? [];
      return {
        ...state,
        nodesById: { ...state.nodesById, [id]: newDir },
        childrenByDirId: {
          ...state.childrenByDirId,
          [action.parentDirId]: [...siblings, id],
          [id]: [],
        },
        selectedNodeId: id,
        editor: { open: false, nodeId: null },
      };
    }

    case "ADD_TEXT_FILE": {
      const parent = state.nodesById[action.parentDirId];
      if (!parent || parent.type !== "dir") return state;
      const name = action.name.trim();
      if (!name) return state;
      const id = uuidv4();
      const now = Date.now();
      const newFile: FSFileNode = {
        id,
        type: "file",
        kind: "text",
        name,
        parentId: action.parentDirId,
        content: "",
        modifiedAt: now,
      };
      const siblings = state.childrenByDirId[action.parentDirId] ?? [];
      return {
        ...state,
        nodesById: { ...state.nodesById, [id]: newFile },
        childrenByDirId: {
          ...state.childrenByDirId,
          [action.parentDirId]: [...siblings, id],
        },
        selectedNodeId: id,
        editor: { open: false, nodeId: null },
      };
    }

    default:
      return state;
  }
}
