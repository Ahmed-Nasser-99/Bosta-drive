"use client";

import React from "react";
import { sectionLabel } from "../fileSystemStyles";

type Props = {
  label: string;
  children: React.ReactNode;
};

export default function DetailBlock({ label, children }: Props) {
  return (
    <div className="space-y-1">
      <div className={sectionLabel}>{label}</div>
      <div className="text-sm font-medium text-foreground">{children}</div>
    </div>
  );
}
