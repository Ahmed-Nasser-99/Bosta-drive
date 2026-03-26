"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FSNode, FileSystemState } from "./context/fileSystemTypes";
import { buildNodeDisplayPath } from "./utils";

const DEBOUNCE_MS = 250;
const MAX_RESULTS = 20;

export type SearchResult = {
  node: FSNode;
  path: string;
};

function search(state: FileSystemState, query: string): SearchResult[] {
  const lower = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const node of Object.values(state.nodesById)) {
    if (!node || node.id === state.rootId) continue;
    if (node.name.toLowerCase().includes(lower)) {
      results.push({ node, path: buildNodeDisplayPath(state.nodesById, node.id) });
      if (results.length >= MAX_RESULTS) break;
    }
  }

  return results;
}

const EMPTY: SearchResult[] = [];

export function useSearch(state: FileSystemState) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>(EMPTY);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const trimmed = query.trim();
    if (!trimmed) return;

    timerRef.current = setTimeout(() => {
      setResults(search(state, trimmed));
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, state]);

  const clear = useCallback(() => {
    setQuery("");
    setResults(EMPTY);
  }, []);

  const updateQuery = useCallback((q: string) => {
    setQuery(q);
    if (!q.trim()) setResults(EMPTY);
  }, []);

  return { query, setQuery: updateQuery, results, clear };
}
