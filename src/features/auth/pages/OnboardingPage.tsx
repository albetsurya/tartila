import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/services/userApi";
import { useEconomyStore, type TilaGender } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import { TitoMascot, TilaMascot } from "@/components/ui";
import { MASCOT_BOY_NAME, MASCOT_GIRL_NAME } from "@/constants/mascot";
import { Avatar } from "@/components/ui/Avatar";

function stepLabel(index: number, total: number): string {
  return `Langkah ${index} dari ${total}`;
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setIsNewUser } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedGender, setSelectedGender] = useState<TilaGender>("boy");
  const [avatarWithAccessories, setAvatarWithAccessories] = useState(true);

  // User wajib login sebelum masuk onboarding
  if (user === null) {
    navigate("/member/ngaji-ceria", { replace: true });
    return null;
  }

  const handleMaskotSelect = (gender: TilaGender) => {
    setSelectedGender(gender);
  };

  const handleAvatarSelect = (withAccessories: boolean) => {
    setAvatarWithAccessories(withAccessories);
  };

  const handleSave = async () => {
    try {
      await userApi.updateUserMascot(selectedGender);
      useEconomyStore.getState().setTilaGender(selectedGender);
      useEconomyStore.getState().setAvatarMode(
        avatarWithAccessories ? "avatar" : "photo",
      );
      useEconomyStore.getState().setEquippedAvatarAccessory(
        avatarWithAccessories ? "peci" : null,
      );
      setIsNewUser(false);
      navigate("/member/ngaji-ceria", { replace: true });
    } catch (error) {
      // Simpan state lokal, lanjutkan ke beranda. Backend bisa dipaksakan
      // nanti dari halaman profil.
      console.error("Gagal menyimpan pilihan onboarding:", error);
      setIsNewUser(false);
      navigate("/member/ngaji-ceria", { replace: true });
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F0FDF4] flex items-center justify-center p-4"
      dir="ltr"
    >
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-black text-[#134E4A]">
            Pilih Panduan Belajarmu
          </h1>
          <p className="text-xs font-bold text-[#134e4a]/60">
            {step === 1
              ? "Tentukan maskot sesuai jenis kelamin kamu."
              : "Pilih avatar santri, dengan atau tanpa aksesoris."}
          </p>
        </div>

        <div className="max-w-sm w-full mx-auto space-y-6">
          {step === 1 ? (
            <>
              {/* Langkah 1: Pilih Maskot */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#134e4a]">
                    {stepLabel(1, 2)}
                  </span>
                  <span className="text-[10px] font-bold text-[#134e4a]/60">
                    Pilih maskot sesuai gender kamu
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleMaskotSelect("boy")}
                    className={`p-3 rounded-2xl border-[3px] border-[#134E4A] font-black text-xs transition-all flex flex-col items-center gap-2 shadow-[4px_4px_0px_#134E4A] ${
                      selectedGender === "boy"
                        ? "bg-white"
                        : "bg-white/60"
                    }`}
                  >
                    <TitoMascot
                      size={96}
                      direction="front"
                      gender={selectedGender === "boy" ? "boy" : "girl"}
                      accessory={selectedGender === "boy" ? "peci" : "hairbow"}
                    />
                    <span className="text-xs font-black text-[#134e4a]">
                      {MASCOT_BOY_NAME} (Putra)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMaskotSelect("girl")}
                    className={`p-3 rounded-2xl border-[3px] border-[#134E4A] font-black text-xs transition-all flex flex-col items-center gap-2 shadow-[4px_4px_0px_#134E4A] ${
                      selectedGender === "girl"
                        ? "bg-white"
                        : "bg-white/60"
                    }`}
                  >
                    <TilaMascot
                      size={96}
                      direction="front"
                      gender={selectedGender === "girl" ? "girl" : "boy"}
                      accessory={selectedGender === "girl" ? "hairbow" : "peci"}
                    />
                    <span className="text-xs font-black text-[#134e4a]">
                      {MASCOT_GIRL_NAME} (Putri)
                    </span>
                  </button>
                </div>
              </div>

              {/* Langkah 2: Pilih Avatar */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#134e4a]">
                    {stepLabel(2, 2)}
                  </span>
                  <span className="text-[10px] font-bold text-[#134e4a]/60">
                    Pilih tampilan avatar santri
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleAvatarSelect(true)}
                    className={`p-3 rounded-2xl border-[3px] border-[#134E4A] font-black text-xs transition-all flex flex-col items-center gap-2 shadow-[4px_4px_0px_#134E4A] ${
                      avatarWithAccessories
                        ? "bg-white"
                        : "bg-white/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#134e4a]">
                        + Aksesoris
                      </span>
                      <Avatar name="Santri" size={22} />
                    </div>
                    <span className="text-[10px] font-bold text-[#134e4a]">
                      Peci &amp; kancing
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAvatarSelect(false)}
                    className={`p-3 rounded-2xl border-[3px] border-[#134E4A] font-black text-xs transition-all flex flex-col items-center gap-2 shadow-[4px_4px_0px_#134E4A] ${
                      !avatarWithAccessories
                        ? "bg-white"
                        : "bg-white/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#134e4a]">
                        Tanpa aksesoris
                      </span>
                      <Avatar name="Santri" size={22} />
                    </div>
                    <span className="text-[10px] font-bold text-[#134e4a]">
                      Topi &amp; kartu
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#134e4a]">
                  {stepLabel(2, 2)}
                </span>
                <span className="text-[10px] font-bold text-[#134e4a]/60">
                  Berapa banyak aksesoris yang akan dibawa?
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAvatarSelect(true)}
                  className={`p-3 rounded-2xl border-[3px] border-[#134E4A] font-black text-xs transition-all flex flex-col items-center gap-2 shadow-[4px_4px_0px_#134E4A] ${
                    avatarWithAccessories
                      ? "bg-white"
                      : "bg-white/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#134e4a]">
                      + Aksesoris
                    </span>
                    <Avatar name="Santri" size={22} />
                  </div>
                  <span className="text-[10px] font-bold text-[#134e4a]">
                    Peci &amp; kancing
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAvatarSelect(false)}
                  className={`p-3 rounded-2xl border-[3px] border-[#134E4A] font-black text-xs transition-all flex flex-col items-center gap-2 shadow-[4px_4px_0px_#134E4A] ${
                    !avatarWithAccessories
                      ? "bg-white"
                      : "bg-white/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#134e4a]">
                      Tanpa aksesoris
                    </span>
                    <Avatar name="Santri" size={22} />
                  </div>
                  <span className="text-[10px] font-bold text-[#134e4a]">
                    Topi &amp; kartu
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-2xl border-[3px] border-[#134E4A] font-black text-sm transition-all shadow-[4px_4px_0px_#134E4A]"
              >
                Lanjut
              </button>
            )}
            {step === 2 && (
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-3 rounded-2xl border-[3px] border-[#134E4A] font-black text-sm transition-all shadow-[4px_4px_0px_#134E4A] bg-[#134E4A] text-white"
              >
                Mulai Belajar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
