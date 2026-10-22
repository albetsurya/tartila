import { ARABIC_KEYBOARD, type TileStatus } from "../data/word-list";

const colors: Record<TileStatus | "action", string> = {
  empty: "border-2 border-[#134E4A] bg-[#115E59] text-white shadow-[2px_2px_0px_#134E4A]",
  correct: "border-2 border-[#134E4A] bg-[#059669] text-white shadow-[2px_2px_0px_#134E4A]",
  present: "border-2 border-[#134E4A] bg-[#D97706] text-white shadow-[2px_2px_0px_#134E4A]",
  absent: "border-2 border-[#134E4A] bg-[#134E4A] text-teal-200/40 shadow-[2px_2px_0px_#134E4A]",
  action: "border-2 border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]",
};

export function ArabicKeyboard({
  keyStatuses,
  onKey,
  onBackspace,
  onSubmit,
  disabled,
}: {
  keyStatuses: Record<string, TileStatus>;
  onKey: (letter: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-1.5 relative z-30" dir="rtl" aria-label="Keyboard Arab">
      {ARABIC_KEYBOARD.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {row.map((letter) => (
            <button
              type="button"
              key={letter}
              disabled={disabled}
              onClick={() => onKey(letter)}
              className={`min-h-[44px] min-w-[30px] sm:min-w-[40px] rounded-xl px-1 text-sm sm:text-base font-black flex items-center justify-center transition-all active:scale-95 ${
                colors[keyStatuses[letter] ?? "empty"]
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-2 pt-1">
        <button
          type="button"
          disabled={disabled}
          onClick={onBackspace}
          className={`min-h-[44px] px-5 rounded-xl text-xs font-black flex items-center justify-center transition-all active:scale-95 ${colors.action}`}
        >
          Hapus
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onSubmit}
          className={`min-h-[44px] px-7 rounded-xl text-xs font-black flex items-center justify-center transition-all active:scale-95 ${colors.action}`}
        >
          Tebak
        </button>
      </div>
    </div>
  );
}
