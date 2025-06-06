// ✅ components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-purple-600">Lukas Rojas Rifa</h1>
      <Link
        href="/premios"
        className="text-purple-600 font-medium hover:underline"
      >
        Premios
      </Link>
    </header>
  );
}
