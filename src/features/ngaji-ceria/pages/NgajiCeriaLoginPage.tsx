import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { NGAJI_CERIA_ASSETS } from "../data/assets";

export default function NgajiCeriaLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
      // Memanggil fungsi login dari AuthContext
      await login(identifier, password);

      // Jika berhasil, arahkan ke halaman utama Ngaji Ceria
      navigate("/member/ngaji-ceria");
    } catch (err) {
      setError("Gagal masuk. Periksa kembali data Anda.");
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
          NGAJI CERIA
        </h1>
      </div>

      {/* ILUSTRASI PLACEHOLDER */}
      {/* ILUSTRASI PLACEHOLDER */}
      <div className="relative w-full max-w-sm mx-auto flex flex-col items-center mt-2 px-6">
        {/* Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-[#FFF8EE] border-[3px] border-[#134E4A] rounded-2xl px-5 py-2.5 mb-6 shadow-[3px_3px_0px_#134E4A] z-10"
        >
          <p className="text-[#134E4A] font-black text-xs text-center">
            Selamat Datang di <br /> Ngaji Ceria!
          </p>
          {/* Ekor Speech Bubble */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FFF8EE] border-b-[3px] border-r-[3px] border-[#134E4A] rotate-45 z-0" />
        </motion.div>

        {/* Wadah Gambar Ilustrasi */}
        <img
          src={NGAJI_CERIA_ASSETS.victory}
          alt="Selamat Datang"
          // Mengubah h-20 w-20 menjadi w-56 h-56 (atau w-64 h-64 jika ingin lebih besar lagi)
          className="w-56 h-56 md:w-64 md:h-64 object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.15)] z-10"
        />
      </div>

      {/* FORM AREA */}
      <div className="flex-1 flex flex-col px-6 pb-10 mt-6 max-w-md w-full mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-display font-black text-xl text-[#134E4A]">
            Masuk ke Akunmu
          </h2>
          <p className="text-[11px] font-bold text-[#134E4A]/60 mt-1">
            Belajar membaca Iqro jadi lebih menyenangkan
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#FF6B6B]/10 border-2 border-[#FF6B6B] rounded-xl text-[#FF6B6B] text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Identifier (Email/Username) */}
          <div>
            <label className="block text-xs font-black text-[#134E4A] mb-1.5 ml-1">
              Email atau Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#134E4A]/40">
                <User size={18} />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Masukkan email atau username"
                className="w-full rounded-xl border-[3px] border-[#134E4A] bg-white pl-10 pr-4 py-3.5 text-sm font-bold text-[#134E4A] placeholder:text-[#134E4A]/40 focus:outline-none focus:border-[#0D9488] shadow-[3px_3px_0px_#134E4A] focus:shadow-[3px_3px_0px_#0D9488] transition-all"
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-xs font-black text-[#134E4A] mb-1.5 ml-1">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#134E4A]/40">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border-[3px] border-[#134E4A] bg-white pl-10 pr-12 py-3.5 text-sm font-bold text-[#134E4A] placeholder:text-[#134E4A]/40 focus:outline-none focus:border-[#0D9488] shadow-[3px_3px_0px_#134E4A] focus:shadow-[3px_3px_0px_#0D9488] transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#134E4A]/50 hover:text-[#134E4A]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                className="text-[10px] font-bold text-[#FF6B6B] hover:underline"
              >
                Lupa Kata Sandi?
              </button>
            </div>
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#0D9488] py-4 font-black text-sm text-white border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-70 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_#134E4A] mt-2 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Memuat...
              </>
            ) : (
              "Masuk"
            )}
          </button>
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

        {/* Tombol Google */}
        <button
          type="button"
          className="w-full rounded-xl bg-white py-3.5 font-black text-sm text-[#134E4A] border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Masuk dengan Google
        </button>

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
