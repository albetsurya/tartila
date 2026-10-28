import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { HijaiyahPopCoverSvg } from "@/components/ui/Illustrations";
import {
  TilaMascot,
  type TilaMood,
  type TilaDirection,
} from "@/components/ui/TilaMascot";
import { useEconomyStore } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import { resolveMascotGender } from "@/utils/mascotHelper";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { useGameExit } from "../_shared/hooks";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { HUD } from "../_shared/HUD";
import { TimerBar } from "../_shared/TimerBar";
import { ComboBadge } from "../_shared/ComboBadge";
import { FallingFruit } from "./components/FallingFruit";
import { TargetBanner } from "../_shared/TargetBanner";
import { playLetterAudio } from "../_shared/gameAudio";
import { playSfx } from "../_shared/audio";
import { useBalloonGame, type BalloonData } from "./hooks/useBalloonGame";

function Game() {
  const game = useBalloonGame();
  const navigate = useNavigate();
  const exit = useGameExit("/member/ngaji-ceria/games");
  const [showCombo, setShowCombo] = useState(false);
  const lastComboRef = useRef(game.combo);

  // Tampilkan toast combo di tengah layar saat combo naik, sembunyikan setelah 1.2s.
  useEffect(() => {
    if (game.combo >= 3 && game.combo > lastComboRef.current) {
      lastComboRef.current = game.combo;
      setShowCombo(true);
      const t = setTimeout(() => setShowCombo(false), 1200);
      return () => clearTimeout(t);
    }
  }, [game.combo]);

  // Active user mascot gender
  const rawGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const mascotGender = resolveMascotGender(rawGender);

  // Tema aplikasi aktif → warna arena & HUD
  const appTheme = useEconomyStore((s) => s.equippedAppTheme);
  const arenaStyle = {
    default: { bg: "bg-[#0F766E]", dot: "#2DD4BF" },
    neon: { bg: "bg-[#0B1220]", dot: "#38BDF8" },
    retro: { bg: "bg-[#F59E0B]", dot: "#FDE68A" },
    pastel: { bg: "bg-[#F9A8D4]", dot: "#FDA4AF" },
    night: { bg: "bg-[#1E1B4B]", dot: "#818CF8" },
    sky: { bg: "bg-[#0369A1]", dot: "#7DD3FC" },
    rose: { bg: "bg-[#BE123C]", dot: "#FDA4AF" },
    gold: { bg: "bg-[#854D0E]", dot: "#FDE047" },
  }[appTheme] ?? { bg: "bg-[#0F766E]", dot: "#2DD4BF" };

  // Audio pelafalan otomatis setiap target huruf berganti (Web Speech, tanpa aset Tilawati)
  useEffect(() => {
    if (game.phase === "playing" && game.target) playLetterAudio(game.target);
  }, [game.target, game.phase]);

  // Mascot dynamic state for pecking animation
  const mascotControls = useAnimation();
  const [mascotMood, setMascotMood] = useState<TilaMood>("happy");
  const [mascotDirection, setMascotDirection] =
    useState<TilaDirection>("front");

  // Animasi Mematuk (Pecking Animation) saat user mengetuk buah
  const handlePopFruit = useCallback(
    async (fruit: BalloonData) => {
      // Jalankan logika game pop terlebih dahulu
      game.pop(fruit.id);
      playSfx('pop');

      if (!game.fieldRef.current) return;
      const rect = game.fieldRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const bottomY = rect.height - 46;

      // Hitung koordinat pergerakan relatif ke arah buah
      const deltaX = fruit.x + 38 - centerX;
      const deltaY = fruit.y + 40 - bottomY;

      setMascotDirection(deltaX >= 0 ? "right" : "left");
      setMascotMood("excited");

      // Fase 1: Bergerak cepat ke posisi buah (Mematuk)
      await mascotControls.start({
        x: deltaX * 0.88,
        y: Math.min(-20, deltaY * 0.88),
        scale: 1.18,
        rotate: deltaX >= 0 ? 15 : -15,
        transition: {
          duration: 0.15,
          ease: "easeOut",
        },
      });

      // Fase 2: Kembali cepat ke posisi semula (Perch)
      await mascotControls.start({
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        transition: {
          duration: 0.22,
          ease: [0.34, 1.56, 0.64, 1], // Efek pantulan kembali
        },
      });

      setMascotDirection("front");
      setMascotMood(game.combo > 0 ? "excited" : "happy");
    },
    [game, mascotControls],
  );

  return (
    <GameShell
      title="Hijaiyah Pop!"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="cyan"
      tutorialGameId="hijaiyah-pop"
      floatingTopBar
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Hijaiyah Pop!"
          tagline="Fokus target, petik buah berkah!"
          description="Ketuk buah huruf hijaiyah yang jatuh dari pohon sesuai target. Hindari buah yang salah dan jangan sampai target terlewat! Tiga nyawa, 60 detik."
          coverImage={<HijaiyahPopCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={exit}
          accent="cyan"
        />
      ) : (
        <div
          ref={game.fieldRef}
          aria-label="Arena buah jatuh"
          className={`absolute inset-0 w-full overflow-hidden border-t-[3.5px] border-[#134E4A] ${arenaStyle.bg} select-none ${
            game.shakeLeft > 0 ? "game-shake" : ""
          }`}
        >
          {/* TOP HUD CONTAINER: HUD, Timer, dan Target sejajar */}
          <div className="absolute top-20 inset-x-0 z-30 flex justify-between px-3 pointer-events-none items-start gap-2">
            {/* KIRI: Skor, Nyawa, Timer */}
            <div className="flex flex-col gap-1.5 w-[45%] max-w-[180px]">
              <div className="rounded-2xl bg-[#042F2E]/40 p-1 backdrop-blur-sm self-start">
                <HUD
                  score={game.score}
                  lives={game.lives}
                  timeLeft={game.timeLeft}
                />
              </div>
              <div className="w-full">
                <TimerBar
                  progress={game.timeLeft / 60}
                  secondsLeft={game.timeLeft}
                />
              </div>
            </div>

            {/* KANAN: Target Banner */}
            <div className="w-[50%] flex justify-end">
              <TargetBanner
                target={game.target}
                name={game.targetName}
                className="shadow-[4px_4px_0px_#134E4A] scale-90 sm:scale-100 origin-top-right"
              />
            </div>
          </div>

          {/* Latar Belakang Pola Titik Neo-Brutalism */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(${arenaStyle.dot} 2px, transparent 2px)`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* ILUSTRASI 1: KANOPI POHON RIMBUN (DEDAUNAN ATAS DIPERBESAR & DITURUNKAN) */}
          <div className="pointer-events-none absolute top-0 inset-x-0 h-40 sm:h-52 z-10 overflow-hidden">
            <svg
              viewBox="0 0 1000 160"
              preserveAspectRatio="none"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Batang Kayu Cabang Atas */}
              <path
                d="M0,0 L1000,0 L1000,18 Q800,28 650,15 T300,24 T0,16 Z"
                fill="#78350F"
                stroke="#134E4A"
                strokeWidth="4"
              />

              {/* Layer 1: Daun Belakang Gelap (Lebih Menjuntai) */}
              <path
                d="M -20,0 L 1020,0 L 1020,80 C 940,110 860,70 780,100 C 700,130 620,80 540,110 C 460,140 380,90 300,120 C 220,140 140,90 60,110 C 20,120 -10,100 -20,90 Z"
                fill="#064E3B"
                stroke="#134E4A"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Layer 2: Daun Utama Hijau Zamrud */}
              <path
                d="M -20,0 L 1020,0 L 1020,60 C 930,90 870,50 800,80 C 730,110 660,60 580,90 C 500,115 430,65 350,95 C 270,115 200,65 120,90 C 60,105 10,70 -20,70 Z"
                fill="#059669"
                stroke="#134E4A"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Layer 3: Daun Menjuntai & Rimbun Terang */}
              <path
                d="M -20,0 L 1020,0 L 1020,40 C 950,65 890,30 830,58 C 760,80 690,35 610,62 C 530,85 460,40 380,68 C 300,90 230,40 150,64 C 80,80 20,45 -20,45 Z"
                fill="#10B981"
                stroke="#134E4A"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Daun Aksen Melengkung Menjuntai (Ditambah) */}
              <ellipse
                cx="180"
                cy="90"
                rx="35"
                ry="22"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3.5"
                transform="rotate(-10 180 90)"
              />
              <ellipse
                cx="460"
                cy="96"
                rx="40"
                ry="24"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3.5"
                transform="rotate(8 460 96)"
              />
              <ellipse
                cx="760"
                cy="88"
                rx="38"
                ry="22"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3.5"
                transform="rotate(-6 760 88)"
              />
              <ellipse
                cx="620"
                cy="105"
                rx="30"
                ry="18"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3.5"
                transform="rotate(5 620 105)"
              />

              {/* Buah Kecil Hiasan di Ranting Pohon */}
              <circle
                cx="180"
                cy="100"
                r="7"
                fill="#FBBF24"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
              <circle
                cx="460"
                cy="106"
                r="8"
                fill="#FF6B6B"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
              <circle
                cx="760"
                cy="98"
                r="7.5"
                fill="#FBBF24"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          {/* ILUSTRASI 2: RUMPUT & TANAH SUBUR (DASAR BAWAH) */}
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-20 sm:h-24 z-10 overflow-hidden">
            <svg
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Lapisan Tanah Dasar */}
              <path
                d="M0,45 Q250,30 500,48 T1000,38 L1000,100 L0,100 Z"
                fill="#064E3B"
                stroke="#134E4A"
                strokeWidth="4"
              />

              {/* Bukit Rumput Hijau */}
              <path
                d="M0,58 Q200,38 420,54 T850,44 Q930,48 1000,56 L1000,100 L0,100 Z"
                fill="#059669"
                stroke="#134E4A"
                strokeWidth="4"
              />
              <path
                d="M0,70 Q300,50 600,68 T1000,62 L1000,100 L0,100 Z"
                fill="#10B981"
                stroke="#134E4A"
                strokeWidth="4"
              />

              {/* Rerumputan & Bunga Cantik Neo-Brutalism */}
              <polygon
                points="120,45 126,28 132,45"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3"
              />
              <polygon
                points="128,46 135,32 142,46"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3"
              />

              <polygon
                points="860,42 866,26 872,42"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3"
              />
              <polygon
                points="868,43 875,30 882,43"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3"
              />

              {/* Bunga Kuning di Rumput */}
              <circle
                cx="240"
                cy="62"
                r="6"
                fill="#FEF08A"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
              <circle cx="240" cy="62" r="2.5" fill="#F59E0B" />

              <circle
                cx="780"
                cy="58"
                r="6"
                fill="#FEF08A"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
              <circle cx="780" cy="58" r="2.5" fill="#F59E0B" />
            </svg>
          </div>

          {/* DAFTAR BUAH YANG JATUH DARI ATAS KE BAWAH */}
          {game.balloons.map((fruit) => (
            <FallingFruit
              key={fruit.id}
              fruit={fruit}
              disabled={game.phase !== "playing"}
              onPop={handlePopFruit}
            />
          ))}

          {/* MASKOT UTAMA GAMEPLAY (MEMATUK BUAH SAAT DI-TAP) */}
          <motion.div
            animate={mascotControls}
            className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
            style={{ transformOrigin: "bottom center" }}
          >
            {/* Balon Ucapan Kombo Ringkas */}
            {game.combo >= 3 && (
              <div className="mb-1 px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] text-[10px] font-black shadow-[1.5px_1.5px_0px_#134E4A] whitespace-nowrap animate-bounce">
                <span>Kombo x{game.combo}!</span>
              </div>
            )}

            {/* Maskot Karakter Utama */}
            <TilaMascot
              size={88}
              gender={mascotGender}
              mood={mascotMood}
              animation="none"
              direction={mascotDirection}
            />

            {/* Pijakan Karakter di Atas Rumput */}
            <div className="w-24 h-5 -mt-2 rounded-[50%] border-2 border-[#134E4A] bg-[#FEF3C7] shadow-[2px_2px_0px_#134E4A] flex items-center justify-center -z-10">
              <div className="w-18 h-3 rounded-[50%] border border-dashed border-[#134E4A]/30" />
            </div>
          </motion.div>

          {/* FLOATING COMBO TOAST DI TENGAH ATAS (muncul saat combo naik, memudar otomatis) */}
          <AnimatePresence>
            {showCombo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                animate={{ opacity: 1, scale: 1.2, y: 0 }}
                exit={{ opacity: 0, scale: 1.5, y: 20 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="absolute left-1/2 top-1/4 z-50 -translate-x-1/2 pointer-events-none"
              >
                <ComboBadge
                  combo={game.combo}
                  multiplier={Math.min(1 + game.combo * 0.1, 5)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* GAME OVER MODAL */}
      <GameOverModal
        visible={game.phase === "gameover"}
        score={game.score}
        maxCombo={game.maxCombo}
        victory={game.lives > 0}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="cyan"
        description={`${
          game.lives <= 0 ? "Nyawa habis" : "Waktu habis"
        } · kombo tertinggi ${game.maxCombo}`}
        onRetry={game.start}
        onExit={exit}
      />
    </GameShell>
  );
}

export default function HijaiyahPopPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
