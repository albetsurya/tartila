import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  ExploreHeader,
  ExploreStatBadge,
} from "../../components/ExploreHeader";
import {
  PatternArrowButton,
  type ArrowType,
  type PatternType,
} from "../../components/lab-irama/PatternArrowButton";
import {
  getRhythmMemoryLevels,
  getRhythmMemoryLevelInfo,
  getBaseTone,
  type TrainingItem,
} from "../../utils/tilawatiTrainingDataAdapter";
import { useRhythmMemoryAudio } from "../../hooks/useRhythmMemoryAudio";
import { triggerBibiReaction } from "@/utils/bibiEvent";
import { soundManager } from "../../services/soundManager";
import { patternTypeToArrows } from "../../utils/rhythmMemoryPattern";
import { AnswerFeedbackSheet } from "../../components/AnswerFeedbackSheet";
import { StarSvg } from "@/components/ui/CustomIcons";

// Kamus: kode panah ditampilkan di bank panah dan kotak jawaban.
const ARROW_LABEL: Record<ArrowType, string> = {
  datar: "Datar",
  naik: "Naik",
  turun: "Turun",
};

const ARROW_SYMBOL: Record<ArrowType, string> = {
  datar: "→",
  naik: "↗",
  turun: "↘",
};

const ARROW_COLOR_CLASS: Record<ArrowType, string> = {
  datar: "bg-[#15803D] text-[#FFFFFF]",
  naik: "bg-[#D97706] text-[#FFFFFF]",
  turun: "bg-[#EF4444] text-[#FFFFFF]",
};

export default function RhythmMemoryPage() {
  const navigate = useNavigate();
  const { jilid: jilidParam } = useParams<{ jilid?: string }>();

  const currentJilid = useMemo(() => {
    const parsed = Number(jilidParam);
    return parsed >= 1 && parsed <= 6 ? parsed : 1;
  }, [jilidParam]);

  const [levels, setLevels] = useState<TrainingItem[][]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState(true);

  useEffect(() => {
    let alive = true;
    void getRhythmMemoryLevels(currentJilid, 12)
      .then((result) => {
        if (alive) setLevels(result);
      })
      .finally(() => {
        if (alive) setIsLoadingLevels(false);
      });
    return () => {
      alive = false;
    };
  }, [currentJilid]);

  const { title, subtitle, badgeBg, borderColor } =
    getRhythmMemoryLevelInfo(currentJilid);

  // Audio hooks (dari adapter yang sudah ada)
  const { playCardSound, stopAudio, preloadAudio } = useRhythmMemoryAudio();

  // State permainan
  const [answer, setAnswer] = useState<ArrowType[]>([]);
  const [phase, setPhase] = useState<"idle" | "listening" | "answered">("idle");
  const [feedback, setFeedback] = useState<"idle" | "success" | "fail">("idle");
  const [checkError, setCheckError] = useState<string | null>(null);
  const [levelIndex, setLevelIndex] = useState(0);

  // Bikin level dari adapter
  const levelItems = levels[levelIndex] ?? [];
  const representativeItem =
    levelItems.find(
      (item) => item.audioUrl && item.patternType !== "1-datar",
    ) ?? levelItems[0];

  // Pola yang benar (murni dari data adapter)
  const correctPattern = useMemo(() => {
    if (representativeItem?.patternType) {
      return patternTypeToArrows(representativeItem.patternType);
    }
    return [];
  }, [representativeItem]);

  // Audio yang diputar saat level dimuat/dirubah
  const audioUrl = representativeItem?.audioUrl ?? null;
  const audioBpm = representativeItem?.bpm ?? 65;
  const audioBeatsCount = representativeItem?.beatsCount ?? 2;
  const audioTone = getBaseTone(representativeItem?.patternType ?? "1-datar");

  // Reset level
  const resetLevel = useCallback(() => {
    stopAudio();
    triggerBibiReaction("click");
    soundManager.playSfx("pop");
    setAnswer([]);
    setPhase("idle");
    setFeedback("idle");
    setCheckError(null);
  }, [stopAudio]);

  // Ketika jilid berubah -> reset ke level 0
  const prevJilidRef = React.useRef(currentJilid);
  React.useEffect(() => {
    if (currentJilid !== prevJilidRef.current) {
      prevJilidRef.current = currentJilid;
      resetLevel();
      setLevelIndex(0);
      void preloadAudio();
    }
  }, [currentJilid, resetLevel, preloadAudio]);

  // Preload audio saat mount
  React.useEffect(() => {
    void preloadAudio();
  }, [preloadAudio]);

  // Putar audio sesuai audioUrl yang ada
  const handlePlayAudio = useCallback(() => {
    if (phase !== "idle" && phase !== "answered") return;
    stopAudio();
    triggerBibiReaction("play");
    void playCardSound({
      audioUrl,
      tone: audioTone,
      bpm: audioBpm,
      beatsCount: audioBeatsCount,
    });
    setPhase("listening");
    setFeedback("idle");
  }, [
    phase,
    audioUrl,
    audioTone,
    audioBpm,
    audioBeatsCount,
    playCardSound,
    stopAudio,
  ]);

  // Tambah panah ke kotak jawaban
  const handleAddArrow = useCallback(
    (arrow: ArrowType) => {
      if (phase !== "idle") return;
      setAnswer((prev) => [...prev, arrow]);
    },
    [phase],
  );

  // Hapus panah terakhir
  const handleRemoveArrow = useCallback(() => {
    if (phase !== "idle") return;
    setAnswer((prev) => prev.slice(0, -1));
    setFeedback("idle");
  }, [phase]);

  // Periksa jawaban
  const handleCheck = useCallback(() => {
    if (phase !== "idle") return;
    if (answer.length === 0) {
      setCheckError("Belum ada jawaban. Tambah panah dari bank panah dulu.");
      setFeedback("fail");
      return;
    }
    setCheckError(null);
    if (JSON.stringify(answer) === JSON.stringify(correctPattern)) {
      triggerBibiReaction("success");
      setPhase("answered");
      setFeedback("success");
    } else {
      triggerBibiReaction("error");
      setPhase("answered");
      setFeedback("fail");
    }
  }, [answer, correctPattern, phase]);

  // Main lagi (reset semua)
  const handleResetAll = useCallback(() => {
    resetLevel();
    setLevelIndex(0);
  }, [resetLevel]);

  const isCorrect = feedback === "success";
  const isWrong = feedback === "fail";

  return (
    <NgajiCeriaLayout
      title="Kemah Irama Savana"
      hideHeader={true}
      themeScope="lab-irama"
      onBack={() => navigate("/member/ngaji-ceria/training")}
    >
      {/* Latar Dalam Tenda Kemah Krem Hangat (#FEF3C7) */}
      <div className="relative min-h-[100dvh] w-full bg-[#FEF3C7] overflow-x-hidden pb-44 sm:pb-48 select-none">
        {/* Pola Tenun Kanvas Tenda Savana */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(#D97706 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Tirai Segitiga Pintu Tenda di Kiri & Kanan Atas */}
        <div
          className="pointer-events-none fixed top-0 left-0 w-24 h-44 bg-[#D97706]/30 z-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />
        <div
          className="pointer-events-none fixed top-0 right-0 w-24 h-44 bg-[#D97706]/30 z-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
        />

        <div className="relative z-20">
          {/* Header Eksplorasi Papan Kayu Kemah */}
          <ExploreHeader
            title={`Tenda Irama - Jilid ${currentJilid}`}
            subtitle={subtitle}
            onBack={() => navigate("/member/ngaji-ceria/training")}
            themeScope="lab-irama"
            themeColorClass="bg-[#78350F]"
            borderColorClass="border-[#451A03]"
            shadowClass="shadow-[0_4px_0px_#451A03]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF08A] text-[#451A03] border-[#451A03] shadow-[2px_2px_0px_#451A03] hover:bg-[#FDE68A]"
            extraBadge={
              <ExploreStatBadge
                icon={<StarSvg size={16} />}
                value={`Pos ${levelIndex + 1} / ${levels.length}`}
                title={`Pos ${levelIndex + 1} dari ${levels.length}`}
                className="bg-[#FEF08A] text-[#451A03] border-[#451A03] shadow-[2px_2px_0px_#451A03]"
              />
            }
          />

          {/* HUD Papan Kayu Perkemahan & Skor */}
          <section className="px-4 pt-5 max-w-xl mx-auto">
            {/* Atap Segitiga Kecil di Atas Papan HUD */}
            <div
              className="mx-auto h-6 w-48 bg-[#D97706] border-t-[3px] border-x-[3px] border-[#451A03]"
              style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
            />
            <div className="flex items-center justify-between rounded-2xl bg-[#78350F] border-[4px] border-[#451A03] px-4 py-3 shadow-[5px_5px_0px_#451A03] text-[#FEF3C7]">
              <div className="flex items-center gap-2 text-[13px] font-black text-[#FEF08A]">
                <span
                  className={`w-3 h-3 rounded-full border border-[#451A03] ${badgeBg}`}
                />
                {title}
              </div>
              <div className="flex items-center gap-2.5 text-[13px] font-black text-[#FEF3C7]">
                <span className="flex items-center gap-1 bg-[#451A03] px-2.5 py-0.5 rounded-lg border border-[#D97706]">
                  <span className={`w-2.5 h-2.5 rounded-full ${borderColor}`} />
                  Pos {levelIndex + 1}/{levels.length || 1}
                </span>
                <span className="flex items-center gap-1 bg-[#FEF08A] text-[#451A03] px-2.5 py-0.5 rounded-lg border-[2px] border-[#451A03]">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      feedback === "success"
                        ? "bg-[#15803D]"
                        : feedback === "fail"
                          ? "bg-[#EF4444]"
                          : "bg-[#D97706]"
                    }`}
                  />
                  <span className="font-black">
                    {answer.length} / {correctPattern.length}
                  </span>
                </span>
              </div>
            </div>

            {/* Pita Petunjuk Kompas */}
            <div className="mt-3 text-center">
              <span className="inline-block px-4 py-1.5 rounded-xl bg-[#FFFBEB] border-[3px] border-[#451A03] text-[11px] font-black text-[#78350F] shadow-[3px_3px_0px_#451A03]">
                {isLoadingLevels
                  ? "Menyiapkan kompas irama savana..."
                  : (checkError ??
                    "🧭 Dengarkan suara qari di tenda, lalu susun panah kayunya!")}
              </span>
            </div>
          </section>

          {/* 1) TOMBOL PUTAR AUDIO (LENTERA SUARA TENDA) */}
          <section className="px-4 pt-4 max-w-xl mx-auto">
            <button
              type="button"
              onClick={handlePlayAudio}
              disabled={
                phase === "listening" ||
                (!audioUrl && correctPattern.length === 0)
              }
              className="inline-flex items-center justify-center gap-3 w-full rounded-2xl border-[4px] border-[#451A03] bg-[#15803D] hover:bg-[#166534] px-6 py-4 font-black text-[#FFFFFF] shadow-[5px_5px_0px_#451A03] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 transition-all cursor-pointer"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF08A] text-[#451A03] border-[2.5px] border-[#451A03] text-xl">
                ▶
              </span>
              <span className="text-base sm:text-lg">
                {phase === "listening"
                  ? "Mendengarkan Irama..."
                  : audioUrl
                    ? "Putar Audio Irama Kemah"
                    : "Bunyikan Sinyal Irama"}
              </span>
              {phase === "listening" && (
                <span className="w-5 h-5 border-[3px] border-[#FEF08A] border-t-transparent rounded-full animate-spin" />
              )}
            </button>
            {!audioUrl && levelItems.length > 0 && (
              <p className="mt-2 text-center text-[11px] font-black text-[#78350F]">
                Audio belum tersedia. Menampilkan pola dari data level.
              </p>
            )}
          </section>

          {/* 2) KOTAK JAWABAN (PAPAN KAYU ALAM TERBUKA) */}
          <section className="px-4 pt-5 max-w-xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <span className="inline-block rounded-lg bg-[#D97706] border-[2px] border-[#451A03] px-3 py-0.5 text-[10px] font-black text-[#FEF3C7] uppercase tracking-widest shadow-[2px_2px_0px_#451A03]">
                Papan Kayu Jawaban
              </span>
              <div
                className={`relative w-full min-h-[76px] flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border-[4px] p-4 shadow-[5px_5px_0px_#451A03] transition-all ${
                  feedback === "fail"
                    ? "border-[#451A03] bg-[#FFE4E6]"
                    : feedback === "success"
                      ? "border-[#451A03] bg-[#DCFCE7]"
                      : "border-[#451A03] bg-[#FFFBEB]"
                }`}
                aria-label="Kotak jawaban"
              >
                {/* Paku Sudut Papan Kayu */}
                <span className="pointer-events-none absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#78350F] border border-[#451A03]" />
                <span className="pointer-events-none absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#78350F] border border-[#451A03]" />

                {answer.length === 0 ? (
                  <span className="text-xs font-black text-[#78350F]/70">
                    Belum ada panah kayu. Ketuk bank panah di bawah!
                  </span>
                ) : (
                  answer.map((arrow, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border-[3px] border-[#451A03] font-black text-sm shadow-[3px_3px_0px_#451A03] ${ARROW_COLOR_CLASS[arrow]}`}
                    >
                      <span className="text-lg leading-none">
                        {ARROW_SYMBOL[arrow]}
                      </span>
                      <span className="text-[11px] font-black">
                        {ARROW_LABEL[arrow]}
                      </span>
                    </span>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* 3) BANK PANAH KOMPAS KAYU */}
          <section className="px-4 pt-5 pb-4 max-w-xl mx-auto">
            <div className="rounded-2xl bg-[#FDE68A] border-[4px] border-[#451A03] p-4 shadow-[5px_5px_0px_#451A03]">
              <div className="text-center mb-3">
                <span className="text-[11px] font-black text-[#451A03] uppercase tracking-widest">
                  ✦ Bank Panah Kompas ✦
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <PatternArrowButton
                  type={"datar" as PatternType}
                  onClick={() => handleAddArrow("datar")}
                  disabled={phase !== "idle"}
                />
                <PatternArrowButton
                  type={"naik" as PatternType}
                  onClick={() => handleAddArrow("naik")}
                  disabled={phase !== "idle"}
                />
                <PatternArrowButton
                  type={"turun" as PatternType}
                  onClick={() => handleAddArrow("turun")}
                  disabled={phase !== "idle"}
                />
              </div>
            </div>
          </section>

          {/* 4) KONTROL & TOMBOL PANAH KAYU NAVIGASI */}
          <section className="px-4 pb-4 max-w-xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRemoveArrow}
                disabled={answer.length === 0 || phase !== "idle"}
                className="inline-flex items-center gap-1.5 rounded-xl border-[3.5px] border-[#451A03] bg-[#EF4444] px-4 py-2.5 font-black text-[#FFFFFF] shadow-[4px_4px_0px_#451A03] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 transition-all cursor-pointer"
              >
                <span className="text-lg">⌫</span>
                <span className="text-xs font-black">Hapus</span>
              </button>

              <button
                type="button"
                onClick={handleCheck}
                disabled={
                  phase !== "idle" ||
                  answer.length !== correctPattern.length ||
                  correctPattern.length === 0
                }
                className="inline-flex items-center gap-1.5 rounded-xl border-[3.5px] border-[#451A03] bg-[#15803D] px-5 py-2.5 font-black text-[#FFFFFF] shadow-[4px_4px_0px_#451A03] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 transition-all cursor-pointer"
              >
                <span className="text-lg">✓</span>
                <span className="text-sm font-black">Periksa Jawaban</span>
              </button>

              {phase === "answered" && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="inline-flex items-center gap-1.5 rounded-xl border-[3.5px] border-[#451A03] bg-[#D97706] px-5 py-2.5 font-black text-[#FEF3C7] shadow-[4px_4px_0px_#451A03] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                >
                  <span className="text-lg">↺</span>
                  <span className="text-sm font-black">Coba Lagi</span>
                </button>
              )}
            </div>

            {/* Navigasi Level Berbentuk Panah Kayu Penunjuk Arah */}
            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setLevelIndex((i) => Math.max(0, i - 1))}
                disabled={levelIndex === 0}
                className="inline-flex items-center gap-1.5 rounded-xl border-[3.5px] border-[#451A03] bg-[#78350F] px-4 py-2 font-black text-[#FEF08A] shadow-[3px_3px_0px_#451A03] disabled:cursor-not-allowed disabled:opacity-40 transition-all hover:bg-[#92400E] cursor-pointer"
                style={{
                  clipPath:
                    "polygon(12% 0%, 100% 0%, 100% 100%, 12% 100%, 0% 50%)",
                }}
              >
                <span className="text-xs font-black pl-2">Pos Sebelum</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setLevelIndex((i) => Math.min(levels.length - 1, i + 1))
                }
                disabled={levelIndex >= levels.length - 1}
                className="inline-flex items-center gap-1.5 rounded-xl border-[3.5px] border-[#451A03] bg-[#D97706] px-4 py-2 font-black text-[#FEF3C7] shadow-[3px_3px_0px_#451A03] disabled:cursor-not-allowed disabled:opacity-40 transition-all hover:bg-[#B45309] cursor-pointer"
                style={{
                  clipPath:
                    "polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%)",
                }}
              >
                <span className="text-xs font-black pr-2">Pos Berikutnya</span>
              </button>
            </div>
          </section>

          {/* Feedback Benar/Salah */}
          <AnimatePresence>
            {isCorrect ? (
              <div className="px-4 pb-6 max-w-xl mx-auto">
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-[4px] border-[#451A03] bg-[#DCFCE7] px-5 py-4 text-center shadow-[5px_5px_0px_#451A03]">
                  <span className="text-4xl">✅</span>
                  <span className="text-[13px] font-black text-[#14532D]">
                    Benar! Irama {correctPattern.join(" → ")} berhasil ditebak!
                  </span>
                </div>
              </div>
            ) : isWrong ? (
              <div className="px-4 pb-6 max-w-xl mx-auto">
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-[4px] border-[#451A03] bg-[#FFE4E6] px-5 py-4 text-center shadow-[5px_5px_0px_#451A03]">
                  <span className="text-4xl">❌</span>
                  <span className="text-[13px] font-black text-[#991B1B]">
                    Kurang tepat. Ulangi dari awal (Coba Lagi).
                  </span>
                </div>
              </div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Bottom Sheet Feedback Jawaban */}
        <AnswerFeedbackSheet
          isOpen={phase === "answered"}
          isCorrect={isCorrect}
          onNext={() => {
            if (levelIndex < levels.length - 1) {
              setLevelIndex((i) => i + 1);
              resetLevel();
            } else {
              navigate("/member/ngaji-ceria/training");
            }
          }}
          onRetry={resetLevel}
          onReset={resetLevel}
          onClose={() => setPhase("idle")}
        />
      </div>
    </NgajiCeriaLayout>
  );
}
