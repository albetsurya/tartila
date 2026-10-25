// src/components/ui/StickerButton.tsx
import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "coral-outline";
type ButtonSize = "sm" | "md" | "lg";

export interface StickerButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  pulse?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--btn-primary-bg,#0D9488)] text-white border-[var(--border-color,#134E4A)] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)]",
  secondary:
    "bg-[var(--bg-card,#FFFFFF)] text-[var(--text-main,#134E4A)] border-[var(--border-color,#134E4A)] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)]",
  danger:
    "bg-[#FF6B6B] text-white border-[var(--border-color,#134E4A)] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)]",
  "coral-outline":
    "bg-[var(--bg-card,#FFF0F0)] text-[#FF6B6B] border-[var(--border-color,#134E4A)] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)]",
  ghost:
    "bg-transparent text-[var(--text-main,#134E4A)] border-transparent shadow-none hover:bg-black/5 dark:hover:bg-white/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-xs rounded-xl",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-2xl",
};

export const StickerButton = forwardRef<HTMLButtonElement, StickerButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth,
      loading,
      disabled,
      pulse,
      className = "",
      children,
      whileHover,
      whileTap,
      transition,
      animate,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        animate={
          pulse
            ? (animate ?? { scale: [1, 1.025, 1] })
            : animate
        }
        whileHover={
          isDisabled
            ? undefined
            : (whileHover ?? {
                scale: 1.03,
                rotate: [0, -2, 2, -2, 0],
                transition: { duration: 0.25 },
              })
        }
        whileTap={
          isDisabled
            ? undefined
            : (whileTap ?? {
                scale: 0.95,
                y: 2,
                transition: { type: "spring", stiffness: 400, damping: 20, duration: 0.08 },
              })
        }
        transition={
          pulse && !transition
            ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
            : (transition ?? { type: "spring", stiffness: 400, damping: 25 })
        }
        className={`
          inline-flex items-center justify-center gap-2
          font-black border-[3px] tracking-wide
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <div
            className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"
            role="status"
            aria-label="Memuat"
          />
        )}
        {children}
      </motion.button>
    );
  },
);

StickerButton.displayName = "StickerButton";
