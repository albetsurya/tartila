import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

import {
  Eye,
  EyeOff,
  Lock,
  User,
  InputField,
  StickerButton,
} from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeAnimation } from "../components/WelcomeAnimation";

export default function NgajiCeriaLoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Email/Username dan kata sandi harus diisi.");
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier, password);
      navigate("/member/ngaji-ceria");
    } catch (err: any) {
      setError(err?.message || "Gagal masuk. Periksa kembali data Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    setIsLoading(true);
    setError("");
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate("/member/ngaji-ceria");
    } catch (err: any) {
      setError(err?.message || "Gagal masuk dengan Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col">
      {/* HEADER / LOGO */}
      <div className="pt-10 pb-4 flex justify-center items-center gap-2">
        <span className="text-3xl">📖</span>
        <h1 className="font-display font-black text-2xl text-[#134E4A] tracking-widest">
          Tartila
        </h1>
      </div>

      {/* ILUSTRASI */}
      <div className="relative w-full max-w-sm mx-auto flex flex-col items-center mt-2 px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-[#FFF8EE] border-[3px] border-[#134E4A] rounded-2xl px-5 py-2.5 mb-6 shadow-[3px_3px_0px_#134E4A] z-10"
        >
          <p className="text-[#134E4A] font-black text-xs text-center">
            Selamat Datang di <br /> Tartila!
          </p>
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FFF8EE] border-b-[3px] border-r-[3px] border-[#134E4A] rotate-45 z-0" />
        </motion.div>

        <WelcomeAnimation />
      </div>

      {/* FORM AREA */}
      <div className="flex-1 flex flex-col px-6 pb-10 mt-6 max-w-md w-full mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-display font-black text-xl text-[#134E4A]">
            Masuk ke Akunmu
          </h2>
          <p className="text-[11px] font-bold text-[#134E4A]/60 mt-1">
            Belajar membaca Tilawati jadi lebih menyenangkan
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#FF6B6B]/10 border-2 border-[#FF6B6B] rounded-xl text-[#FF6B6B] text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="identifier"
            label="Email atau Username"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Masukkan email atau username"
            required
            icon={<User size={18} />}
          />

          <InputField
            id="password"
            label="Kata Sandi"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            icon={<Lock size={18} />}
            rightAction={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#134E4A]/50 hover:text-[#134E4A] focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <div className="flex justify-end -mt-2">
            <button
              type="button"
              className="text-[10px] font-bold text-[#FF6B6B] hover:underline"
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
            className="mt-2"
          >
            Masuk
          </StickerButton>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-[#134E4A]/10"></div>
          </div>
          <div className="relative bg-[#F0FDF4] px-3 text-[10px] font-black text-[#134E4A]/40">
            ATAU
          </div>
        </div>

        {/* Google Login */}
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

        {/* Footer Links */}
        <p className="text-center text-xs font-bold text-[#134E4A]/60 mt-8">
          Belum memiliki akun?{" "}
          <Link
            to="/register/ngaji-ceria"
            className="text-[#0D9488] font-black hover:underline"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}