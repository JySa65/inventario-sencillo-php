import type { ComponentProps } from "react";

export default function Select(props: ComponentProps<"select">) {
  return (
    <select
      {...props}
      className={`w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${props.className ?? ""}`}
    />
  );
}
