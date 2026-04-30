import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1 text-2xl font-extrabold tracking-tight">
      <span>truth</span>
      <span className="rounded-md border-2 border-ink px-2 py-[2px] leading-none">label</span>
      <span className="-ml-1">.</span>
    </Link>
  );
}
