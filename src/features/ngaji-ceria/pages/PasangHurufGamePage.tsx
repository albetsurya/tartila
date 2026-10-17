import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import { HIJAIYAH_LIST, HijaiyahItem } from "../data/hijaiyah";
import { playHijaiyahAudio, playSoundEffect } from "../utils/audioPlayer";
import { tapFeedback } from "../../../lib/haptics";
import { Trophy, Sparkles } from "../../../components/ui/FontAwesomeIcons";

interface MatchTile {
  key: string;
  pairId: string;
  kind: "arabic" | "latin";
  label: string;
  svgUrl?: string;
  latinText?: string;
  isOpen: boolean;
  isMatched: boolean;
}

export default function PasangHurufGamePage() {
  const navigate = useNavigate();
  const [tiles, setTiles] = useState<MatchTile[]>([]);
  const [firstIdx, setFirstIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const setupBoard = () => {
    const selected = [...HIJAIYAH_LIST].sort(() => Math.random() - 0.5).slice(0, 6);
    const newTiles: MatchTile[] = [];

    selected.forEach((item) => {
      newTiles.push({
        key: `${item.id}-arab`,
        pairId: item.id,
        kind: "arabic",
        label: item.arabic,
        svgUrl: item.svg,
        isOpen: false,
        isMatched: false,
      });
      newTiles.push({
        key: `${item.id}-latin`,
        pairId: item.id,
        kind: "latin",
        label: item.name,
        latinText: `${item.arabic} = ${item.name}`,
        isOpen: false,
        isMatched: false,
      });
    });

    setTiles(newTiles.sort(() => Math.random() - 0.5));
    setFirstIdx(null);
    setScore(0);
    setMoves(0);
    setMatchesCount(0);
    setIsLocked(false);
    setIsWon(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (matchesCount === 6 && matchesCount > 0) {
      setIsWon(true);
      setIsPlaying(false);
    }
  }, [matchesCount]);

  const handleFlip = (idx: number) => {
    if (!isPlaying || isLocked) return;
    const tile = tiles[idx];
    if (tile.isOpen || tile.isMatched) return;
    tapFeedback();

    const newTiles = [...tiles];
    newTiles[idx].isOpen = true;
    setTiles(newTiles);

    if (firstIdx === null) {
      setFirstIdx(idx);
    } else {
      setMoves((m) => m + 1);
      const first = newTiles[firstIdx];
      const second = newTiles[idx];

      if (first.pairId === second.pairId) {
        // Match!
        playSoundEffect("correct");
        playHijaiyahAudio(second.pairId);
        newTiles[firstIdx].isMatched = true;
        newTiles[idx].isMatched = true;
        setTiles([...newTiles]);
        setScore((s) => s + 200);
        setMatchesCount((c) => c + 1);
        setFirstIdx(null);
      } else {
        // No match, flip back after delay
        playSoundEffect("wrong");
        setIsLocked(true);
        setTimeout(() => {
          newTiles[firstIdx].isOpen = false;
          newTiles[idx].isOpen = false;
          setTiles([...newTiles]);
          setFirstIdx(null);
          setIsLocked(false);
          setScore((s) => Math.max(0, s - 20));
        }, 800);
      }
    }
  };

  return (
    <NgajiCeriaLayout title="Pasang Huruf" showBack onBack={() => navigate("/member/ngaji-ceria/games")}>
      <div className="px-4 py-4 space-y-4 bg-[#F0FDF4] min-h-full rounded-t-3xl">
        {/* Score Bar */}
        <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#134e4a]/70">Langkah:</span>
            <span className="text-base font-black text-[#134e4a]">{moves}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#134e4a]/70">Cocok:</span>
            <span className="text-base font-black text-[#0F766E]">{matchesCount}/6</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#134e4a]/70">Poin:</span>
            <span className="text-lg font-black text-[#0D9488]">{score}</span>
          </div>
        </div>

        {!isPlaying && !isWon ? (
          <div className="bg-white rounded-[28px] p-8 text-center border border-gray-100 shadow-md space-y-4">
            <div className="w-20 h-20 mx-auto">
              <img src={NGAJI_CERIA_ASSETS.kartuMatchCocok} alt="Pasang Huruf" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-[#134e4a]">Pasang Huruf</h3>
              <p className="text-xs text-[#134e4a]/70 mt-1 leading-relaxed max-w-xs mx-auto">
                Buka kartu satu per satu dan temukan pasangan kartu Hijaiyah Arab dan nama Latinnya yang cocok.
              </p>
            </div>
            <button
              onClick={setupBoard}
              className="w-full py-3.5 rounded-2xl bg-[#0F766E] hover:bg-[#6F370E] text-white font-black text-sm shadow-md border-b-4 border-[#4A2408] active:translate-y-1 transition-all"
            >
              Mulai Cocokkan
            </button>
          </div>
        ) : isWon ? (
          <div className="bg-white rounded-[28px] p-8 text-center border border-gray-100 shadow-md space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#D1FAE5] border-2 border-[#0F766E]/20 mx-auto flex items-center justify-center">
              <Trophy size={28} className="text-[#0F766E]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#0F766E] text-[10px] font-black uppercase tracking-wider mb-2">
                <Sparkles size={10} />
                Papan Selesai
              </div>
              <h3 className="font-display font-black text-xl text-[#134e4a]">Luar Biasa!</h3>
              <p className="text-xs text-[#134e4a]/70 mt-1">
                Selesai dalam {moves} langkah. Skor: {score}
              </p>
            </div>
            <button
              onClick={setupBoard}
              className="w-full py-3.5 rounded-2xl bg-[#0F766E] hover:bg-[#134E4A] text-white font-black text-sm shadow-md border-b-4 border-[#134E4A] active:translate-y-1 transition-all"
            >
              Main Lagi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {tiles.map((tile, idx) => (
              <button
                key={tile.key}
                onClick={() => handleFlip(idx)}
                className={`aspect-[3/4] rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center p-1.5 ${
                  tile.isMatched
                    ? "bg-[#D1FAE5] border-2 border-[#0F766E] opacity-70"
                    : tile.isOpen
                    ? "bg-white border-2 border-[#0D9488] shadow-lg scale-105"
                    : "bg-gradient-to-b from-[#0D9488] to-[#0F766E] border-2 border-[#0F766E] shadow-md cursor-pointer hover:scale-105"
                }`}
              >
                {tile.isOpen || tile.isMatched ? (
                  tile.kind === "arabic" ? (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="font-arabic text-3xl font-black text-[#134e4a] select-none">{tile.label}</span>
                    </div>
                  ) : (
                    <span className="font-black text-sm text-[#134e4a] text-center select-none">{tile.label}</span>
                  )
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                    <span className="text-white font-black text-lg">?</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </NgajiCeriaLayout>
  );
}
