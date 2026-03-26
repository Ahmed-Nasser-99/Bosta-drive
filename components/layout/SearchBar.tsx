"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import SearchIcon from "@/components/icons/SearchIcon";
import XIcon from "@/components/icons/XIcon";
import FolderIcon from "@/components/icons/FolderIcon";
import FileIcon from "@/components/icons/FileIcon";
import { focusRing } from "@/components/ui/styles";
import { useFileSystem } from "@/components/filesystem/context/FileSystemProvider";
import { useSearch } from "@/components/filesystem/useSearch";
import { useNavigateToFolder } from "@/components/filesystem/useNavigateToFolder";

export default function SearchBar() {
  const { state, dispatch } = useFileSystem();
  const navigateToFolder = useNavigateToFolder();
  const { query, setQuery, results, clear } = useSearch(state);
  const [focused, setFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showResults = focused && query.trim().length > 0;

  const handleSelect = useCallback(
    (nodeId: string, type: "dir" | "file") => {
      clear();
      inputRef.current?.blur();
      if (type === "dir") {
        navigateToFolder(nodeId);
      } else {
        dispatch({ type: "SELECT_NODE", nodeId });
        dispatch({ type: "OPEN_TEXT_EDITOR", nodeId });
      }
    },
    [clear, navigateToFolder, dispatch]
  );

  useEffect(() => {
    if (!showResults) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setFocused(false);
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [showResults]);

  return (
    <div ref={rootRef} className="relative w-full max-w-md">
      <div
        className={`flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5 transition ${
          focused ? "ring-2 ring-primary" : ""
        }`}
      >
        <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search files and folders..."
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {query.length > 0 && (
          <button
            type="button"
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground ${focusRing}`}
            aria-label="Clear search"
            onClick={() => {
              clear();
              inputRef.current?.focus();
            }}
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-80 overflow-y-auto rounded-xl border border-border bg-surface-2 py-1 shadow-lg shadow-black/10 dark:shadow-black/40">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            <ul role="listbox">
              {results.map((r) => (
                <li key={r.node.id} role="option" aria-selected={false}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-foreground transition hover:bg-surface"
                    onClick={() => handleSelect(r.node.id, r.node.type)}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground">
                      {r.node.type === "dir" ? (
                        <FolderIcon className="h-4 w-4" />
                      ) : (
                        <FileIcon className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {r.node.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {r.path}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
