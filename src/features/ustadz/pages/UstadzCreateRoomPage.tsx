import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { StickerButton } from "@/components/ui/StickerButton";
import { InputField } from "@/components/ui/InputField";
import { Check } from "@/components/ui/CustomIcons";
import { createClassroom } from "@/services/classroomService";
import { setRoomFocusMateri } from "@/services/ustadzMonitoringService";
import {
  MATERI_LABELS,
  ALL_MATERI_POKOK,
  type MateriPokok,
} from "@/data/learningCatalog";

const JILID_OPTIONS = [1, 2, 3, 4, 5] as const;

const GROUPED_MATERI: { label: string; keys: MateriPokok[] }[] = [
  {
    label: "Dasar & Bacaan Tilawati",
    keys: ["tilawati", "hijaiyah", "harakat", "makhraj", "tulisan"],
  },
  {
    label: "Ilmu Tajwid & Lanjutan",
    keys: ["tajwid", "mad", "waqaf", "gharib"],
  },
  {
    label: "Hafalan & Juz 'Amma",
    keys: ["hafalan", "juz-amma"],
  },
  {
    label: "Amalan & Ibadah (Jelajah)",
    keys: ["doa", "ibadah", "adab", "kisah-islami"],
  },
];

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
    name.trim().length >= 3 && (!usePassword || password.length >= 4);

  const toggleMateri = (materi: MateriPokok) => {
    setFocusMateri((prev) =>
      prev.includes(materi)
        ? prev.filter((m) => m !== materi)
        : [...prev, materi],
    );
  };

  const handleToggleAllMateri = () => {
    if (focusMateri.length === ALL_MATERI_POKOK.length) {
      setFocusMateri([]);
    } else {
      setFocusMateri([...ALL_MATERI_POKOK]);
    }
  };

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

  const isAllSelected = focusMateri.length === ALL_MATERI_POKOK.length;

  return (
    <div className="w-full max-w-2xl mx-auto py-2 sm:py-4">
      {/* Compact Page Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold text-[#134E4A] tracking-tight leading-tight">
            Buat Kelas Baru
          </h1>
          <p className="text-[13px] font-medium text-[#64748B] mt-0.5">
            Atur identitas kelas, target jilid, dan cakupan materi santri.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center h-7 px-2.5 rounded-full bg-[#CCFBF1] text-[#0F766E] border border-[#134E4A]/15 text-[11.5px] font-semibold shrink-0">
          Maks. 10 Santri
        </span>
      </div>

      {/* Main Form Card — Professional Neo-Brutalism */}
      <div className="bg-white rounded-2xl border-[1.5px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-[#DCE5E3]">
          {/* SECTION 1: Informasi Dasar */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* Garis Judul Section 1 (Teal) */}
            <div className="mb-2 border-b-[3px] border-[#0D9488] pb-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#134E4A]">
                Informasi Kelas
              </h2>
            </div>

            <InputField
              label="Nama Kelas"
              placeholder="Contoh: Tilawati Jilid 2 — Kelompok Sore"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              required
              helperText="Minimal 3 karakter."
              className="bg-[#F8FAFC]"
            />

            <InputField
              label="Deskripsi Singkat (Opsional)"
              placeholder="Contoh: Senin & Kamis pukul 16.00 WIB, fokus kelancaran makhraj"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={240}
              className="bg-[#F8FAFC]"
            />
          </div>

          {/* SECTION 2: Target Jilid & Fokus Materi */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* Garis Judul Section 2 (Amber/Kuning) */}
            <div className="mb-2 border-b-[3px] border-[#F59E0B] pb-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#134E4A]">
                Kurikulum & Target
              </h2>
            </div>

            {/* Target Jilid Segmented Pill */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-semibold text-[#183B38]">
                  Target Jilid Tilawati
                </label>
                <span className="text-[11.5px] font-semibold text-[#0D9488]">
                  Jilid {targetJilid} dipilih
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-[#F1F5F9] border border-[#DCE5E3]">
                {JILID_OPTIONS.map((jilid) => {
                  const isSelected = targetJilid === jilid;
                  return (
                    <button
                      key={jilid}
                      type="button"
                      onClick={() => setTargetJilid(jilid)}
                      className={`h-9 rounded-lg text-[13px] font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                        isSelected
                          ? "bg-[#0D9488] text-white border-[1.5px] border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]"
                          : "bg-transparent text-[#475569] hover:bg-white hover:text-[#183B38]"
                      }`}
                    >
                      Jilid {jilid}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fokus Materi — Grouped by Category */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 mt-4">
                <div className="flex items-center gap-2">
                  <label className="text-[13px] font-semibold text-[#183B38]">
                    Fokus Materi
                  </label>
                  <span
                    className={`inline-flex items-center h-5 px-2 rounded-full text-[11px] font-bold ${
                      focusMateri.length > 0
                        ? "bg-[#CCFBF1] text-[#0F766E]"
                        : "bg-[#F1F5F9] text-[#64748B]"
                    }`}
                  >
                    {focusMateri.length > 0
                      ? `${focusMateri.length} dipilih`
                      : "Opsional"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleAllMateri}
                  className="text-[12px] font-semibold text-[#0D9488] hover:text-[#134E4A] transition-colors"
                >
                  {isAllSelected ? "Reset Pilihan" : "Pilih Semua"}
                </button>
              </div>

              {/* Render per Grup */}
              <div className="rounded-xl border border-[#DCE5E3] bg-[#F8FAFC] p-3.5 space-y-5">
                {GROUPED_MATERI.map((group) => (
                  <div key={group.label}>
                    {/* Label Grup dengan Gaya Sticker Neo-Brutalism */}
                    <div className="mb-2.5">
                      <span className="inline-flex items-center rounded-md border-[1.5px] border-[#134E4A] bg-[#FEF08A] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                        {group.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {group.keys.map((materi) => {
                        const active = focusMateri.includes(materi);
                        return (
                          <button
                            key={materi}
                            type="button"
                            onClick={() => toggleMateri(materi)}
                            aria-pressed={active}
                            className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[12px] font-semibold transition-all select-none ${
                              active
                                ? "bg-[#CCFBF1] text-[#134E4A] border-[1.5px] border-[#134E4A] shadow-[1px_1px_0px_#134E4A]"
                                : "bg-white text-[#475569] border border-[#DCE5E3] hover:border-[#0D9488] hover:text-[#183B38]"
                            }`}
                          >
                            <span
                              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                                active
                                  ? "border-[#134E4A] bg-[#0D9488] text-white"
                                  : "border-[#CBD5E1] bg-[#F8FAFC]"
                              }`}
                            >
                              {active && (
                                <Check
                                  size={9}
                                  className="text-white"
                                  strokeWidth={4}
                                />
                              )}
                            </span>
                            <span className="leading-none">
                              {MATERI_LABELS[materi]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11.5px] text-[#64748B] mt-2">
                Pilih topik prioritas. Materi yang dipilih akan muncul di
                laporan pemantauan kelas Anda.
              </p>
            </div>
          </div>

          {/* SECTION 3: Keamanan Akses */}
          <div className="p-4 sm:p-5 space-y-3">
            {/* Garis Judul Section 3 (Merah) */}
            <div className="mb-2 border-b-[3px] border-[#EF4444] pb-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#134E4A]">
                Keamanan Akses
              </h2>
            </div>

            <div
              className={`rounded-xl border transition-colors ${
                usePassword
                  ? "border-[#134E4A] bg-[#F8FAFC]"
                  : "border-[#DCE5E3] bg-[#F8FAFC]/60"
              }`}
            >
              <div className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#183B38]">
                    Kunci Kelas dengan Kata Sandi
                  </p>
                  <p className="text-[11.5px] text-[#64748B]">
                    Santri wajib memasukkan sandi saat bergabung ke kelas ini.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={usePassword}
                  onClick={() => setUsePassword((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-[1.5px] border-[#134E4A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    usePassword ? "bg-[#0D9488]" : "bg-[#CBD5E1]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full border border-[#134E4A] bg-white transition duration-150 mt-0.5 ml-0.5 ${
                      usePassword ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {usePassword && (
                <div className="px-3 pb-3 pt-1 border-t border-[#DCE5E3]">
                  <InputField
                    type="password"
                    placeholder="Masukkan kata sandi kelas (min. 4 karakter)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-[#B91C1C] bg-[#FEE2E2] px-3.5 py-2.5 text-[12.5px] font-semibold text-[#B91C1C]">
                {error}
              </div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="px-4 py-3.5 sm:px-5 bg-[#F8FAFC] flex items-center justify-end gap-2.5">
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
              Buat Kelas
            </StickerButton>
          </div>
        </form>
      </div>
    </div>
  );
}
