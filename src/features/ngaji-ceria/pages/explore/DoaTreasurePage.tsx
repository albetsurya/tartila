import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ExploreHeader } from "../../components/ExploreHeader";
import { Sparkles } from "../../../../components/ui/CustomIcons";
import { DOA_CATEGORIES } from "./exploreData";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

type KendiTheme = {
  bodyBg: string;
  bodyHoverBg: string;
  neckBg: string;
  rimBg: string;
  collarBg: string;
  iconRingBg: string;
  waterPrimary: string;
  waterSecondary: string;
  badgeText: string;
};

/**
 * Menyesuaikan warna keramik kendi dan air oase berdasarkan judul kategori doa
 */
function getKendiStyleByTitle(title: string, index: number): KendiTheme {
  const t = title.toLowerCase();

  // 1. Pagi / Sore / Petang / Cahaya
  if (t.includes("pagi") || t.includes("petang") || t.includes("sore")) {
    return {
      bodyBg: "bg-[#FEF3C7]",
      bodyHoverBg: "group-hover:bg-[#FDE68A]",
      neckBg: "bg-[#F59E0B]",
      rimBg: "bg-[#B45309]",
      collarBg: "bg-[#FACC15]",
      iconRingBg: "bg-[#FFFBEB]",
      waterPrimary: "#38BDF8",
      waterSecondary: "#0284C7",
      badgeText: "Sejuk Pagi & Petang",
    };
  }

  // 2. Sholat / Masjid / Ibadah / Wudhu
  if (
    t.includes("sholat") ||
    t.includes("salat") ||
    t.includes("ibadah") ||
    t.includes("masjid") ||
    t.includes("wudhu")
  ) {
    return {
      bodyBg: "bg-[#ECFDF5]",
      bodyHoverBg: "group-hover:bg-[#D1FAE5]",
      neckBg: "bg-[#059669]",
      rimBg: "bg-[#065F46]",
      collarBg: "bg-[#34D399]",
      iconRingBg: "bg-[#FFFFFF]",
      waterPrimary: "#2DD4BF",
      waterSecondary: "#0D9488",
      badgeText: "Air Suci Ibadah",
    };
  }

  // 3. Tidur / Malam / Istirahat
  if (t.includes("tidur") || t.includes("malam") || t.includes("istirahat")) {
    return {
      bodyBg: "bg-[#F3E8FF]",
      bodyHoverBg: "group-hover:bg-[#E9D5FF]",
      neckBg: "bg-[#7C3AED]",
      rimBg: "bg-[#5B21B6]",
      collarBg: "bg-[#FACC15]",
      iconRingBg: "bg-[#FFFFFF]",
      waterPrimary: "#60A5FA",
      waterSecondary: "#2563EB",
      badgeText: "Embun Malam Tenang",
    };
  }

  // 4. Makan / Minum / Rezeki
  if (t.includes("makan") || t.includes("minum") || t.includes("rezeki")) {
    return {
      bodyBg: "bg-[#FFE4E6]",
      bodyHoverBg: "group-hover:bg-[#FECDD3]",
      neckBg: "bg-[#E11D48]",
      rimBg: "bg-[#9F1239]",
      collarBg: "bg-[#FBBF24]",
      iconRingBg: "bg-[#FFFFFF]",
      waterPrimary: "#38BDF8",
      waterSecondary: "#0284C7",
      badgeText: "Berkah Hidangan",
    };
  }

  // 5. Perjalanan / Kendaraan / Safar / Rumah
  if (
    t.includes("perjalanan") ||
    t.includes("bepergian") ||
    t.includes("safar") ||
    t.includes("kendaraan") ||
    t.includes("rumah")
  ) {
    return {
      bodyBg: "bg-[#E0F2FE]",
      bodyHoverBg: "group-hover:bg-[#BAE6FD]",
      neckBg: "bg-[#0284C7]",
      rimBg: "bg-[#075985]",
      collarBg: "bg-[#FACC15]",
      iconRingBg: "bg-[#FFFFFF]",
      waterPrimary: "#38BDF8",
      waterSecondary: "#0369A1",
      badgeText: "Bekal Perjalanan",
    };
  }

  // 6. Adab / Akhlak / Keluarga / Orang Tua / Ilmu
  if (
    t.includes("adab") ||
    t.includes("akhlak") ||
    t.includes("keluarga") ||
    t.includes("orang tua") ||
    t.includes("ilmu") ||
    t.includes("belajar")
  ) {
    return {
      bodyBg: "bg-[#FFEDD5]",
      bodyHoverBg: "group-hover:bg-[#FED7AA]",
      neckBg: "bg-[#EA580C]",
      rimBg: "bg-[#9A3412]",
      collarBg: "bg-[#FDE047]",
      iconRingBg: "bg-[#FFFBEB]",
      waterPrimary: "#38BDF8",
      waterSecondary: "#0284C7",
      badgeText: "Tetes Akhlak Mulia",
    };
  }

  // Default: Kendi Terakota Oase Klasik (Bergantian hangat & sejuk)
  const isEven = index % 2 === 0;
  return {
    bodyBg: isEven ? "bg-[#FEF3C7]" : "bg-[#FFEDD5]",
    bodyHoverBg: isEven
      ? "group-hover:bg-[#FDE68A]"
      : "group-hover:bg-[#FED7AA]",
    neckBg: isEven ? "bg-[#D97706]" : "bg-[#B45309]",
    rimBg: "bg-[#78350F]",
    collarBg: "bg-[#38BDF8]",
    iconRingBg: "bg-[#FFFFFF]",
    waterPrimary: "#38BDF8",
    waterSecondary: "#0284C7",
    badgeText: "Air Sejuk Oase",
  };
}

export default function DoaTreasurePage() {
  const navigate = useNavigate();

  const back = () => {
    navigate("/member/ngaji-ceria/map");
  };

  const handleCategoryClick = (categoryTitle: string) => {
    triggerBibiReaction("click");
    navigate(`/member/ngaji-ceria/explore/doa/kategori/${categoryTitle}`);
  };

  return (
    <NgajiCeriaLayout
      title="Oase Gurun Doa"
      hideHeader={true}
      themeScope="doa"
      onBack={back}
    >
      {/* Background Pasir Gurun (#FDE68A) */}
      <div className="min-h-[100dvh] w-full bg-[#FDE68A] relative overflow-x-hidden pb-36 select-none">
        {/* Pola Butiran Pasir Gurun */}
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage: "radial-gradient(#D97706 2px, transparent 2px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* ILUSTRASI BUKIT PASIR & MATA AIR OASE GURUN DI BAWAH */}
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-36 sm:h-44 z-0 overflow-hidden">
          <svg
            viewBox="0 0 1000 180"
            preserveAspectRatio="xMidYMin slice"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Bukit Pasir Belakang */}
            <path
              d="M-20,95 Q220,25 480,80 T1020,55 L1020,180 L-20,180 Z"
              fill="#D97706"
              stroke="#451A03"
              strokeWidth="4"
            />
            {/* Bukit Pasir Depan */}
            <path
              d="M-20,115 Q280,65 550,110 T1020,90 L1020,180 L-20,180 Z"
              fill="#F59E0B"
              stroke="#451A03"
              strokeWidth="4"
            />
            {/* Kolam Mata Air Oase di Tengah */}
            <ellipse
              cx="500"
              cy="155"
              rx="260"
              ry="34"
              fill="#0284C7"
              stroke="#451A03"
              strokeWidth="4"
            />
            <ellipse cx="500" cy="158" rx="190" ry="20" fill="#38BDF8" />
            {/* Batu-Batu Oasis di Tepi Kolam */}
            <ellipse
              cx="250"
              cy="146"
              rx="22"
              ry="10"
              fill="#78350F"
              stroke="#451A03"
              strokeWidth="3.5"
            />
            <ellipse
              cx="750"
              cy="146"
              rx="24"
              ry="11"
              fill="#78350F"
              stroke="#451A03"
              strokeWidth="3.5"
            />
          </svg>
        </div>

        <div className="relative z-10">
          {/* HEADER: Oase Gurun */}
          <ExploreHeader
            title="Oase Doa Harian"
            subtitle="Kendi Air Sejuk & Batu Oasis Padang Pasir"
            onBack={back}
            themeScope="doa"
            themeColorClass="bg-[#D97706]"
            borderColorClass="border-[#451A03]"
            shadowClass="shadow-[0_4px_0px_#451A03]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF3C7] text-[#451A03] border-[#451A03] shadow-[3px_3px_0px_#451A03] hover:bg-[#FDE68A]"
          />

          {/* HERO: Padang Pasir, Pohon Kurma, Kendi & Mata Air Oase */}
          <div className="px-4 pt-6 max-w-3xl mx-auto">
            <section className="relative rounded-3xl bg-[#78350F] border-[4px] border-[#451A03] shadow-[6px_6px_0px_#451A03] px-5 py-6 overflow-hidden text-[#FEF3C7]">
              {/* Dekorasi Cahaya Matahari Gurun di Latar Hero */}
              <div className="pointer-events-none absolute -right-6 -bottom-10 w-36 h-36 rounded-full bg-[#92400E] border-[3px] border-[#451A03] opacity-60" />

              {/* Ilustrasi Pohon Kurma, Kendi & Air Oase di Kanan */}
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="bg-[#FEF3C7] p-2.5 rounded-2xl border-[3.5px] border-[#451A03] shadow-[4px_4px_0px_#451A03]">
                  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                    {/* Matahari Kecil */}
                    <circle
                      cx="16"
                      cy="16"
                      r="7"
                      fill="#FACC15"
                      stroke="#451A03"
                      strokeWidth="2.5"
                    />
                    {/* Batang Pohon Kurma */}
                    <path
                      d="M34 22 C36 32 35 42 32 50 H40 C42 42 42 32 39 22 Z"
                      fill="#B45309"
                      stroke="#451A03"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* Daun Pohon Kurma Rimbun */}
                    <path
                      d="M36 22 C24 12 12 16 10 24 C20 20 28 22 36 22 Z"
                      fill="#16A34A"
                      stroke="#451A03"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M36 22 C48 12 58 16 60 24 C50 20 44 22 36 22 Z"
                      fill="#16A34A"
                      stroke="#451A03"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M36 20 C28 6 16 6 14 12 C22 12 30 16 36 20 Z"
                      fill="#22C55E"
                      stroke="#451A03"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M36 20 C44 6 54 6 56 12 C48 12 42 16 36 20 Z"
                      fill="#22C55E"
                      stroke="#451A03"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* Buah Kurma Menggantung */}
                    <circle
                      cx="33"
                      cy="24"
                      r="2.5"
                      fill="#F59E0B"
                      stroke="#451A03"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="39"
                      cy="24"
                      r="2.5"
                      fill="#F59E0B"
                      stroke="#451A03"
                      strokeWidth="1.5"
                    />
                    {/* Kolam Air Oase */}
                    <ellipse
                      cx="32"
                      cy="52"
                      rx="24"
                      ry="7"
                      fill="#0284C7"
                      stroke="#451A03"
                      strokeWidth="2.5"
                    />
                    <ellipse cx="32" cy="53" rx="16" ry="3.5" fill="#38BDF8" />
                    {/* Kendi Kecil di Tepi Oase */}
                    <circle
                      cx="16"
                      cy="46"
                      r="6"
                      fill="#D97706"
                      stroke="#451A03"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative z-10 max-w-[70%] sm:max-w-[75%]">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#0284C7] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FFFFFF] border-[2.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03] mb-2.5">
                  <Sparkles size={12} /> Mata Air Oase Gurun
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-black leading-tight text-[#FEF3C7]">
                  Reguk Kesejukan Doa di Tengah Gurun
                </h2>
                <p className="mt-1.5 text-xs font-bold text-[#FDE68A] leading-relaxed">
                  Setiap kendi air dan batu oasis menyimpan doa harian penyejuk
                  hati di bawah teduhnya pohon kurma.
                </p>
              </div>
            </section>
          </div>

          {/* KATEGORI DOA: SILUET "KENDI AIR OASE" (WATER PITCHER) */}
          <section className="px-4 pt-8 max-w-3xl mx-auto">
            <div className="mb-5 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-xl bg-[#0284C7] border-[3px] border-[#451A03] px-3.5 py-1.5 shadow-[3px_3px_0px_#451A03]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEF08A] border border-[#451A03]" />
                <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-[#FFFFFF]">
                  Kendi Air Kategori Doa ({DOA_CATEGORIES.length})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 pt-2">
              {DOA_CATEGORIES.map((category, index) => {
                const Icon = category.icon;
                const kendi = getKendiStyleByTitle(category.title, index);

                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => handleCategoryClick(category.title)}
                    className="group relative flex flex-col items-center pt-7 pb-2.5 px-2 text-center transition-transform duration-150 hover:-translate-y-1 active:translate-y-[3px] cursor-pointer focus:outline-none"
                  >
                    {/* ===================================================== */}
                    {/* 1. MULUT, BIBIR & LEHER KENDI (MENYATU DALAM TOMBOL)  */}
                    {/* ===================================================== */}
                    <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                      {/* Bibir Atas Mulut Kendi + Lubang Gelap */}
                      <div
                        className={`w-16 h-4 rounded-full ${kendi.rimBg} border-[3.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03] flex items-center justify-center`}
                      >
                        <div className="w-10 h-1.5 rounded-full bg-[#451A03]" />
                      </div>
                      {/* Leher Kendi */}
                      <div
                        className={`w-11 h-4 -mt-0.5 ${kendi.neckBg} border-x-[3.5px] border-[#451A03] relative flex items-center justify-center`}
                      >
                        {/* Cincin Ornamen Leher Kendi */}
                        <div
                          className={`w-13 h-2 rounded-full ${kendi.collarBg} border-[2.5px] border-[#451A03]`}
                        />
                      </div>
                    </div>

                    {/* ===================================================== */}
                    {/* 2. CORONG TUANG KENDI (KIRI) & TETES AIR SEJUK        */}
                    {/* ===================================================== */}
                    <div className="pointer-events-none absolute top-9 left-0 z-0 flex items-center">
                      <svg
                        width="28"
                        height="34"
                        viewBox="0 0 28 34"
                        fill="none"
                      >
                        {/* Corong Kendi */}
                        <path
                          d="M26 10 L8 3 C4 2 2 6 5 10 L24 24 Z"
                          fill="#D97706"
                          stroke="#451A03"
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                        />
                        {/* Tetes Air Menggantung di Ujung Corong */}
                        <path
                          d="M5 15 C5 15 10 21 10 24.5 C10 27.2 7.8 29 5 29 C2.2 29 0 27.2 0 24.5 C0 21 5 15 5 15 Z"
                          fill="#38BDF8"
                          stroke="#451A03"
                          strokeWidth="2.5"
                        />
                      </svg>
                    </div>

                    {/* ===================================================== */}
                    {/* 3. GAGANG KENDI MELENGKUNG (KANAN)                    */}
                    {/* ===================================================== */}
                    <div
                      className={`pointer-events-none absolute top-8 right-0 w-7 h-16 rounded-r-[22px] border-[4px] border-l-0 border-[#451A03] ${kendi.neckBg} shadow-[3px_3px_0px_#451A03] z-0 flex items-center justify-start`}
                    >
                      <div className="w-3 h-8 rounded-r-full bg-[#FDE68A] border-[3px] border-l-0 border-[#451A03]" />
                    </div>

                    {/* ===================================================== */}
                    {/* 4. BADAN UTAMA KENDI AIR ( AMPHORA BELLY )            */}
                    {/* ===================================================== */}
                    <div
                      className={`relative z-10 w-full flex flex-col items-center justify-between overflow-hidden rounded-[48px_48px_40px_40px] border-[4px] border-[#451A03] ${kendi.bodyBg} ${kendi.bodyHoverBg} px-3.5 pt-6 pb-8 shadow-[5px_5px_0px_#451A03] group-active:shadow-[2px_2px_0px_#451A03] transition-colors min-h-[192px]`}
                    >
                      {/* Kilap Keramik Kendi di Kiri Atas */}
                      <div className="pointer-events-none absolute top-4 left-4 w-2.5 h-8 rounded-full bg-white/80 rotate-[18deg]" />
                      <div className="pointer-events-none absolute top-13 left-3 w-2 h-2 rounded-full bg-white/80" />

                      {/* Lencana Tetes Nomor di Kanan Atas */}
                      <div className="absolute top-3 right-3.5 z-20 flex items-center justify-center">
                        <span className="inline-flex h-6 min-w-[24px] px-1.5 items-center justify-center rounded-full bg-[#FFFBEB] border-[2.5px] border-[#451A03] text-[10px] font-black text-[#78350F] shadow-[1.5px_1.5px_0px_#451A03]">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Medali Ikon Kategori di Tengah Perut Kendi */}
                      <div
                        className={`relative z-20 mb-2 flex h-14 w-14 items-center justify-center rounded-full ${kendi.iconRingBg} border-[3.5px] border-[#451A03] shadow-[3px_3px_0px_#451A03] group-hover:scale-110 transition-transform p-1`}
                      >
                        <Icon size={20} stroke="#451A03" />
                      </div>

                      {/* Judul Kategori Doa */}
                      <div className="relative z-20 w-full px-1 my-1">
                        <p className="font-display font-black text-sm sm:text-base text-[#451A03] leading-tight line-clamp-2">
                          {category.title}
                        </p>
                        <span className="mt-0.5 block text-[9px] font-extrabold uppercase tracking-wider text-[#92400E]">
                          {kendi.badgeText}
                        </span>
                      </div>

                      {/* Pill Jumlah Tetes Doa (Mengapung di Atas Permukaan Air) */}
                      <div className="relative z-20 mt-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] border-[2.5px] border-[#451A03] px-3 py-0.5 text-[10px] font-black text-[#0284C7] shadow-[2px_2px_0px_#451A03]">
                          <span className="h-2 w-2 rounded-full bg-[#38BDF8] border border-[#451A03]" />
                          {category.count} Tetes Doa
                        </span>
                      </div>

                      {/* ================================================= */}
                      {/* 5. GELOMBANG AIR SEJUK DI DASAR PERUT KENDI       */}
                      {/* ================================================= */}
                      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-9 z-10 overflow-hidden">
                        <svg
                          viewBox="0 0 200 45"
                          preserveAspectRatio="none"
                          className="w-full h-full"
                          fill="none"
                        >
                          {/* Gelombang Air Belakang */}
                          <path
                            d="M0,14 Q50,2 100,14 T200,14 L200,45 L0,45 Z"
                            fill={kendi.waterSecondary}
                            stroke="#451A03"
                            strokeWidth="3.5"
                          />
                          {/* Gelombang Air Depan */}
                          <path
                            d="M0,22 Q50,32 100,20 T200,22 L200,45 L0,45 Z"
                            fill={kendi.waterPrimary}
                            stroke="#451A03"
                            strokeWidth="3.5"
                          />
                          {/* Gelembung Air Sejuk */}
                          <circle cx="38" cy="33" r="3" fill="#E0F2FE" />
                          <circle cx="155" cy="31" r="3.5" fill="#E0F2FE" />
                          <circle cx="96" cy="36" r="2.5" fill="#E0F2FE" />
                        </svg>
                      </div>
                    </div>

                    {/* ===================================================== */}
                    {/* 6. KAKI DASAR KENDI TERAKOTA (PITCHER FOOT BASE)      */}
                    {/* ===================================================== */}
                    <div
                      className={`pointer-events-none relative z-0 -mt-1.5 w-20 h-4 rounded-b-2xl ${kendi.rimBg} border-[3.5px] border-[#451A03] shadow-[3px_3px_0px_#451A03]`}
                    />
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
