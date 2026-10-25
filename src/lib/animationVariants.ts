// src/lib/animationVariants.ts
import type { Variants, TargetAndTransition } from "framer-motion";

/**
 * Standard Kids App Page Transition (YouTube Kids / Khan Academy style)
 * Fast (0.15s - 0.18s), subtle fade & slide-up (y: 10 to 0), no wide horizontal slides.
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.18,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

/**
 * Rapid Staggered Animation for Kids Cards List (Warung, Game Hub, Map, etc.)
 * Stagger 0.025s (snappy) and bouncy spring (stiffness: 300, damping: 20).
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.01,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

/**
 * Standard Kids App Card Spring & Interactive Variants
 */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export const cardHoverVariants: TargetAndTransition = {
  scale: 1.03,
  y: -4,
};

export const cardTapVariants: TargetAndTransition = {
  scale: 0.95,
  y: 2,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 20,
    duration: 0.08,
  },
};

/**
 * Button Hover Wiggle (Playful kids feedback)
 */
export const buttonWiggleHover: TargetAndTransition = {
  scale: 1.03,
  rotate: [0, -2, 2, -2, 0],
  transition: { duration: 0.25 },
};

/**
 * Button Pulse for Primary CTAs
 */
export const buttonPulseAnimate: TargetAndTransition = {
  scale: [1, 1.03, 1],
  transition: {
    repeat: Infinity,
    duration: 1.8,
    ease: "easeInOut",
  },
};
