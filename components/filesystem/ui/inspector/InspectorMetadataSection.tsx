"use client";

import type { FSNode } from "../../context/fileSystemTypes";
import {
  formatFsItemDate,
  formatFsItemDateTime,
} from "../../utils";
import DetailBlock from "./DetailBlock";

type DirCounts = { folders: number; files: number };

type Props = {
  node: FSNode;
  displayPath: string;
  dirCounts: DirCounts | null;
};

export default function InspectorMetadataSection({
  node,
  displayPath,
  dirCounts,
}: Props) {
  return (
    <>
      <DetailBlock label="Created">
        {formatFsItemDate(node.createdAt)}
      </DetailBlock>
      <DetailBlock label="Last updated">
        {formatFsItemDateTime(node.modifiedAt)}
      </DetailBlock>
      <DetailBlock label="Path">
        <span className="break-all font-mono text-xs font-normal text-muted-foreground">
          {displayPath}
        </span>
      </DetailBlock>

      {node.type === "dir" && dirCounts ? (
        <DetailBlock label="Contents">
          <span>
            {dirCounts.folders}{" "}
            {dirCounts.folders === 1 ? "folder" : "folders"},{" "}
            {dirCounts.files} {dirCounts.files === 1 ? "file" : "files"}
          </span>
          <p className="mt-1 text-xs font-normal text-muted-foreground">
            {dirCounts.folders + dirCounts.files}{" "}
            {dirCounts.folders + dirCounts.files === 1 ? "item" : "items"} in
            this folder
          </p>
        </DetailBlock>
      ) : null}
    </>
  );
}
