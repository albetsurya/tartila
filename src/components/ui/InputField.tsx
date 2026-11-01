// src/components/ui/InputField.tsx
import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  icon?: ReactNode;
  rightAction?: ReactNode;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      helperText,
      icon,
      rightAction,
      error,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs md:text-sm font-bold text-[#183B38] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0D9488] pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`
              w-full h-11 rounded-xl bg-white
              px-3.5 text-sm font-medium text-[#183B38]
              placeholder:text-[#64748B]/60
              border-[1.5px] border-[#DCE5E3]
              shadow-[1px_1px_0px_rgba(19,78,74,0.08)]
              hover:border-[#134E4A]/60
              focus:outline-none focus:border-[#0D9488] focus:shadow-[2px_2px_0px_#0D9488]
              transition-all
              disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:cursor-not-allowed
              ${icon ? "pl-10" : ""}
              ${rightAction ? "pr-10" : ""}
              ${error ? "border-[#FF6B6B] focus:border-[#FF6B6B] focus:shadow-[2px_2px_0px_#FF6B6B]" : ""}
              ${className}
            `}
            {...props}
          />
          {rightAction && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {rightAction}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs font-semibold text-[#B91C1C]">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-[#64748B]">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

InputField.displayName = "InputField";
