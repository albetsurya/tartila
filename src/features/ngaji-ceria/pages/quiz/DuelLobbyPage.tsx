import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { StickerButton } from "@/components/ui/StickerButton";
import { AvatarSantriSvg } from "@/components/ui/Illustrations";
import { generateDuelCode } from "@/services/duelService";
import { soundManager } from "../../services/soundManager";
import { triggerBibiReaction } from "@/utils/tilaEvent";
import { useEconomyStore } from "../../hooks/useEconomyStore";

const COUNTDOWN_STEPS = ["3", "2", "1", "MULAI!"];
const PLAY_ROUTE = "/member/ngaji-ceria/quiz/duel/play";

function PlayerSlot({
  name,
  ready,
  avatar,
}: {
  name: string;
  ready: boolean;
  avatar: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border-[3px] border-[#134E4A] p-3 flex flex-col items-center gap-2 shadow-[4px_4px_0px_#134E4A] transition-colors ${
        ready ? "bg-[#CCFBF1]" : "bg-white"
      }`}
    >
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border-[3px] border-[#134E4A] bg-[#F0FDF4]">
        {avatar}
      </div>
      <p className="max-w-full truncate font-display text-sm font-black text-[#134E4A]">
        {name}
      </p>
      <span
        className={`rounded-full border-2 border-[#134E4A] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
          ready ? "bg-[#0D9488] text-white" : "bg-[#FEF08A] text-[#134E4A]"
        }`}
      >
        {ready ? "Siap!" : "Menunggu"}
      </span>
    </div>
  );
}

export default function DuelLobbyPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const storageKey = `tartila:duel:${sessionId ?? "unknown"}:code`;
  const [duelCode] = useState(() => {
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing) return existing;
      const code = generateDuelCode();
      localStorage.setItem(storageKey, code);
      return code;
    } catch {
      return generateDuelCode();
    }
  });

  const [hostReady, setHostReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [opponentName, setOpponentName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countIndex, setCountIndex] = useState(0);

  const consumeTicket = useEconomyStore((s) => s.consumeTicket);
  const [ticketError, setTicketError] = useState(false);

  const pollCountRef = useRef(0);
  const startingRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      pollCountRef.current += 1;
      // TODO(backend): lawan join masih mock. Backend Go belum punya kontrak duel
      // (tidak ada /api/v1/duel/* atau tipe pesan duel di WS). Ganti ke
      // duelService.getDuelSession + polling begitu endpoint tersedia.
      if (hostReady && pollCountRef.current >= 2 && !opponentReady) {
        setOpponentReady(true);
        setOpponentName("Teman Santri");
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [hostReady, opponentReady]);

  useEffect(() => {
    if (hostReady && opponentReady) setShowCountdown(true);
  }, [hostReady, opponentReady]);

  useEffect(() => {
    if (!showCountdown) return;
    if (countIndex >= COUNTDOWN_STEPS.length) {
      if (startingRef.current) return;
      startingRef.current = true;
      void consumeTicket().then((ok) => {
        if (!ok) {
          setShowCountdown(false);
          setTicketError(true);
          return;
        }
        navigate(`${PLAY_ROUTE}/${sessionId ?? ""}`);
      });
      return;
    }
    soundManager.playSfx("pop");
    const timer = setTimeout(() => setCountIndex((i) => i + 1), 1000);
    return () => clearTimeout(timer);
  }, [showCountdown, countIndex, navigate, sessionId, consumeTicket]);

  const handleReady = () => {
    triggerBibiReaction("click");
    soundManager.playSfx("tap");
    setHostReady(true);
  };

  const handleCopyCode = async () => {
    triggerBibiReaction("click");
    soundManager.playSfx("tap");
    try {
      await navigator.clipboard.writeText(duelCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard tidak tersedia
    }
  };

  const isGo = countIndex === COUNTDOWN_STEPS.length - 1;

  return (
    <div className="min-h-dvh bg-[#F0FDF4] text-[#134E4A] font-sans">
      <header className="border-b-[3px] border-[#134E4A] bg-white shadow-[0_2px_0_#134E4A]">
        <div className="mx-auto flex h-14 max-w-md items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => {
              triggerBibiReaction("click");
              soundManager.playSfx("tap");
              navigate("/member/ngaji-ceria/games");
            }}
            aria-label="Kembali"
            className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-white font-black text-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            ←
          </button>
          <h1 className="font-display font-black text-xl text-[#134E4A]">
            Lobi Duel
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6">
        <div className="flex items-center justify-between gap-3 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] p-4 shadow-[4px_4px_0px_#134E4A]">
          <div>
            <p className="font-display text-xs font-black uppercase tracking-widest text-[#134E4A]/70">
              Kode Duel
            </p>
            <p className="font-display text-3xl font-black tracking-[0.2em] text-[#134E4A]">
              {duelCode}
            </p>
          </div>
          <StickerButton variant="secondary" size="sm" onClick={handleCopyCode}>
            {copied ? "Tersalin!" : "Salin"}
          </StickerButton>
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <PlayerSlot
            name="Kamu"
            ready={hostReady}
            avatar={
              <AvatarSantriSvg
                gender="boy"
                accessory="peci"
                mood={hostReady ? "happy" : "idle"}
                size={84}
              />
            }
          />
          <div className="font-display text-2xl font-black text-[#134E4A]">
            VS
          </div>
          <PlayerSlot
            name={opponentName ?? "Lawan"}
            ready={opponentReady}
            avatar={
              opponentReady ? (
                <AvatarSantriSvg
                  gender="girl"
                  accessory="hairbow"
                  mood="happy"
                  size={84}
                />
              ) : (
                <span className="font-display text-4xl font-black text-[#134E4A]/40">
                  ?
                </span>
              )
            }
          />
        </div>

        <div className="mt-8">
          <StickerButton
            variant="primary"
            size="lg"
            fullWidth
            disabled={hostReady || ticketError}
            onClick={handleReady}
          >
            {hostReady ? "Menunggu Lawan..." : "Siap"}
          </StickerButton>
        </div>

        <p className="mt-3 text-center font-display text-sm font-black text-[#134E4A]/70">
          {hostReady
            ? opponentReady
              ? "Lawan siap! Bersiaplah..."
              : "Menunggu lawan menekan Siap..."
            : "Tekan Siap saat kamu sudah siap!"}
        </p>
      </main>

      <AnimatePresence>
        {showCountdown && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#134E4A]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={countIndex}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className={`font-display font-black leading-none ${
                isGo
                  ? "text-[4rem] text-[#FEF08A] sm:text-[5rem]"
                  : "text-[9rem] text-[#0D9488]"
              }`}
            >
              {COUNTDOWN_STEPS[countIndex]}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ticketError && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#134E4A]/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="w-full max-w-sm rounded-3xl border-[3px] border-[#134E4A] bg-white p-6 text-center shadow-[4px_4px_0px_#134E4A]"
            >
              <h2 className="font-display font-black text-2xl text-[#FF6B6B]">
                Tiket Bermain Habis!
              </h2>
              <p className="mt-2 font-display text-sm font-bold text-[#134E4A]/80">
                Tunggu 6 jam atau beli di Warung Santri.
              </p>
              <StickerButton
                variant="primary"
                size="lg"
                fullWidth
                className="mt-5"
                onClick={() => {
                  triggerBibiReaction("click");
                  soundManager.playSfx("tap");
                  navigate("/member/ngaji-ceria/warung-santri");
                }}
              >
                Beli di Warung Santri
              </StickerButton>
              <StickerButton
                variant="secondary"
                size="lg"
                fullWidth
                className="mt-3"
                onClick={() => {
                  triggerBibiReaction("click");
                  soundManager.playSfx("tap");
                  navigate("/member/ngaji-ceria/games");
                }}
              >
                Kembali ke Game
              </StickerButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
