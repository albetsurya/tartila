import { motion } from "framer-motion";

export function TartilaLogo({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 380 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-auto sm:h-16 select-none"
        role="img"
        aria-label="Tartila Logo - تارتيلا"
      >
        {/* ============================================================
            1. BINTANG 4-SUDUT (Warm Yellow #F6C851)
           ============================================================ */}
        <g fill="#F6C851">
          <path d="M 48 18 Q 50.5 23.5 56 26 Q 50.5 28.5 48 34 Q 45.5 28.5 40 26 Q 45.5 23.5 48 18 Z" />
          <path d="M 155 6 Q 157.8 12.2 164 15 Q 157.8 17.8 155 24 Q 152.2 17.8 146 15 Q 152.2 12.2 155 6 Z" />
          <path d="M 232 10 Q 234 14.5 238.5 16.5 Q 234 18.5 232 23 Q 230 18.5 225.5 16.5 Q 230 14.5 232 10 Z" />
          <path d="M 326 18 Q 328.5 23.5 334 26 Q 328.5 28.5 326 34 Q 323.5 28.5 318 26 Q 323.5 23.5 326 18 Z" />
          <path d="M 26 68 Q 28.2 73 33 75 Q 28.2 77 26 82 Q 23.8 77 19 75 Q 23.8 73 26 68 Z" />
          <path d="M 342 74 Q 344.5 79.5 350 82 Q 344.5 84.5 342 90 Q 339.5 84.5 334 82 Q 339.5 79.5 342 74 Z" />
          <path d="M 92 108 Q 94.5 113.5 100 116 Q 94.5 118.5 92 124 Q 89.5 118.5 84 116 Q 89.5 113.5 92 108 Z" />
          <path d="M 225 132 Q 227.5 137.5 233 140 Q 227.5 142.5 225 148 Q 222.5 142.5 217 140 Q 222.5 137.5 225 132 Z" />
        </g>

        {/* ============================================================
            2. SWOOSH SENYUM / UNDERLINE (Coral Pink #FF7366 + Stiker Putih)
           ============================================================ */}
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Layer 1: Outline Stiker Putih */}
          <path d="M 122 108 Q 190 142 258 108" stroke="#FFFFFF" strokeWidth="20" />
          <path d="M 115 116 C 115 103, 122 100, 132 103" stroke="#FFFFFF" strokeWidth="18" />
          <path d="M 265 116 C 265 103, 258 100, 248 103" stroke="#FFFFFF" strokeWidth="18" />

          {/* Layer 2: Inti Coral Pink */}
          <path d="M 122 108 Q 190 142 258 108" stroke="#FF7366" strokeWidth="10" />
          <path d="M 115 116 C 115 103, 122 100, 132 103" stroke="#FF7366" strokeWidth="8" />
          <path d="M 265 116 C 265 103, 258 100, 248 103" stroke="#FF7366" strokeWidth="8" />
        </g>

        {/* ============================================================
            3. KALIGRAFI ARAB "تارتيلا" (Custom Vector Path)
           ============================================================ */}
        <defs>
          <g id="tartila-letters" strokeLinecap="round" strokeLinejoin="round">
            {/* 1. Kelompok Kanan: تا (Ta + Alif) */}
            <path d="M 300 54 L 300 68 Q 300 76 286 76 L 262 76 L 262 28" />

            {/* 2. Kelompok Tengah: ر (Ra) */}
            <path d="M 230 54 L 230 70 Q 230 92 204 94" />

            {/* 3. Kelompok Kiri: تيلا (Ta + Ya + Lam-Alif لا) */}
            <path d="M 196 54 L 196 68 Q 196 76 182 76 L 162 76 Q 152 76 152 66 L 152 54 L 152 66 Q 152 76 138 76 L 114 76 L 114 28 L 114 66 Q 114 80 86 80 L 58 80" />
            {/* Batang Alif miring untuk membentuk huruf لا (Lam-Alif) */}
            <path d="M 62 32 C 80 44, 96 62, 98 78" />
          </g>

          {/* Titik-titik Huruf Teal (Nuqthah) */}
          <g id="teal-dots">
            {/* 2 Titik Ta kedua (ت) di atas */}
            <circle cx="180" cy="34" r="8.5" />
            <circle cx="198" cy="34" r="8.5" />
            {/* 2 Titik Ya (ي) di bawah */}
            <circle cx="143" cy="95" r="8.5" />
            <circle cx="161" cy="95" r="8.5" />
          </g>

          {/* 2 Titik Coral Pink di atas huruf pertama Ta (ت) di kanan */}
          <g id="pink-dots">
            <circle cx="284" cy="34" r="8.5" />
            <circle cx="302" cy="34" r="8.5" />
          </g>
        </defs>

        {/* LAYER A: Stiker Putih Luar (Paling Tebal) */}
        <use href="#tartila-letters" stroke="#FFFFFF" strokeWidth="31" />
        <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="14">
          <use href="#teal-dots" />
          <use href="#pink-dots" />
        </g>

        {/* LAYER B: Outline Deep Teal Gelap (#06373A) */}
        <use href="#tartila-letters" stroke="#06373A" strokeWidth="22" />
        <g fill="#06373A" stroke="#06373A" strokeWidth="6">
          <use href="#teal-dots" />
          <use href="#pink-dots" />
        </g>

        {/* LAYER C: Isi Warna Utama (Deep Teal #0E5A60 & Coral Pink #FF7366) */}
        <use href="#tartila-letters" stroke="#0E5A60" strokeWidth="15.5" />
        <use href="#teal-dots" fill="#0E5A60" />
        <use href="#pink-dots" fill="#FF7366" />
      </svg>
    </motion.div>
  );
}