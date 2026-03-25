import { v4 as uuidv4 } from "uuid";
import {
  collectSubtreeIds,
  nameExistsAmongSiblings,
  resolveCurrentDirAfterDelete,
} from "../utils";
import type {
  FileSystemAction,
  FileSystemState,
  FSDirNode,
  FSFileNode,
  FSNode,
} from "./fileSystemTypes";
import { migrateFileSystemState } from "./migrateFileSystemState";

function isFile(node: FSNode): node is FSFileNode {
  return node.type === "file";
}

export function fileSystemReducer(
  state: FileSystemState,
  action: FileSystemAction
): FileSystemState {
  switch (action.type) {
    case "HYDRATE_STATE":
      return migrateFileSystemState(action.state);

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
        createdAt: now,
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
        createdAt: now,
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

    case "RENAME_NODE": {
      const node = state.nodesById[action.nodeId];
      if (!node || !node.parentId || action.nodeId === state.rootId)
        return state;
      const name = action.newName.trim();
      if (!name) return state;
      if (
        nameExistsAmongSiblings(
          state.nodesById,
          state.childrenByDirId,
          node.parentId,
          name,
          action.nodeId
        )
      ) {
        return state;
      }
      const now = Date.now();
      const updated = { ...node, name, modifiedAt: now } as FSNode;
      return {
        ...state,
        nodesById: { ...state.nodesById, [action.nodeId]: updated },
      };
    }

    case "DELETE_NODE": {
      const node = state.nodesById[action.nodeId];
      if (!node || action.nodeId === state.rootId) return state;
      const deleted = collectSubtreeIds(state, action.nodeId);
      const nextCurrentDirId = resolveCurrentDirAfterDelete(state, deleted);
      const nodesById = { ...state.nodesById };
      for (const id of deleted) {
        delete nodesById[id];
      }
      const childrenByDirId: Record<string, string[]> = {};
      for (const key of Object.keys(state.childrenByDirId)) {
        if (deleted.has(key)) continue;
        childrenByDirId[key] = (state.childrenByDirId[key] ?? []).filter(
          (id) => !deleted.has(id)
        );
      }
      const selectedNodeId =
        state.selectedNodeId && deleted.has(state.selectedNodeId)
          ? null
          : state.selectedNodeId;
      const editor =
        state.editor.nodeId && deleted.has(state.editor.nodeId)
          ? { open: false, nodeId: null }
          : state.editor;
      return {
        ...state,
        nodesById,
        childrenByDirId,
        currentDirId: nextCurrentDirId,
        selectedNodeId,
        editor,
      };
    }

    default:
      return state;
  }
}
