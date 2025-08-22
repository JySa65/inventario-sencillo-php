import { NavLink } from "react-router";

const linkBase = "rounded-md px-3 py-2 text-sm font-medium";
const linkActive = "bg-[var(--color-primary)] text-white";
const linkIdle = "text-[var(--color-fg)] hover:bg-[var(--color-border)]/60";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="text-base font-semibold">Inventario</div>
        <div className="flex gap-2">
          {[
            { to: "/items", label: "Items" },
            { to: "/stocks", label: "Stocks" },
            { to: "/health", label: "Health" },
            { to: "/warehouses", label: "Warehouses" },
          ].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
