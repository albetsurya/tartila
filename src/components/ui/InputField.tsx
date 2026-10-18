// src/components/ui/InputField.tsx
import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  rightAction?: ReactNode;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, icon, rightAction, error, className = "", id, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-black text-[#134E4A] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0D9488]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`
              w-full rounded-xl border-[3px] border-[#134E4A] bg-white
              px-4 py-3 text-sm font-bold text-[#134E4A]
              placeholder:text-[#134E4A]/40
              focus:outline-none focus:border-[#0D9488]
              shadow-[2px_2px_0px_#134E4A] focus:shadow-[2px_2px_0px_#0D9488]
              transition-all
              ${icon ? "pl-10" : ""}
              ${rightAction ? "pr-10" : ""}
              ${error ? "border-[#FF6B6B]" : ""}
              ${className}
            `}
            {...props}
          />
          {rightAction}
        </div>
        {error && (
          <p className="mt-1 text-[10px] font-bold text-[#FF6B6B]">{error}</p>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";
