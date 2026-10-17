export function normalizeGender(
  value?: string | null,
): "L" | "P" | undefined {
  if (value === "L" || value === "P") return value;
  return undefined;
}

export function formatRp(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "Rp 0";
  return (
    "Rp " +
    Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

export const fmtRp = formatRp;

export function toTitleCase(s?: string | null): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
