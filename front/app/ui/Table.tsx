import type { PropsWithChildren } from "react";

export function Table({ children }: PropsWithChildren) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({
  children,
  ...props
}: PropsWithChildren & React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={`border-b border-[var(--color-border)] px-3 py-2 font-semibold ${
        props.className ? props.className : ""
      }`}
    >
      {children}
    </th>
  );
}
export function Td({
  children,
  ...props
}: PropsWithChildren & React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td  {...props} className={`border-b border-[var(--color-border)] px-3 py-2 ${props.className ? props.className : ""}`}>
      {children}
    </td>
  );
}
