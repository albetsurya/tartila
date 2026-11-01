// src/components/ui/StickerBadge.tsx
import React from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "completed"
  | "neutral"
  | "primary";

export type BadgeSize = "sm" | "md";
export type BadgeShape = "pill" | "rounded";

export interface StickerBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  dot?: boolean;
  brutal?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

// Semantic Status Colors (Chapter 4 & 6C)
const variantStyles: Record<
  BadgeVariant,
  { bg: string; text: string; border: string; dot: string }
> = {
  success: {
    bg: "bg-[#DCFCE7]",
    text: "text-[#166534]",
    border: "border-[#86EFAC]",
    dot: "bg-[#16A34A]",
  },
  warning: {
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    border: "border-[#FDE68A]",
    dot: "bg-[#D97706]",
  },
  danger: {
    bg: "bg-[#FEE2E2]",
    text: "text-[#B91C1C]",
    border: "border-[#FECACA]",
    dot: "bg-[#DC2626]",
  },
  info: {
    bg: "bg-[#DBEAFE]",
    text: "text-[#1D4ED8]",
    border: "border-[#BFDBFE]",
    dot: "bg-[#2563EB]",
  },
  completed: {
    bg: "bg-[#CCFBF1]",
    text: "text-[#0F766E]",
    border: "border-[#99F6E4]",
    dot: "bg-[#0D9488]",
  },
  neutral: {
    bg: "bg-[#F1F5F9]",
    text: "text-[#475569]",
    border: "border-[#CBD5E1]",
    dot: "bg-[#64748B]",
  },
  primary: {
    bg: "bg-[#CCFBF1]",
    text: "text-[#134E4A]",
    border: "border-[#0D9488]",
    dot: "bg-[#0D9488]",
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "h-6 px-2 text-[11px] gap-1",
  md: "h-7 px-2.5 text-xs gap-1.5",
};

export const StickerBadge: React.FC<StickerBadgeProps> = ({
  variant = "neutral",
  size = "md",
  shape = "pill",
  dot = false,
  brutal = false,
  icon,
  className = "",
  children,
  ...props
}) => {
  const current = variantStyles[variant];
  const roundedClass = shape === "pill" ? "rounded-full" : "rounded-lg";

  // 25% Neo-Brutalism Accent (Border tegas dan hard shadow kecil jika brutal=true)
  const borderAndShadow = brutal
    ? "border-[1.5px] border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]"
    : `border ${current.border}`;

  return (
    <span
      className={`
        inline-flex items-center font-bold tracking-tight select-none shrink-0
        ${current.bg} ${current.text}
        ${sizeStyles[size]}
        ${roundedClass}
        ${borderAndShadow}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${current.dot}`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
};

StickerBadge.displayName = "StickerBadge";
