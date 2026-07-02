import Link from "next/link";

const LINKS = [
  { href: "/", label: "Матрица рисков" },
  { href: "/risks", label: "Реестр рисков" },
  { href: "/plan", label: "План обработки" },
];

export default function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-slate-900">
          СУР <span className="font-normal text-slate-500 text-sm">Система управления рисками</span>
        </Link>
        <nav className="flex gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
