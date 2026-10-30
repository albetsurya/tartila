/**
 * Pre-match setup multiplayer: nama tampilan (maks 12 karakter) dan avatar.
 * Pilihan disimpan di localStorage `tartila-multiplayer-profile` dan dipakai
 * RoomLobbyPage / DuelLobbyPage pada papan skor.
 */
import { useState } from "react";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { StickerButton } from "@/components/ui/StickerButton";
import { AvatarSantriSvg } from "@/components/ui/Illustrations";
import { RocketSvg, UserSvg } from "@/components/ui/CustomIcons";

export const MULTIPLAYER_PROFILE_KEY = "tartila-multiplayer-profile";

export interface MultiplayerProfile {
  displayName: string;
  avatarId: string;
}

export interface AvatarOption {
  id: string;
  gender: "boy" | "girl";
  accessory: string;
}

export const AVATAR_OPTIONS: readonly AvatarOption[] = [
  { id: "boy-peci", gender: "boy", accessory: "peci" },
  { id: "boy-glasses", gender: "boy", accessory: "glasses" },
  { id: "boy-turban", gender: "boy", accessory: "turban" },
  { id: "girl-hairbow", gender: "girl", accessory: "hairbow" },
  { id: "girl-flowercrown", gender: "girl", accessory: "flowercrown" },
  { id: "girl-scarf", gender: "girl", accessory: "scarf" },
];

export function getAvatarOption(avatarId: string): AvatarOption {
  return (
    AVATAR_OPTIONS.find((option) => option.id === avatarId) ?? AVATAR_OPTIONS[0]
  );
}

/** Avatar SVG sesuai profil tersimpan; fallback opsi pertama. */
export function MultiplayerAvatar({
  avatarId,
  size = 48,
}: {
  avatarId: string;
  size?: number;
}) {
  const option = getAvatarOption(avatarId);
  return (
    <AvatarSantriSvg
      gender={option.gender}
      accessory={option.accessory}
      mood="happy"
      size={size}
    />
  );
}

export function loadMultiplayerProfile(): MultiplayerProfile | null {
  try {
    const raw = localStorage.getItem(MULTIPLAYER_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MultiplayerProfile>;
    if (
      typeof parsed?.displayName !== "string" ||
      parsed.displayName.trim().length === 0 ||
      typeof parsed?.avatarId !== "string" ||
      parsed.avatarId.length === 0
    ) {
      return null;
    }
    return {
      displayName: parsed.displayName.trim(),
      avatarId: parsed.avatarId,
    };
  } catch {
    return null;
  }
}

export function saveMultiplayerProfile(profile: MultiplayerProfile): void {
  try {
    localStorage.setItem(MULTIPLAYER_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage tidak tersedia; game tetap jalan tanpa profil tersimpan.
  }
}

export interface MultiplayerSetupSheetProps {
  isOpen: boolean;
  /** Nama awal, biasanya nama user yang sedang login. */
  defaultName?: string;
  onSave: (profile: MultiplayerProfile) => void;
  onClose?: () => void;
}

export function MultiplayerSetupSheet({
  isOpen,
  defaultName,
  onSave,
  onClose,
}: MultiplayerSetupSheetProps) {
  // State lokal di-isolasi sepenuhnya dari parent render
  const [name, setName] = useState(() => (defaultName ?? "").slice(0, 12));
  const [avatarId, setAvatarId] = useState(() => getAvatarOption("").id);

  const trimmed = name.trim();
  const canContinue = trimmed.length > 0;

  const handleSave = () => {
    if (!canContinue) return;
    const profile = { displayName: trimmed, avatarId };
    saveMultiplayerProfile(profile);
    onSave(profile);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      // Fallback jika parent tidak menyediakan onClose:
      // Simpan profil default / saat ini agar sheet tertutup dan tidak stuck
      const fallbackName = trimmed.length > 0 ? trimmed : (defaultName || "Santri").slice(0, 12);
      const profile = { displayName: fallbackName, avatarId };
      saveMultiplayerProfile(profile);
      onSave(profile);
    }
  };

  return (
    <AppBottomSheet isOpen={isOpen} onClose={handleClose} title="Profil Multiplayer">
      <div className="pb-2">
        <p className="text-sm font-bold text-[#134E4A]/80">
          Kenalkan dirimu ke teman sepermainan!
        </p>

        {/* Nama Tampilan */}
        <label
          htmlFor="mp-display-name"
          className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-[#134E4A]/70"
        >
          <UserSvg size={14} /> Nama Tampilan
        </label>
        <input
          id="mp-display-name"
          type="text"
          maxLength={12}
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 12))}
          placeholder="Maks 12 karakter"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="mt-1.5 w-full rounded-xl border-[3px] border-[#134E4A] bg-white px-4 py-3 font-display text-base font-black text-[#134E4A] placeholder:font-bold placeholder:text-[#134E4A]/30 focus:outline-none focus:bg-[#F0FDF4] cursor-text"
        />
        <p className="mt-1 text-right text-[10px] font-bold text-[#134E4A]/50">
          {name.length}/12
        </p>

        {/* Grid Avatar */}
        <p className="mt-3 text-[10px] font-black uppercase tracking-wide text-[#134E4A]/70">
          Pilih Avatar
        </p>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {AVATAR_OPTIONS.map((option) => {
            const selected = option.id === avatarId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setAvatarId(option.id)}
                aria-pressed={selected}
                className={`flex h-24 items-center justify-center rounded-2xl border-[3px] transition-all cursor-pointer active:translate-y-[2px] ${
                  selected
                    ? "border-[#0D9488] bg-[#CCFBF1] shadow-[4px_4px_0px_#0D9488]"
                    : "border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A] hover:bg-[#F0FDF4]"
                }`}
              >
                <AvatarSantriSvg
                  gender={option.gender}
                  accessory={option.accessory}
                  mood="happy"
                  size={68}
                />
              </button>
            );
          })}
        </div>

        {/* Lanjut ke Lobby */}
        <div className="mt-5">
          <StickerButton
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canContinue}
            onClick={handleSave}
          >
            <span className="flex items-center justify-center gap-2">
              <RocketSvg size={18} /> Lanjut ke Lobby
            </span>
          </StickerButton>
        </div>
      </div>
    </AppBottomSheet>
  );
}

export default MultiplayerSetupSheet;
