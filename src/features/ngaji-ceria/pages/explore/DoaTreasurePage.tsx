import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  ChevronRight,
  Search,
  Volume2,
} from "../../../../components/ui/FontAwesomeIcons";
import { DOA_CATEGORIES, DOA_LIST } from "./exploreData";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

export default function DoaTreasurePage() {
  const navigate = useNavigate();
  const back = () => navigate("/member/ngaji-ceria/map");

  const handleNavigate = (path: string) => {
    triggerBibiReaction("click");
    navigate(path);
  };

  return (
    <NgajiCeriaLayout title="Kumpulan Doa Harian" onBack={back}>
      <div className="space-y-5 bg-[#F0FDF4] px-4 py-4 min-h-full rounded-t-3xl pb-32">
        {/* Search Bar (Sticker Style) */}
        <div className="flex items-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-white px-4 py-3 shadow-[3px_3px_0px_#134E4A]">
          <Search size={18} className="text-[#134E4A]" />
          <input
            type="text"
            placeholder="Cari doa harianmu..."
            className="w-full bg-transparent text-sm font-bold text-[#134E4A] placeholder:text-[#134E4A]/40 focus:outline-none"
          />
        </div>

        {/* Category Grid (Sticker Style) */}
        <section className="grid grid-cols-2 gap-3">
          {DOA_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.key}
                type="button"
                onClick={() =>
                  handleNavigate(`/member/ngaji-ceria/explore/doa`)
                } // Sesuaikan route jika perlu
                className="flex flex-col text-left rounded-2xl bg-white border-[3px] border-[#134E4A] p-3.5 shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 border-2 border-[#0D9488]/20 flex items-center justify-center">
                  <Icon size={20} className="text-[#0D9488]" />
                </div>
                <p className="mt-2.5 font-display font-black text-sm text-[#134E4A] leading-tight">
                  {category.title}
                </p>
                <div className="mt-auto pt-2">
                  <span className="inline-block rounded-md bg-[#F0FDF4] border-2 border-[#0D9488]/30 px-2 py-0.5 text-[9px] font-black text-[#0D9488]">
                    {category.count}
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        {/* List View (Sticker Style) */}
        <section className="space-y-3">
          <h4 className="font-display font-black text-sm text-[#134E4A] pt-2">
            Semua Doa
          </h4>

          {DOA_LIST.map((doa, index) => (
            <button
              key={doa.id}
              type="button"
              onClick={() =>
                handleNavigate(`/member/ngaji-ceria/explore/doa/${doa.id}`)
              }
              className="w-full flex items-center gap-3 rounded-2xl bg-white border-[3px] border-[#134E4A] p-3 shadow-[3px_3px_0px_#134E4A] text-left active:translate-y-[2px] active:shadow-none transition-all"
            >
              {/* Nomor */}
              <span className="shrink-0 w-8 h-8 rounded-lg bg-[#F0FDF4] border-2 border-[#0D9488]/30 text-[#0D9488] flex items-center justify-center text-xs font-black">
                {index + 1}
              </span>

              {/* Teks */}
              <div className="min-w-0 flex-1">
                <p className="font-display font-black text-sm text-[#134E4A] truncate">
                  {doa.title}
                </p>
                <p className="text-[10px] font-bold text-[#134E4A]/60 mt-0.5">
                  {doa.category}
                </p>
              </div>

              {/* Aksi */}
              <div className="shrink-0 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#FFF0F0] border-2 border-[#FF6B6B]/30 flex items-center justify-center">
                  <Volume2 size={14} className="text-[#FF6B6B]" />
                </div>
                <ChevronRight size={16} className="text-[#134E4A]/40" />
              </div>
            </button>
          ))}
        </section>

        <div className="h-32" aria-hidden="true" />
      </div>
    </NgajiCeriaLayout>
  );
}
