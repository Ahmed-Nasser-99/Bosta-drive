import React from "react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="w-full border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <div className="text-lg font-bold tracking-wide text-bosta-red-500">
          BOSTA DRIVE
        </div>

        <div className="flex-1" />

        <div className="hidden max-w-md flex-1 sm:block">
          <div className="rounded-full border border-border bg-surface-2 px-4 py-2 text-sm text-muted-foreground">
            Search local files...
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
