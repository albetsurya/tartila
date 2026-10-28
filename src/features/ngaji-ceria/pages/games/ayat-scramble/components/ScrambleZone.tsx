import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { WordChip } from "./WordChip";
import type { Word } from "../hooks/useScrambleGame";

export function ScrambleZone({ words, onTap, disabled }: { words: Word[]; onTap: (id: string) => void; disabled: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: "source-zone", disabled });
  return <div><p className="mb-3 text-sm font-bold text-white/70">Kata teracak</p><div ref={setNodeRef} dir="rtl" className={`flex min-h-28 flex-wrap items-center gap-3 rounded-2xl border-3 p-5 ${isOver ? "border-teal-300 bg-teal-500/10" : "border-white/15 bg-white/5"}`}>{!isOver && <p className="text-xs text-white/50">Tempatkan kata di kotak jawaban.</p>}<SortableContext items={words.map((word) => word.id)} strategy={rectSortingStrategy}>{words.map((word) => <WordChip key={word.id} word={word} onTap={() => onTap(word.id)} disabled={disabled} />)}</SortableContext>{words.length === 0 && <p className="self-center text-xs text-white/50" dir="ltr">Semua kata sudah di jawaban.</p>}</div></div>;
}
