import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

import {
  Eye,
  EyeOff,
  Lock,
  User,
  InputField,
  StickerButton,
  TilaMascot,
  TitoMascot,
  type TilaMood,
  type TilaAnimation,
  type TilaDirection,
} from "@/components/ui";
import { MASCOT_NAME } from "@/constants/mascot";
import {
  GamepadSvg,
  TrophySvg,
  BookOpenSvg,
} from "@/components/ui/CustomIcons";
import { useAuth } from "@/contexts/AuthContext";
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

interface MascotDuoProps {
  isPasswordFocused: boolean;
  isSuccess: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  isMobile?: boolean;
}

const IDLE_DIALOGUES = [
  {
    speaker: MASCOT_NAME,
    text: "Assalamu'alaikum! Yuk segera masuk, kita mengaji bareng!",
    tilaMood: "greeting" as TilaMood,
    titoMood: "happy" as TilaMood,
  },
  {
    speaker: MASCOT_NAME,
    text: "Ayo masuk akunmu sekarang, kumpulkan koin & bintang hafalan!",
    tilaMood: "happy" as TilaMood,
    titoMood: "holding" as TilaMood,
  },
  {
    speaker: MASCOT_NAME,
    text: "Belajar Tilawati dan 23 mini games seru sudah menantimu!",
    tilaMood: "excited" as TilaMood,
    titoMood: "happy" as TilaMood,
  },
  {
    speaker: MASCOT_NAME,
    text: `${MASCOT_NAME} sudah siap menemanimu, yuk segera masuk!`,
    tilaMood: "happy" as TilaMood,
    titoMood: "greeting" as TilaMood,
  },
];

function MascotDuo({
  isPasswordFocused,
  isSuccess,
  isLoading = false,
  hasError = false,
  isMobile = false,
}: MascotDuoProps) {
  // Ukuran diperbesar secara signifikan agar lebih gagah dan menarik perhatian
  const size = isMobile ? 122 : 195;
  const [idleIndex, setIdleIndex] = useState(0);
  const [activeTapSide, setActiveTapSide] = useState<"left" | "right" | null>(null);
  const [tapReaction, setTapReaction] = useState<{
    speaker: string;
    text: string;
  } | null>(null);

  // Interval rotasi percakapan otomatis saat idle
  useEffect(() => {
    if (isPasswordFocused || isSuccess || isLoading || hasError || tapReaction)
      return;
    const interval = setInterval(() => {
      setIdleIndex((prev) => (prev + 1) % IDLE_DIALOGUES.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPasswordFocused, isSuccess, isLoading, hasError, tapReaction]);

  // Reset tap reaction timer
  useEffect(() => {
    if (!tapReaction) return;
    const t = setTimeout(() => setTapReaction(null), 3500);
    return () => clearTimeout(t);
  }, [tapReaction]);

  // Tentukan speaker, ucapan, dan ekspresi aktif berdasarkan interaksi
  let currentSpeaker: string = MASCOT_NAME;
  let currentText = "";
  let tilaMood: TilaMood = "happy";
  let titoMood: TilaMood = "happy";
  let tilaAnim: TilaAnimation = "float";
  let titoAnim: TilaAnimation = "float";
  let titoDir: TilaDirection = "left";
  let tilaDir: TilaDirection = "right";

  if (isSuccess) {
    currentSpeaker = MASCOT_NAME;
    currentText =
      "Alhamdulillah berhasil masuk! Ayo kita mulai petualangan mengaji!";
    tilaMood = "excited";
    titoMood = "excited";
    tilaAnim = "bounce";
    titoAnim = "bounce";
  } else if (isLoading) {
    currentSpeaker = MASCOT_NAME;
    currentText = "Sedang memeriksa akun santrimu... Bismillah!";
    tilaMood = "happy";
    titoMood = "thinking";
    tilaAnim = "float";
    titoAnim = "float";
  } else if (hasError) {
    currentSpeaker = MASCOT_NAME;
    currentText = "Ups! Coba periksa kembali email atau kata sandimu ya.";
    tilaMood = "shocked";
    titoMood = "thinking";
    tilaAnim = "bounce";
  } else if (isPasswordFocused) {
    currentSpeaker = MASCOT_NAME;
    currentText =
      "Tenang, kami tutup mata dan tidak akan mengintip kata sandimu!";
    tilaMood = "shy";
    titoMood = "thinking";
    titoDir = "back";
    tilaDir = "front";
  } else if (tapReaction) {
    currentSpeaker = tapReaction.speaker;
    currentText = tapReaction.text;
    if (activeTapSide === "left") {
      tilaMood = "excited";
      tilaAnim = "bounce";
    } else {
      titoMood = "excited";
      titoAnim = "bounce";
    }
  } else {
    const idle = IDLE_DIALOGUES[idleIndex];
    currentSpeaker = idle.speaker;
    currentText = idle.text;
    tilaMood = idle.tilaMood;
    titoMood = idle.titoMood;
  }

  const handleTapTila = () => {
    setActiveTapSide("left");
    setTapReaction({
      speaker: MASCOT_NAME,
      text: `Hai! Aku ${MASCOT_NAME}! Siap menemani belajarmu dengan ceria!`,
    });
  };

  const handleTapTito = () => {
    setActiveTapSide("right");
    setTapReaction({
      speaker: MASCOT_NAME,
      text: `Halo! Aku ${MASCOT_NAME}! Ayo rajin belajar dan taklukkan semua tantangan!`,
    });
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Balon Ucapan Tunggal Interaktif Anti-Bertumpukan */}
      <div className="min-h-[64px] flex items-end justify-center mb-1 w-full px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSpeaker + currentText}
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative rounded-2xl border-[3px] border-[#134E4A] bg-white px-3.5 py-2 shadow-[3px_3px_0px_#134E4A] max-w-[290px] sm:max-w-[340px] text-center"
          >
            {/* Speaker Tag Badge */}
            <div className="absolute -top-3 left-4 flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-[#134E4A] text-[9px] font-black uppercase tracking-wider shadow-[1px_1px_0px_#134E4A] bg-[#FEF08A] text-[#134E4A]">
              <span>
                {currentSpeaker}
              </span>
            </div>

            <p className="text-[11px] sm:text-xs font-black text-[#134E4A] leading-snug pt-1">
              {currentText}
            </p>

            {/* Ekor Balon Menunjuk ke Maskot yang Berbicara */}
            <div
              className={`absolute -bottom-2 w-3.5 h-3.5 bg-white border-r-[3px] border-b-[3px] border-[#134E4A] rotate-45 transition-all duration-300 ${
                activeTapSide === "left"
                  ? "left-1/4 -translate-x-1/2"
                  : activeTapSide === "right"
                    ? "right-1/4 translate-x-1/2"
                    : "left-1/2 -translate-x-1/2"
              }`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Duo Maskot dengan Animasi Mendekat (Zoom / Lean-in ke Layar Mengajak Segera Login) */}
      <motion.div
        animate={{
          y: [0, -12, -4, 0],
          scale: [1, 1.08, 1.04, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 4.5,
          ease: "easeInOut",
          times: [0, 0.45, 0.7, 1],
        }}
        whileHover={{ scale: 1.08 }}
        className="relative flex items-end justify-center gap-4 sm:gap-7 pt-2 pointer-events-auto"
      >
        {/* TILA (PUTRI) */}
        <div
          onClick={handleTapTila}
          className="flex flex-col items-center cursor-pointer group"
          title="Ketuk Tila!"
        >
          <TilaMascot
            gender="girl"
            accessory="hairbow"
            size={size}
            mood={tilaMood}
            animation={tilaAnim}
            direction={tilaDir}
          />
          <span className="mt-1 inline-block rounded-full border-2 border-[#134E4A] bg-[#FEF08A] px-2.5 py-0.5 text-[10px] sm:text-xs font-black text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] group-hover:scale-105 transition-transform">
            Tila (Putri)
          </span>
        </div>

        {/* TITO (PUTRA) */}
        <div
          onClick={handleTapTito}
          className="flex flex-col items-center cursor-pointer group"
          title="Ketuk Tito!"
        >
          <TitoMascot
            gender="boy"
            accessory="peci"
            size={size}
            mood={titoMood}
            animation={titoAnim}
            direction={titoDir}
          />
          <span className="mt-1 inline-block rounded-full border-2 border-[#134E4A] bg-[#CCFBF1] px-2.5 py-0.5 text-[10px] sm:text-xs font-black text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] group-hover:scale-105 transition-transform">
            Tito (Putra)
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

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
      setTimeout(() => {
        navigate("/member/ngaji-ceria");
      }, 600);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal masuk. Periksa kembali data Anda.",
      );
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    setIsLoading(true);
    setError("");
    try {
      await loginWithGoogle(credentialResponse.credential);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/member/ngaji-ceria");
      }, 600);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal masuk dengan Google.",
      );
      setIsLoading(false);
    }
  };

  const hasPasswordInput = isPasswordFocused || password.length > 0;

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col md:flex-row">
      {/* SISI KIRI — Panel Maskot Interaktif Tito (Desktop 50%) */}
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

          {/* Maskot Tito Tartila */}
          <div className="mt-8 w-full">
            <MascotDuo
              isPasswordFocused={hasPasswordInput}
              isSuccess={isSuccess}
              isLoading={isLoading}
              hasError={!!error}
              isMobile={false}
            />
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

      {/* SISI KANAN — Form Login Neo-Brutalism (Desktop 50% / Mobile 100%) */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:px-6 md:p-12 w-full md:w-1/2 min-h-screen">
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
          {/* Mobile Mascot Header (Hanya di layar kecil) */}
          <div className="mb-6 flex flex-col items-center md:hidden">
            <TartilaLogoSvg variant="app-icon" size={110} />
            <div className="mt-4">
              <TartilaLogo />
            </div>
            <MascotDuo
              isPasswordFocused={hasPasswordInput}
              isSuccess={isSuccess}
              isLoading={isLoading}
              hasError={!!error}
              isMobile={true}
            />
          </div>

          {/* Kartu Form Login Neo-Brutalism */}
          <div className="bg-white rounded-[28px] border-[4px] border-[#134E4A] shadow-[6px_6px_0px_#134E4A] p-6 sm:p-8">
            <div className="mb-6 text-center">
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
                {isSuccess ? "Berhasil Masuk! ✨" : "Masuk Sekarang"}
              </StickerButton>
            </form>

            {GOOGLE_CLIENT_ID ? (
              <>
                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-[#134E4A]/20" />
                  </div>
                  <div className="relative bg-white px-3 text-[11px] font-black text-[#134E4A]/50">
                    ATAU
                  </div>
                </div>

                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Gagal login dengan Google")}
                    useOneTap
                    shape="pill"
                    theme="outline"
                    size="large"
                    width="100%"
                  />
                </div>
              </>
            ) : null}

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

      {/* WELCOME OVERLAY — once per browser session */}
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
