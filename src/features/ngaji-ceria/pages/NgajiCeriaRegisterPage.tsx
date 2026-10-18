import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Sparkles,
  StickerButton,
  StickerCard,
  SectionHeader,
  GraduationCap,
  ArrowRight,
} from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/services/api";

export default function NgajiCeriaRegisterPage() {
  const navigate = useNavigate();
  const { registerCeria } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      await registerCeria(name, username, password, confirmPassword);
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
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-2xl bg-[#134E4A] text-white border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#FF6B6B]">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-2xl font-black text-[#134e4a]">
            Daftar Akun Santri
          </h1>
          <p className="text-xs font-bold text-[#134e4a]/60">
            Menyiapkan petualangan seru mengaji!
          </p>
        </div>

        {/* Form Card */}
        <StickerCard className="p-6 space-y-4">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-[#134E4A]/20 text-sm font-bold text-[#134e4a] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
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
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-[#134E4A]/20 text-sm font-bold text-[#134e4a] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
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
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-[#134E4A]/20 text-sm font-bold text-[#134e4a] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
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
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-[#134E4A]/20 text-sm font-bold text-[#134e4a] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
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

            <StickerButton
              type="submit"
              disabled={submitting}
              fullWidth
              className="rounded-2xl bg-[#0D9488] border-b-4 border-[#097b71]"
            >
              {submitting ? "Memproses..." : "Mulai Belajar Sekarang"}
              <ArrowRight size={14} className="ml-1 inline" />
            </StickerButton>
          </form>
        </StickerCard>

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