import type { WudhuStep } from "../data/steps";
import { NGAJI_CERIA_ASSETS } from "@/features/ngaji-ceria/data/assets";

export function NodeChip({
  step,
  index,
  active,
  completed,
  disabled,
  onTap,
}: {
  step: WudhuStep;
  index: number;
  active: boolean;
  completed: boolean;
  disabled: boolean;
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onTap}
      aria-label={`Langkah ${index + 1}: ${step.name}`}
      className={`flex min-h-[52px] items-center gap-3 rounded-2xl border-2 border-[#134E4A] p-3 text-left transition-all active:scale-[0.97] relative z-30 ${
        active
          ? "bg-[#0D9488] shadow-[3px_3px_0px_#134E4A]"
          : completed
            ? "bg-[#115E59] shadow-[2px_2px_0px_#134E4A] opacity-90"
            : "bg-[#134E4A] shadow-[1px_1px_0px_#134E4A] opacity-60"
      }`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10 border border-[#134E4A]/40">
        {completed ? (
          <img
            src={NGAJI_CERIA_ASSETS.iconCheckMark}
            alt="Complete"
            className="h-6 w-6 object-contain"
          />
        ) : step.art ? (
          <img
            src={step.art}
            alt={step.name}
            draggable={false}
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <span className="text-xl">{step.icon}</span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] text-teal-200">Langkah {index + 1}</span>
        <span className="block truncate text-xs font-black text-white">{step.name}</span>
        <span className="game-arabic block truncate text-xs text-teal-200 font-bold" dir="rtl">
          {step.arabic}
        </span>
      </span>
    </button>
  );
}
