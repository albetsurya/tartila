import React, { useEffect, useState } from "react";
import {
  referralApi,
  type ReferralInfoResponse,
  type ReferralItem,
} from "@/services/referralApi";
import {
  GiftSvg,
  CopySvg,
  CheckSvg,
  Share2Svg,
  UsersSvg,
  SparklesSvg,
  XSvg,
  ChevronRightSvg,
} from "@/components/ui/CustomIcons";
import { tapFeedback } from "@/lib/haptics";
import { playSfx } from "@/features/ngaji-ceria/pages/games/_shared/audio";

export function ReferralSection() {
  const [info, setInfo] = useState<ReferralInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);

  // Input kode referral milik teman jika user belum pernah di-refer
  const [inputCode, setInputCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchReferralInfo = async () => {
    try {
      const data = await referralApi.getReferralInfo();
      setInfo(data);
    } catch (err) {
      console.error("Gagal memuat info referral:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralInfo();
  }, []);

  const handleCopyCode = async () => {
    if (!info?.referral_code) return;
    try {
      await navigator.clipboard.writeText(info.referral_code);
      setCopied(true);
      tapFeedback();
      playSfx("pop");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement("textarea");
      el.value = info.referral_code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    if (!info?.referral_code) return;
    tapFeedback();
    const text = `Ayo belajar ngaji di Tartila! Masukkan kode referral saya: ${info.referral_code} untuk dapat hadiah 1 Bulan VIP!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setApplying(true);
    setApplyMessage(null);
    try {
      const res = await referralApi.applyReferral(inputCode.trim());
      tapFeedback();
      playSfx("correct");
      setApplyMessage({
        type: "success",
        text: res.message || "Kode referral berhasil diterapkan!",
      });
      setInputCode("");
      await fetchReferralInfo();
    } catch (err: any) {
      playSfx("wrong");
      setApplyMessage({
        type: "error",
        text:
          err?.message ||
          "Gagal menerapkan kode referral. Pastikan kode valid dan belum pernah digunakan.",
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-4 shadow-[3px_3px_0px_#134E4A] animate-pulse">
        <div className="h-4 w-36 bg-gray-200 rounded mb-2" />
        <div className="h-10 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  const referralCode = info?.referral_code || "TARTILA-XXXX";
  const referrals = info?.referrals || [];

  return (
    <section>
      {/* CARD RINGKAS REFERRAL (NEO-BRUTALISM SOLID) */}
      <div className="rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] p-4 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] space-y-3.5 transition-colors duration-200">
        {/* Header Ringkas */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#FEF08A] border-2 border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] flex items-center justify-center shrink-0">
              <GiftSvg size={20} className="text-[#B45309]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-black text-sm text-[var(--text-main,#134E4A)] truncate">
                Ajak Teman &amp; Hadiah VIP
              </h3>
              <p className="text-[10px] font-bold text-[var(--text-main,#134E4A)]/70 truncate">
                Dapat 1 Bulan VIP untuk setiap teman yang bergabung
              </p>
            </div>
          </div>
          <span className="text-[9px] font-black bg-[#CCFBF1] dark:bg-[#1E293B] text-[#0F766E] dark:text-[#38BDF8] px-2.5 py-1 rounded-lg border-2 border-[var(--border-color,#134E4A)] shadow-[1px_1px_0px_var(--shadow-color,#134E4A)] shrink-0">
            VIP 1 Bulan
          </span>
        </div>

        {/* Kode Referral Box & Action Buttons */}
        <div className="rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[#FEF08A] p-2.5 shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[9px] font-black uppercase text-[#134E4A]/70 block leading-none">
              Kode Referral Kamu
            </span>
            <span className="font-mono font-black text-lg text-[#134E4A] tracking-wider select-all">
              {referralCode}
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={handleCopyCode}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-[#134E4A] text-xs font-black shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
                copied
                  ? "bg-[#134E4A] text-white"
                  : "bg-white text-[#134E4A] hover:bg-gray-50"
              }`}
            >
              {copied ? (
                <>
                  <CheckSvg size={12} className="text-[#34D399]" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <CopySvg size={12} />
                  <span>Salin Kode</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-[#134E4A] bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <Share2Svg size={12} />
              <span>Share WA</span>
            </button>
          </div>
        </div>

        {/* Baris Link Informasi & Modal Trigger */}
        <div className="flex items-center justify-between text-xs font-bold pt-0.5 border-t border-[#134E4A]/10">
          <button
            type="button"
            onClick={() => setIsFriendsModalOpen(true)}
            className="flex items-center gap-1 text-[11px] font-black text-[#0D9488] hover:underline"
          >
            <UsersSvg size={13} />
            <span>Daftar Teman Diundang ({referrals.length} Teman)</span>
            <ChevronRightSvg size={13} />
          </button>

          {!info?.referred_by ? (
            <button
              type="button"
              onClick={() => setIsInputModalOpen(true)}
              className="flex items-center gap-1 text-[11px] font-black text-[#B45309] hover:underline"
            >
              <SparklesSvg size={12} />
              <span>Masukkan Kode Teman</span>
            </button>
          ) : (
            <span className="text-[10px] font-bold text-[#134E4A]/70">
              Diundang oleh: <span className="font-black text-[#0D9488]">{info.referred_by.referrer_name}</span>
            </span>
          )}
        </div>
      </div>

      {/* MODAL 1: DAFTAR TEMAN DIUNDANG */}
      {isFriendsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="max-h-[80dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border-[3px] border-[#134E4A] bg-white p-5 shadow-[4px_4px_0px_#134E4A] sm:rounded-2xl">
            <div className="flex items-center justify-between border-b-2 border-[#134E4A]/10 pb-3">
              <div className="flex items-center gap-2">
                <UsersSvg size={20} className="text-[#134E4A]" />
                <h3 className="font-display font-black text-base text-[#134E4A]">
                  Daftar Teman Diundang
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFriendsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[1px_1px_0px_#134E4A] active:translate-y-[1px]"
              >
                <XSvg size={16} />
              </button>
            </div>

            <div className="mt-4">
              {referrals.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-[#134E4A]/30 bg-[#F0FDF4] p-6 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#134E4A] bg-[#CCFBF1] text-[#0D9488]">
                    <UsersSvg size={22} />
                  </div>
                  <p className="font-display text-sm font-black text-[#134E4A]">
                    Belum Ada Teman yang Bergabung
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#134E4A]/70">
                    Bagikan kode referral <span className="font-black text-[#0D9488]">{referralCode}</span> ke santri lain atau keluarga untuk mendapatkan 1 bulan langganan VIP gratis!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {referrals.map((item: ReferralItem) => {
                    const isSuccess =
                      item.status === "success" || item.status === "rewarded";
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border-2 border-[#134E4A] bg-[#F0FDF4] p-3 shadow-[2px_2px_0px_#134E4A]"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-display text-xs font-black text-[#134E4A]">
                            {item.referee_name}
                          </p>
                          <p className="text-[10px] font-bold text-[#134E4A]/60">
                            Bergabung:{" "}
                            {new Date(item.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          {isSuccess ? (
                            <span className="inline-flex items-center gap-1 rounded-xl border-2 border-[#134E4A] bg-[#DCFCE7] px-2.5 py-0.5 text-[10px] font-black text-[#166534]">
                              <CheckSvg size={12} /> VIP Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-[10px] font-black text-[#854D0E]">
                              Menunggu Aktif
                            </span>
                          )}
                          <p className="mt-0.5 text-[9px] font-bold text-[#134E4A]/60">
                            {isSuccess ? "Hadiah Diterima" : "Perlu kuis 1x"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setIsFriendsModalOpen(false)}
                className="w-full rounded-xl border-2 border-[#134E4A] bg-white py-2 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INPUT KODE REFERRAL TEMAN */}
      {isInputModalOpen && !info?.referred_by && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl border-[3px] border-[#134E4A] bg-white p-5 shadow-[4px_4px_0px_#134E4A] sm:rounded-2xl">
            <div className="flex items-center justify-between border-b-2 border-[#134E4A]/10 pb-3">
              <div className="flex items-center gap-2">
                <SparklesSvg size={18} className="text-[#F59E0B]" />
                <h3 className="font-display font-black text-base text-[#134E4A]">
                  Punya Kode Referral Teman?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInputModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[1px_1px_0px_#134E4A] active:translate-y-[1px]"
              >
                <XSvg size={16} />
              </button>
            </div>

            <p className="mt-3 text-xs font-semibold text-[#134E4A]/80">
              Masukkan kode referral dari temanmu untuk mendapatkan hadiah belajar di Tartila.
            </p>

            <form onSubmit={handleApplyCode} className="mt-4 space-y-3">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Misal: TARTILA-ABCD"
                maxLength={20}
                spellCheck={false}
                className="w-full rounded-xl border-2 border-[#134E4A] bg-white px-3 py-2.5 text-xs font-black uppercase tracking-wider text-[#134E4A] shadow-[2px_2px_0px_#134E4A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
              />
              <button
                type="submit"
                disabled={applying || !inputCode.trim()}
                className="w-full rounded-xl border-2 border-[#134E4A] bg-[#0D9488] py-2.5 text-xs font-black text-white shadow-[2px_2px_0px_#134E4A] disabled:opacity-50 active:translate-y-[1px]"
              >
                {applying ? "Memproses..." : "Terapkan Kode Referral"}
              </button>
            </form>

            {applyMessage && (
              <p
                role="alert"
                className={`mt-3 rounded-xl border-2 p-2.5 text-xs font-bold ${
                  applyMessage.type === "success"
                    ? "border-[#166534] bg-[#DCFCE7] text-[#166534]"
                    : "border-[#991B1B] bg-[#FEE2E2] text-[#991B1B]"
                }`}
              >
                {applyMessage.text}
              </p>
            )}

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setIsInputModalOpen(false)}
                className="w-full rounded-xl border-2 border-[#134E4A] bg-white py-2 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
