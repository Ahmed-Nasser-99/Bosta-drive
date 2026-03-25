import React from "react";
import FileSystemApp from "./FileSystemApp";
import { FileSystemProvider } from "./context/FileSystemProvider";

const DrivePage = () => {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <FileSystemApp />
    </main>
  );
};

export default DrivePage;
