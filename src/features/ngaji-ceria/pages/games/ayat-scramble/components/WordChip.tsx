import { useSortable } from "@dnd-kit/sortable";
import { CheckSvg } from "@/components/ui/CustomIcons";
import type { Word } from "../hooks/useScrambleGame";

export function WordChip({ word, onTap, locked = false, disabled = false }: { word: Word; onTap: () => void; locked?: boolean; disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: word.id, disabled: disabled || locked });
  return <button ref={setNodeRef} {...attributes} {...listeners} onClick={onTap} disabled={disabled || locked} aria-label={`${word.text}, ${locked ? "dikunci oleh hint" : "pindahkan kata"}`} className={`game-arabic min-h-14 shrink-0 touch-none rounded-xl border-[2.5px] border-[#134E4A] px-3.5 py-2 text-3xl font-black text-white shadow-[2px_2px_0px_#134E4A] ${locked ? "bg-[#0D9488]" : "bg-[#0F766E] hover:bg-[#115E59]"} ${isDragging ? "z-20 opacity-40" : ""}`} style={{ transform: transform ? `translate3d(${transform.x}px,${transform.y}px,0) scale(${transform.scaleX},${transform.scaleY})` : undefined, transition }}>{word.text}{locked && <CheckSvg size={16} className="ml-1 inline text-teal-200" />}</button>;
}
