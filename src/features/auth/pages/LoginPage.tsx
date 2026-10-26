import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  Eye,
  EyeOff,
  Lock,
  User,
  InputField,
  StickerButton,
  TilaMascot,
  type TilaMood,
} from "@/components/ui";
import {
  resolveMascotGender,
  getDefaultAccessoryForGender,
} from "@/utils/mascotHelper";
import { MASCOT_STORAGE_KEY } from "@/constants/mascot";
import {
  GamepadSvg,
  TrophySvg,
  BookOpenSvg,
  SparklesSvg,
} from "@/components/ui/CustomIcons";
import { useAuth } from "@/contexts/AuthContext";
import { triggerBibiReaction } from "@/utils/bibiEvent";
import { TartilaLogo } from "@/features/ngaji-ceria/components/TartilaLogo";
import { TartilaLogoSvg } from "@/components/ui/TartilaLogo";
import { WelcomeAnimation } from "../components/WelcomeAnimation";

const WELCOMED_KEY = "tartila_welcomed_v1";
const WELCOME_DURATION_MS = 2500;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function shouldShowWelcome(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(WELCOMED_KEY) !== "1";
  } catch {
    return true;
  }
}

function markWelcomed() {
  try {
    window.sessionStorage.setItem(WELCOMED_KEY, "1");
  } catch {
    /* sessionStorage unavailable */
  }
}

// Gender maskot terakhir dari store lokal; fallback Tila (putri).
function getLoginMascotGender(): "boy" | "girl" {
  if (typeof window === "undefined") return "girl";
  try {
    const saved = window.localStorage.getItem(MASCOT_STORAGE_KEY);
    return resolveMascotGender(saved || "girl");
  } catch {
    return "girl";
  }
}

function LoginMascot({ mood, size }: { mood: TilaMood; size: number }) {
  const gender = getLoginMascotGender();
  return (
    <TilaMascot
      gender={gender}
      accessory={getDefaultAccessoryForGender(gender)}
      size={size}
      mood={mood}
      animation="float"
      direction="right"
    />
  );
}

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C41 35.4 44 30.2 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { user, login, loginWithGoogle } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState<boolean>(shouldShowWelcome);

  useEffect(() => {
    if (!showWelcome) return;
    const timer = window.setTimeout(() => {
      markWelcomed();
      setShowWelcome(false);
    }, WELCOME_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [showWelcome]);

  // Setelah session tersedia (email/password atau redirect OAuth Google),
  // tampilkan reaksi sukses lalu arahkan ke beranda.
  useEffect(() => {
    if (!user) return;
    triggerBibiReaction("success");
    navigate("/member/ngaji-ceria", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Email/Username dan kata sandi harus diisi.");
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier, password);
      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal masuk. Periksa kembali data Anda.",
      );
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal masuk dengan Google.",
      );
      setIsLoading(false);
    }
  };

  const hasPasswordInput = isPasswordFocused || password.length > 0;

  const mascotMood: TilaMood = isSuccess
    ? "excited"
    : isLoading
      ? "happy"
      : error
        ? "shocked"
        : hasPasswordInput
          ? "shy"
          : "happy";

  const mascotText = isSuccess
    ? "Berhasil masuk, selamat datang!"
    : isLoading
      ? "Memeriksa akunmu..."
      : error
        ? "Periksa kembali email & sandi."
        : hasPasswordInput
          ? "Tenang, kata sandimu aman."
          : "Yuk masuk, kita mengaji bareng!";

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col md:flex-row">
      {/* SISI KIRI: Panel Maskot (Desktop 50%) */}
      <aside className="relative hidden md:flex md:w-1/2 flex-col items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#134E4A] text-white overflow-hidden border-r-4 border-[#134E4A] shadow-[4px_0px_0px_#134E4A]">
        {/* Dekorasi Latar Neo-Brutalism */}
        <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full border-[8px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full border-[8px] border-white/10" />
        <div className="pointer-events-none absolute top-1/4 right-8 h-16 w-16 rotate-12 rounded-2xl bg-[#FEF08A]/20 border-2 border-white/20" />
        <div className="pointer-events-none absolute bottom-1/4 left-8 h-12 w-12 -rotate-12 rounded-xl bg-[#FF6B6B]/20 border-2 border-white/20" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="mb-6">
            <TartilaLogo />
          </div>

          <h1 className="font-display font-black text-2xl lg:text-3xl text-white drop-shadow-md">
            Belajar & Bermain Bersama!
          </h1>
          <p className="mt-2 text-sm font-bold text-white/80 max-w-xs leading-relaxed">
            Kumpulkan koin, taklukkan tilawati, dan raih bintang hafalan bersama kami.
          </p>

          {/* Maskot Tunggal */}
          <div className="mt-8 flex flex-col items-center">
            <LoginMascot mood={mascotMood} size={140} />
            <p className="mt-3 text-sm font-black text-white/90">
              {mascotText}
            </p>
          </div>

          {/* Badge Fitur Neo-Brutalism */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border-2 border-white/30 text-xs font-black text-white shadow-sm">
              <GamepadSvg size={14} />
              <span>23 Mini Games</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border-2 border-white/30 text-xs font-black text-white shadow-sm">
              <BookOpenSvg size={14} />
              <span>Tilawati 1-6</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border-2 border-white/30 text-xs font-black text-white shadow-sm">
              <TrophySvg size={14} />
              <span>Leaderboard Santri</span>
            </span>
          </div>
        </div>
      </aside>

      {/* SISI KANAN: Form Login Neo-Brutalism (Desktop 50% / Mobile 100%) */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-6 sm:px-6 md:p-12 w-full md:w-1/2 min-h-screen">
        <motion.div
          initial={false}
          animate={{ opacity: showWelcome ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo App Icon (Desktop) */}
          <div className="hidden md:flex justify-center mb-6">
            <TartilaLogoSvg variant="app-icon" size={110} />
          </div>
          {/* Mobile Header: Logo + Maskot Tunggal */}
          <div className="mb-4 flex flex-col items-center md:hidden">
            <TartilaLogoSvg variant="app-icon" size={88} />
            <LoginMascot mood={mascotMood} size={96} />
            <p className="mt-2 text-center text-xs font-black text-[#134E4A]">
              {mascotText}
            </p>
          </div>

          {/* Kartu Form Login Neo-Brutalism */}
          <div className="bg-white rounded-[28px] border-[3px] border-[#134E4A] shadow-[6px_6px_0px_#134E4A] p-5 sm:p-6">
            <div className="mb-5 text-center">
              <h2 className="font-display font-black text-2xl text-[#134E4A]">
                Masuk ke Akunmu
              </h2>
              <p className="mt-1 text-xs font-bold text-[#134E4A]/70">
                Lanjutkan petualangan mengajimu hari ini!
              </p>
            </div>

            {error ? (
              <div
                role="alert"
                aria-live="polite"
                className="mb-4 rounded-xl border-[3px] border-[#FF6B6B] bg-[#FFF0F0] p-3 text-center text-xs font-black text-[#FF6B6B] shadow-[2px_2px_0px_#FF6B6B]"
              >
                {error}
              </div>
            ) : null}

            {GOOGLE_CLIENT_ID ? (
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl border-[3px] border-[#134E4A] bg-white px-4 py-3 text-sm font-black text-[#134E4A] shadow-[3px_3px_0px_#134E4A] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                >
                  <GoogleIcon size={20} />
                  Masuk dengan Google
                </button>
                <div className="relative mt-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-[#134E4A]/20" />
                  </div>
                  <div className="relative bg-white px-3 text-[11px] font-black text-[#134E4A]/50">
                    atau masuk dengan email
                  </div>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                id="identifier"
                label="Email atau Username"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Masukkan email atau username"
                autoComplete="username"
                aria-label="Email atau username"
                required
                icon={<User size={18} />}
              />

              <InputField
                id="password"
                label="Kata Sandi"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-label="Kata sandi"
                required
                icon={<Lock size={18} />}
                rightAction={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    aria-pressed={showPassword}
                    title={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#134E4A]/60 hover:text-[#134E4A] focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <div className="-mt-1 flex justify-end">
                <button
                  type="button"
                  className="text-xs font-black text-[#FF6B6B] hover:underline"
                >
                  Lupa Kata Sandi?
                </button>
              </div>

              <StickerButton
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
                loading={isLoading}
                className="mt-3 py-3.5 text-base shadow-[4px_4px_0px_#134E4A]"
              >
                {isSuccess ? (
                  <span className="inline-flex items-center gap-1.5 justify-center">
                    Berhasil Masuk! <SparklesSvg size={16} />
                  </span>
                ) : (
                  "Masuk Sekarang"
                )}
              </StickerButton>
            </form>

            <p className="mt-6 text-center text-xs font-bold text-[#134E4A]/70">
              Belum memiliki akun?{" "}
              <Link
                to="/register/ngaji-ceria"
                className="font-black text-[#0D9488] hover:underline"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      {/* WELCOME OVERLAY: once per browser session */}
      <AnimatePresence>
        {showWelcome ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#134E4A] p-6 text-center text-white"
          >
            <WelcomeAnimation />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
