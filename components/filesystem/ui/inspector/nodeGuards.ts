import type { FSFileNode, FSNode } from "../../context/fileSystemTypes";

export function isFsFileNode(node: FSNode): node is FSFileNode {
  return node.type === "file";
}
