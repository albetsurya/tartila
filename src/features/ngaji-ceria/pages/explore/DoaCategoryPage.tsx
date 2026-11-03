import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ExploreHeader } from "../../components/ExploreHeader";
import { Search } from "../../../../components/ui/CustomIcons";
import { DOA_CATEGORIES, DOA_LIST } from "./exploreData";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

type DoaVisualConfig = {
  themeLabel: string;
  accentBg: string;
  badgeBg: string;
  rippleColor: string;
  stoneBorderRadius: string;
  renderIcon: () => ReactNode;
};

/**
 * Menentukan bentuk batu, warna aksen, dan ilustrasi SVG Neo-Brutalism
 * secara otomatis berdasarkan kata kunci pada judul doa.
 */
function getDoaVisualByTitle(title: string, index: number): DoaVisualConfig {
  const t = title.toLowerCase();

  // 1. TIDUR / MIMPI (Bulan Sabit & Bintang)
  if (t.includes("tidur") && !t.includes("bangun")) {
    return {
      themeLabel: "Malam & Istirahat",
      accentBg: "bg-[#DDD6FE]",
      badgeBg: "bg-[#7C3AED]",
      rippleColor: "#A78BFA",
      stoneBorderRadius: "rounded-[34px_20px_32px_22px]",
      renderIcon: () => (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <circle cx="34" cy="34" r="22" fill="#451A03" />
          <circle
            cx="31"
            cy="31"
            r="22"
            fill="#DDD6FE"
            stroke="#451A03"
            strokeWidth="3.5"
          />
          <path
            d="M36 17 C26 19 22 30 28 39 C33 46 42 46 47 41 C39 48 25 46 20 36 C15 26 22 15 36 17 Z"
            fill="#FACC15"
            stroke="#451A03"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle
            cx="42"
            cy="23"
            r="3"
            fill="#FACC15"
            stroke="#451A03"
            strokeWidth="2.5"
          />
        </svg>
      ),
    };
  }

  // 2. BANGUN TIDUR / PAGI / SORE (Matahari Terbit)
  if (
    t.includes("bangun") ||
    t.includes("pagi") ||
    t.includes("sore") ||
    t.includes("petang")
  ) {
    return {
      themeLabel: "Cahaya Hari",
      accentBg: "bg-[#FEF08A]",
      badgeBg: "bg-[#EA580C]",
      rippleColor: "#FBBF24",
      stoneBorderRadius: "rounded-[30px_30px_20px_20px]",
      renderIcon: () => (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <circle cx="34" cy="34" r="22" fill="#451A03" />
          <circle
            cx="31"
            cy="31"
            r="22"
            fill="#FEF9C3"
            stroke="#451A03"
            strokeWidth="3.5"
          />
          <circle
            cx="31"
            cy="34"
            r="10"
            fill="#F97316"
            stroke="#451A03"
            strokeWidth="3"
          />
          <path
            d="M31 16 V20 M17 24 L20 27 M45 24 L42 27 M16 40 H46"
            stroke="#451A03"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      ),
    };
  }

  // 3. MAKAN / MINUM / BERBUKA / PUASA (Hidangan Berkah)
  if (
    t.includes("makan") ||
    t.includes("minum") ||
    t.includes("buka") ||
    t.includes("puasa")
  ) {
    return {
      themeLabel: "Rezeki & Hidangan",
      accentBg: "bg-[#FECDD3]",
      badgeBg: "bg-[#E11D48]",
      rippleColor: "#FB7185",
      stoneBorderRadius: "rounded-[28px_28px_34px_34px]",
      renderIcon: () => (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <circle cx="34" cy="34" r="22" fill="#451A03" />
          <circle
            cx="31"
            cy="31"
            r="22"
            fill="#FFE4E6"
            stroke="#451A03"
            strokeWidth="3.5"
          />
          {/* Mangkuk Hidangan */}
          <path
            d="M17 31 H45 C45 41 39 46 31 46 C23 46 17 41 17 31 Z"
            fill="#F43F5E"
            stroke="#451A03"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M23 25 Q25 20 23 17 M31 24 Q33 19 31 16 M39 25 Q41 20 39 17"
            stroke="#451A03"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    };
  }

  // 4. MASJID / SHOLAT / ADZAN / WUDHU (Kubah Masjid)
  if (
    t.includes("masjid") ||
    t.includes("sholat") ||
    t.includes("salat") ||
    t.includes("adzan")
  ) {
    return {
      themeLabel: "Ibadah & Masjid",
      accentBg: "bg-[#A7F3D0]",
      badgeBg: "bg-[#059669]",
      rippleColor: "#34D399",
      stoneBorderRadius: "rounded-[36px_36px_18px_18px]",
      renderIcon: () => (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <circle cx="34" cy="34" r="22" fill="#451A03" />
          <circle
            cx="31"
            cy="31"
            r="22"
            fill="#D1FAE5"
            stroke="#451A03"
            strokeWidth="3.5"
          />
          <path
            d="M19 42 C19 27 31 19 31 19 C31 19 43 27 43 42 Z"
            fill="#10B981"
            stroke="#451A03"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect
            x="27"
            y="32"
            width="8"
            height="10"
            rx="4"
            fill="#FEF08A"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <line
            x1="31"
            y1="14"
            x2="31"
            y2="19"
            stroke="#451A03"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      ),
    };
  }

  // 5. KAMAR MANDI / WC / WUDHU / BERSUCI (Tetes Air Suci)
  if (
    t.includes("mandi") ||
    t.includes("wc") ||
    t.includes("toilet") ||
    t.includes("wudhu") ||
    t.includes("air")
  ) {
    return {
      themeLabel: "Bersuci & Air",
      accentBg: "bg-[#BAE6FD]",
      badgeBg: "bg-[#0284C7]",
      rippleColor: "#38BDF8",
      stoneBorderRadius: "rounded-[32px_20px_32px_20px]",
      renderIcon: () => (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <circle cx="34" cy="34" r="22" fill="#451A03" />
          <circle
            cx="31"
            cy="31"
            r="22"
            fill="#E0F2FE"
            stroke="#451A03"
            strokeWidth="3.5"
          />
          <path
            d="M31 16 C31 16 43 29 43 37 C43 43.5 37.5 47 31 47 C24.5 47 19 43.5 19 37 C19 29 31 16 31 16 Z"
            fill="#38BDF8"
            stroke="#451A03"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M25 36 C25 32 27 29 29 27"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    };
  }

  // 6. RUMAH / MASUK / KELUAR RUMAH (Rumah Hangat)
  if (t.includes("rumah")) {
    return {
      themeLabel: "Rumah & Keluarga",
      accentBg: "bg-[#FED7AA]",
      badgeBg: "bg-[#D97706]",
      rippleColor: "#FB923C",
      stoneBorderRadius: "rounded-[26px_26px_20px_20px]",
      renderIcon: () => (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <circle cx="34" cy="34" r="22" fill="#451A03" />
          <circle
            cx="31"
            cy="31"
            r="22"
            fill="#FFEDD5"
            stroke="#451A03"
            strokeWidth="3.5"
          />
          <rect
            x="21"
            y="29"
            width="20"
            height="15"
            rx="2"
            fill="#FEF3C7"
            stroke="#451A03"
            strokeWidth="3"
          />
          <polygon
            points="17,30 31,17 45,30"
            fill="#F97316"
            stroke="#451A03"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect
            x="28"
            y="34"
            width="6"
            height="10"
            rx="3"
            fill="#D97706"
            stroke="#451A03"
            strokeWidth="2.5"
          />
        </svg>
      ),
    };
  }

  // 7. KENDARAAN / PERJALANAN / BEPERGIAN / NAIK (Awan & Roda Perjalanan)
  if (
    t.includes("kendaraan") ||
    t.includes("perjalanan") ||
    t.includes("bepergian") ||
    t.includes("naik") ||
    t.includes("safar")
  ) {
    return {
      themeLabel: "Perjalanan Aman",
      accentBg: "bg-[#BAE6FD]",
      badgeBg: "bg-[#0369A1]",
      rippleColor: "#38BDF8",
      stoneBorderRadius: "rounded-[20px_34px_20px_34px]",
      renderIcon: () => (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <circle cx="34" cy="34" r="22" fill="#451A03" />
          <circle
            cx="31"
            cy="31"
            r="22"
            fill="#E0F2FE"
            stroke="#451A03"
            strokeWidth="3.5"
          />
          <path
            d="M17 36 L21 24 H39 L44 36 Z"
            fill="#38BDF8"
            stroke="#451A03"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle
            cx="24"
            cy="39"
            r="4.5"
            fill="#FACC15"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <circle
            cx="38"
            cy="39"
            r="4.5"
            fill="#FACC15"
            stroke="#451A03"
            strokeWidth="2.5"
          />
        </svg>
      ),
    };
  }

  // 8. BELAJAR / ILMU / PINTAR (Kitab & Bintang Ilmu)
  if (
    t.includes("belajar") ||
    t.includes("ilmu") ||
    t.includes("ujian") ||
    t.includes("sekolah")
  ) {
    return {
      themeLabel: "Cahaya Ilmu",
      accentBg: "bg-[#FEF08A]",
      badgeBg: "bg-[#B45309]",
      rippleColor: "#FACC15",
      stoneBorderRadius: "rounded-[22px_28px_22px_28px]",
      renderIcon: () => (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <circle cx="34" cy="34" r="22" fill="#451A03" />
          <circle
            cx="31"
            cy="31"
            r="22"
            fill="#FEF9C3"
            stroke="#451A03"
            strokeWidth="3.5"
          />
          <path
            d="M18 24 C23 22 28 24 31 27 C34 24 39 22 44 24 V41 C39 39 34 41 31 44 C28 41 23 39 18 41 Z"
            fill="#FFFFFF"
            stroke="#451A03"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <line
            x1="31"
            y1="27"
            x2="31"
            y2="44"
            stroke="#451A03"
            strokeWidth="3"
          />
        </svg>
      ),
    };
  }

  // 9. HUJAN / PETIR / ANGIN / ALAM (Awan Hujan Berkah)
  if (
    t.includes("hujan") ||
    t.includes("petir") ||
    t.includes("angin") ||
    t.includes("awan")
  ) {
    return {
      themeLabel: "Berkah Alam",
      accentBg: "bg-[#E0F2FE]",
      badgeBg: "bg-[#0284C7]",
      rippleColor: "#38BDF8",
      stoneBorderRadius: "rounded-[34px_30px_24px_28px]",
      renderIcon: () => (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <circle cx="34" cy="34" r="22" fill="#451A03" />
          <circle
            cx="31"
            cy="31"
            r="22"
            fill="#BAE6FD"
            stroke="#451A03"
            strokeWidth="3.5"
          />
          <path
            d="M21 35 C16 35 15 28 20 26 C19 20 27 18 31 22 C35 17 44 20 43 26 C48 28 47 35 41 35 Z"
            fill="#FFFFFF"
            stroke="#451A03"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M24 40 L22 44 M31 40 L29 44 M38 40 L36 44"
            stroke="#0284C7"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      ),
    };
  }

  // 10. ORANG TUA / KELUARGA / ANAK / SAKIT (Kasih Sayang Hati)
  if (
    t.includes("orang tua") ||
    t.includes("ibu") ||
    t.includes("ayah") ||
    t.includes("sakit") ||
    t.includes("menjenguk")
  ) {
    return {
      themeLabel: "Kasih Sayang",
      accentBg: "bg-[#FCE7F3]",
      badgeBg: "bg-[#DB2777]",
      rippleColor: "#F472B6",
      stoneBorderRadius: "rounded-[30px_22px_30px_22px]",
      renderIcon: () => (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <circle cx="34" cy="34" r="22" fill="#451A03" />
          <circle
            cx="31"
            cy="31"
            r="22"
            fill="#FCE7F3"
            stroke="#451A03"
            strokeWidth="3.5"
          />
          <path
            d="M31 43 C31 43 18 35 18 26 C18 21 22 18 26 18 C28.5 18 30 19.5 31 21 C32 19.5 33.5 18 36 18 C40 18 44 21 44 26 C44 35 31 43 31 43 Z"
            fill="#F43F5E"
            stroke="#451A03"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      ),
    };
  }

  // 11. PAKAIAN / BAJU / BERCERMIN (Cermin & Keindahan)
  if (
    t.includes("pakaian") ||
    t.includes("baju") ||
    t.includes("cermin") ||
    t.includes("bercermin")
  ) {
    return {
      themeLabel: "Adab & Syukur",
      accentBg: "bg-[#CCFBF1]",
      badgeBg: "bg-[#0D9488]",
      rippleColor: "#2DD4BF",
      stoneBorderRadius: "rounded-[28px_18px_28px_18px]",
      renderIcon: () => (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <circle cx="34" cy="34" r="22" fill="#451A03" />
          <circle
            cx="31"
            cy="31"
            r="22"
            fill="#CCFBF1"
            stroke="#451A03"
            strokeWidth="3.5"
          />
          <ellipse
            cx="31"
            cy="31"
            rx="9"
            ry="13"
            fill="#38BDF8"
            stroke="#451A03"
            strokeWidth="3"
          />
          <path
            d="M27 25 L33 35"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    };
  }

  // DEFAULT: PERMATA AIR OASIS (Batu Oasis Doa)
  const shapes = [
    "rounded-[32px_18px_30px_20px]",
    "rounded-[20px_32px_18px_30px]",
    "rounded-[28px_24px_34px_18px]",
  ];
  return {
    themeLabel: "Tetes Doa Oase",
    accentBg: "bg-[#E0F2FE]",
    badgeBg: "bg-[#0284C7]",
    rippleColor: "#38BDF8",
    stoneBorderRadius: shapes[index % shapes.length],
    renderIcon: () => (
      <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
        <circle cx="34" cy="34" r="22" fill="#451A03" />
        <circle
          cx="31"
          cy="31"
          r="22"
          fill="#FEF3C7"
          stroke="#451A03"
          strokeWidth="3.5"
        />
        {/* Batu Permata Oase & Tetes Air */}
        <polygon
          points="31,16 43,27 38,43 24,43 19,27"
          fill="#38BDF8"
          stroke="#451A03"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon points="31,20 38,27 31,38 24,27" fill="#BAE6FD" />
      </svg>
    ),
  };
}

export default function DoaCategoryPage() {
  const navigate = useNavigate();
  const { kategori } = useParams<{ kategori: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  const decodedCategory = useMemo(() => {
    return kategori ? decodeURIComponent(kategori) : "";
  }, [kategori]);

  const categoryInfo = useMemo(() => {
    return DOA_CATEGORIES.find(
      (c) =>
        c.title.toLowerCase() === decodedCategory.toLowerCase() ||
        c.key.toLowerCase() === decodedCategory.toLowerCase(),
    );
  }, [decodedCategory]);

  const activeCategoryTitle = categoryInfo?.title ?? decodedCategory;

  const categoryDoas = useMemo(() => {
    return DOA_LIST.filter(
      (d) => d.category.toLowerCase() === activeCategoryTitle.toLowerCase(),
    );
  }, [activeCategoryTitle]);

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return categoryDoas;
    const q = searchQuery.toLowerCase();
    return categoryDoas.filter((d) => d.title.toLowerCase().includes(q));
  }, [categoryDoas, searchQuery]);

  const back = () => {
    triggerBibiReaction("click");
    navigate("/member/ngaji-ceria/explore/doa");
  };

  const handleNavigate = (path: string) => {
    triggerBibiReaction("click");
    navigate(path);
  };

  return (
    <NgajiCeriaLayout
      title={activeCategoryTitle || "Daftar Doa"}
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
            {/* Batu-Batu Kecil di Tepi Oase */}
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
          {/* HEADER */}
          <ExploreHeader
            title={activeCategoryTitle || "Daftar Doa"}
            subtitle={`${categoryDoas.length} Tetes Doa di Oase Gurun`}
            onBack={back}
            themeScope="doa"
            themeColorClass="bg-[#D97706]"
            borderColorClass="border-[#451A03]"
            shadowClass="shadow-[0_4px_0px_#451A03]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF3C7] text-[#451A03] border-[#451A03] shadow-[3px_3px_0px_#451A03] hover:bg-[#FDE68A]"
          />

          {/* PENCARIAN */}
          <div className="px-4 pt-5 max-w-3xl mx-auto">
            <div className="flex items-center gap-2.5 rounded-2xl border-[4px] border-[#451A03] bg-[#FFFBEB] px-4 py-3 shadow-[4px_4px_0px_#451A03]">
              <Search size={20} className="text-[#D97706]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Cari doa ${activeCategoryTitle}...`}
                className="w-full bg-transparent text-sm font-black text-[#451A03] placeholder:text-[#92400E]/60 focus:outline-none"
              />
            </div>
          </div>

          {/* DAFTAR DOA: BATU OASIS & TETES DOA SESUAI JUDUL */}
          <section className="px-4 pt-6 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-xl bg-[#78350F] border-[3px] border-[#451A03] px-4 py-1.5 shadow-[3px_3px_0px_#451A03]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#38BDF8] border border-[#451A03]" />
              <h4 className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-[#FEF3C7]">
                Batu Oasis Doa ({filteredList.length})
              </h4>
            </div>

            {filteredList.length === 0 ? (
              <div className="rounded-3xl border-[4px] border-[#451A03] bg-[#FFFBEB] p-8 text-center shadow-[5px_5px_0px_#451A03]">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF3C7] border-[3px] border-[#451A03] shadow-[3px_3px_0px_#451A03]">
                  <Search size={22} className="text-[#D97706]" />
                </div>
                <h5 className="font-display font-black text-sm text-[#451A03]">
                  Tidak Ada Doa Ditemukan
                </h5>
                <p className="mt-1 text-xs font-bold text-[#78350F]/70">
                  Coba cari dengan kata kunci lain untuk menemukan doa di oase
                  ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 pt-2">
                {filteredList.map((doa, index) => {
                  const visual = getDoaVisualByTitle(doa.title, index);

                  return (
                    <button
                      key={doa.id}
                      type="button"
                      onClick={() =>
                        handleNavigate(
                          `/member/ngaji-ceria/explore/doa/${doa.id}`,
                        )
                      }
                      className={`group relative flex flex-col items-center justify-between p-4 pt-4 pb-3.5 text-center ${visual.stoneBorderRadius} bg-[#FFFBEB] border-[4px] border-[#451A03] shadow-[5px_5px_0px_#451A03] hover:-translate-y-0.5 hover:bg-[#FEF3C7] active:translate-y-[3px] active:shadow-[2px_2px_0px_#451A03] transition-all cursor-pointer overflow-hidden min-h-[176px]`}
                    >
                      {/* Tekstur Lempeng Batu Atas (Highlight) */}
                      <div className="pointer-events-none absolute top-1.5 right-5 h-1.5 w-8 rounded-full bg-white/80" />

                      {/* Riak Mata Air Oasis di Dasar Batu */}
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-3 border-t-[2.5px] border-[#451A03] opacity-90"
                        style={{ backgroundColor: visual.rippleColor }}
                      />

                      {/* Lencana Nomor Berbentuk "Tetes Doa" (Water Droplet SVG) */}
                      <div className="absolute top-2 left-2.5 flex items-center justify-center w-8 h-9">
                        <svg
                          viewBox="0 0 36 42"
                          className="w-full h-full drop-shadow-[1.5px_1.5px_0px_#451A03]"
                          fill="none"
                        >
                          <path
                            d="M18 3 C18 3 33 17 33 26 C33 34.2 26.2 39 18 39 C9.8 39 3 34.2 3 26 C3 17 18 3 18 3 Z"
                            fill="#0284C7"
                            stroke="#451A03"
                            strokeWidth="3"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="absolute mt-1.5 text-[10px] font-black text-[#FEF08A]">
                          {index + 1}
                        </span>
                      </div>

                      {/* Ilustrasi Dinamis Sesuai Judul Doa */}
                      <div className="mt-2 mb-1 transition-transform duration-200 group-hover:scale-110">
                        {visual.renderIcon()}
                      </div>

                      {/* Judul Doa */}
                      <div className="w-full px-1 flex flex-col items-center flex-1 justify-center">
                        <p className="font-display font-black text-xs sm:text-sm text-[#451A03] leading-snug line-clamp-2">
                          {doa.title}
                        </p>
                      </div>

                      {/* Label Tema Sesuai Judul Doa */}
                      <div className="w-full mt-2.5 mb-1.5 flex justify-center relative z-10">
                        <span
                          className={`inline-block rounded-lg ${visual.accentBg} border-[2.5px] border-[#451A03] px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black text-[#451A03] shadow-[1.5px_1.5px_0px_#451A03] truncate max-w-full`}
                        >
                          {visual.themeLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
