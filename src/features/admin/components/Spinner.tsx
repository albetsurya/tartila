import { Loader2 } from "@/components/ui/CustomIcons";

export interface SpinnerProps {
  size?: number;
  className?: string;
}

/**
 * Standard loading spinner for admin action buttons.
 * `Loader2` maps to FontAwesome's `faSpinner`; `animate-spin` drives rotation.
 */
export function Spinner({ size = 14, className = "" }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      className={`animate-spin ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
