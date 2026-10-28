import React from 'react';

export type PatternType = '1-datar' | '1-naik' | '1-turun' | '2-datar-turun' | '3-datar-naik-turun' | '4-datar-naik-naik-turun';
export type ArrowType = 'datar' | 'naik' | 'turun';

const ARROW_LABEL: Record<PatternType, string> = {
  '1-datar': 'Datar',
  '1-naik': 'Naik',
  '1-turun': 'Turun',
  '2-datar-turun': 'Datar-Turun',
  '3-datar-naik-turun': 'Datar-Naik-Turun',
  '4-datar-naik-naik-turun': 'Datar-Naik-Naik-Turun',
};

const ARROW_SYMBOL: Record<PatternType, string> = {
  '1-datar': '→',
  '1-naik': '↗',
  '1-turun': '↘',
  '2-datar-turun': '→↘',
  '3-datar-naik-turun': '→↗↘',
  '4-datar-naik-naik-turun': '→↗↗↘',
};

const ARROW_COLOR: Record<PatternType, string> = {
  '1-datar': 'text-[#0D9488]',
  '1-naik': 'text-[#F59E0B]',
  '1-turun': 'text-[#FF6B6B]',
  '2-datar-turun': 'text-[#10B981]',
  '3-datar-naik-turun': 'text-[#7C3AED]',
  '4-datar-naik-naik-turun': 'text-[#5B21B1]',
};

export interface PatternArrowButtonProps {
  type: PatternType;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  /** Opsional label lain dari pengguna (misal: "1 Nada"). */
  label?: string;
}

/**
 * Tombol panah interaktif (Neo-Brutalism).
 * Visual: border tebal 3px, hard shadow, border teal #134E4A,
 * warna sesuai jenis: Datar teal, Naik kuning, Turun merah.
 */
export function PatternArrowButton({
  type,
  onClick,
  active = false,
  disabled = false,
  className = '',
  label,
}: PatternArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center gap-1
        rounded-xl border-[3px] border-[#134E4A] bg-white p-2.5 shadow-[4px_4px_0px_#134E4A]
        active:translate-y-[2px] active:shadow-none
        ${active ? 'border-[#0D9488] shadow-[4px_4px_0px_#0D9488]' : ''}
        ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span
        className={`text-3xl font-black leading-none ${ARROW_COLOR[type]}`}
        dir="ltr"
      >
        {ARROW_SYMBOL[type]}
      </span>
      <span className="text-[10px] font-black text-[#64748B]">{label ?? ARROW_LABEL[type]}</span>
    </button>
  );
}
