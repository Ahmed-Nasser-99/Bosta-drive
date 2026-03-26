import Link from "next/link";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full border-b border-border bg-surface">
      <div className="flex items-center md:gap-10 gap-2 mx-auto justify-between px-2 md:px-4 py-3 w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center relative">
            <Image src="/logo.png" alt="Bosta Drive" fill />
          </div>
          <div className="shrink-0 text-lg font-bold tracking-wide text-bosta-red-500 hidden md:block">
            BOSTA DRIVE
          </div>
        </Link>

        <SearchBar />

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
