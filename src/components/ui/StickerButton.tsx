// src/components/ui/StickerButton.tsx
import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost"
  | "coral-outline";

export type ButtonSize = "sm" | "md" | "lg";
export type PulseIntensity = "subtle" | "medium" | "strong";
export type IconPosition = "left" | "right" | "only";

export interface StickerButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  pulse?: boolean;
  pulseIntensity?: PulseIntensity;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  children?: React.ReactNode;
}

// Professional Neo-Brutalism Button Styles (Chapter 6B)
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0D9488] text-white border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-[#0F766E] hover:shadow-[3px_3px_0px_#134E4A] active:shadow-[1px_1px_0px_#134E4A]",
  secondary:
    "bg-white text-[#134E4A] border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-[#F0FDF4] hover:shadow-[3px_3px_0px_#134E4A] active:shadow-[1px_1px_0px_#134E4A]",
  outline:
    "bg-transparent text-[#183B38] border border-[#DCE5E3] hover:border-[#134E4A] hover:bg-slate-50 active:bg-slate-100 shadow-none",
  danger:
    "bg-[#FF6B6B] text-white border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-[#E63946] hover:shadow-[3px_3px_0px_#134E4A] active:shadow-[1px_1px_0px_#134E4A]",
  "coral-outline":
    "bg-[#FFF0F0] text-[#FF6B6B] border-2 border-[#FF6B6B] shadow-[2px_2px_0px_#FF6B6B] hover:bg-[#FFE4E6]",
  ghost:
    "bg-transparent text-[#183B38] border-transparent shadow-none hover:bg-slate-100 dark:hover:bg-slate-800",
};

// Standardized Heights (Chapter 6B: 44-48px standard touch targets)
const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs rounded-lg gap-1.5",
  md: "h-11 px-4 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2.5",
};

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 w-9 p-0 text-xs rounded-lg",
  md: "h-11 w-11 p-0 text-sm rounded-xl",
  lg: "h-12 w-12 p-0 text-base rounded-xl",
};

const spinnerSizes: Record<ButtonSize, string> = {
  sm: "w-3.5 h-3.5 border-2",
  md: "w-4 h-4 border-2",
  lg: "w-5 h-5 border-[2.5px]",
};

const pulseScaleMap: Record<PulseIntensity, number[]> = {
  subtle: [1, 1.015, 1],
  medium: [1, 1.025, 1],
  strong: [1, 1.04, 1],
};

const pulseDurationMap: Record<PulseIntensity, number> = {
  subtle: 2.2,
  medium: 1.8,
  strong: 1.4,
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
      pulseIntensity = "medium",
      icon,
      iconPosition = "left",
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
    const isIconOnly = iconPosition === "only";
    const sizeClasses = isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size];

    const spinner = (
      <div
        className={`${spinnerSizes[size]} border-current border-t-transparent rounded-full animate-spin shrink-0`}
        role="status"
        aria-label="Memuat"
      />
    );

    const renderContent = () => {
      if (isIconOnly) {
        return loading ? spinner : (icon ?? children);
      }

      const showLeftSpinner = loading && iconPosition === "left";
      const showRightSpinner = loading && iconPosition === "right";
      const showFallbackSpinner = loading && !icon && iconPosition !== "right";

      const leading = showLeftSpinner || showFallbackSpinner ? (
        spinner
      ) : !loading && icon && iconPosition === "left" ? (
        <span className="shrink-0 flex items-center justify-center text-[18px]">
          {icon}
        </span>
      ) : null;

      const trailing = showRightSpinner ? (
        spinner
      ) : !loading && icon && iconPosition === "right" ? (
        <span className="shrink-0 flex items-center justify-center text-[18px]">
          {icon}
        </span>
      ) : null;

      return (
        <>
          {leading}
          {children}
          {trailing}
        </>
      );
    };

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        animate={
          pulse
            ? (animate ?? { scale: pulseScaleMap[pulseIntensity] })
            : animate
        }
        whileHover={
          isDisabled
            ? undefined
            : (whileHover ?? {
                scale: 1.02,
                y: -1,
                transition: { type: "spring", stiffness: 400, damping: 20 },
              })
        }
        whileTap={
          isDisabled
            ? undefined
            : (whileTap ?? {
                scale: 0.98,
                y: 1,
                transition: {
                  type: "spring",
                  stiffness: 450,
                  damping: 20,
                  duration: 0.08,
                },
              })
        }
        transition={
          pulse && !transition
            ? {
                repeat: Infinity,
                duration: pulseDurationMap[pulseIntensity],
                ease: "easeInOut",
              }
            : (transition ?? { type: "spring", stiffness: 400, damping: 25 })
        }
        className={`
          inline-flex items-center justify-center
          font-bold tracking-tight cursor-pointer select-none transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
          ${variantStyles[variant]}
          ${sizeClasses}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {renderContent()}
      </motion.button>
    );
  },
);

StickerButton.displayName = "StickerButton";
