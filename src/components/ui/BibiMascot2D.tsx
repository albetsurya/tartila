// 2.5D Bibi mascot variants — a thin, performance-aware layer over the
// hand-crafted `BibiMascot` (layered SVG + Framer Motion).
//
// - "animated": Framer Motion float + wing flaps (default).
// - "static":   SVG only, no looping animations (cheap to render).
//
// `BibiMascot` itself is never modified; we only choose its `animation` prop.

import { motion, useReducedMotion } from "framer-motion";
import { BibiMascot, type BibiMascotProps } from "./BibiMascot";

export type BibiMascotVariant = "animated" | "static";

export interface BibiMascot2DProps extends Omit<BibiMascotProps, "animation"> {
  /** Rendering mode. Defaults to "animated". */
  variant?: BibiMascotVariant;
  /** Force the static variant when the OS requests reduced motion. */
  respectReducedMotion?: boolean;
  /** Which animation to use in "animated" mode. Defaults to "float". */
  animatedAnimation?: BibiMascotProps["animation"];
}

export function BibiMascot2D({
  variant = "animated",
  respectReducedMotion = true,
  animatedAnimation = "float",
  ...props
}: BibiMascot2DProps) {
  const reducedMotion = useReducedMotion();
  const isStatic =
    variant === "static" || (respectReducedMotion && reducedMotion === true);

  return (
    <BibiMascot {...props} animation={isStatic ? "none" : animatedAnimation} />
  );
}

export interface BibiWaveProps extends BibiMascot2DProps {
  size?: number;
}

/**
 * Bibi waving — used on the login hero / welcome overlay.
 * Adds a gentle side-to-side tilt on top of the animated variant so it reads
 * as a greeting; collapses to a still SVG in the static variant.
 */
export function BibiWave({
  variant = "animated",
  respectReducedMotion = true,
  animatedAnimation = "float",
  size = 240,
  className,
  mood,
  direction,
  ...props
}: BibiWaveProps) {
  const reducedMotion = useReducedMotion();
  const isStatic =
    variant === "static" || (respectReducedMotion && reducedMotion === true);

  return (
    <motion.div
      className={className}
      style={{ originX: 0.5, originY: 0.9, display: "inline-flex" }}
      animate={isStatic ? undefined : { rotate: [-3, 3, -3] }}
      transition={
        isStatic
          ? undefined
          : { repeat: Infinity, duration: 1.6, ease: "easeInOut" }
      }
    >
      <BibiMascot
        {...props}
        size={size}
        mood={mood ?? "happy"}
        direction={direction ?? "right"}
        animation={isStatic ? "none" : animatedAnimation}
      />
    </motion.div>
  );
}
