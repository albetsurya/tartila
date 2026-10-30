import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ExploreHeader } from "../../components/ExploreHeader";
import {
  ChevronRight,
  Search,
  Volume2,
  LockSvg,
  Sparkles,
} from "../../../../components/ui/CustomIcons";
import { DOA_CATEGORIES, DOA_LIST } from "./exploreData";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

export default function DoaTreasurePage() {
  const navigate = useNavigate();
  const back = () => {
    navigate("/member/ngaji-ceria/map");
  };

  const handleNavigate = (path: string) => {
    triggerBibiReaction("click");
    navigate(path);
  };

  return (
    <NgajiCeriaLayout
      title="Oase Gurun Doa"
      hideHeader={true}
      themeScope="doa"
      onBack={back}
    >
      {/* Background Pasir Gurun (#FDE68A) */}
      <div className="min-h-[100dvh] w-full bg-[#FDE68A] relative overflow-x-hidden pb-32 select-none">
        {/* Pola Butiran Pasir Gurun */}
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage: "radial-gradient(#D97706 2px, transparent 2px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* Bukit Pasir Gurun di Bawah */}
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-40 bg-[#F59E0B] border-t-[4px] border-[#451A03] z-0"
          style={{
            clipPath:
              "polygon(0% 45%, 28% 15%, 60% 40%, 88% 10%, 100% 30%, 100% 100%, 0% 100%)",
          }}
        />

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

          {/* HERO: Padang Pasir, Pohon Kurma & Mata Air Oase */}
          <div className="px-4 pt-6 max-w-3xl mx-auto">
            <section className="relative rounded-3xl bg-[#78350F] border-[4px] border-[#451A03] shadow-[6px_6px_0px_#451A03] px-5 py-6 overflow-hidden text-[#FEF3C7]">
              {/* Ilustrasi Pohon Kurma & Air Oase di Kanan */}
              <div className="absolute right-4 top-3 flex flex-col items-center">
                <div className="bg-[#FEF3C7] p-2 rounded-2xl border-[3px] border-[#451A03] shadow-[3px_3px_0px_#451A03]">
                  <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
                    {/* Daun Pohon Kurma */}
                    <path
                      d="M24 18C18 10 8 12 6 18C12 16 18 18 24 18Z"
                      fill="#15803D"
                      stroke="#451A03"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M24 18C30 10 40 12 42 18C36 16 30 18 24 18Z"
                      fill="#15803D"
                      stroke="#451A03"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M24 16C20 6 12 4 10 8C16 9 20 13 24 16Z"
                      fill="#16A34A"
                      stroke="#451A03"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M24 16C28 6 36 4 38 8C32 9 28 13 24 16Z"
                      fill="#16A34A"
                      stroke="#451A03"
                      strokeWidth="2.5"
                    />
                    {/* Batang Kurma */}
                    <path
                      d="M22 18L20 38H28L26 18H22Z"
                      fill="#B45309"
                      stroke="#451A03"
                      strokeWidth="2.5"
                    />
                    {/* Kolam Air Oase */}
                    <ellipse
                      cx="24"
                      cy="40"
                      rx="16"
                      ry="5"
                      fill="#0284C7"
                      stroke="#451A03"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative z-10 max-w-[74%]">
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

          {/* PENCARIAN */}
          <div className="px-4 pt-5 max-w-3xl mx-auto">
            <div className="flex items-center gap-2.5 rounded-2xl border-[4px] border-[#451A03] bg-[#FFFBEB] px-4 py-3 shadow-[4px_4px_0px_#451A03]">
              <Search size={20} className="text-[#D97706]" />
              <input
                type="text"
                placeholder="Cari kendi atau batu doa di oase..."
                className="w-full bg-transparent text-sm font-black text-[#451A03] placeholder:text-[#92400E]/60 focus:outline-none"
              />
            </div>
          </div>

          {/* KATEGORI DOA: DIBENTUK SEPERTI "KENDI AIR" (WATER PITCHER) */}
          <section className="px-4 pt-8 max-w-3xl mx-auto">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-block rounded-xl bg-[#0284C7] border-[3px] border-[#451A03] px-3.5 py-1 font-display font-black text-xs uppercase tracking-wider text-[#FFFFFF] shadow-[3px_3px_0px_#451A03]">
                Kendi Air Kategori Doa
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-9 pt-4">
              {DOA_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.key} className="relative pt-6 px-1">
                    {/* MULUT & LEHER KENDI AIR DI ATAS */}
                    <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                      <div className="w-16 h-3.5 rounded-full bg-[#B45309] border-[3px] border-[#451A03]" />
                      <div className="w-11 h-4 bg-[#D97706] border-x-[3px] border-[#451A03]" />
                    </div>

                    {/* Gagang Kendi di Sisi Kanan */}
                    <div className="pointer-events-none absolute top-7 -right-1 w-6 h-14 rounded-r-full border-[4px] border-l-0 border-[#451A03] bg-transparent z-0" />

                    {/* Badan Kendi Air (Membulat seperti Guci/Kendi) */}
                    <button
                      type="button"
                      onClick={() =>
                        handleNavigate("/member/ngaji-ceria/explore/doa")
                      }
                      className="group relative z-10 w-full flex flex-col items-center text-center overflow-hidden rounded-[36px_36px_28px_28px] border-[4px] border-[#451A03] bg-[#FEF3C7] p-4 pt-5 pb-6 shadow-[5px_5px_0px_#451A03] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
                    >
                      <div className="absolute top-3 right-3 z-10">
                        <LockSvg size={14} className="text-[#B45309]" />
                      </div>

                      <div className="relative z-10 mb-2.5 flex h-12 w-12 items-center justify-center rounded-full bg-[#E0F2FE] border-[3px] border-[#451A03] shadow-[3px_3px_0px_#451A03] group-hover:scale-105 transition-transform">
                        <Icon size={22} className="text-[#0284C7]" />
                      </div>

                      <p className="relative z-10 font-display font-black text-sm sm:text-base text-[#451A03] leading-tight">
                        {category.title}
                      </p>
                      <div className="relative z-10 mt-2">
                        <span className="inline-block rounded-full bg-[#0284C7] border-[2px] border-[#451A03] px-3 py-0.5 text-[10px] font-black text-[#FFFFFF] shadow-[2px_2px_0px_#451A03]">
                          {category.count} Tetes Doa
                        </span>
                      </div>

                      {/* Gelombang Air di Dasar Kendi */}
                      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-3 bg-[#38BDF8] border-t-[3px] border-[#451A03]" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* DAFTAR SELURUH DOA: DIBENTUK SEPERTI "BATU OASIS" DI TEPI MATA AIR */}
          <section className="px-4 pt-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-block rounded-xl bg-[#78350F] border-[3px] border-[#451A03] px-4 py-1.5 shadow-[3px_3px_0px_#451A03]">
              <h4 className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-[#FEF3C7]">
                Batu Oasis Doa ({DOA_LIST.length})
              </h4>
            </div>

            <div className="space-y-4">
              {DOA_LIST.map((doa, index) => {
                const stoneShape =
                  index % 2 === 0
                    ? "rounded-[26px_18px_28px_16px]"
                    : "rounded-[18px_28px_16px_26px]";

                return (
                  <button
                    key={doa.id}
                    type="button"
                    onClick={() =>
                      handleNavigate(
                        `/member/ngaji-ceria/explore/doa/${doa.id}`,
                      )
                    }
                    className={`group relative flex w-full items-center gap-3.5 ${stoneShape} bg-[#FFFBEB] border-[4px] border-[#451A03] px-4 py-3.5 text-left shadow-[5px_5px_0px_#451A03] hover:bg-[#FEF3C7] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer overflow-hidden`}
                  >
                    {/* Aksen Air Oasis di Sisi Kiri Batu */}
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-2.5 bg-[#0284C7] border-r-[2.5px] border-[#451A03]" />

                    {/* Permata Air Nomor */}
                    <span className="ml-1 shrink-0 w-10 h-10 rounded-[14px_18px_14px_18px] bg-[#0284C7] border-[3px] border-[#451A03] text-[#FEF08A] flex items-center justify-center text-xs font-black shadow-[2px_2px_0px_#451A03]">
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-display font-black text-sm sm:text-base text-[#451A03] truncate">
                        {doa.title}
                      </p>
                      <span className="inline-block mt-0.5 rounded-md bg-[#FDE68A] border-[2px] border-[#451A03] px-2 py-0.2 text-[10px] font-extrabold text-[#78350F]">
                        {doa.category}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] border-[2.5px] border-[#451A03] flex items-center justify-center shadow-[2px_2px_0px_#451A03]">
                        <Volume2 size={15} className="text-[#0284C7]" />
                      </div>
                      <ChevronRight size={18} className="text-[#451A03]" />
                    </div>
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
