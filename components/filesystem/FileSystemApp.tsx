"use client";

import { FileSystemProvider } from "./context/FileSystemProvider";
import FileSystemShell from "./ui/FileSystemShell";

export default function FileSystemApp() {
  return (
    <FileSystemProvider>
      <FileSystemShell />
    </FileSystemProvider>
  );
}
