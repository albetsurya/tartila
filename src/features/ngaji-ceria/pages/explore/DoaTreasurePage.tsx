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
      title="Kumpulan Doa Harian"
      hideHeader={true}
      themeScope="doa"
      onBack={back}
    >
      <div className="min-h-[100dvh] w-full bg-[#B45309] relative overflow-x-hidden pb-28">
        {/* Pola papan kayu horizontal */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #7C2D12 0px, #7C2D12 2px, transparent 2px, transparent 46px), repeating-linear-gradient(90deg, #92400E22 0px, #92400E22 1px, transparent 1px, transparent 9px)",
          }}
        />
        {/* Palm sapling */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(#FEF3C733 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative z-10">
          {/* HEADER: Papan kayu dengan paku Terstandarisasi [Hati] [Koin] */}
          <ExploreHeader
            title="Gudang Doa"
            subtitle="Peti Karun Doa Sehari-hari"
            onBack={back}
            themeScope="doa"
            themeColorClass="bg-[#7C2D12]"
            borderColorClass="border-[#B45309]"
            shadowClass="shadow-[0_3px_0px_#451A03]"
            textColorClass="text-[#FDE68A]"
            backClass="bg-[#92400E] text-[#FDE68A] border-[#B45309] shadow-[2px_2px_0px_#451A03]"
          >
            {/* Paku besi di sudut papan */}
            <div className="pointer-events-none absolute left-3 right-3 top-1 h-2 flex justify-between z-20">
              <span className="w-2 h-2 rounded-full bg-[#FCA5A5] border border-[#450A0A]" />
              <span className="w-2 h-2 rounded-full bg-[#FCA5A5] border border-[#450A0A]" />
            </div>
            {/* Kunci emas menempel */}
            <svg
              className="pointer-events-none absolute right-24 top-3.5 w-6 h-6 text-[#FBBF24] rotate-[18deg] opacity-90 z-20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="7" cy="7" r="3.5" />
              <path d="M9.5 9.5 17 17m0-2 2 2m-3 1 2 2m-8-7 1.5 1.5" />
            </svg>
          </ExploreHeader>

          {/* HERO: Lentera + intro */}
          <div className="px-4 pt-6">
            <section className="relative rounded-2xl bg-[#78350F] border-[3px] border-[#FDE68A] shadow-[5px_5px_0px_#451A03] px-5 py-5 overflow-hidden">
              {/* Cahaya lentera */}
              <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[#FBBF24]/20 blur-2xl" />
              <div className="absolute right-5 top-5 rotate-12">
                <svg
                  className="w-10 h-10 text-[#FBBF24]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 3h6M10 6h4m-6 2h8l1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L7 8Z" />
                  <path d="M12 11v6" stroke="#FDE68A" />
                  <circle cx="12" cy="14" r="1.6" fill="#FDE68A" stroke="none" />
                </svg>
              </div>
              <div className="relative z-10 max-w-[82%]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBBF24]/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FDE68A] border-2 border-[#FBBF24]/30 mb-2">
                  <Sparkles size={12} /> Peti Harta
                </span>
                <h2 className="font-display text-xl font-black leading-tight text-[#FDE68A]">
                  Buka peti doa-doa tersembunyi
                </h2>
                <p className="mt-2 text-[11px] font-bold text-[#FDE68A]/75 leading-relaxed">
                  Setiap gulungan berisi doa harian untuk menjaga hari-mu.
                  Dekati dengan kunci emas di tanganmu.
                </p>
              </div>
            </section>
          </div>

          {/* Pencarian: lubang peti dengan tali */}
          <div className="px-4 pt-4">
            <div className="flex items-center gap-2 rounded-full border-[3px] border-[#FDE68A] bg-[#78350F] px-4 py-3 shadow-[3px_3px_0px_#451A03]">
              <Search size={18} className="text-[#FBBF24]" />
              <input
                type="text"
                placeholder="Raba gulungan doa..."
                className="w-full bg-transparent text-sm font-bold text-[#FDE68A] placeholder:text-[#FDE68A]/40 focus:outline-none"
              />
            </div>
          </div>

          {/* Kartu kategori: peti kecil berisi gulungan */}
          <section className="grid grid-cols-2 gap-3 px-4 pt-4">
            {DOA_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => handleNavigate("/member/ngaji-ceria/explore/doa")}
                  className="relative flex flex-col text-left rounded-xl bg-[#78350F] border-[3px] border-[#FDE68A] p-3 pb-4 shadow-[3px_3px_0px_#451A03] active:translate-y-[3px] active:shadow-none transition-all overflow-hidden"
                >
                  {/* Peti: garis μαren kayu + engsel */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, transparent 0, transparent 10px, #7C2D1244 10px, #7C2D1244 12px)",
                    }}
                  />
                  {/* Engsel emas */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-[#FBBF24] border-2 border-[#450A0A] rounded-full z-10" />
                  {/* Kunci emas pojok */}
                  <div className="absolute top-2 right-2 z-10">
                    <LockSvg size={14} className="text-[#FBBF24]" />
                  </div>
                  {/* Gulungan menyembul dari peti */}
                  <div className="relative z-10 mb-2">
                    <span className="block w-11 h-10 rounded-sm bg-[#FEF3C7] border-[2.5px] border-[#B45309] shadow-[2px_2px_0px_#450A0A] rotate-[-4deg] relative">
                      <span className="absolute inset-x-1.5 top-1.5 bottom-1.5 border-t border-b border-dashed border-[#B45309]/40" />
                    </span>
                    <Icon
                      size={18}
                      className="absolute -right-1 -bottom-1 text-[#0D9488]"
                    />
                  </div>
                  <p className="relative z-10 font-display font-black text-sm text-[#FDE68A] leading-tight">
                    {category.title}
                  </p>
                  <div className="relative z-10 mt-2">
                    <span className="inline-block rounded-md bg-[#FBBF24] border-2 border-[#450A0A] px-2 py-0.5 text-[9px] font-black text-[#450A0A] shadow-[1.5px_1.5px_0px_#450A0A]">
                      {category.count} doa
                    </span>
                  </div>
                </button>
              );
            })}
          </section>

          {/* Daftar seluruh doa: gulungan kertas di atas lantai kayu */}
          <section className="px-4 pt-6 space-y-3">
            <h4 className="font-display font-black text-sm text-[#FDE68A] flex items-center gap-2">
              <span className="w-7 h-[3px] bg-[#FBBF24] rounded-full" />
              Semua Gulungan
            </h4>

            {DOA_LIST.map((doa, index) => (
              <button
                key={doa.id}
                type="button"
                onClick={() =>
                  handleNavigate(`/member/ngaji-ceria/explore/doa/${doa.id}`)
                }
                className="w-full text-left"
              >
                <div
                  className="relative w-full flex items-center gap-3 rounded-md px-2.5 py-3 shadow-[3px_3px_0px_rgba(69,26,3,0.6)] active:translate-y-[3px] active:shadow-none transition-all"
                  style={{
                    background: "linear-gradient(90deg,#FDF6E3 0%,#FEF3C7 70%,#F6E7C1 100%)",
                    border: "2.5px solid #92400E",
                  }}
                >
                  {/* Ujung gulungan bergelombang */}
                  <span className="absolute -left-1 top-1 bottom-1 w-3 bg-[#F6E7C1] border-[2.5px] border-r-0 border-[#92400E] rounded-l-full -z-10" />
                  <span className="absolute -right-1 top-1 bottom-1 w-3 bg-[#F6E7C1] border-[2.5px] border-l-0 border-[#92400E] rounded-r-full -z-10" />

                  {/* Stempel nomor wax */}
                  <span className="relative shrink-0 w-8 h-8 rounded-full bg-[#92400E] border-2 border-[#450A0A] text-[#FDE68A] flex items-center justify-center text-xs font-black shadow-inner">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-display font-black text-sm text-[#7C2D12] truncate">
                      {doa.title}
                    </p>
                    <p className="text-[10px] font-bold text-[#7C2D12]/60 mt-0.5">
                      {doa.category}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#FDE68A]/60 border-2 border-[#92400E]/40 flex items-center justify-center">
                      <Volume2 size={14} className="text-[#92400E]" />
                    </div>
                    <ChevronRight size={16} className="text-[#92400E]" />
                  </div>
                </div>
              </button>
            ))}
          </section>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
