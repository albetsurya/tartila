import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TilaMascot } from "@/components/ui/TilaMascot";
import {
  TicketSvg,
  SparklesSvg,
  CrownSvg,
  XSvg,
  AlertTriangleSvg,
  Loader2Svg,
  CheckSvg,
} from "@/components/ui/CustomIcons";
import { voucherApi, type RedeemVoucherResponse } from "@/services/voucherApi";
import { useEconomyStore } from "../hooks/useEconomyStore";
import { useAuth } from "@/contexts/AuthContext";
import { getMascotName } from "@/utils/mascotHelper";
import { playSfx } from "../pages/games/_shared/audio";
import { tapFeedback } from "@/lib/haptics";

interface VoucherRedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (result: RedeemVoucherResponse) => void;
}

export function VoucherRedeemModal({
  isOpen,
  onClose,
  onSuccess,
}: VoucherRedeemModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<RedeemVoucherResponse | null>(null);

  const { refreshUser } = useAuth();
  const tilaGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const mascotName = getMascotName(tilaGender);

  const resetForm = () => {
    setCode("");
    setError(null);
    setLoading(false);
    setSuccessResult(null);
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setError("Silakan masukkan kode voucher terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      tapFeedback(15);
      const res = await voucherApi.redeemVoucher(cleanCode);

      // Berhasil menukar voucher
      playSfx("powerup");
      tapFeedback([20, 50, 40]);

      // Update state ekonomi secara instan di Zustand
      useEconomyStore.getState().applyVipSuccess(res.duration_days, res.subscription_expires_at);

      // Sinkronkan state user di AuthContext
      try {
        await refreshUser();
      } catch {
        // noop
      }

      setSuccessResult(res);
      onSuccess?.(res);
    } catch (err: any) {
      playSfx("wrong");
      tapFeedback([40, 60]);

      // Tampilkan error yang informatif tanpa menutup modal
      const errMsg = err?.message || "Gagal menukar voucher. Silakan periksa kembali kodenya.";
      if (err?.statusCode === 404 || errMsg.toLowerCase().includes("tidak ditemukan")) {
        setError("Voucher tidak ditemukan. Mohon periksa ejaan kode yang kamu masukkan.");
      } else if (err?.statusCode === 400 || errMsg.toLowerCase().includes("sudah digunakan")) {
        setError("Voucher ini sudah pernah digunakan sebelumnya.");
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFinishCelebration = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#134E4A]/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative w-full max-w-sm rounded-[28px] border-[3px] border-[#134E4A] bg-white p-5 shadow-[6px_6px_0px_#134E4A] z-10 overflow-hidden"
        >
          {/* Subtle decorative background circle */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FEF08A]/30 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />

          {/* CELEBRATION VIEW */}
          {successResult ? (
            <div className="text-center py-2">
              {/* Mascot celebration */}
              <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#FEF08A] rounded-full border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A]" />
                <div className="transform scale-[0.88] translate-y-2 z-10">
                  <TilaMascot
                    size={110}
                    accessory="crown"
                    mood="excited"
                    animation="cheer"
                  />
                </div>
              </div>

              {/* Congratulatory texts */}
              <div className="mt-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A] text-[11px] font-black text-[#134E4A] uppercase tracking-wider mb-1">
                  <CrownSvg size={14} />
                  <span>VIP Terverifikasi</span>
                </div>
                <h2 className="font-display text-2xl font-black text-[#134E4A]">
                  Hore! Berhasil Ditukar!
                </h2>
                <p className="text-xs font-bold text-[#134E4A]/75 mt-1 leading-relaxed">
                  Selamat menikmati fitur VIP. Kuota hati dan tiket game kini tanpa batas!
                </p>
              </div>

              {/* Details card */}
              <div className="my-4 p-3 rounded-2xl border-[2px] border-[#134E4A] bg-[#F0FDF4] shadow-[2px_2px_0px_#134E4A] text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#134E4A]/70">Kode Voucher</span>
                  <span className="font-mono text-xs font-black text-[#134E4A]">
                    {successResult.code}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#134E4A]/15">
                  <span className="text-[11px] font-bold text-[#134E4A]/70">Durasi Aktif</span>
                  <span className="text-xs font-black text-[#0D9488] bg-white px-2 py-0.5 rounded-md border border-[#134E4A]/20">
                    +{successResult.duration_days} Hari
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleFinishCelebration}
                className="w-full py-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] text-[#134E4A] font-black text-sm tracking-wide shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[#FDE047] flex items-center justify-center gap-2"
              >
                <CheckSvg size={18} />
                <span>Alhamdulillah, Mulai Bermain!</span>
              </button>
            </div>
          ) : (
            /* INPUT FORM VIEW */
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] flex items-center justify-center shadow-[2px_2px_0px_#134E4A] shrink-0">
                    <TicketSvg size={24} />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-black text-[#134E4A] leading-tight">
                      Tukar Kode VIP
                    </h2>
                    <p className="text-[11px] font-bold text-[#134E4A]/60 mt-0.5">
                      Aktivasi langganan santri TPQ
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border-2 border-[#134E4A] bg-[#FFF0F0] p-1.5 text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all hover:bg-[#FFE0E0]"
                  aria-label="Tutup modal"
                >
                  <XSvg size={18} />
                </button>
              </div>

              <p className="mt-3 text-xs font-bold text-[#134E4A]/75 leading-snug">
                Punya kode voucher dari pengurus TPQ? Masukkan kodenya di bawah untuk membuka akses VIP & energi tanpa batas!
              </p>

              {/* Error Banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 rounded-xl border-2 border-[#FF6B6B] bg-[#FFF0F0] flex items-start gap-2 shadow-[2px_2px_0px_#FF6B6B]"
                >
                  <AlertTriangleSvg size={18} className="shrink-0 text-[#FF6B6B] mt-0.5" />
                  <p className="text-xs font-black text-[#FF6B6B] leading-tight">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="voucher-code-input"
                    className="block text-[11px] font-black uppercase tracking-wider text-[#134E4A] mb-1.5"
                  >
                    Masukkan Kode Voucher
                  </label>
                  <div className="relative">
                    <input
                      id="voucher-code-input"
                      type="text"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.toUpperCase().replace(/\s+/g, ""));
                        if (error) setError(null);
                      }}
                      placeholder="Contoh: TPQ-ALFATIH-VIP"
                      disabled={loading}
                      autoFocus
                      autoComplete="off"
                      spellCheck={false}
                      className="w-full px-3.5 py-3 rounded-xl border-[3px] border-[#134E4A] bg-[#F0FDF4] font-mono text-base font-black tracking-wider text-[#134E4A] placeholder:text-[#134E4A]/35 shadow-[2px_2px_0px_#134E4A] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0D9488]"
                    />
                    {code && !loading && (
                      <button
                        type="button"
                        onClick={() => {
                          setCode("");
                          setError(null);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-wider text-[#134E4A]/50 hover:text-[#134E4A] bg-white/80 px-1.5 py-0.5 rounded border border-[#134E4A]/20"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-[#134E4A]/50 mt-1.5">
                    Huruf besar/kecil tidak berpengaruh.
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || !code.trim()}
                  className="w-full py-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-sm tracking-wide shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#0F766E]"
                >
                  {loading ? (
                    <>
                      <Loader2Svg size={18} className="animate-spin" />
                      <span>Memvalidasi Kode...</span>
                    </>
                  ) : (
                    <>
                      <SparklesSvg size={18} />
                      <span>Tukar Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
