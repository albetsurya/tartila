import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { TitoMascot } from "@/components/ui/TitoMascot";
import { SparklesSvg } from "@/components/ui/CustomIcons";
import { arenaApi } from "../../services/arenaApi";
import { useAuth } from "@/contexts/AuthContext";

export default function JoinRoomPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [pin, setPin] = useState(searchParams.get("pin") || "");
  const [nickname, setNickname] = useState(user?.name || user?.username || "");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim().replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      setErrorMsg("PIN harus berupa 6 angka unik.");
      return;
    }
    if (!nickname.trim()) {
      setErrorMsg("Nama panggilan wajib diisi.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await arenaApi.joinRoom(cleanPin, nickname.trim(), user?.id);
      // Simpan session peserta di sessionStorage
      sessionStorage.setItem("arena_player_id", res.playerId);
      sessionStorage.setItem("arena_player_name", res.nickname);
      sessionStorage.setItem("arena_room_pin", cleanPin);

      // Redirect ke layar kuis santri
      navigate(`/arena/play/${cleanPin}`);
    } catch (err: any) {
      setErrorMsg(err.message || "PIN tidak ditemukan atau kuis sudah dimulai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NgajiCeriaLayout title="Masuk Tartila Arena">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        {/* Maskot Tito Menyapa Santri */}
        <div className="flex flex-col items-center justify-center text-center">
          <TitoMascot
            size={100}
            mood="excited"
            animation="bounce"
            direction="front"
            speech="Ayo gabung kuis seru!"
          />
          <h1 className="mt-4 font-display text-3xl font-black text-[#134E4A]">
            Tartila Arena
          </h1>
          <p className="mt-1 text-xs font-bold text-[#134E4A]/70">
            Masukkan PIN 6-digit yang diberikan oleh Ustadz / Host kuis
          </p>
        </div>

        {/* Form Input PIN & Nama */}
        <div className="rounded-3xl border-[3px] border-[#134E4A] bg-white p-6 shadow-[5px_5px_0px_#134E4A]">
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#134E4A] mb-1.5 text-center">
                GAME PIN
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center font-display text-3xl tracking-widest font-black py-3 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] text-[#134E4A] shadow-[3px_3px_0px_#134E4A] focus:outline-none"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#134E4A] mb-1.5">
                Nama Panggilan
              </label>
              <input
                type="text"
                maxLength={20}
                placeholder="Contoh: Ahmad / Aisyah"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full py-3 px-4 rounded-xl border-2 border-[#134E4A] font-black text-sm text-[#134E4A] shadow-[2px_2px_0px_#134E4A] focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl border-2 border-[#134E4A] bg-rose-100 text-rose-800 text-xs font-black shadow-[2px_2px_0px_#134E4A]">
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || pin.length !== 6 || !nickname.trim()}
              className="w-full py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-lg shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[1px_1px_0px_#134E4A] transition-all disabled:opacity-50"
            >
              {loading ? "Memeriksa Room..." : "Masuk Kuis 🎮"}
            </button>
          </form>
        </div>

        {/* Link untuk Ustadz / Buat Room */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => navigate("/arena/host/create")}
            className="text-xs font-black text-[#0D9488] hover:underline inline-flex items-center gap-1"
          >
            <SparklesSvg size={14} /> Anda seorang Ustadz? Buka Room Kuis Baru
          </button>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
