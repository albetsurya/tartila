import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { JUZ_AMMA_QUIZ_DATA } from "../data/hijaiyah";
import { tapFeedback } from "../../../lib/haptics";
import {
  Check,
  X,
  Sparkles,
  Trophy,
  ChevronRight,
} from "../../../components/ui/CustomIcons";

export default function TebakAyatGamePage() {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question =
    JUZ_AMMA_QUIZ_DATA[Math.min(currentIdx, JUZ_AMMA_QUIZ_DATA.length - 1)];
  const totalQuestions = JUZ_AMMA_QUIZ_DATA.length;
  const progressPercent = Math.round((currentIdx / totalQuestions) * 100);

  const handlePick = (opt: string) => {
    if (status !== "idle") return;
    tapFeedback();
    setSelected(opt);
  };

  const handleCheck = () => {
    if (!selected) return;
    tapFeedback();
    if (selected === question.surahName) {
      setStatus("correct");
      setScore((s) => s + 150);
    } else {
      setStatus("wrong");
    }
  };

  const handleNext = () => {
    tapFeedback();
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setStatus("idle");
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setSelected(null);
    setStatus("idle");
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <NgajiCeriaLayout
        title="Tebak Ayat"
        showBack
        onBack={() => navigate("/member/ngaji-ceria/games")}
      >
        <div className="px-4 py-10 flex flex-col items-center">
          <div className="bg-white rounded-[28px] p-8 text-center border border-gray-100 shadow-md space-y-4 max-w-sm w-full">
            <div className="w-16 h-16 rounded-full bg-[#FF6B6B] border-2 border-[#0F766E]/20 mx-auto flex items-center justify-center">
              <Trophy size={28} className="text-[#134e4a]" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-[#134e4a]">
                Misi Selesai!
              </h3>
              <p className="text-xs text-[#134e4a]/70 mt-1">
                Skor akhir Tebak Ayat: {score}
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={restart}
                className="flex-1 py-3 rounded-2xl bg-[#0d9488] text-white font-black text-sm shadow-md border-b-4 border-[#0f766e] active:translate-y-1 transition-all"
              >
                Main Lagi
              </button>
              <button
                onClick={() => navigate("/member/ngaji-ceria/games")}
                className="flex-1 py-3 rounded-2xl bg-white text-[#134e4a] font-black text-sm shadow-md border border-gray-100 active:translate-y-1 transition-all"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </NgajiCeriaLayout>
    );
  }

  return (
    <NgajiCeriaLayout
      title="Tebak Ayat"
      showBack
      onBack={() => navigate("/member/ngaji-ceria/games")}
    >
      <div className="px-4 py-4 space-y-4 bg-[#FBF6EE] min-h-full rounded-t-3xl flex flex-col">
        {/* Progress Header */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex-1">
            <div className="flex justify-between items-center text-[11px] font-black mb-1.5 text-[#134e4a]/70">
              <span>
                {currentIdx + 1} dari {totalQuestions}
              </span>
              <span className="text-[#0d9488]">Skor: {score}</span>
            </div>
            <div className="w-full bg-[#D1FAE5] rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#0d9488] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Ayat Card */}
        <div className="bg-[#0d9488] rounded-[26px] p-6 text-center border-2 border-[#0f766e] shadow-md relative overflow-hidden">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[#FF6B6B] text-[10px] font-black uppercase tracking-wider mb-4 border border-white/20">
            <Sparkles size={10} />
            Tebak Nama Surah
          </div>

          <p
            className="font-arabic text-3xl text-white leading-loose select-none"
            dir="rtl"
          >
            {question.ayatArabic}
          </p>

          <p className="text-xs text-white/70 italic mt-4 max-w-xs mx-auto">
            "{question.arti}"
          </p>
        </div>

        {/* Options Grid */}
        <div className="space-y-2.5">
          <p className="text-xs font-black text-[#134e4a]/70 text-center">
            Potongan ayat di atas dari surah apa?
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {question.options.map((opt) => {
              const isSelected = selected === opt;
              const showCorrect =
                status !== "idle" && opt === question.surahName;
              const showWrong = status === "wrong" && isSelected;

              return (
                <button
                  key={opt}
                  disabled={status !== "idle"}
                  onClick={() => handlePick(opt)}
                  className={`min-h-14 py-3.5 px-3 rounded-2xl font-black text-sm border-2 transition-all active:scale-95 flex items-center justify-center gap-1.5 break-words ${
                    showCorrect
                      ? "bg-[#D1FAE5] border-[#0F766E] text-[#0F766E] shadow-md"
                      : showWrong
                        ? "bg-[#fff0f0] border-[#ff6b6b] text-[#ff6b6b] shadow-md"
                        : isSelected
                          ? "bg-[#0d9488] border-[#0f766e] text-white shadow-md"
                          : "bg-white border-[#D1FAE5] text-[#134e4a] hover:border-[#0d9488] shadow-sm"
                  }`}
                >
                  {showCorrect && <Check size={15} />}
                  {showWrong && <X size={15} />}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-2 pb-4">
          {status === "idle" ? (
            <button
              disabled={!selected}
              onClick={handleCheck}
              className={`w-full py-4 rounded-2xl font-black text-base transition-all shadow-lg ${
                selected
                  ? "bg-[#0d9488] text-white border-b-4 border-[#0f766e] active:translate-y-1"
                  : "bg-[#D1FAE5] text-[#134e4a]/70 cursor-not-allowed"
              }`}
            >
              Periksa Jawaban
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={`w-full py-4 rounded-2xl font-black text-base text-white transition-all shadow-lg active:scale-[0.98] border-b-4 flex items-center justify-center gap-1.5 ${
                status === "correct"
                  ? "bg-[#0F766E] border-[#134E4A]"
                  : "bg-[#0D9488] border-[#0F766E]"
              }`}
            >
              {currentIdx < totalQuestions - 1 ? (
                <>
                  <span>
                    {status === "correct"
                      ? "Tepat! Lanjut"
                      : "Coba Soal Berikutnya"}
                  </span>
                  <ChevronRight size={18} />
                </>
              ) : (
                "Lihat Hasil Akhir"
              )}
            </button>
          )}
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
