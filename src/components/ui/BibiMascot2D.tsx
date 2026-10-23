// 2.5D Tito mascot variants — a thin, performance-aware layer over the
// hand-crafted `TitoMascot` (layered SVG + Framer Motion).
//
// - "animated": Framer Motion float + wing flaps (default).
// - "static":   SVG only, no looping animations (cheap to render).

import { motion, useReducedMotion } from "framer-motion";
import { TitoMascot, type TitoMascotProps } from "./TitoMascot";

export type TitoMascotVariant = "animated" | "static";
export type BibiMascotVariant = TitoMascotVariant;

export interface TitoMascot2DProps extends Omit<TitoMascotProps, "animation"> {
  /** Rendering mode. Defaults to "animated". */
  variant?: TitoMascotVariant;
  /** Force the static variant when the OS requests reduced motion. */
  respectReducedMotion?: boolean;
  /** Which animation to use in "animated" mode. Defaults to "float". */
  animatedAnimation?: TitoMascotProps["animation"];
}

export type BibiMascot2DProps = TitoMascot2DProps;

export function TitoMascot2D({
  variant = "animated",
  respectReducedMotion = true,
  animatedAnimation = "float",
  ...props
}: TitoMascot2DProps) {
  const reducedMotion = useReducedMotion();
  const isStatic =
    variant === "static" || (respectReducedMotion && reducedMotion === true);

  return (
    <TitoMascot {...props} animation={isStatic ? "none" : animatedAnimation} />
  );
}

export const BibiMascot2D = TitoMascot2D;

export interface TitoWaveProps extends TitoMascot2DProps {
  size?: number;
}

export type BibiWaveProps = TitoWaveProps;

/**
 * Tito waving — used on the login hero / welcome overlay.
 * Adds a gentle side-to-side tilt on top of the animated variant so it reads
 * as a greeting; collapses to a still SVG in the static variant.
 */
export function TitoWave({
  variant = "animated",
  respectReducedMotion = true,
  animatedAnimation = "float",
  size = 240,
  className,
  mood,
  direction,
  ...props
}: TitoWaveProps) {
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
      <TitoMascot
        {...props}
        size={size}
        mood={mood ?? "happy"}
        direction={direction ?? "right"}
        animation={isStatic ? "none" : animatedAnimation}
      />
    </motion.div>
  );
}

export const BibiWave = TitoWave;
