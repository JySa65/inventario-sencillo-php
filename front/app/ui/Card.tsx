import type { PropsWithChildren } from "react";

export default function Card({ children }: PropsWithChildren & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-sm">
      {children}
    </div>
  );
}
