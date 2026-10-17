// src/components/ui/PageHero.tsx
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  illustration?: ReactNode;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  illustration,
  className = "",
}: PageHeroProps) {
  return (
    <header
      className={`rounded-b-[32px] bg-[#134E4A] px-5 pb-16 pt-safe text-white relative overflow-hidden border-b-[3px] border-[#134E4A] ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -right-6 -top-6 h-44 w-44"
        >
          {illustration}
        </motion.div>
      </div>

      <div className="pt-6 relative z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FF6B6B]">
          {eyebrow}
        </span>
        <h1 className="mt-1 font-display text-2xl font-black">{title}</h1>
        {description && (
          <p className="text-xs font-medium text-white/70 mt-2 max-w-[200px] leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
