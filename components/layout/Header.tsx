import React from "react";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="w-full border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <div className="shrink-0 text-lg font-bold tracking-wide text-bosta-red-500">
          BOSTA DRIVE
        </div>

        <div className="min-w-0 flex-1">
          <SearchBar />
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
