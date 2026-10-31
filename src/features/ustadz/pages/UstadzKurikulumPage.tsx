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
import { BookOpen, Sparkles, Trophy, Search, Gamepad, Check } from "@/components/ui/CustomIcons";
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
          <div className="flex flex-wrap gap-2 items-center">
            <span
              className={`inline-flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3 py-1 text-xs font-black shadow-[1.5px_1.5px_0px_#134E4A] ${
                TYPE_BADGE_COLORS[entry.type].bg
              } ${TYPE_BADGE_COLORS[entry.type].text}`}
            >
              <TypeIcon type={entry.type} size={14} />
              {CATALOG_TYPE_LABELS[entry.type]}
            </span>

            {isGame && (
              <span className="rounded-xl border-2 border-[#134E4A] bg-[#DCFCE7] px-3 py-1 text-xs font-black text-[#15803D] shadow-[1.5px_1.5px_0px_#134E4A]">
                {entry.access === "guest-open" ? "Terbuka Tamu" : "Khusus Member"}
              </span>
            )}

            {entry.materiPokok.map((materi) => (
              <span
                key={materi}
                className="rounded-xl border-2 border-[#134E4A] bg-[#F8FAFC] px-2.5 py-1 text-xs font-bold text-[#134E4A]"
              >
                {MATERI_LABELS[materi]}
              </span>
            ))}
          </div>

          <div className="rounded-2xl border-2 border-[#134E4A] bg-[#F8FAFC] p-4 space-y-2.5 text-xs sm:text-sm">
            <p className="text-[#134E4A]">
              <span className="font-black">Tujuan Pembelajaran:</span>{" "}
              <span className="font-semibold text-[#183B38]/80">
                {entry.learningObjective}
              </span>
            </p>
            <p className="text-[#134E4A]">
              <span className="font-black">
                {isGame ? "Cara Bermain:" : "Metode Belajar:"}
              </span>{" "}
              <span className="font-semibold text-[#183B38]/80">
                {entry.caraMain}
              </span>
            </p>
          </div>

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

  return (
    <div className="space-y-5">
      {/* Search & Filter Header (Tactile Neo-Brutalist Box) */}
      <div className="rounded-2xl border-3 border-[#134E4A] bg-white p-4 sm:p-5 shadow-[4px_4px_0px_#134E4A] space-y-4">
        <InputField
          placeholder="Cari materi, judul game, atau topik tajwid..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Filter Bar: Types & Jilid */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t-2 border-dashed border-[#134E4A]/20">
          {/* Tipe Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {TYPE_FILTERS.map((type) => {
              const active = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(active ? null : type)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3 py-1.5 text-xs sm:text-sm font-black transition-all ${
                    active
                      ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                      : "bg-[#F8FAFC] text-[#134E4A] hover:bg-white"
                  }`}
                >
                  <TypeIcon type={type} size={14} />
                  <span>{CATALOG_TYPE_LABELS[type]}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:block h-6 w-0.5 bg-[#134E4A]/20" />

          {/* Jilid 1-5 Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-xs font-black uppercase text-[#134E4A] mr-1">
              Jilid:
            </span>
            {JILID_FILTERS.map((jilid) => {
              const active = selectedJilid === jilid;
              return (
                <button
                  key={jilid}
                  type="button"
                  onClick={() => setSelectedJilid(active ? null : jilid)}
                  className={`h-9 w-9 rounded-xl border-2 border-[#134E4A] text-xs sm:text-sm font-black transition-all ${
                    active
                      ? "bg-[#134E4A] text-white shadow-[2px_2px_0px_#0D9488]"
                      : "bg-white text-[#134E4A] hover:bg-[#CCFBF1]"
                  }`}
                >
                  {jilid}
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic Chips */}
        <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide pt-1">
          {allMateri.map((materi) => {
            const active = selectedMateri.includes(materi);
            return (
              <button
                key={materi}
                type="button"
                onClick={() => toggleMateri(materi)}
                className={`inline-flex items-center shrink-0 rounded-xl border-2 border-[#134E4A] px-3 py-1 text-xs font-black transition-all ${
                  active
                    ? "bg-[#FEF08A] text-[#713F12] shadow-[1.5px_1.5px_0px_#134E4A]"
                    : "bg-[#F8FAFC] text-[#134E4A] hover:bg-white"
                }`}
              >
                {active && <Check size={12} className="mr-1 inline-block" />}
                {MATERI_LABELS[materi]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <p className="text-xs sm:text-sm font-black text-[#134E4A]">
          Ditemukan <span className="text-[#0D9488]">{visible.length}</span> item pembelajaran
        </p>
      </div>

      {/* Grid of Materials */}
      {visible.length === 0 ? (
        <div className="rounded-3xl border-3 border-[#134E4A] bg-white p-8 text-center shadow-[4px_4px_0px_#134E4A]">
          <p className="text-sm font-bold text-[#183B38]/70">
            Tidak ada materi yang sesuai dengan filter yang dipilih.
          </p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {visible.map((entry) => {
            const badgeTheme = TYPE_BADGE_COLORS[entry.type];
            return (
              <motion.div
                key={entry.id}
                variants={staggerItemVariants}
                onClick={() => setDetailEntry(entry)}
                className="group flex flex-col justify-between rounded-2xl border-2 sm:border-3 border-[#134E4A] bg-white shadow-[3px_3px_0px_#134E4A] hover:-translate-y-1 hover:shadow-[5px_5px_0px_#134E4A] transition-all p-4 sm:p-5 cursor-pointer text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-2.5 py-0.5 text-xs font-black ${badgeTheme.bg} ${badgeTheme.text}`}
                    >
                      <TypeIcon type={entry.type} size={13} />
                      {CATALOG_TYPE_LABELS[entry.type]}
                    </span>

                    <span className="rounded-lg border-2 border-[#134E4A] bg-[#F1F5F9] px-2 py-0.5 text-xs font-black text-[#134E4A]">
                      {entry.jilidRelevan.length > 1
                        ? "Global"
                        : `Jilid ${entry.jilidRelevan[0] || "-"}`}
                    </span>
                  </div>

                  <h3 className="font-black text-sm sm:text-base text-[#134E4A] group-hover:text-[#0D9488] transition-colors line-clamp-2 leading-snug mt-1">
                    {entry.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm font-semibold text-[#183B38]/70 line-clamp-2 leading-relaxed">
                    {entry.learningObjective}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-dashed border-[#134E4A]/20 flex flex-wrap gap-1.5">
                  {entry.materiPokok.slice(0, 2).map((materi) => (
                    <span
                      key={materi}
                      className="rounded-lg border border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-xs font-black text-[#713F12]"
                    >
                      {MATERI_LABELS[materi]}
                    </span>
                  ))}
                  {entry.materiPokok.length > 2 && (
                    <span className="text-xs font-black text-[#134E4A] self-center">
                      +{entry.materiPokok.length - 2}
                    </span>
                  )}
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
