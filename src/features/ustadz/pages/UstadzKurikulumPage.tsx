import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { InputField } from "@/components/ui/InputField";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animationVariants";
import { AppModal } from "@/components/ui/AppModal";
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

const JILID_FILTERS: JilidNumber[] = [1, 2, 3, 4, 5];

const TYPE_FILTERS: CatalogType[] = ["materi", "quiz", "game"];

const TYPE_BADGE_STYLES: Record<CatalogType, string> = {
  materi: "bg-[#DBEAFE] text-[#1E3A8A]",
  quiz: "bg-[#EDE9FE] text-[#4C1D95]",
  game: "bg-[#FCE7F3] text-[#831843]",
};

// Pastel berbeda per kategori materi agar peta kurikulum terasa hidup.
const MATERI_CHIP_STYLES: Record<MateriPokok, string> = {
  tilawati: "bg-[#FEF08A] text-[#134E4A]",
  hijaiyah: "bg-[#BBF7D0] text-[#134E4A]",
  harakat: "bg-[#BFDBFE] text-[#134E4A]",
  makhraj: "bg-[#E9D5FF] text-[#134E4A]",
  tajwid: "bg-[#DDF2F1] text-[#134E4A]",
  mad: "bg-[#FDE8CF] text-[#134E4A]",
  waqaf: "bg-[#FDE8CF] text-[#134E4A]",
  gharib: "bg-[#E0E7FF] text-[#134E4A]",
  tulisan: "bg-[#FFE4E6] text-[#134E4A]",
  hafalan: "bg-[#E9D5FF] text-[#134E4A]",
  "juz-amma": "bg-[#D9F99D] text-[#134E4A]",
  doa: "bg-[#FEF08A] text-[#134E4A]",
  ibadah: "bg-[#BBF7D0] text-[#134E4A]",
  adab: "bg-[#BFDBFE] text-[#134E4A]",
  "kisah-islami": "bg-[#FDE68A] text-[#134E4A]",
};

const CARD_TINT_STYLES: Record<CatalogType, string> = {
  materi: "bg-[#DBEAFE]",
  quiz: "bg-[#EDE9FE]",
  game: "bg-[#FCE7F3]",
};

function MateriChip({
  label,
  materi,
}: {
  label: string;
  materi: MateriPokok;
}) {
  return (
    <span
      className={`rounded-lg border-2 border-[#134E4A] px-2 py-0.5 text-[10px] font-black ${
        MATERI_CHIP_STYLES[materi] ?? "bg-[#ECFEFF]"
      }`}
    >
      {label}
    </span>
  );
}

function TypeBadge({ type }: { type: CatalogType }) {
  return (
    <span
      className={`shrink-0 rounded-lg border-2 border-[#134E4A] px-2 py-0.5 text-[10px] font-black ${TYPE_BADGE_STYLES[type]}`}
    >
      {CATALOG_TYPE_LABELS[type]}
    </span>
  );
}

interface CatalogDetailModalProps {
  entry: CatalogEntry | null;
  onClose: () => void;
  onOpen: (route: string) => void;
}

function CatalogDetailModal({ entry, onClose, onOpen }: CatalogDetailModalProps) {
  const isGame = entry?.type === "game";
  return (
    <AppModal
      isOpen={!!entry}
      onClose={onClose}
      title={entry?.title ?? ""}
    >
      {entry && (
        <>
          <div className="mt-1 flex flex-wrap gap-1">
            <TypeBadge type={entry.type} />
            {isGame && (
              <span
                className={`shrink-0 rounded-lg border-2 border-[#134E4A] px-2 py-0.5 text-[10px] font-black ${
                  entry.access === "guest-open"
                    ? "bg-[#DCFCE7] text-[#166534]"
                    : "bg-[#FEF9C3] text-[#7C2D12]"
                }`}
              >
                {entry.access === "guest-open"
                  ? "Terbuka untuk tamu"
                  : "Hanya member"}
              </span>
            )}
            {entry.materiPokok.map((materi) => (
              <MateriChip key={materi} label={MATERI_LABELS[materi]} materi={materi} />
            ))}
          </div>

          <p className="mt-3 text-xs font-bold text-[#134E4A]/80">
            <span className="font-black">Tujuan Belajar:</span>{" "}
            {entry.learningObjective}
          </p>
          <p className="mt-2 text-xs font-semibold text-[#134E4A]/80">
            <span className="font-black">
              {isGame ? "Cara Main:" : "Cara Belajar:"}
            </span>{" "}
            {entry.caraMain}
          </p>

          <div className="mt-3">
            <p className="text-xs font-black text-[#134E4A]">Jilid Relevan</p>
            {entry.jilidRelevan.length > 0 ? (
              <div className="mt-1 flex gap-1">
                {entry.jilidRelevan.map((jilid) => (
                  <span
                    key={jilid}
                    className="h-7 w-7 rounded-lg border-[3px] border-[#134E4A] bg-[#FEF3C7] text-center text-xs font-black leading-6 text-[#7C2D12]"
                  >
                    {jilid}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-[11px] font-semibold text-[#134E4A]/60">
                Materi pengayaan: tidak terikat jilid Tilawati.
              </p>
            )}
          </div>

          <div className="mt-3">
            <p className="text-xs font-black text-[#134E4A]">
              Tips Membimbing Santri
            </p>
            <ul className="mt-1 space-y-1">
              {entry.tipsUstadz.map((tip) => (
                <li
                  key={tip}
                  className="list-disc pl-4 text-[11px] font-semibold text-[#134E4A]/80"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <StickerButton
            className="mt-4 w-full"
            onClick={() => onOpen(`/ustadz/preview/${entry.id}`)}
          >
            {entry.type === "quiz" ? "Buka Kuis" : entry.type === "game" ? "Buka Game" : "Buka Materi"}
          </StickerButton>

          {entry.needsContentValidation && (
            <p className="mt-3 rounded-xl border-2 border-dashed border-[#FF6B6B] bg-[#FFF0F0] p-2 text-[10px] font-bold text-[#7C2D12]">
              Metadata ini masih draf: perlu validasi konten oleh tim kurikulum.
            </p>
          )}
        </>
      )}
    </AppModal>
  );
}

export function UstadzKurikulumPage() {
  const navigate = useNavigate();
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

  const visible = useMemo(
    () =>
      filterCatalogItems({
        type: selectedType,
        materi: selectedMateri,
        jilid: selectedJilid,
        query,
      }),
    [selectedType, selectedMateri, selectedJilid, query],
  );

  const toggleMateri = (materi: MateriPokok) => {
    setSelectedMateri((prev) =>
      prev.includes(materi)
        ? prev.filter((m) => m !== materi)
        : [...prev, materi],
    );
  };

  return (
    <>
      <div className="w-full max-w-6xl space-y-4">
        <p className="text-xs font-semibold text-[#134E4A]/70">
          Peta kurikulum: materi Jelajah, kuis evaluasi, dan game pendukung:
          selaras Tilawati Jilid 1–5.
        </p>

        <StickerButton
          className="w-full"
          onClick={() => navigate("/ustadz/kuis/baru")}
        >
          + Buat Kuis untuk Kelas
        </StickerButton>

        <InputField
          placeholder="Cari judul atau materi…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div>
          <p className="mb-1 text-[11px] font-black uppercase text-[#134E4A]/70">
            Tipe
          </p>
          <div className="flex flex-wrap gap-1.5">
            {TYPE_FILTERS.map((type) => {
              const active = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(active ? null : type)}
                  className={`rounded-xl border-[3px] px-2.5 py-1 text-[10px] font-black transition-colors ${
                    active
                      ? "border-[#134E4A] bg-[#0D9488] text-white"
                      : "border-[#134E4A] bg-white text-[#134E4A] hover:bg-[#F0FDF4]"
                  }`}
                >
                  {CATALOG_TYPE_LABELS[type]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-1 text-[11px] font-black uppercase text-[#134E4A]/70">
            Materi
          </p>
          <div className="flex flex-wrap gap-1.5">
            {allMateri.map((materi) => {
              const active = selectedMateri.includes(materi);
              return (
                <button
                  key={materi}
                  type="button"
                  onClick={() => toggleMateri(materi)}
                  className={`rounded-xl border-[3px] px-2.5 py-1 text-[10px] font-black transition-colors ${
                    active
                      ? "border-[#134E4A] bg-[#0D9488] text-white"
                      : "border-[#134E4A] bg-white text-[#134E4A] hover:bg-[#F0FDF4]"
                  }`}
                >
                  {MATERI_LABELS[materi]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-1 text-[11px] font-black uppercase text-[#134E4A]/70">
            Jilid
          </p>
          <div className="flex flex-wrap gap-1.5">
            {JILID_FILTERS.map((jilid) => {
              const active = selectedJilid === jilid;
              return (
                <button
                  key={jilid}
                  type="button"
                  onClick={() => setSelectedJilid(active ? null : jilid)}
                  className={`h-8 w-8 rounded-xl border-[3px] text-xs font-black transition-colors ${
                    active
                      ? "border-[#134E4A] bg-[#0D9488] text-white"
                      : "border-[#134E4A] bg-white text-[#134E4A] hover:bg-[#F0FDF4]"
                  }`}
                >
                  {jilid}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] font-bold text-[#134E4A]/60">
          {visible.length} item ditemukan
        </p>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {visible.map((entry) => (
            <StickerCard
              key={entry.id}
              asButton
              variants={staggerItemVariants}
              className={`p-0 overflow-hidden transition-all`}
              accent="none"
              onClick={() => setDetailEntry(entry)}
            >
              <div className={`flex h-2 w-full border-b-[3px] border-[#134E4A] ${CARD_TINT_STYLES[entry.type]}`} />
              <div className="flex flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-black text-[#134E4A]">
                    {entry.title}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <TypeBadge type={entry.type} />
                    {entry.materiPokok.map((materi) => (
                    <MateriChip
                      key={materi}
                      label={MATERI_LABELS[materi]}
                      materi={materi}
                    />
                  ))}
                  </div>
                  <p className="mt-1.5 text-[11px] font-semibold text-[#134E4A]/70">
                    {entry.jilidRelevan.length > 0
                      ? `Jilid ${entry.jilidRelevan.join(", ")}`
                      : "Materi pengayaan"}
                    {" · "}
                    {entry.learningObjective}
                  </p>
                </div>
                </div>
              </div>
            </StickerCard>
          ))}
        </motion.div>

        <CatalogDetailModal
          entry={detailEntry}
          onClose={() => setDetailEntry(null)}
          onOpen={(route) => {
            setDetailEntry(null);
            navigate(route);
          }}
        />
      </div>
    </>
  );
}
