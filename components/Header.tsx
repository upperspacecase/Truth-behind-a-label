import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="border-b border-black/5">
      <div className="mx-auto flex max-w-page items-center justify-between px-6 py-5">
        <Logo />
        <nav className="hidden items-center gap-10 md:flex">
          <Link href="#how" className="nav-link">
            How it works
          </Link>
          <Link href="#examples" className="nav-link">
            Examples
          </Link>
          <Link href="#about" className="nav-link">
            About
          </Link>
        </nav>
        <Link
          href="#upload"
          className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/90"
        >
          Try it now
        </Link>
      </div>
    </header>
  );
}
