export function TartilaLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center -ml-2 ${className}`}>
      <svg
        viewBox="0 0 240 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-auto" // Atur tinggi di sini agar pas di header
      >
        {/* Tulisan Arab "تارتيلا" - Gaya Kaligrafi */}
        <text
          x="10"
          y="42"
          fontFamily="serif"
          fontWeight="900"
          fontSize="36"
          fill="#134E4A"
          stroke="#F0FDF4"
          strokeWidth="2"
          paintOrder="stroke"
          textAnchor="start"
        >
          تارتيلا
        </text>

        {/* Aksen Garis Lengkung (Swoosh) Coral di bawah tulisan Arab */}
        <path
          d="M 15 50 Q 40 62 65 50"
          stroke="#FF6B6B"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Titik Dua (Nuqthah) di atas huruf Ta (ت) - Warnai Coral */}
        <circle cx="22" cy="10" r="3" fill="#FF6B6B" />
        <circle cx="35" cy="10" r="3" fill="#FF6B6B" />
      </svg>
    </div>
  );
}
