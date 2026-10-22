import { motion } from "framer-motion";
import type { Question } from "../data/juz-amma-questions";
import type { AnswerState } from "../hooks/useQuizGame";
import { OptionButton } from "./OptionButton";
import { SparkleBurst } from "../../_shared/SparkleBurst";

const LABELS = { "lanjut-ayat": "Lanjutkan Ayat", "nama-surah": "Nama Surah", "arti-ayat": "Arti Ayat" };
export function QuestionCard({ question, selectedIndex, answerState, onSelect }: { question: Question; selectedIndex: number | null; answerState: AnswerState; onSelect: (index: number) => void }) {
  const failed = answerState === "wrong" || answerState === "timeout";
  return <motion.div key={`${question.id}:${answerState}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18 }} className={`relative space-y-3 ${failed ? "game-shake" : ""}`}>
    {answerState === "correct" && <SparkleBurst burstKey={question.id} />}
    <div className="rounded-3xl border-2 border-[#134E4A] bg-white p-6 text-center shadow-[3px_3px_0px_#134E4A]">
      <p className="text-[10px] font-black uppercase tracking-wider text-[#0D9488]">{LABELS[question.type]}</p>
      <p className="mt-2 text-xs leading-relaxed text-[#134E4A]/70">{question.prompt}</p>
      <p dir="rtl" className="game-arabic mt-3 text-center text-3xl leading-loose text-[#134E4A]">{question.promptArabic}</p>
    </div>
    <div className="space-y-2">{question.options.map((option, index) => <OptionButton key={`${question.id}:${index}`} label={option} index={index} selected={selectedIndex === index} correct={question.correctIndex === index} answerState={answerState} arabic={question.type === "lanjut-ayat"} onSelect={onSelect} />)}</div>
    {answerState !== "idle" && <p className="text-center text-xs font-semibold text-[#0D9488]">{question.surahName} · ayat {question.ayahNumber}{question.type === "lanjut-ayat" ? ` → ${question.ayahNumber + 1}` : ""}</p>}
  </motion.div>;
}
