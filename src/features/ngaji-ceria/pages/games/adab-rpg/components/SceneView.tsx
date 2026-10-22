import { motion } from "framer-motion";
import { TilaMascot } from "@/components/ui/TilaMascot";
import type { StoryNode, StoryStats } from "../data/story";
import { StatBar } from "./StatBar";

export function SceneView({
  node,
  stats,
  disabled,
  onChoice,
}: {
  node: StoryNode;
  stats: StoryStats;
  disabled: boolean;
  onChoice: (id: string) => void;
}) {
  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-3"
    >
      <div className="rounded-3xl border-2 border-[#134E4A] bg-gradient-to-br from-teal-950/90 to-teal-900/80 p-4 shadow-[2.5px_2.5px_0px_#134E4A]">
        <p className="text-[10px] font-black uppercase tracking-wider text-teal-300">
          {node.chapter}
        </p>

        {/* Maskot berinteraksi dengan NPC */}
        <div className="flex items-center justify-between gap-4 my-3 px-2">
          <div className="flex flex-col items-center">
            <TilaMascot
              size={68}
              mood="thinking"
              animation="float"
              direction="right"
              speech="Assalamu'alaikum!"
            />
            <span className="text-[10px] font-black text-teal-200 mt-1">
              Santri Tila
            </span>
          </div>

          <div className="flex-1 text-center font-bold text-xs text-teal-200 bg-[#0F3E38] p-2 rounded-xl border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
            Berdialog Adab
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl border-2 border-[#134E4A] bg-[#FEF3C7] shadow-[2px_2px_0px_#134E4A] flex items-center justify-center p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0D9488" stroke="#134E4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="text-[10px] font-black text-amber-200 mt-1">
              Warga / Guru
            </span>
          </div>
        </div>

        <p className="mt-2 text-center text-base font-black leading-relaxed text-white">
          {node.prompt}
        </p>
      </div>

      <div className="space-y-2">
        {node.choices.map((choice, index) => (
          <button
            type="button"
            key={choice.id}
            disabled={disabled}
            onClick={() => onChoice(choice.id)}
            className="w-full min-h-[44px] rounded-2xl border-2 border-[#134E4A] bg-[#0F766E] p-3 text-left text-sm font-bold leading-relaxed text-white shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#115E59] active:scale-[0.98]"
          >
            <span className="mr-2 text-teal-300">{index + 1}.</span>
            {choice.text}
          </button>
        ))}
      </div>
      <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
        <StatBar label="Akhlak" value={stats.akhlak} color="bg-teal-400" />
        <StatBar label="Ilmu" value={stats.ilmu} color="bg-teal-400" />
        <StatBar label="Sosial" value={stats.sosial} color="bg-rose-400" />
      </div>
    </motion.div>
  );
}
