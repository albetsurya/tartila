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
} from "@/components/ui/CustomIcons";
import { tapFeedback } from "@/lib/haptics";
import { playSfx } from "@/features/ngaji-ceria/pages/games/_shared/audio";

export function ReferralSection() {
  const [info, setInfo] = useState<ReferralInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
      // Fallback manual jika clipboard API tidak diizinkan
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
    const text = `Ayo belajar ngaji di Tartila! Masukkan kode referral saya: ${info.referral_code} untuk dapat hadiah!`;
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
      <div className="rounded-3xl border-[3px] border-[#134E4A] bg-white p-6 shadow-[4px_4px_0px_#134E4A] animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded-md mb-3" />
        <div className="h-14 bg-gray-100 rounded-2xl mb-4" />
        <div className="h-10 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  const referralCode = info?.referral_code || "TITO-XXXX";
  const referrals = info?.referrals || [];

  return (
    <section className="space-y-4">
      {/* CARD UTAMA REFERRAL */}
      <div className="rounded-3xl border-[3px] border-[#134E4A] bg-gradient-to-b from-[#FFFDF5] to-[#F0FDF4] p-5 shadow-[4px_4px_0px_#134E4A] space-y-4 relative overflow-hidden">
        {/* Header Ajak Teman */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF08A] border-[3px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] flex items-center justify-center shrink-0">
              <GiftSvg size={26} className="text-[#B45309]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base text-[#134E4A]">
                  Ajak Teman (Referral)
                </h3>
                <span className="text-[10px] font-black bg-[#CCFBF1] text-[#0F766E] px-2 py-0.5 rounded-md border border-[#134E4A]">
                  VIP 1 Bulan
                </span>
              </div>
              <p className="text-xs font-bold text-[#134E4A]/70 mt-0.5 leading-snug">
                Dapatkan <strong>Hadiah 1 Bulan VIP</strong> untuk setiap teman yang kamu ajak setelah mereka menyelesaikan 1 kuis belajar!
              </p>
            </div>
          </div>
        </div>

        {/* KOTAK KODE REFERRAL (NEO-BRUTALISM) */}
        <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] p-4 shadow-[3px_3px_0px_#134E4A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/70 block">
              Kode Referral Kamu
            </span>
            <span className="font-mono font-black text-2xl text-[#134E4A] tracking-widest select-all">
              {referralCode}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyCode}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-xs border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
                copied
                  ? "bg-[#134E4A] text-white"
                  : "bg-white text-[#134E4A] hover:bg-[#FEFCE8]"
              }`}
            >
              {copied ? (
                <>
                  <CheckSvg size={14} className="text-[#34D399]" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <CopySvg size={14} />
                  <span>Salin Kode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* TOMBOL BAGIKAN KE WHATSAPP */}
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
        >
          <Share2Svg size={18} />
          <span>Bagikan ke WhatsApp</span>
        </button>

        {/* INPUT KODE REFERRAL TEMAN (JIKA BELUM DI-REFER) */}
        {!info?.referred_by ? (
          <div className="pt-2 border-t-2 border-dashed border-[#134E4A]/20">
            <p className="text-xs font-black text-[#134E4A] mb-1.5 flex items-center gap-1.5">
              <SparklesSvg size={14} className="text-[#F59E0B]" />
              <span>Punya Kode Referral Teman?</span>
            </p>
            <form onSubmit={handleApplyCode} className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Misal: TITO-ABCD"
                maxLength={20}
                spellCheck={false}
                className="flex-1 px-3 py-2 rounded-xl border-2 border-[#134E4A] bg-white text-xs font-black text-[#134E4A] tracking-wider uppercase placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 shadow-[2px_2px_0px_#134E4A]"
              />
              <button
                type="submit"
                disabled={applying || !inputCode.trim()}
                className="px-4 py-2 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-50 text-white font-black text-xs border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0"
              >
                {applying ? "Memproses..." : "Terapkan"}
              </button>
            </form>

            {applyMessage && (
              <p
                role="alert"
                className={`mt-2 text-xs font-bold rounded-xl p-2.5 border-2 ${
                  applyMessage.type === "success"
                    ? "bg-[#DCFCE7] text-[#166534] border-[#166534]"
                    : "bg-[#FEE2E2] text-[#991B1B] border-[#991B1B]"
                }`}
              >
                {applyMessage.text}
              </p>
            )}
          </div>
        ) : (
          <div className="pt-2 border-t-2 border-dashed border-[#134E4A]/20 flex items-center justify-between text-xs font-bold text-[#134E4A]/80">
            <span>Kamu diundang oleh:</span>
            <span className="font-black text-[#0D9488] bg-[#CCFBF1] px-2.5 py-1 rounded-lg border border-[#134E4A]">
              {info.referred_by.referrer_name} ({info.referred_by.referral_code})
            </span>
          </div>
        )}
      </div>

      {/* DAFTAR TEMAN DIUNDANG */}
      <div className="rounded-3xl border-[3px] border-[#134E4A] bg-white p-5 shadow-[4px_4px_0px_#134E4A] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersSvg size={18} className="text-[#134E4A]" />
            <h4 className="font-display font-black text-sm text-[#134E4A]">
              Daftar Teman Diundang
            </h4>
          </div>
          <span className="text-xs font-extrabold bg-[#F0FDF4] text-[#134E4A] px-2.5 py-0.5 rounded-full border border-[#134E4A]">
            {referrals.length} Teman
          </span>
        </div>

        {referrals.length === 0 ? (
          <div className="text-center py-6 px-4 bg-[#F0FDF4] rounded-2xl border-2 border-dashed border-[#134E4A]/30">
            <div className="w-10 h-10 rounded-full bg-[#CCFBF1] border-2 border-[#134E4A] flex items-center justify-center mx-auto mb-2 text-[#0D9488]">
              <UsersSvg size={20} />
            </div>
            <p className="font-display font-black text-xs text-[#134E4A]">
              Belum Ada Teman yang Bergabung
            </p>
            <p className="text-[11px] font-bold text-[#134E4A]/60 mt-0.5">
              Ajak teman TPQ atau keluargamu dengan membagikan kode referral di atas!
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
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl border-2 border-[#134E4A] bg-[#F0FDF4] shadow-[2px_2px_0px_#134E4A]"
                >
                  <div className="min-w-0">
                    <p className="font-display font-black text-xs text-[#134E4A] truncate">
                      {item.referee_name}
                    </p>
                    <p className="text-[10px] font-bold text-[#134E4A]/60">
                      Bergabung:{" "}
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    {isSuccess ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-[#DCFCE7] text-[#166534] border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                        <CheckSvg size={12} className="text-[#166534]" /> Berhasil
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-[#FEF08A] text-[#854D0E] border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                        Menunggu Aktif
                      </span>
                    )}
                    <p className="text-[9px] font-bold text-[#134E4A]/60 mt-0.5">
                      {isSuccess ? "VIP 1 Bulan Aktif" : "Perlu selesaikan 1 kuis"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
