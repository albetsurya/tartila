import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { arenaRoomService } from "@/services/arenaRoomService";
import { normalizeJoinCode } from "@/lib/joinCode";

interface ArenaJoinPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal Gabung PIN: input kode 6 digit, cek room via getRoom, lalu langsung
 * masuk lobi tanpa membuat tabel room. Error ditampilkan di dalam modal.
 */
export function ArenaJoinPinModal({ isOpen, onClose }: ArenaJoinPinModalProps) {
  const navigate = useNavigate();
  const [pinInput, setPinInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    const pin = normalizeJoinCode(pinInput.trim());
    if (!pin) {
      setErrorMsg("Masukkan kode PIN 6 digit.");
      return;
    }
    setJoining(true);
    setErrorMsg("");
    try {
      const room = await arenaRoomService.getRoom(pin);
      if (!room) {
        setErrorMsg("Room tidak ditemukan. Periksa kembali kode PIN.");
        return;
      }
      onClose();
      navigate(`/arena/lobby/${pin}`);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? `Gagal mencari room: ${err.message}`
          : "Gagal mencari room.",
      );
    } finally {
      setJoining(false);
    }
  };

  return (
    <AppBottomSheet
      isOpen={isOpen}
      onClose={() => {
        setErrorMsg("");
        setPinInput("");
        onClose();
      }}
      title="Gabung Room"
    >
      <div className="pb-2 space-y-4">
        <p className="text-sm font-bold text-[#134E4A]/80">
          Masukkan kode PIN dari temanmu.
        </p>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={6}
          value={pinInput}
          onChange={(e) => {
            setPinInput(e.target.value.replace(/[^0-9a-zA-Z]/g, "").toUpperCase());
            setErrorMsg("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleJoin();
          }}
          placeholder="6 digit kode PIN"
          className="w-full rounded-xl border-[3px] border-[#134E4A] bg-white px-4 py-3 text-center font-display text-2xl font-black tracking-[0.35em] text-[#134E4A] placeholder:font-bold placeholder:text-[#134E4A]/25 placeholder:tracking-widest focus:outline-none focus:bg-[#F0FDF4] cursor-text"
        />
        {errorMsg && (
          <p className="text-xs font-black text-[#B91C1C] text-center" role="alert">
            {errorMsg}
          </p>
        )}
        <button
          type="button"
          onClick={() => void handleJoin()}
          disabled={joining || pinInput.trim().length === 0}
          className="w-full py-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] hover:bg-[#0F766E] disabled:bg-gray-300 disabled:text-[#134E4A]/50 text-white font-display font-black text-sm shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all disabled:shadow-none disabled:active:translate-y-0 cursor-pointer"
        >
          {joining ? "Mencari room..." : "Gabung"}
        </button>
      </div>
    </AppBottomSheet>
  );
}
