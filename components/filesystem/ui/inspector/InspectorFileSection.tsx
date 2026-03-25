"use client";

import type { FSFileNode } from "../../context/fileSystemTypes";
import {
  countTextFileLines,
  getFileContentPreview,
} from "../../utils";
import { sectionLabel } from "../fileSystemStyles";
import DetailBlock from "./DetailBlock";

function utf8Length(text: string) {
  return new TextEncoder().encode(text).length;
}

type Props = { file: FSFileNode };

export default function InspectorFileSection({ file }: Props) {
  const lines = countTextFileLines(file.content);

  return (
    <>
      <DetailBlock label="Type">Text file</DetailBlock>
      <DetailBlock label="Size (text)">
        {utf8Length(file.content)} characters · {lines}{" "}
        {lines === 1 ? "line" : "lines"}
      </DetailBlock>
      <div className="space-y-1">
        <div className={sectionLabel}>Preview</div>
        <pre className="max-h-40 overflow-auto rounded-xl border border-border bg-background p-3 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap wrap-break-word">
          {getFileContentPreview(file.content)}
        </pre>
      </div>
    </>
  );
}
