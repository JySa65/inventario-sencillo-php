import type { ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  variant?: "primary" | "ghost";
};

export default function Button({ className = "", variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-lg)] px-4 py-2 text-sm font-medium transition duration-150";
  const variants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)]",
    ghost: "bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-border)]/40",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
