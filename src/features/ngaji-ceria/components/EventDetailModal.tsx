import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckSvg,
  CoinSvg,
  GiftSvg,
  HeartSvg,
  Loader2Svg,
  TicketSvg,
  XSvg,
} from "../../../components/ui/CustomIcons";
import { useEventStore } from "../hooks/useEventStore";

interface EventDetailModalProps {
  open: boolean;
  onClose: () => void;
}

export function EventDetailModal({ open, onClose }: EventDetailModalProps) {
  const activeEvent = useEventStore((state) => state.activeEvent);
  const claimReward = useEventStore((state) => state.claimReward);

  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      setToast(null);
      setError(null);
      setClaimingId(null);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) {
        window.clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current !== null) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => setToast(null), 3500);
  };

  const handleClaim = async (missionId: string) => {
    if (claimingId) return;
    setClaimingId(missionId);
    setError(null);
    try {
      const result = await claimReward(missionId);
      const coins = result.reward?.coins ?? result.coins ?? 0;
      const tickets = result.reward?.tickets ?? result.tickets ?? 0;
      showToast(`Hadiah diterima: ${coins} Koin dan ${tickets} Tiket.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengklaim hadiah misi.",
      );
    } finally {
      setClaimingId(null);
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && activeEvent && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-[#134E4A]/60 px-4 py-6 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Misi event ${activeEvent.name}`}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-[24px] border-[3px] border-[#134E4A] bg-white shadow-[6px_6px_0px_#134E4A]"
          >
            <header className="flex items-start justify-between gap-3 border-b-[3px] border-[#134E4A] bg-[#F59E0B] p-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  <GiftSvg size={23} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#134E4A]/70">
                    Misi Event
                  </p>
                  <h2 className="truncate font-display text-lg font-black leading-tight text-[#134E4A]">
                    {activeEvent.name}
                  </h2>
                  <p className="mt-0.5 text-[11px] font-bold text-[#134E4A]/80">
                    {formatDate(activeEvent.start_date)} -{" "}
                    {formatDate(activeEvent.end_date)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup detail event"
                className="shrink-0 rounded-xl border-[2px] border-[#134E4A] bg-white p-1.5 text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-all active:translate-y-[1px] active:shadow-none"
              >
                <XSvg size={16} />
              </button>
            </header>

            <div className="max-h-[65dvh] space-y-3 overflow-y-auto bg-[#F0FDF4] p-4">
              {error && (
                <p
                  role="alert"
                  className="rounded-xl border-[2px] border-[#991B1B] bg-[#FEF2F2] p-3 text-xs font-bold text-[#991B1B]"
                >
                  {error}
                </p>
              )}

              {activeEvent.missions.length === 0 ? (
                <p className="rounded-2xl border-[3px] border-dashed border-[#134E4A]/30 bg-white/70 p-6 text-center text-xs font-bold text-[#134E4A]/60">
                  Belum ada misi pada event ini.
                </p>
              ) : (
                activeEvent.missions.map((mission) => {
                  const percent =
                    mission.target_amount > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (mission.progress / mission.target_amount) * 100,
                          ),
                        )
                      : 0;
                  const isComplete = mission.progress >= mission.target_amount;
                  const isClaiming = claimingId === mission.id;
                  const canClaim = isComplete && !mission.is_claimed;

                  return (
                    <article
                      key={mission.id}
                      className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-3.5 shadow-[3px_3px_0px_#134E4A]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-display text-sm font-black leading-tight text-[#134E4A]">
                            {mission.title}
                          </h3>
                          <p className="mt-0.5 text-[11px] font-bold text-[#134E4A]/70">
                            Main {mission.target_amount}x ({mission.progress}/
                            {mission.target_amount})
                          </p>
                        </div>
                        {mission.is_claimed ? (
                          <span className="shrink-0 rounded-lg border-2 border-[#134E4A] bg-[#D1FAE5] px-2 py-0.5 text-[10px] font-black text-[#065F46]">
                            Sudah Diklaim
                          </span>
                        ) : isComplete ? (
                          <span className="shrink-0 rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-[10px] font-black text-[#854D0E]">
                            Selesai
                          </span>
                        ) : null}
                      </div>

                      <div
                        className="mt-2.5 h-3 w-full overflow-hidden rounded-full border-2 border-[#134E4A] bg-[#E5E7EB]"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={mission.target_amount}
                        aria-valuenow={Math.min(
                          mission.progress,
                          mission.target_amount,
                        )}
                        aria-label={`Progres ${mission.title}`}
                      >
                        <div
                          className="h-full rounded-full bg-[#0D9488] transition-[width] duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {mission.reward_coins > 0 && (
                            <RewardChip
                              icon={<CoinSvg size={13} />}
                              label={`${mission.reward_coins} Koin`}
                              colorClass="bg-[#FEF08A]"
                            />
                          )}
                          {mission.reward_tickets > 0 && (
                            <RewardChip
                              icon={<TicketSvg size={13} />}
                              label={`${mission.reward_tickets} Tiket`}
                              colorClass="bg-[#DBEAFE]"
                            />
                          )}
                          {mission.reward_hearts > 0 && (
                            <RewardChip
                              icon={<HeartSvg size={13} />}
                              label={`${mission.reward_hearts} Hati`}
                              colorClass="bg-[#FFE4E6]"
                            />
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleClaim(mission.id)}
                          disabled={!canClaim || Boolean(claimingId)}
                          className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border-[2px] border-[#134E4A] px-3 py-1.5 text-xs font-black transition-all ${
                            canClaim
                              ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A] hover:bg-[#0F766E] active:translate-y-[1px] active:shadow-none"
                              : "bg-[#E5E7EB] text-[#134E4A]/45 shadow-none"
                          } disabled:cursor-not-allowed`}
                        >
                          {isClaiming ? (
                            <Loader2Svg size={14} className="animate-spin" />
                          ) : canClaim ? (
                            <CheckSvg size={14} />
                          ) : null}
                          {mission.is_claimed
                            ? "Sudah Diklaim"
                            : canClaim
                              ? "Klaim Hadiah"
                              : "Belum Selesai"}
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </motion.div>

          {toast && (
            <div
              role="status"
              aria-live="polite"
              onClick={(event) => event.stopPropagation()}
              className="fixed bottom-6 left-1/2 z-[130] flex -translate-x-1/2 items-center gap-2 rounded-xl border-[3px] border-[#134E4A] bg-[#D1FAE5] px-4 py-2.5 text-xs font-black text-[#134E4A] shadow-[4px_4px_0px_#134E4A]"
            >
              <CheckSvg size={15} />
              {toast}
            </div>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function RewardChip({
  icon,
  label,
  colorClass,
}: {
  icon: ReactNode;
  label: string;
  colorClass: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border-2 border-[#134E4A] px-1.5 py-0.5 text-[10px] font-black text-[#134E4A] ${colorClass}`}
    >
      {icon}
      {label}
    </span>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default EventDetailModal;
