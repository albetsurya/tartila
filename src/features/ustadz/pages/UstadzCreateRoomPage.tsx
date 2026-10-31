import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { InputField } from "@/components/ui/InputField";
import { ArrowLeft, Users, Lock, BookOpen, Check } from "@/components/ui/CustomIcons";
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

    setSubmitting(true);
    const result = await createClassroom({
      ustadzId: user?.id ?? "",
      name: name.trim(),
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
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Back button & Title header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/ustadz/kelas")}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition hover:bg-[#F8FAFC] active:scale-95"
          aria-label="Kembali ke Daftar Kelas"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#134E4A] tracking-tight">
            Buat Kelas Baru
          </h1>
          <p className="text-xs font-semibold text-[#183B38]/70">
            Siapkan ruang belajar interaktif untuk santri Anda
          </p>
        </div>
      </div>

      <StickerCard variant="elevated" className="p-6 md:p-7">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Info Dasar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-dashed border-[#134E4A]/20">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-[#CCFBF1] text-[#0D9488] shadow-[1px_1px_0px_#134E4A]">
                <Users size={16} />
              </span>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#183B38]">
                Informasi Kelas
              </h2>
            </div>

            <InputField
              label="Nama Kelas"
              placeholder="Contoh: Kelas Tilawati Jilid 2 (Kelompok A)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              required
              helperText="Minimal 3 karakter untuk nama kelas yang mudah dikenali."
            />

            <InputField
              label="Deskripsi (Opsional)"
              placeholder="Contoh: Pembelajaran tajwid dan makhorijul huruf setiap sore..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={240}
              helperText="Deskripsi singkat tentang jadwal atau fokus belajar kelas ini."
            />
          </div>

          {/* Section: Kurikulum & Target */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-dashed border-[#134E4A]/20">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] text-[#713F12] shadow-[1px_1px_0px_#134E4A]">
                <BookOpen size={16} />
              </span>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#183B38]">
                Kurikulum & Target
              </h2>
            </div>

            {/* Target Jilid selector */}
            <div>
              <label className="block text-xs font-bold text-[#183B38] mb-1.5">
                Target Jilid
              </label>
              <div className="flex flex-wrap gap-2.5">
                {JILID_OPTIONS.map((jilid) => {
                  const isSelected = targetJilid === jilid;
                  return (
                    <button
                      key={jilid}
                      type="button"
                      onClick={() => setTargetJilid(jilid)}
                      className={`h-11 w-12 rounded-xl border-2 text-sm font-black transition-all ${
                        isSelected
                          ? "border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                          : "border-[#134E4A] bg-white text-[#183B38] hover:bg-[#FEF08A]"
                      }`}
                    >
                      J.{jilid}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[11px] text-[#64748B]">
                Menentukan materi rekomendasi yang disesuaikan untuk level santri.
              </p>
            </div>

            {/* Fokus Materi selector */}
            <div>
              <label className="block text-xs font-bold text-[#183B38] mb-1.5">
                Fokus Materi (Opsional)
              </label>
              <div className="flex flex-wrap gap-2">
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
                      className={`inline-flex items-center rounded-lg border-2 px-3 py-1.5 text-xs font-black transition-all ${
                        active
                          ? "border-[#134E4A] bg-[#134E4A] text-white shadow-[1.5px_1.5px_0px_#0D9488]"
                          : "border-[#134E4A] bg-white text-[#134E4A] hover:bg-[#FEF08A]"
                      }`}
                    >
                      {active && <Check size={12} className="inline mr-1" />}
                      {MATERI_LABELS[materi]}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[11px] text-[#64748B]">
                Pilih topik yang menjadi prioritas evaluasi di kelas ini.
              </p>
            </div>
          </div>

          {/* Section: Keamanan & Akses */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-dashed border-[#134E4A]/20">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-[#FEF3C7] text-[#B45309] shadow-[1px_1px_0px_#134E4A]">
                <Lock size={16} />
              </span>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#183B38]">
                Akses & Keamanan
              </h2>
            </div>

            <div className="flex items-center justify-between rounded-xl border-2 border-[#134E4A] p-4 bg-[#FDFBF7] shadow-[2px_2px_0px_#134E4A]">
              <div>
                <p className="text-xs font-bold text-[#183B38]">
                  Lindungi dengan Kata Sandi
                </p>
                <p className="text-[11px] text-[#64748B]">
                  Hanya santri dengan kata sandi yang bisa bergabung ke kelas ini
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={usePassword}
                onClick={() => setUsePassword((prev) => !prev)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-[#134E4A] shadow-[2px_2px_0_#134E4A] transition-colors duration-200 ease-in-out focus:outline-none ${
                  usePassword ? "bg-[#0D9488]" : "bg-[#CBD5E1]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full border-2 border-[#134E4A] bg-white transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                    usePassword ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {usePassword && (
              <InputField
                label="Kata Sandi Kelas"
                type="password"
                placeholder="Minimal 4 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Berikan kata sandi ini bersama dengan kode join kepada santri."
              />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-xs font-bold text-[#991B1B]">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <StickerButton
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate("/ustadz/kelas")}
            >
              Batal
            </StickerButton>
            <StickerButton
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
              disabled={!canSubmit}
            >
              Buat Kelas Sekarang
            </StickerButton>
          </div>
        </form>
      </StickerCard>
    </div>
  );
}
