export function formatAtomic(atomic: number, scale = 2) {
  const v = atomic / 10 ** scale;
  return v.toLocaleString(undefined, { minimumFractionDigits: scale, maximumFractionDigits: scale });
}
