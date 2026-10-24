import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Lock,
  Sparkles,
  StickerButton,
  StickerCard,
  SectionHeader,
  GraduationCap,
  ArrowRight,
  Shirt,
} from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/services/api";
import { userApi } from "@/services/userApi";
import { TitoMascot } from "@/components/ui/TitoMascot";
import { MASCOT_NAME, MASCOT_BOY_NAME, MASCOT_GIRL_NAME } from "@/constants/mascot";
import { useEconomyStore, type TilaGender } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import { NGAJI_CERIA_ASSETS } from "@/features/ngaji-ceria/data/assets";

export default function NgajiCeriaRegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get("ref") || "";
  const { registerCeria } = useAuth();
  const setTilaGender = useEconomyStore((s) => s.setTilaGender);
  const equipAccessory = useEconomyStore((s) => s.equipAccessory);

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedGender, setSelectedGender] = useState<TilaGender>("boy");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState(initialRef.toUpperCase());
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (
      username.trim() !== username ||
      !/^[a-z0-9][a-z0-9_]{2,31}$/.test(username)
    ) {
      setError(
        "Username harus 3–32 karakter: huruf kecil, angka, atau underscore."
      );
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    setSubmitting(true);
    try {
      await setTilaGender(selectedGender);
      if (selectedGender === "boy") {
        equipAccessory("peci");
      } else {
        equipAccessory("hairbow");
      }
      await registerCeria(
        name,
        username,
        password,
        confirmPassword,
        referralCode.trim() || undefined,
      );
      try {
        await userApi.updateUserMascot(selectedGender);
      } catch {
        // ignore
      }
      sessionStorage.setItem("trigger_ngaji_ceria_splash", "true");
      navigate("/member/ngaji-ceria");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Gagal membuat akun. Coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col justify-center px-6 py-12">
      <div className="max-w-sm w-full mx-auto space-y-6">
        {/* Hero */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-[#134E4A] text-white border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#FF6B6B]">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-2xl font-black text-[#134e4a]">
            Daftar Akun Santri
          </h1>
          <p className="text-xs font-bold text-[#134e4a]/60">
            {step === 1
              ? "Langkah 1: Pilih Teman Belajarmu"
              : "Langkah 2: Lengkapi Data Akunmu"}
          </p>
        </div>

        {step === 1 ? (
          /* Step 1: Pilih Teman Belajar (Tito) */
          <StickerCard className="p-6 space-y-5 text-center">
            <div className="bg-[#FEF08A]/40 rounded-2xl border-[3px] border-[#134E4A] p-4 flex flex-col items-center justify-center relative shadow-[3px_3px_0px_#134E4A]">
              <TitoMascot
                size={170}
                direction="front"
                mood="excited"
                animation="bounce"
                gender={selectedGender === "girl" ? "girl" : "boy"}
                accessory={selectedGender === "boy" ? "peci" : "hairbow"}
              />
              <span className="mt-2 inline-block rounded-full bg-[#134E4A] px-3 py-1 text-[11px] font-black text-white border-2 border-[#134E4A]">
                {selectedGender === "boy" ? `${MASCOT_BOY_NAME} (Putra)` : `${MASCOT_GIRL_NAME} (Putri)`}
              </span>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-xs font-black text-[#134e4a]">
                Pilih Gaya Teman Belajarmu:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedGender("boy")}
                  className={`p-3 rounded-2xl border-[3px] border-[#134E4A] font-black text-xs transition-all flex flex-col items-center gap-1.5 ${
                    selectedGender === "boy"
                      ? "bg-[#0D9488] text-white shadow-[3px_3px_0px_#134E4A] -translate-y-0.5"
                      : "bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] opacity-80"
                  }`}
                >
                  <img src={NGAJI_CERIA_ASSETS.peci} alt="Tito (Peci Santri)" className="w-8 h-8 object-contain" />
                  <span>{MASCOT_BOY_NAME} (Putra)</span>
                  <span className="text-[10px] font-bold opacity-80">(Santri Putra / Peci)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGender("girl")}
                  className={`p-3 rounded-2xl border-[3px] border-[#134E4A] font-black text-xs transition-all flex flex-col items-center gap-1.5 ${
                    selectedGender === "girl"
                      ? "bg-[#FF6B6B] text-white shadow-[3px_3px_0px_#134E4A] -translate-y-0.5"
                      : "bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] opacity-80"
                  }`}
                >
                  <Sparkles size={28} className={selectedGender === "girl" ? "text-white my-0.5" : "text-[#FF6B6B] my-0.5"} />
                  <span>{MASCOT_GIRL_NAME} (Putri)</span>
                  <span className="text-[10px] font-bold opacity-80">(Santri Putri / Pita)</span>
                </button>
              </div>
            </div>

            <StickerButton
              type="button"
              fullWidth
              onClick={() => setStep(2)}
              className="rounded-2xl bg-[#0D9488] border-b-4 border-[#097b71]"
            >
              Lanjutkan ke Data Santri
              <ArrowRight size={14} className="ml-1 inline" />
            </StickerButton>
          </StickerCard>
        ) : (
          /* Step 2: Form Card */
          <StickerCard className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F0FDF4] border-2 border-[#134E4A]">
              <TitoMascot
                size={48}
                direction="front"
                animation="none"
                gender={selectedGender === "girl" ? "girl" : "boy"}
                accessory={selectedGender === "boy" ? "peci" : "hairbow"}
              />
              <div className="text-left text-xs">
                <p className="font-black text-[#134E4A]">
                  {selectedGender === "boy" ? MASCOT_BOY_NAME : MASCOT_GIRL_NAME} siap menemanimu!
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[10px] font-extrabold text-[#0D9488] underline"
                >
                  Ganti Pilihan
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="ceria-name" className="block text-xs font-black text-[#134e4a] mb-1.5">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  id="ceria-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Rayhan"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#134E4A]/30 text-sm font-bold text-[#134e4a] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
                />
              </div>

              <div>
                <label htmlFor="ceria-username" className="block text-xs font-black text-[#134e4a] mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  id="ceria-username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  minLength={3}
                  maxLength={32}
                  placeholder="Username akun"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#134E4A]/30 text-sm font-bold text-[#134e4a] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
                />
              </div>

              <div>
                <label htmlFor="ceria-password" className="block text-xs font-black text-[#134e4a] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  id="ceria-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  maxLength={128}
                  placeholder="Buat password"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#134E4A]/30 text-sm font-bold text-[#134e4a] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
                />
              </div>

              <div>
                <label htmlFor="ceria-confirm-password" className="block text-xs font-black text-[#134e4a] mb-1.5">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  id="ceria-confirm-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#134E4A]/30 text-sm font-bold text-[#134e4a] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="ceria-referral-code" className="block text-xs font-black text-[#134e4a]">
                    Punya kode referral? (Opsional)
                  </label>
                  <span className="text-[10px] font-black text-[#0D9488] bg-[#CCFBF1] px-2 py-0.5 rounded-md border border-[#134E4A]">
                    Hadiah VIP 1 Bulan
                  </span>
                </div>
                <input
                  type="text"
                  id="ceria-referral-code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="Misal: TITO-ABCD"
                  maxLength={20}
                  autoCapitalize="characters"
                  spellCheck={false}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#134E4A]/30 text-sm font-black text-[#134e4a] tracking-wider uppercase placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border-2 border-[#FF6B6B]/30 bg-[#FF6B6B]/10 px-3 py-2 text-xs font-semibold leading-relaxed text-[#FF6B6B]"
                >
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-2xl border-[3px] border-[#134E4A] font-black text-xs text-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A] active:translate-y-0.5"
                >
                  Kembali
                </button>
                <StickerButton
                  type="submit"
                  disabled={submitting}
                  fullWidth
                  className="rounded-2xl bg-[#0D9488] border-b-4 border-[#097b71]"
                >
                  {submitting ? "Memproses..." : "Mulai Belajar Sekarang"}
                  <ArrowRight size={14} className="ml-1 inline" />
                </StickerButton>
              </div>
            </form>
          </StickerCard>
        )}

        <div className="text-center">
          <Link
            to="/login?intent=ceria"
            className="text-xs font-bold text-[#134e4a]/70 hover:text-[#0D9488]"
          >
            Sudah punya akun? <span className="underline">Masuk di sini</span>
          </Link>
        </div>
      </div>
    </div>
  );
}