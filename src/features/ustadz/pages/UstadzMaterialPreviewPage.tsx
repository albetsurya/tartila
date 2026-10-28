import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Play,
  Pause,
  Volume2,
  Check,
  Plus,
  Users,
  Lightbulb,
  Info,
  AlertCircle,
  FileText,
} from "@/components/ui/CustomIcons";
import {
  getCatalogItemById,
  MATERI_LABELS,
  type CatalogEntry,
  type CatalogType,
  type MateriPokok,
  type JilidNumber,
} from "@/data/learningCatalog";
import { loadTilawatiDataset } from "@/features/ngaji-ceria/data/tilawatiPageDatasets";
import type { PageQuizData, QuizQuestion as TilawatiQuestion } from "@/features/ngaji-ceria/data/tilawatiQuizTypes";
import {
  TAJWID_RULES,
  DOA_LIST,
  DOA_CATEGORIES,
  JUZ_AMMA_SURAHS,
  type TajwidRule,
  type DoaItem,
} from "@/features/ngaji-ceria/pages/explore/exploreData";
import { getQuiz, type Quiz } from "@/services/quizBankService";
import {
  listOwnedClassrooms,
  type ClassroomRoom,
} from "@/services/classroomService";
import {
  assignGameToRoom,
  listGameAssignments,
} from "@/services/ustadzMonitoringService";
import { AppModal } from "@/components/ui/AppModal";

/* -------------------------------------------------------------------------- */
/* Modal Penugasan Materi ke Kelas                                           */
/* -------------------------------------------------------------------------- */

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialId: string;
  materialTitle: string;
  ustadzId: string | undefined;
}

function AssignModal({
  isOpen,
  onClose,
  materialId,
  materialTitle,
  ustadzId,
}: AssignModalProps) {
  const [rooms, setRooms] = useState<ClassroomRoom[]>([]);
  const [assignedRoomIds, setAssignedRoomIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen || !ustadzId) return;
    let alive = true;
    setLoading(true);
    setFeedback(null);

    listOwnedClassrooms(ustadzId).then(async (res) => {
      if (!alive) return;
      if (res.ok) {
        setRooms(res.data);
        const assigned: string[] = [];
        for (const room of res.data) {
          try {
            const list = await listGameAssignments(room.id);
            if (list.some((a) => a.gameId === materialId)) {
              assigned.push(room.id);
            }
          } catch {
            // Abaikan error per room
          }
        }
        if (alive) {
          setAssignedRoomIds(assigned);
          setLoading(false);
        }
      } else {
        setLoading(false);
        setFeedback({
          type: "error",
          message: res.message || "Gagal memuat daftar kelas.",
        });
      }
    });

    return () => {
      alive = false;
    };
  }, [isOpen, ustadzId, materialId]);

  const handleAssign = async (room: ClassroomRoom) => {
    if (!ustadzId) return;
    setAssigningId(room.id);
    setFeedback(null);
    try {
      await assignGameToRoom(room.id, materialId, ustadzId);
      setAssignedRoomIds((prev) =>
        prev.includes(room.id) ? prev : [...prev, room.id],
      );
      setFeedback({
        type: "success",
        message: `Materi berhasil ditugaskan ke kelas "${room.name}"!`,
      });
    } catch {
      setFeedback({
        type: "error",
        message: `Gagal menugaskan materi ke kelas "${room.name}".`,
      });
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tugaskan Materi Ini"
    >
      <p className="text-xs font-semibold text-[#134E4A]/80">
        Materi: <span className="font-black">{materialTitle}</span>
      </p>

      {feedback && (
        <div
          className={`mt-4 rounded-xl border-2 p-3 text-xs font-bold ${
            feedback.type === "success"
              ? "border-[#166534] bg-[#DCFCE7] text-[#166534]"
              : "border-[#991B1B] bg-[#FEE2E2] text-[#991B1B]"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs font-black uppercase tracking-wider text-[#134E4A]">
          Pilih Kelas Tujuan
        </p>
        {loading ? (
          <div className="py-8 text-center text-xs font-bold text-[#134E4A]/60">
            Memuat daftar kelas Ustadz...
          </div>
        ) : rooms.length === 0 ? (
          <div className="mt-3 rounded-xl border-2 border-dashed border-[#134E4A]/30 bg-gray-50 p-4 text-center">
            <p className="text-xs font-bold text-[#134E4A]/70">
              Ustadz belum memiliki kelas aktif.
            </p>
            <StickerButton
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={onClose}
            >
              Tutup
            </StickerButton>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {rooms.map((room) => {
              const isAssigned = assignedRoomIds.includes(room.id);
              const isBusy = assigningId === room.id;
              return (
                <div
                  key={room.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-[#134E4A] bg-white p-3 shadow-[2px_2px_0px_#134E4A]"
                >
                  <div>
                    <p className="text-sm font-black text-[#134E4A]">
                      {room.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-[#134E4A]/70">
                      <span>Kode: {room.joinCode}</span>
                      {room.targetJilid && (
                        <span>· Target Jilid {room.targetJilid}</span>
                      )}
                    </div>
                  </div>
                  {isAssigned ? (
                    <span className="flex items-center gap-1 rounded-lg border-2 border-[#166534] bg-[#DCFCE7] px-2.5 py-1 text-xs font-black text-[#166534]">
                      <Check size={14} /> Sudah Ditugaskan
                    </span>
                  ) : (
                    <StickerButton
                      size="sm"
                      disabled={isBusy}
                      onClick={() => handleAssign(room)}
                      className="bg-[#0D9488] text-xs font-black text-white hover:bg-[#0f766e]"
                    >
                      {isBusy ? "Menugaskan..." : "Tugaskan ke Kelas"}
                    </StickerButton>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <StickerButton variant="ghost" size="sm" onClick={onClose}>
          Selesai
        </StickerButton>
      </div>
    </AppModal>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-komponen Preview: Tilawati Reader                                      */
/* -------------------------------------------------------------------------- */

interface TilawatiPreviewProps {
  initialJilid: number;
  entry: CatalogEntry;
  onPlayAudio: (url: string) => void;
  playingUrl: string | null;
}

function TilawatiPreview({
  initialJilid,
  entry,
  onPlayAudio,
  playingUrl,
}: TilawatiPreviewProps) {
  const [jilid, setJilid] = useState<number>(initialJilid || 1);
  const [page, setPage] = useState<number>(1);
  const [dataset, setDataset] = useState<Record<number, import("@/features/ngaji-ceria/data/tilawatiQuizTypes").PageQuizData>>({});
  const [isLoadingDataset, setIsLoadingDataset] = useState(false);

  // Load dataset saat jilid berubah
  useEffect(() => {
    let alive = true;
    setIsLoadingDataset(true);
    void loadTilawatiDataset(jilid)
      .then((data) => {
        if (alive) setDataset(data);
      })
      .finally(() => {
        if (alive) setIsLoadingDataset(false);
      });
    return () => {
      alive = false;
    };
  }, [jilid]);

  const pageNumbers = useMemo(() => {
    const keys = Object.keys(dataset).map(Number).sort((a, b) => a - b);
    return keys.length > 0 ? keys : [1];
  }, [dataset]);

  const currentPageData: import("@/features/ngaji-ceria/data/tilawatiQuizTypes").PageQuizData | undefined = dataset[page];

  // Ketika jilid berubah, reset ke halaman pertama
  const handleJilidChange = (nextJilid: number) => {
    setJilid(nextJilid);
    void loadTilawatiDataset(nextJilid).then((nextDataset) => {
      const keys = Object.keys(nextDataset || {}).map(Number).sort((a, b) => a - b);
      setPage(keys[0] ?? 1);
    });
  };

  const handlePrevPage = () => {
    const currentIndex = pageNumbers.indexOf(page);
    if (currentIndex > 0) {
      setPage(pageNumbers[currentIndex - 1]);
    }
  };

  const handleNextPage = () => {
    const currentIndex = pageNumbers.indexOf(page);
    if (currentIndex < pageNumbers.length - 1) {
      setPage(pageNumbers[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Selector Jilid & Halaman */}
      <StickerCard className="p-4 bg-[#F0FDF4]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-[#134E4A]/70">
              Pilih Jilid Tilawati
            </p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() => handleJilidChange(j)}
                  className={`flex h-10 w-14 items-center justify-center rounded-xl border-2 border-[#134E4A] font-black text-sm transition-all ${
                    jilid === j
                      ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                      : "bg-white text-[#134E4A] hover:bg-[#CCFBF1]"
                  }`}
                >
                  Jilid {j}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pageNumbers.indexOf(page) <= 0}
              onClick={handlePrevPage}
              className="flex h-9 items-center gap-1 rounded-xl border-2 border-[#134E4A] bg-white px-3 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] disabled:opacity-40 disabled:shadow-none hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px]"
            >
              <ChevronLeft size={16} /> Hal Sebelumnya
            </button>
            <div className="rounded-xl border-2 border-[#134E4A] bg-[#FEF3C7] px-3 py-1.5 text-center text-xs font-black text-[#7C2D12]">
              Hal {page} / {pageNumbers[pageNumbers.length - 1] ?? 1}
            </div>
            <button
              type="button"
              disabled={pageNumbers.indexOf(page) >= pageNumbers.length - 1}
              onClick={handleNextPage}
              className="flex h-9 items-center gap-1 rounded-xl border-2 border-[#134E4A] bg-white px-3 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] disabled:opacity-40 disabled:shadow-none hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px]"
            >
              Hal Berikutnya <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </StickerCard>

      {/* Konten Halaman */}
      {currentPageData ? (
        <div className="space-y-4">
          {/* Header Judul Halaman */}
          <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-4 shadow-[3px_3px_0px_#134E4A]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#134E4A]/10 pb-3">
              <div>
                <span className="rounded-lg border-2 border-[#134E4A] bg-[#CCFBF1] px-2 py-0.5 text-[10px] font-black uppercase text-[#0F766E]">
                  Jilid {jilid} — Halaman {page}
                </span>
                <h3 className="mt-1 text-base font-black text-[#134E4A]">
                  {currentPageData.title}
                </h3>
              </div>
              <p className="text-xs font-bold text-[#134E4A]/70">
                {currentPageData.subtitle}
              </p>
            </div>

            <p className="mt-2 text-xs font-semibold text-[#134E4A]/80">
              Terdapat <span className="font-black text-[#134E4A]">{currentPageData.questions.length} baris bacaan</span> pada lembar ini. Setiap baris dilengkapi audio talaqqi resmi dan pilihan evaluasi untuk santri.
            </p>
          </div>

          {/* Baris Bacaan Tilawati */}
          <div className="space-y-3">
            {currentPageData.questions.map((q: TilawatiQuestion, idx: number) => {
              const isPlaying = playingUrl === q.audioUrl;
              return (
                <div
                  key={q.id ?? idx}
                  className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-4 shadow-[3px_3px_0px_#134E4A] transition-colors hover:border-[#0D9488]"
                >
                  <div className="flex items-center justify-between gap-2 border-b-2 border-[#134E4A]/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-[#FEF3C7] text-xs font-black text-[#7C2D12]">
                        {idx + 1}
                      </span>
                      {q.hintTone && (
                        <span className="rounded-md border border-[#134E4A] bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-bold text-[#0369A1]">
                          {q.hintTone}
                        </span>
                      )}
                      {q.isListenOnly && (
                        <span className="rounded-md border border-[#134E4A] bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                          Hanya Simak
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onPlayAudio(q.audioUrl)}
                      className={`flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3 py-1 text-xs font-black shadow-[2px_2px_0px_#134E4A] transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                        isPlaying
                          ? "bg-[#EA580C] text-white"
                          : "bg-[#0D9488] text-white hover:bg-[#0f766e]"
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={14} /> Berhenti
                        </>
                      ) : (
                        <>
                          <Volume2 size={14} /> Putar Audio Talaqqi
                        </>
                      )}
                    </button>
                  </div>

                  {/* Teks Arab Besar */}
                  <div className="my-4 text-center">
                    <p
                      dir="rtl"
                      className="font-arabic text-3xl font-bold leading-loose tracking-wide text-[#134E4A] sm:text-4xl"
                    >
                      {q.arabic}
                    </p>
                    {q.transliterationParts.length > 0 && (
                      <p className="mt-2 text-xs font-semibold tracking-wider text-[#134E4A]/70">
                        {q.transliterationParts.join(" - ")}
                      </p>
                    )}
                  </div>

                  {/* Preview Opsi Jawaban Santri */}
                  {q.options && q.options.length > 0 && (
                    <div className="mt-3 rounded-xl border-2 border-dashed border-[#134E4A]/30 bg-gray-50 p-2.5">
                      <p className="text-[10px] font-black uppercase text-[#134E4A]/70">
                        Pilihan Jawaban Santri (Kunci Jawaban Ustadz):
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect =
                            q.correctOptionIndex !== undefined
                              ? optIdx === q.correctOptionIndex
                              : q.transliterationParts.includes(opt);
                          return (
                            <span
                              key={optIdx}
                              className={`flex items-center gap-1 rounded-lg border-2 px-2 py-0.5 text-xs font-black ${
                                isCorrect
                                  ? "border-[#166534] bg-[#DCFCE7] text-[#166534]"
                                  : "border-[#134E4A]/30 bg-white text-[#134E4A]/70"
                              }`}
                            >
                              {isCorrect && <Check size={12} />}
                              {opt}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <StickerCard className="p-6 text-center">
          <p className="text-sm font-bold text-[#134E4A]/80">
            Halaman {page} untuk Jilid {jilid} belum memiliki dataset bacaan.
          </p>
        </StickerCard>
      )}

      {/* Tips Membimbing untuk Ustadz */}
      {entry.tipsUstadz.length > 0 && (
        <StickerCard className="p-4 bg-[#FEF3C7]">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-[#B45309]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-[#7C2D12]">
              Tips Membimbing Santri (Kurikulum Tilawati)
            </h4>
          </div>
          <ul className="mt-2 space-y-1.5">
            {entry.tipsUstadz.map((tip, i) => (
              <li
                key={i}
                className="list-disc pl-4 text-xs font-semibold text-[#7C2D12]/90"
              >
                {tip}
              </li>
            ))}
          </ul>
        </StickerCard>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-komponen Preview: Tajwid Reader                                        */
/* -------------------------------------------------------------------------- */

interface TajwidPreviewProps {
  entry: CatalogEntry;
  onPlayAudio: (url: string) => void;
  playingUrl: string | null;
}

function TajwidPreview({ entry, onPlayAudio, playingUrl }: TajwidPreviewProps) {
  const [selectedRuleId, setSelectedRuleId] = useState<string>(
    TAJWID_RULES[0]?.id ?? "idzhar",
  );

  const currentRule: TajwidRule | undefined =
    TAJWID_RULES.find((r) => r.id === selectedRuleId) || TAJWID_RULES[0];

  return (
    <div className="space-y-5">
      {/* Selector Kaidah Tajwid */}
      <StickerCard className="p-4 bg-[#F0FDF4]">
        <p className="text-xs font-black uppercase text-[#134E4A]/70">
          Pilih Hukum Tajwid
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TAJWID_RULES.map((rule) => (
            <button
              key={rule.id}
              type="button"
              onClick={() => setSelectedRuleId(rule.id)}
              className={`rounded-xl border-2 border-[#134E4A] px-3 py-1.5 text-xs font-black transition-all ${
                selectedRuleId === rule.id
                  ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                  : "bg-white text-[#134E4A] hover:bg-[#CCFBF1]"
              }`}
            >
              {rule.title}
            </button>
          ))}
        </div>
      </StickerCard>

      {/* Detail Kaidah Tajwid Terpilih */}
      {currentRule && (
        <div className="space-y-4">
          <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-5 shadow-[3px_3px_0px_#134E4A]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#134E4A]/10 pb-3">
              <div>
                <span className="rounded-lg border-2 border-[#134E4A] bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-black uppercase text-[#7C2D12]">
                  {currentRule.kaidah}
                </span>
                <h3 className="mt-1 text-lg font-black text-[#134E4A]">
                  {currentRule.title}
                </h3>
              </div>
              <span className="rounded-xl border-2 border-[#134E4A] bg-[#CCFBF1] px-3 py-1 text-xs font-black text-[#0F766E]">
                Cara Baca: {currentRule.caraBaca}
              </span>
            </div>

            <p className="mt-3 text-xs font-semibold leading-relaxed text-[#134E4A]/80">
              {currentRule.note}
            </p>

            <div className="mt-4 rounded-xl border-2 border-[#134E4A] bg-[#FEF9C3] p-3">
              <p className="text-[10px] font-black uppercase text-[#7C2D12]">
                Huruf-Huruf Tajwid:
              </p>
              <p
                dir="rtl"
                className="font-arabic mt-1 text-xl font-bold text-[#7C2D12]"
              >
                {currentRule.huruf}
              </p>
            </div>
          </div>

          {/* Contoh-Contoh Bacaan */}
          <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-5 shadow-[3px_3px_0px_#134E4A]">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#134E4A]">
              Contoh Penerapan Ayat ({currentRule.examples.length} Contoh)
            </h4>

            <div className="mt-3 space-y-3">
              {currentRule.examples.map((ex, idx) => {
                const isPlaying = playingUrl === ex.audioUrl;
                return (
                  <div
                    key={idx}
                    className="flex flex-col gap-3 rounded-xl border-2 border-[#134E4A] bg-white p-3 shadow-[2px_2px_0px_#134E4A] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-[#134E4A] bg-[#FEF3C7] text-[10px] font-black text-[#7C2D12]">
                          {ex.number}
                        </span>
                        <span className="text-xs font-bold text-[#134E4A]/70">
                          Fokus Huruf: <span className="font-black text-[#0D9488]">{ex.highlight}</span>
                        </span>
                      </div>
                      {ex.fullAyah && (
                        <p
                          dir="rtl"
                          className="font-arabic mt-2 text-right text-lg font-bold leading-relaxed text-[#134E4A]"
                        >
                          {ex.fullAyah}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      <button
                        type="button"
                        onClick={() => onPlayAudio(ex.audioUrl)}
                        className={`flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_#134E4A] transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                          isPlaying
                            ? "bg-[#EA580C] text-white"
                            : "bg-[#0D9488] text-white hover:bg-[#0f766e]"
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Pause size={14} /> Berhenti
                          </>
                        ) : (
                          <>
                            <Volume2 size={14} /> Putar Contoh
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tips Membimbing */}
      {entry.tipsUstadz.length > 0 && (
        <StickerCard className="p-4 bg-[#FEF3C7]">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-[#B45309]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-[#7C2D12]">
              Panduan Mengajar Tajwid
            </h4>
          </div>
          <ul className="mt-2 space-y-1.5">
            {entry.tipsUstadz.map((tip, i) => (
              <li
                key={i}
                className="list-disc pl-4 text-xs font-semibold text-[#7C2D12]/90"
              >
                {tip}
              </li>
            ))}
          </ul>
        </StickerCard>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-komponen Preview: Doa Reader                                           */
/* -------------------------------------------------------------------------- */

interface DoaPreviewProps {
  entry: CatalogEntry;
  onPlayAudio: (url: string) => void;
  playingUrl: string | null;
}

function DoaPreview({ entry, onPlayAudio, playingUrl }: DoaPreviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");

  const filteredDoa = useMemo(() => {
    if (selectedCategory === "semua") return DOA_LIST;
    return DOA_LIST.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-5">
      {/* Filter Kategori Doa */}
      <StickerCard className="p-4 bg-[#F0FDF4]">
        <p className="text-xs font-black uppercase text-[#134E4A]/70">
          Kategori Doa
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("semua")}
            className={`rounded-xl border-2 border-[#134E4A] px-3 py-1.5 text-xs font-black transition-all ${
              selectedCategory === "semua"
                ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                : "bg-white text-[#134E4A] hover:bg-[#CCFBF1]"
            }`}
          >
            Semua ({DOA_LIST.length})
          </button>
          {DOA_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-xl border-2 border-[#134E4A] px-3 py-1.5 text-xs font-black transition-all ${
                selectedCategory === cat.key
                  ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                  : "bg-white text-[#134E4A] hover:bg-[#CCFBF1]"
              }`}
            >
              {cat.title} ({cat.count})
            </button>
          ))}
        </div>
      </StickerCard>

      {/* Grid Kartu Doa */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredDoa.map((doa: DoaItem) => {
          const isPlaying = Boolean(doa.audioUrl && playingUrl === doa.audioUrl);
          return (
            <div
              key={doa.id}
              className="flex flex-col justify-between rounded-2xl border-[3px] border-[#134E4A] bg-white p-4 shadow-[3px_3px_0px_#134E4A]"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b-2 border-[#134E4A]/10 pb-2">
                  <h4 className="text-sm font-black text-[#134E4A]">
                    {doa.title}
                  </h4>
                  <span className="shrink-0 rounded-md border border-[#134E4A] bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-black text-[#7C2D12]">
                    {doa.category}
                  </span>
                </div>

                <div className="my-3 text-right">
                  <p
                    dir="rtl"
                    className="font-arabic text-2xl font-bold leading-loose text-[#134E4A]"
                  >
                    {doa.arabic}
                  </p>
                </div>

                <p className="text-xs font-semibold italic text-[#0F766E]">
                  {doa.latin}
                </p>

                <p className="mt-2 text-xs font-semibold text-[#134E4A]/80">
                  <span className="font-black">Arti:</span> {doa.translation}
                </p>
              </div>

              {doa.audioUrl && (
                <div className="mt-4 border-t-2 border-[#134E4A]/10 pt-3">
                  <button
                    type="button"
                    onClick={() => doa.audioUrl && onPlayAudio(doa.audioUrl)}
                    className={`flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[#134E4A] py-1.5 text-xs font-black shadow-[2px_2px_0px_#134E4A] transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                      isPlaying
                        ? "bg-[#EA580C] text-white"
                        : "bg-[#0D9488] text-white hover:bg-[#0f766e]"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={14} /> Berhenti
                      </>
                    ) : (
                      <>
                        <Volume2 size={14} /> Dengarkan Doa
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tips Membimbing */}
      {entry.tipsUstadz.length > 0 && (
        <StickerCard className="p-4 bg-[#FEF3C7]">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-[#B45309]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-[#7C2D12]">
              Tips Bimbingan Doa & Adab Harian
            </h4>
          </div>
          <ul className="mt-2 space-y-1.5">
            {entry.tipsUstadz.map((tip, i) => (
              <li
                key={i}
                className="list-disc pl-4 text-xs font-semibold text-[#7C2D12]/90"
              >
                {tip}
              </li>
            ))}
          </ul>
        </StickerCard>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-komponen Preview: Juz Amma Reader                                      */
/* -------------------------------------------------------------------------- */

interface JuzAmmaPreviewProps {
  entry: CatalogEntry;
  onPlayAudio: (url: string) => void;
  playingUrl: string | null;
}

function JuzAmmaPreview({ entry, onPlayAudio, playingUrl }: JuzAmmaPreviewProps) {
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(114);

  const currentSurah = useMemo(
    () =>
      JUZ_AMMA_SURAHS.find((s) => s.number === selectedSurahNumber) ||
      JUZ_AMMA_SURAHS[0],
    [selectedSurahNumber],
  );

  return (
    <div className="space-y-5">
      {/* Selector Surah */}
      <StickerCard className="p-4 bg-[#F0FDF4]">
        <p className="text-xs font-black uppercase text-[#134E4A]/70">
          Pilih Surah Juz 30 (Juz 'Amma)
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {JUZ_AMMA_SURAHS.map((surah) => (
            <button
              key={surah.number}
              type="button"
              onClick={() => setSelectedSurahNumber(surah.number)}
              className={`rounded-xl border-2 border-[#134E4A] px-3 py-1.5 text-xs font-black transition-all ${
                selectedSurahNumber === surah.number
                  ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                  : "bg-white text-[#134E4A] hover:bg-[#CCFBF1]"
              }`}
            >
              {surah.number}. {surah.name}
            </button>
          ))}
        </div>
      </StickerCard>

      {/* Detail Surah Terpilih */}
      {currentSurah && (
        <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-5 shadow-[3px_3px_0px_#134E4A]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#134E4A]/10 pb-3">
            <div>
              <span className="rounded-lg border-2 border-[#134E4A] bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-black uppercase text-[#7C2D12]">
                Surah Ke-{currentSurah.number}
              </span>
              <h3 className="mt-1 text-xl font-black text-[#134E4A]">
                Surah {currentSurah.name}
              </h3>
              <p className="text-xs font-bold text-[#134E4A]/70">
                Terdiri dari {currentSurah.ayah} ayat
              </p>
            </div>

            <button
              type="button"
              onClick={() => onPlayAudio(currentSurah.audioUrl)}
              className={`flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-4 py-2 text-xs font-black shadow-[2px_2px_0px_#134E4A] transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                playingUrl === currentSurah.audioUrl
                  ? "bg-[#EA580C] text-white"
                  : "bg-[#0D9488] text-white hover:bg-[#0f766e]"
              }`}
            >
              {playingUrl === currentSurah.audioUrl ? (
                <>
                  <Pause size={16} /> Berhenti Murottal
                </>
              ) : (
                <>
                  <Volume2 size={16} /> Putar Audio Murottal
                </>
              )}
            </button>
          </div>

          <div className="mt-4 rounded-xl border-2 border-dashed border-[#134E4A]/30 bg-gray-50 p-4">
            <p className="text-xs font-bold text-[#134E4A]/80">
              Mode Preview Guru menyajikan audio pembacaan dan rincian surah untuk verifikasi hafalan santri tanpa animasi bintang atau koin.
            </p>
          </div>
        </div>
      )}

      {/* Tips Membimbing */}
      {entry.tipsUstadz.length > 0 && (
        <StickerCard className="p-4 bg-[#FEF3C7]">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-[#B45309]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-[#7C2D12]">
              Tips Penilaian Hafalan Surah
            </h4>
          </div>
          <ul className="mt-2 space-y-1.5">
            {entry.tipsUstadz.map((tip, i) => (
              <li
                key={i}
                className="list-disc pl-4 text-xs font-semibold text-[#7C2D12]/90"
              >
                {tip}
              </li>
            ))}
          </ul>
        </StickerCard>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-komponen Preview: Generic / Quiz / Game Preview                        */
/* -------------------------------------------------------------------------- */

interface GenericPreviewProps {
  entry?: CatalogEntry;
  customQuiz?: Quiz | null;
  onOpenAssign: () => void;
}

function GenericPreview({ entry, customQuiz, onOpenAssign }: GenericPreviewProps) {
  if (customQuiz) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-5 shadow-[3px_3px_0px_#134E4A]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#134E4A]/10 pb-3">
            <div>
              <span className="rounded-lg border-2 border-[#134E4A] bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-black uppercase text-[#7C2D12]">
                Kuis Bank Ustadz
              </span>
              <h3 className="mt-1 text-lg font-black text-[#134E4A]">
                {customQuiz.title}
              </h3>
            </div>
            <span className="rounded-xl border-2 border-[#134E4A] bg-[#CCFBF1] px-3 py-1 text-xs font-black text-[#0F766E]">
              {customQuiz.questions.length} Soal
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {customQuiz.questions.map((q, idx) => (
              <div
                key={q.id ?? idx}
                className="rounded-xl border-2 border-[#134E4A] bg-gray-50 p-3"
              >
                <p className="text-xs font-black text-[#134E4A]">
                  {idx + 1}. {q.prompt}
                </p>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.answerIndex;
                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-1.5 rounded-lg border-2 p-2 text-xs font-bold ${
                          isCorrect
                            ? "border-[#166534] bg-[#DCFCE7] text-[#166534]"
                            : "border-[#134E4A]/20 bg-white text-[#134E4A]/70"
                        }`}
                      >
                        {isCorrect && <Check size={14} className="shrink-0" />}
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!entry) return null;

  const isGame = entry.type === "game";
  const isQuiz = entry.type === "quiz";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-5 shadow-[3px_3px_0px_#134E4A]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#134E4A]/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border-2 border-[#134E4A] bg-[#CCFBF1] px-2 py-0.5 text-[10px] font-black uppercase text-[#0F766E]">
                {isGame ? "Game Interaktif" : isQuiz ? "Evaluasi Kuis" : "Materi Pembelajaran"}
              </span>
              {isGame && (
                <span
                  className={`rounded-lg border-2 border-[#134E4A] px-2 py-0.5 text-[10px] font-black ${
                    entry.access === "guest-open"
                      ? "bg-[#DCFCE7] text-[#166534]"
                      : "bg-[#FEF9C3] text-[#7C2D12]"
                  }`}
                >
                  {entry.access === "guest-open"
                    ? "Terbuka Tamu"
                    : "Hanya Member"}
                </span>
              )}
            </div>
            <h3 className="mt-1 text-xl font-black text-[#134E4A]">
              {entry.title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-1">
            {entry.materiPokok.map((materi) => (
              <span
                key={materi}
                className="rounded-lg border-2 border-[#134E4A] bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-black text-[#0369A1]"
              >
                {MATERI_LABELS[materi] || materi}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#134E4A]">
              Tujuan Pembelajaran
            </h4>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-[#134E4A]/80">
              {entry.learningObjective}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#134E4A]">
              {isGame ? "Mekanik & Cara Main Santri" : "Tata Cara Belajar"}
            </h4>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-[#134E4A]/80">
              {entry.caraMain}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#134E4A]">
              Jilid Relevan
            </h4>
            {entry.jilidRelevan.length > 0 ? (
              <div className="mt-1 flex gap-1.5">
                {entry.jilidRelevan.map((jilid) => (
                  <span
                    key={jilid}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-[#FEF3C7] text-xs font-black text-[#7C2D12]"
                  >
                    {jilid}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-xs font-semibold text-[#134E4A]/60">
                Materi pengayaan fleksibel (tidak terikat jilid Tilawati tertentu).
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t-2 border-[#134E4A]/10 pt-4">
          <StickerButton onClick={onOpenAssign} className="w-full bg-[#0D9488] text-white">
            Tugaskan {isGame ? "Game" : isQuiz ? "Kuis" : "Materi"} Ini ke Kelas
          </StickerButton>
        </div>
      </div>

      {entry.tipsUstadz.length > 0 && (
        <StickerCard className="p-4 bg-[#FEF3C7]">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-[#B45309]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-[#7C2D12]">
              Tips Membimbing Santri
            </h4>
          </div>
          <ul className="mt-2 space-y-1.5">
            {entry.tipsUstadz.map((tip, i) => (
              <li
                key={i}
                className="list-disc pl-4 text-xs font-semibold text-[#7C2D12]/90"
              >
                {tip}
              </li>
            ))}
          </ul>
        </StickerCard>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Halaman Utama: UstadzMaterialPreviewPage                                    */
/* -------------------------------------------------------------------------- */

export function UstadzMaterialPreviewPage() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [customQuiz, setCustomQuiz] = useState<Quiz | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ambil catalog entry
  const entry = useMemo(
    () => (materialId ? getCatalogItemById(materialId) : undefined),
    [materialId],
  );

  // Jika tidak ada di catalog, coba cari di Bank Kuis Ustadz
  useEffect(() => {
    if (!entry && materialId) {
      getQuiz(materialId)
        .then((q) => {
          if (q) setCustomQuiz(q);
        })
        .catch(() => {});
    }
  }, [entry, materialId]);

  // Audio player cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayAudio = (url: string) => {
    if (!url) return;
    if (playingAudioUrl === url) {
      audioRef.current?.pause();
      setPlayingAudioUrl(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingAudioUrl(url);

    audio.play().catch(() => {
      setPlayingAudioUrl(null);
    });

    audio.onended = () => {
      setPlayingAudioUrl(null);
    };

    audio.onerror = () => {
      setPlayingAudioUrl(null);
    };
  };

  const materialTitle = entry?.title || customQuiz?.title || materialId || "Materi";

  // Deteksi tipe konten untuk menentukan renderer yang tepat
  const isTilawati =
    entry &&
    (entry.materiPokok.includes("tilawati") ||
      entry.id.startsWith("tilawati") ||
      entry.id === "menara-tilawati");

  const isTajwid =
    entry &&
    (entry.id === "kunci-rahasia-tajwid" ||
      (entry.materiPokok.includes("tajwid") && entry.type === "materi"));

  const isDoa =
    entry &&
    (entry.id === "gudang-doa" ||
      (entry.materiPokok.includes("doa") && entry.type === "materi"));

  const isJuzAmma =
    entry &&
    (entry.id === "galaksi-juz-amma" ||
      (entry.materiPokok.includes("juz-amma") && entry.type === "materi"));

  // Default jilid untuk Tilawati reader
  const initialJilid = useMemo(() => {
    if (!entry) return 1;
    const match = entry.id.match(/tilawati-jilid-(\d+)/);
    if (match && match[1]) return Number(match[1]);
    if (entry.jilidRelevan.length > 0) return entry.jilidRelevan[0] as number;
    return 1;
  }, [entry]);

  return (
    <div className="relative pb-24">
      {/* 1. Sticky Preview Header */}
      <div className="sticky top-16 z-20 -mx-4 -mt-6 mb-6 flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-[#134E4A] bg-[#CCFBF1] px-4 py-3 md:-mx-8 md:px-8">
        <div className="flex items-center gap-3">
          <StickerButton
            variant="ghost"
            size="sm"
            onClick={() => navigate("/ustadz/kurikulum")}
            className="flex items-center gap-1.5 bg-white text-xs font-black shadow-[2px_2px_0px_#134E4A]"
          >
            <ChevronLeft size={16} />
            <span>Kembali ke Kurikulum</span>
          </StickerButton>
          <div className="h-5 w-0.5 bg-[#134E4A]/20" />
          <span className="rounded-md border-2 border-[#134E4A] bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-black uppercase text-[#7C2D12]">
            Teacher Preview Mode
          </span>
        </div>

        <div className="text-right">
          <p className="text-xs font-bold text-[#134E4A]/80">
            Materi: <span className="font-black text-[#134E4A]">{materialTitle}</span>
          </p>
        </div>
      </div>

      {/* 2. Informasi Banner Ustadz */}
      <div className="mb-6 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] p-4 shadow-[3px_3px_0px_#134E4A]">
        <div className="flex items-start gap-3">
          <Info size={20} className="mt-0.5 shrink-0 text-[#B45309]" />
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#7C2D12]">
              Mode Pratinjau Pengajar (Teacher View)
            </p>
            <p className="mt-0.5 text-xs font-semibold leading-relaxed text-[#7C2D12]/90">
              Anda sedang melihat konten asli materi ini secara langsung tanpa antarmuka gamifikasi santri (tanpa koin, hati, atau maskot). Gunakan halaman ini untuk menelaah teks bacaan, memutar talaqqi audio, dan menugaskannya ke kelas Anda.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Konten Utama Berdasarkan Kategori Materi */}
      {isTilawati && entry ? (
        <TilawatiPreview
          initialJilid={initialJilid}
          entry={entry}
          onPlayAudio={handlePlayAudio}
          playingUrl={playingAudioUrl}
        />
      ) : isTajwid && entry ? (
        <TajwidPreview
          entry={entry}
          onPlayAudio={handlePlayAudio}
          playingUrl={playingAudioUrl}
        />
      ) : isDoa && entry ? (
        <DoaPreview
          entry={entry}
          onPlayAudio={handlePlayAudio}
          playingUrl={playingAudioUrl}
        />
      ) : isJuzAmma && entry ? (
        <JuzAmmaPreview
          entry={entry}
          onPlayAudio={handlePlayAudio}
          playingUrl={playingAudioUrl}
        />
      ) : (
        <GenericPreview
          entry={entry}
          customQuiz={customQuiz}
          onOpenAssign={() => setIsAssignModalOpen(true)}
        />
      )}

      {/* 4. Floating Action Button (FAB) Tugaskan Materi */}
      <button
        type="button"
        onClick={() => setIsAssignModalOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-30 flex items-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0px_#134E4A] transition-all hover:bg-[#0f766e] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A]"
      >
        <BookOpen size={18} />
        <span>Tugaskan Materi Ini</span>
      </button>

      {/* 5. Modal Penugasan */}
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        materialId={materialId ?? ""}
        materialTitle={materialTitle}
        ustadzId={user?.id}
      />
    </div>
  );
}
