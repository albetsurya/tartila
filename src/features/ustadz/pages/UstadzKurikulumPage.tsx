import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StickerButton } from "@/components/ui/StickerButton";
import { InputField } from "@/components/ui/InputField";
import { AppModal } from "@/components/ui/AppModal";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animationVariants";
import {
  CATALOG_TYPE_LABELS,
  LEARNING_CATALOG,
  MATERI_LABELS,
  filterCatalogItems,
  type CatalogEntry,
  type CatalogType,
  type JilidNumber,
  type MateriPokok,
} from "@/data/learningCatalog";
import {
  BookOpen,
  Sparkles,
  Trophy,
  Search,
  Gamepad,
  Check,
} from "@/components/ui/CustomIcons";
import { useActiveGames } from "@/features/ngaji-ceria/hooks/useActiveGames";

const JILID_FILTERS: JilidNumber[] = [1, 2, 3, 4, 5];
const TYPE_FILTERS: CatalogType[] = ["materi", "quiz", "game"];

function TypeIcon({ type, size = 14 }: { type: CatalogType; size?: number }) {
  if (type === "materi") return <BookOpen size={size} className="shrink-0" />;
  if (type === "quiz") return <Trophy size={size} className="shrink-0" />;
  return <Gamepad size={size} className="shrink-0" />;
}

const TYPE_BADGE_COLORS: Record<CatalogType, { bg: string; text: string }> = {
  materi: { bg: "bg-[#BAE6FD]", text: "text-[#0369A1]" },
  quiz: { bg: "bg-[#FEF08A]", text: "text-[#713F12]" },
  game: { bg: "bg-[#FECDD3]", text: "text-[#9F1239]" },
};

interface CatalogDetailModalProps {
  entry: CatalogEntry | null;
  onClose: () => void;
  onOpen: (route: string) => void;
}

function CatalogDetailModal({
  entry,
  onClose,
  onOpen,
}: CatalogDetailModalProps) {
  const isGame = entry?.type === "game";
  return (
    <AppModal isOpen={!!entry} onClose={onClose} title={entry?.title ?? ""}>
      {entry && (
        <div className="space-y-4">
          {/* Meta Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border-2 border-[#134E4A] px-2.5 py-1 text-xs font-black shadow-[1.5px_1.5px_0px_#134E4A] ${
                TYPE_BADGE_COLORS[entry.type].bg
              } ${TYPE_BADGE_COLORS[entry.type].text}`}
            >
              <TypeIcon type={entry.type} size={13} />
              {CATALOG_TYPE_LABELS[entry.type]}
            </span>

            <span className="rounded-lg border-2 border-[#134E4A] bg-[#CCFBF1] px-2.5 py-1 text-xs font-black text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]">
              {entry.jilidRelevan.length > 1
                ? "Semua Jilid (Global)"
                : `Jilid ${entry.jilidRelevan[0] || "-"}`}
            </span>

            {isGame && (
              <span className="rounded-lg border-2 border-[#134E4A] bg-[#DCFCE7] px-2.5 py-1 text-xs font-black text-[#166534] shadow-[1.5px_1.5px_0px_#134E4A]">
                {entry.access === "guest-open"
                  ? "Terbuka Tamu"
                  : "Khusus Member"}
              </span>
            )}
          </div>

          {/* Detail Content Box */}
          <div className="rounded-xl border-2 border-[#134E4A] bg-[#F8FAFC] divide-y-2 divide-[#134E4A]/15 overflow-hidden">
            <div className="p-3.5 space-y-1">
              <p className="text-[11px] font-black uppercase tracking-wider text-[#0D9488]">
                Tujuan Pembelajaran
              </p>
              <p className="text-xs sm:text-sm font-semibold text-[#183B38] leading-relaxed">
                {entry.learningObjective}
              </p>
            </div>

            <div className="p-3.5 space-y-1 bg-white">
              <p className="text-[11px] font-black uppercase tracking-wider text-[#D97706]">
                {isGame ? "Cara Bermain" : "Metode Belajar"}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-[#183B38] leading-relaxed">
                {entry.caraMain}
              </p>
            </div>
          </div>

          {/* Cakupan Materi Tags */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-[#64748B] mb-1.5">
              Cakupan Materi Pokok
            </p>
            <div className="flex flex-wrap gap-1.5">
              {entry.materiPokok.map((materi) => (
                <span
                  key={materi}
                  className="rounded-lg border-[1.5px] border-[#134E4A] bg-[#FEF08A] px-2.5 py-0.5 text-xs font-black text-[#713F12]"
                >
                  {MATERI_LABELS[materi]}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-1">
            <StickerButton
              variant="primary"
              size="md"
              className="w-full font-black shadow-[3px_3px_0px_#134E4A]"
              onClick={() => onOpen(`/ustadz/preview/${entry.id}`)}
            >
              {entry.type === "quiz"
                ? "Buka & Uji Kuis"
                : entry.type === "game"
                  ? "Buka & Mainkan Game"
                  : "Buka & Pratinjau Materi"}
            </StickerButton>
          </div>
        </div>
      )}
    </AppModal>
  );
}

export function UstadzKurikulumPage() {
  const navigate = useNavigate();
  const { isGameActive } = useActiveGames();
  const [selectedType, setSelectedType] = useState<CatalogType | null>(null);
  const [selectedMateri, setSelectedMateri] = useState<MateriPokok[]>([]);
  const [selectedJilid, setSelectedJilid] = useState<JilidNumber | null>(null);
  const [query, setQuery] = useState("");
  const [detailEntry, setDetailEntry] = useState<CatalogEntry | null>(null);

  const allMateri = useMemo(() => {
    const set = new Set<MateriPokok>();
    for (const entry of LEARNING_CATALOG) {
      for (const materi of entry.materiPokok) set.add(materi);
    }
    return [...set];
  }, []);

  const visible = useMemo(() => {
    const filtered = filterCatalogItems({
      type: selectedType,
      materi: selectedMateri,
      jilid: selectedJilid,
      query,
    });

    return filtered.filter((entry) => {
      if (entry.type === "game") {
        const gameKey = entry.gameId;
        if (!isGameActive(gameKey) || entry.isActive === false) return false;
      }

      const isGlobal = entry.jilidRelevan.length > 1;
      const isSpecific = entry.jilidRelevan.length === 1;

      // LOGIKA ANTI-REDUNDANSI:
      if (selectedJilid === null && isSpecific) return false;
      if (selectedJilid !== null && isGlobal) return false;

      return true;
    });
  }, [selectedType, selectedMateri, selectedJilid, query, isGameActive]);

  const toggleMateri = (materi: MateriPokok) => {
    setSelectedMateri((prev) =>
      prev.includes(materi)
        ? prev.filter((m) => m !== materi)
        : [...prev, materi],
    );
  };

  const hasActiveFilters =
    selectedType !== null ||
    selectedJilid !== null ||
    selectedMateri.length > 0 ||
    query.trim().length > 0;

  const resetAllFilters = () => {
    setSelectedType(null);
    setSelectedJilid(null);
    setSelectedMateri([]);
    setQuery("");
  };

  return (
    <div className="space-y-4">
      {/* Compact Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#134E4A] tracking-tight">
            Katalog Kurikulum & Materi
          </h1>
          <p className="text-xs font-semibold text-[#64748B]">
            Jelajahi dan pratinjau materi Tilawati, evaluasi kuis, serta game
            interaktif santri.
          </p>
        </div>

        <div className="inline-flex items-center self-start sm:self-auto gap-1.5 rounded-xl border-2 border-[#134E4A] bg-[#CCFBF1] px-3 py-1.5 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
          <Sparkles size={14} className="text-[#0D9488]" />
          <span>{visible.length} Item Tersedia</span>
        </div>
      </div>

      {/* Tactile Neo-Brutalist Filter & Search Console */}
      <div className="rounded-2xl border-2 border-[#134E4A] bg-white shadow-[3px_3px_0px_#134E4A] overflow-hidden">
        {/* Top Row: Search + Content Type Selector */}
        <div className="p-3.5 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-[#F8FAFC] border-b-2 border-[#134E4A]">
          <div className="relative flex-1">
            <InputField
              placeholder="Cari judul materi, game, atau topik tajwid..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* Filter Tipe Konten */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide shrink-0">
            <button
              type="button"
              onClick={() => setSelectedType(null)}
              className={`h-10 px-3 rounded-xl border-2 border-[#134E4A] text-xs font-black transition-all shrink-0 ${
                selectedType === null
                  ? "bg-[#134E4A] text-white shadow-[2px_2px_0px_#0D9488]"
                  : "bg-white text-[#134E4A] hover:bg-[#CCFBF1]/50"
              }`}
            >
              Semua Tipe
            </button>
            {TYPE_FILTERS.map((type) => {
              const active = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(active ? null : type)}
                  className={`inline-flex items-center gap-1.5 h-10 rounded-xl border-2 border-[#134E4A] px-3 text-xs font-black transition-all shrink-0 ${
                    active
                      ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                      : "bg-white text-[#134E4A] hover:bg-[#CCFBF1]/50"
                  }`}
                >
                  <TypeIcon type={type} size={14} />
                  <span>{CATALOG_TYPE_LABELS[type]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Controls: Jilid Bar & Multi-Wrap Materi Chips */}
        <div className="p-3.5 sm:p-4 space-y-4">
          {/* Baris Jilid (Gaya Segmented Control ala Buat Kelas) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[13px] font-semibold text-[#183B38]">
                Target Jilid
              </label>

              {/* Tombol Reset dipindah ke atas agar hemat tempat */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[11px] font-bold text-[#B91C1C] hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {/* Grid Segmented 6 Kolom (Umum + Jilid 1-5) */}
            <div className="grid grid-cols-6 gap-1.5 p-1 rounded-xl bg-[#F1F5F9] border border-[#DCE5E3]">
              <button
                type="button"
                onClick={() => setSelectedJilid(null)}
                className={`h-9 rounded-lg text-[11px] sm:text-[13px] font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                  selectedJilid === null
                    ? "bg-[#0D9488] text-white border-[1.5px] border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]"
                    : "bg-transparent text-[#475569] hover:bg-white hover:text-[#183B38]"
                }`}
              >
                Umum
              </button>

              {JILID_FILTERS.map((jilid) => {
                const active = selectedJilid === jilid;
                return (
                  <button
                    key={jilid}
                    type="button"
                    onClick={() => setSelectedJilid(active ? null : jilid)}
                    className={`h-9 rounded-lg text-[11px] sm:text-[13px] font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                      active
                        ? "bg-[#0D9488] text-white border-[1.5px] border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]"
                        : "bg-transparent text-[#475569] hover:bg-white hover:text-[#183B38]"
                    }`}
                  >
                    Jilid {jilid}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Baris Topik Materi (Tetap Gaya Pill/Sticker) */}
          <div className="pt-3 border-t-[1.5px] border-dashed border-[#134E4A]/25">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#64748B]">
                Filter Topik Materi:
              </span>
              {selectedMateri.length > 0 && (
                <span className="text-[10px] font-black text-[#0D9488] bg-[#CCFBF1] px-2 py-0.5 rounded-full border border-[#0D9488]/30">
                  {selectedMateri.length} topik dipilih
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {allMateri.map((materi) => {
                const active = selectedMateri.includes(materi);
                return (
                  <button
                    key={materi}
                    type="button"
                    onClick={() => toggleMateri(materi)}
                    className={`inline-flex items-center gap-1 h-7 rounded-lg border-[1.5px] px-2.5 text-[11.5px] font-extrabold transition-all select-none ${
                      active
                        ? "border-[#134E4A] bg-[#FEF08A] text-[#713F12] shadow-[1.5px_1.5px_0px_#134E4A]"
                        : "border-[#134E4A]/35 bg-[#F8FAFC] text-[#183B38] hover:border-[#134E4A] hover:bg-white"
                    }`}
                  >
                    {active && <Check size={11} strokeWidth={4} />}
                    <span>{MATERI_LABELS[materi]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Materials */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border-2 border-[#134E4A] bg-white p-8 text-center shadow-[3px_3px_0px_#134E4A] space-y-3">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
            <Search size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-[#134E4A]">
              Tidak ada materi yang cocok dengan filter
            </p>
            <p className="text-xs font-semibold text-[#64748B] mt-0.5">
              Coba ubah pilihan Jilid atau hapus filter topik materi yang aktif.
            </p>
          </div>
          {hasActiveFilters && (
            <StickerButton
              variant="outline"
              size="sm"
              onClick={resetAllFilters}
            >
              Tampilkan Semua
            </StickerButton>
          )}
        </div>
      ) : (
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
        >
          {visible.map((entry) => {
            const badgeTheme = TYPE_BADGE_COLORS[entry.type];
            return (
              <motion.div
                key={entry.id}
                variants={staggerItemVariants}
                onClick={() => setDetailEntry(entry)}
                className="group flex flex-col justify-between rounded-2xl border-2 border-[#134E4A] bg-white shadow-[3px_3px_0px_#134E4A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#134E4A] transition-all overflow-hidden cursor-pointer text-left"
              >
                {/* Card Top Strip */}
                <div>
                  <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-[#F8FAFC] border-b-2 border-[#134E4A]">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg border-[1.5px] border-[#134E4A] px-2 py-0.5 text-[11px] font-black shadow-[1px_1px_0px_#134E4A] ${badgeTheme.bg} ${badgeTheme.text}`}
                    >
                      <TypeIcon type={entry.type} size={12} />
                      {CATALOG_TYPE_LABELS[entry.type]}
                    </span>

                    <span className="rounded-md border-[1.5px] border-[#134E4A] bg-white px-2 py-0.5 text-[11px] font-black text-[#134E4A]">
                      {entry.jilidRelevan.length > 1
                        ? "Global"
                        : `Jilid ${entry.jilidRelevan[0] || "-"}`}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <h3 className="font-black text-sm sm:text-[15px] text-[#134E4A] group-hover:text-[#0D9488] transition-colors line-clamp-1 leading-snug">
                      {entry.title}
                    </h3>

                    <p className="mt-1.5 text-xs font-semibold text-[#64748B] line-clamp-2 leading-relaxed">
                      {entry.learningObjective}
                    </p>
                  </div>
                </div>

                {/* Card Footer Tags */}
                <div className="px-4 py-2.5 bg-[#F8FAFC]/60 border-t border-dashed border-[#134E4A]/25 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1 min-w-0">
                    {entry.materiPokok.slice(0, 2).map((materi) => (
                      <span
                        key={materi}
                        className="rounded-md border border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-[10.5px] font-black text-[#713F12] truncate"
                      >
                        {MATERI_LABELS[materi]}
                      </span>
                    ))}
                    {entry.materiPokok.length > 2 && (
                      <span className="rounded-md border border-[#134E4A] bg-white px-1.5 py-0.5 text-[10px] font-black text-[#134E4A]">
                        +{entry.materiPokok.length - 2}
                      </span>
                    )}
                  </div>

                  <span className="shrink-0 text-[11px] font-black text-[#0D9488] group-hover:translate-x-0.5 transition-transform">
                    Detail →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <CatalogDetailModal
        entry={detailEntry}
        onClose={() => setDetailEntry(null)}
        onOpen={(route) => {
          setDetailEntry(null);
          navigate(route);
        }}
      />
    </div>
  );
}
