// src/components/ui/StickerButton.tsx
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "coral-outline";
type ButtonSize = "sm" | "md" | "lg";

interface StickerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0D9488] text-white border-[#134E4A] shadow-[3px_3px_0px_#134E4A]",
  secondary:
    "bg-white text-[#134E4A] border-[#134E4A] shadow-[3px_3px_0px_#134E4A]",
  danger:
    "bg-[#FF6B6B] text-white border-[#134E4A] shadow-[3px_3px_0px_#134E4A]",
  "coral-outline":
    "bg-[#FFF0F0] text-[#FF6B6B] border-[#134E4A] shadow-[3px_3px_0px_#134E4A]",
  ghost:
    "bg-transparent text-[#134E4A] border-transparent shadow-none hover:bg-[#F0FDF4]",
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
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center gap-2
          font-black border-[3px] tracking-wide
          transition-all
          active:translate-y-[2px] active:shadow-none
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0px_#134E4A]
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {loading && <span className="animate-spin">⏳</span>}
        {children}
      </button>
    );
  },
);

StickerButton.displayName = "StickerButton";
