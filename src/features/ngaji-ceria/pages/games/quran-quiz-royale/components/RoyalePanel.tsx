import type { RoyalePlayer } from "../hooks/useQuizRoyale";

export function RoyalePanel({ players }: { players: RoyalePlayer[] }) {
  return <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-3 shadow-[3px_3px_0px_#134E4A]"><div className="mb-2 flex items-center justify-between text-xs"><span className="font-bold text-[#134E4A]/70">Pemain tersisa</span><span className="font-black text-[#134E4A]">{players.filter((player) => player.alive).length}/{players.length}</span></div><div className="grid grid-cols-4 gap-1.5">{players.map((player) => <div key={player.id} className={`rounded-lg border-2 border-[#134E4A]/30 px-1 py-1.5 text-center text-[10px] ${player.alive ? "bg-[#CCFBF1] text-[#134E4A]" : "bg-gray-200 text-gray-400 line-through"}`} title={`${player.name}: ${player.score}`}><span className="block truncate">{player.name}</span><span className="text-[9px] opacity-70">{player.alive ? `${player.score} pts` : "keluar"}</span></div>)}</div></div>;
}
