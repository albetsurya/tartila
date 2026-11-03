import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCapSvg,
  XSvg,
  AlertTriangleSvg,
  Loader2Svg,
  CheckSvg,
} from "@/components/ui/CustomIcons";
import { ustadzApi, type ApplyUstadzResponse } from "@/services/ustadzApi";

interface ApplyUstadzModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (res: ApplyUstadzResponse) => void;
}

export function ApplyUstadzModal({
  isOpen,
  onClose,
  onSuccess,
}: ApplyUstadzModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<ApplyUstadzResponse | null>(null);

  const resetForm = () => {
    setReason("");
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
    const cleanReason = reason.trim();
    if (!cleanReason) {
      setError("Silakan tulis alasan atau nama lembaga/TPQ tempat mengajar.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await ustadzApi.applyUstadz(cleanReason);
      setSuccessResult(res);
      onSuccess?.(res);
    } catch (err: any) {
      const errMsg =
        err?.message ||
        "Gagal mengirim pengajuan ustadz. Silakan periksa koneksi dan coba lagi.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#134E4A]/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-[28px] border-[3px] border-[#134E4A] bg-white p-5 shadow-[6px_6px_0px_#134E4A]"
          >
            {successResult ? (
              /* Success View */
              <div className="py-2 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] bg-[#D1FAE5] shadow-[3px_3px_0px_#134E4A]">
                  <CheckSvg size={32} className="text-[#134E4A]" />
                </div>
                <h2 className="text-xl font-black text-[#134E4A]">
                  Pengajuan Terkirim!
                </h2>
                <p className="mt-2 text-xs font-bold leading-relaxed text-[#134E4A]/80">
                  {successResult.message ||
                    "Permohonan Anda berhasil diajukan dan sedang menunggu peninjauan oleh admin."}
                </p>

                <div className="my-4 rounded-2xl border-[2px] border-[#134E4A] bg-[#F0FDF4] p-3 text-left shadow-[2px_2px_0px_#134E4A]">
                  <p className="text-[11px] font-bold text-[#134E4A]/70">
                    Catatan:
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-[#134E4A]/90">
                    Setelah disetujui, akun Anda akan otomatis beralih ke role Ustadz. Sesi login akan diperbarui.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] py-3 text-sm font-black text-[#134E4A] shadow-[3px_3px_0px_#134E4A] transition-all hover:bg-[#FDE047] active:translate-y-[2px] active:shadow-none"
                >
                  Tutup
                </button>
              </div>
            ) : (
              /* Form View */
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] bg-[#D1FAE5] shadow-[2px_2px_0px_#134E4A]">
                      <GraduationCapSvg size={24} className="text-[#134E4A]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black leading-tight text-[#134E4A]">
                        Daftar Sebagai Ustadz
                      </h2>
                      <p className="mt-0.5 text-[11px] font-bold text-[#134E4A]/60">
                        Ajukan akun pengajar TPQ / Lembaga
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="rounded-xl border-2 border-[#134E4A] bg-[#FFF0F0] p-1.5 text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#FFE0E0] active:translate-y-[1px] active:shadow-none disabled:opacity-50"
                    aria-label="Tutup modal"
                  >
                    <XSvg size={18} />
                  </button>
                </div>

                <p className="mt-3 text-xs font-bold leading-relaxed text-[#134E4A]/75">
                  Sebagai Ustadz, Anda dapat membuat kelas, memantau kemajuan santri, dan menguji hafalan serta bacaan Al-Quran.
                </p>

                {/* Error Banner */}
                {error && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border-2 border-[#991B1B] bg-[#FEF2F2] p-2.5 text-left text-xs font-bold text-[#991B1B] shadow-[2px_2px_0px_#991B1B]">
                    <AlertTriangleSvg size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                  <div>
                    <label
                      htmlFor="ustadz-reason-input"
                      className="block text-xs font-black uppercase tracking-wider text-[#134E4A]"
                    >
                      Alasan / Nama Lembaga
                    </label>
                    <textarea
                      id="ustadz-reason-input"
                      rows={3}
                      value={reason}
                      onChange={(e) => {
                        setReason(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Contoh: Pengajar di TPQ Nurul Huda / Guru Tahsin Masjid Al-Muhajirin"
                      disabled={loading}
                      className="mt-1.5 w-full resize-none rounded-2xl border-[3px] border-[#134E4A] bg-[#F0FDF4] p-3 text-sm font-bold text-[#134E4A] placeholder:text-[#134E4A]/40 shadow-[2px_2px_0px_#134E4A] transition-all focus:bg-white focus:outline-none disabled:opacity-60"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="flex-1 rounded-2xl border-[3px] border-[#134E4A] bg-white py-3 text-sm font-black text-[#134E4A] shadow-[3px_3px_0px_#134E4A] transition-all hover:bg-gray-50 active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !reason.trim()}
                      className="flex-[2] flex items-center justify-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] py-3 text-sm font-black text-[#134E4A] shadow-[3px_3px_0px_#134E4A] transition-all hover:bg-[#FDE047] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2Svg size={16} className="animate-spin" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <span>Ajukan Sekarang</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
