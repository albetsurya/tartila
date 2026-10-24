import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { InputField } from "@/components/ui/InputField";
import { Users } from "@/components/ui/CustomIcons";
import { createClassroom } from "@/services/classroomService";
import { setRoomFocusMateri } from "@/services/ustadzMonitoringService";
import {
  MATERI_LABELS,
  ALL_MATERI_POKOK,
  type MateriPokok,
} from "@/data/learningCatalog";

const JILID_OPTIONS = [1, 2, 3, 4, 5] as const;

export function UstadzCreateRoomPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetJilid, setTargetJilid] = useState<number>(1);
  const [focusMateri, setFocusMateri] = useState<MateriPokok[]>([]);
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    name.trim().length >= 3 &&
    (!usePassword || password.length >= 4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // TODO(backend): batas jumlah kelas per langganan juga harus divalidasi
    // oleh RLS/policy di Supabase, bukan hanya di klien.
    setSubmitting(true);
    const result = await createClassroom({
      ustadzId: user?.id ?? "",
      name,
      description: description.trim() ? description.trim() : null,
      targetJilid,
      password: usePassword ? password : null,
      maxParticipants: 10,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    await setRoomFocusMateri(result.data.id, focusMateri);
    navigate(`/ustadz/kelas/${result.data.id}`);
  };

  return (
    <>
      <div className="w-full max-w-3xl">
        <StickerCard className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="ustadz-accent-soft flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                <Users size={20} />
              </span>
              <p className="text-sm font-bold text-[#134E4A]">
                Sedang menyiapkan kelas{" "}
                <span className="font-black">barunya</span>?
              </p>
            </div>

            <InputField
              label="Nama Kelas"
              placeholder="mis. Kelas Tahfidz Kelompok A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
            />

            <InputField
              label="Deskripsi (opsional)"
              placeholder="Tentang kelas ini…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={240}
            />

            <div>
              <p className="mb-1.5 text-xs font-black text-[#134E4A]">
                Target Jilid
              </p>
              <div className="flex gap-2">
                {JILID_OPTIONS.map((jilid) => (
                  <button
                    key={jilid}
                    type="button"
                    onClick={() => setTargetJilid(jilid)}
                    className={`h-10 w-10 rounded-xl border-[3px] text-sm font-black transition-colors ${
                      targetJilid === jilid
                        ? "border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                        : "border-[#134E4A] bg-white text-[#134E4A] hover:bg-[#F0FDF4]"
                    }`}
                  >
                    {jilid}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black text-[#134E4A]">
                Fokus Materi (opsional)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_MATERI_POKOK.map((materi) => {
                  const active = focusMateri.includes(materi);
                  return (
                    <button
                      key={materi}
                      type="button"
                      onClick={() =>
                        setFocusMateri((prev) =>
                          prev.includes(materi)
                            ? prev.filter((m) => m !== materi)
                            : [...prev, materi],
                        )
                      }
                      className={`rounded-xl border-[3px] px-2 py-1 text-[10px] font-black transition-colors ${
                        active
                          ? "border-[#134E4A] bg-[#0D9488] text-white"
                          : "border-[#134E4A] bg-white text-[#134E4A] hover:bg-[#F0FDF4]"
                      }`}
                    >
                      {MATERI_LABELS[materi]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-[#134E4A]">
                Lindungi dengan password
              </p>
              <button
                type="button"
                role="switch"
                aria-checked={usePassword}
                onClick={() => setUsePassword((prev) => !prev)}
                className={`relative h-6 w-11 rounded-full border-[3px] border-[#134E4A] transition-colors ${
                  usePassword ? "bg-[#0D9488]" : "bg-white"
                }`}
              >
                <span
                  className={`absolute top-0 h-full w-4 rounded-full bg-white transition-all ${
                    usePassword ? "left-full -translate-x-full" : "left-0"
                  }`}
                />
              </button>
            </div>

            {usePassword && (
              <InputField
                label="Password Kelas"
                type="password"
                placeholder="min. 4 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}

            {error && (
              <p className="text-xs font-bold text-[#FF6B6B]">{error}</p>
            )}

            <StickerButton
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={!canSubmit}
              fullWidth
            >
              Buat Kelas
            </StickerButton>
          </form>
        </StickerCard>
      </div>
    </>
  );
}
