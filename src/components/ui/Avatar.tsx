import type { CSSProperties } from "react";

interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
  gender?: "L" | "P";
  className?: string;
}

export function Avatar({
  src,
  name,
  size = 44,
  gender = "L",
  className = "",
}: AvatarProps) {
  const style: CSSProperties = { width: size, height: size };
  const bg =
    gender === "P"
      ? "bg-accent-soft text-accent"
      : "bg-surface-card2 text-surface-muted";

  return (
    <div
      style={style}
      className={`relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full ${bg} ${className}`}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="text-lg font-bold uppercase" aria-hidden="true">
          {name?.trim()?.charAt(0) ?? "?"}
        </span>
      )}
    </div>
  );
}
