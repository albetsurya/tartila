import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { InputField } from "@/components/ui/InputField";
import { ArrowLeft, Plus, Trash2, HelpCircle, Sparkles, BookOpen } from "@/components/ui/CustomIcons";
import { useAuth } from "@/contexts/AuthContext";
import {
  ALL_MATERI_POKOK,
  MATERI_LABELS,
  type JilidNumber,
  type MateriPokok,
} from "@/data/learningCatalog";
import {
  createQuiz,
  validateQuizDraft,
  type QuizDraft,
} from "@/services/quizBankService";
import {
  listOwnedClassrooms,
  type ClassroomRoom,
} from "@/services/classroomService";

interface QuestionForm {
  prompt: string;
  options: [string, string, string, string];
  answerIndex: number;
}

const JILID_OPTIONS: JilidNumber[] = [1, 2, 3, 4, 5];

export function UstadzQuizCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMember = location.pathname.startsWith("/member/ngaji-ceria");
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ClassroomRoom[]>([]);
  const [title, setTitle] = useState("");
  const [materi, setMateri] = useState<MateriPokok>("hijaiyah");
  const [targetJilid, setTargetJilid] = useState<JilidNumber | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { prompt: "", options: ["", "", "", ""], answerIndex: 0 },
  ]);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const owned = await listOwnedClassrooms(user?.id);
      if (owned.ok) setRooms(owned.data);
    };
    void load();
  }, [user?.id]);

  const updateQuestion = (
    index: number,
    field: "prompt" | "options",
    value: string | string[],
  ) => {
    setQuestions((prev) => {
      const next = [...prev];
      const current = { ...next[index] };
      if (field === "prompt") current.prompt = value as string;
      else current.options = [...(value as string[])] as [string, string, string, string];
      next[index] = current;
      return next;
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { prompt: "", options: ["", "", "", ""], answerIndex: 0 },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const draft = (): QuizDraft => ({
    title: title.trim(),
    materi,
    targetJilid,
    roomId: roomId === "" ? null : roomId,
    questions: questions.map((q) => ({
      prompt: q.prompt,
      options: q.options,
      answerIndex: q.answerIndex,
    })),
  });

  const handleSave = async () => {
    const validation = validateQuizDraft(draft());
    if (validation.length > 0) {
      setErrors(validation);
      return;
    }
    setErrors([]);
    setSaving(true);
    const result = await createQuiz(draft(), user?.id ?? "anon");
    setSaving(false);
    if (result.ok) {
      if (isMember) {
        navigate("/arena/create", { state: { selectedCustomQuizId: result.quiz?.id } });
      } else {
        navigate("/ustadz/kuis");
      }
    } else {
      setErrors(result.errors);
    }
  };

  return (
    <div className={isMember ? "min-h-screen bg-[#F8FAFC] p-4 md:p-6" : ""}>
      <div className="w-full max-w-3xl mx-auto space-y-5">
        {/* Header navigation */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              isMember ? navigate("/arena/create") : navigate("/ustadz/kuis")
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition hover:bg-[#F8FAFC] active:scale-95"
            aria-label="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#134E4A] tracking-tight">
              {isMember ? "Buat Kuis Arena" : "Buat Kuis Baru"}
            </h1>
            <p className="text-xs font-semibold text-[#183B38]/70">
              {isMember
                ? "Buat tebak-tebakan seru untuk dimainkan bersama teman di Tartila Arena"
                : "Rancang instrumen evaluasi materi untuk santri Anda"}
            </p>
          </div>
        </div>

        {/* Section 1: Informasi Kuis */}
        <StickerCard variant="elevated" className="p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-dashed border-[#134E4A]/20">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-[#CCFBF1] text-[#0D9488] shadow-[1px_1px_0px_#134E4A]">
              <BookOpen size={16} />
            </span>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#183B38]">
              Pengaturan Dasar Kuis
            </h2>
          </div>

          <InputField
            label="Judul Kuis"
            placeholder="Contoh: Pengenalan Huruf Hijaiyah Berharakat Fathah"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            helperText="Judul kuis yang jelas memudahkan santri memahami materi yang diuji."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#183B38] mb-1.5">
                Kategori Materi
              </label>
              <select
                className="w-full h-11 rounded-xl border-2 border-[#134E4A] bg-white px-3 text-xs font-black text-[#183B38] shadow-[2px_2px_0px_#134E4A] focus:outline-none transition"
                value={materi}
                onChange={(e) => setMateri(e.target.value as MateriPokok)}
              >
                {ALL_MATERI_POKOK.map((item) => (
                  <option key={item} value={item}>
                    {MATERI_LABELS[item]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#183B38] mb-1.5">
                Target Jilid (Opsional)
              </label>
              <select
                className="w-full h-11 rounded-xl border-2 border-[#134E4A] bg-white px-3 text-xs font-black text-[#183B38] shadow-[2px_2px_0px_#134E4A] focus:outline-none transition"
                value={targetJilid ?? ""}
                onChange={(e) =>
                  setTargetJilid(
                    e.target.value === "" ? null : (Number(e.target.value) as JilidNumber),
                  )
                }
              >
                <option value="">Tanpa Target Jilid (Umum)</option>
                {JILID_OPTIONS.map((jilid) => (
                  <option key={jilid} value={jilid}>
                    Jilid {jilid}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!isMember && (
            <div>
              <label className="block text-xs font-bold text-[#183B38] mb-1.5">
                Tugaskan ke Kelas (Opsional)
              </label>
              <select
                className="w-full h-11 rounded-xl border-2 border-[#134E4A] bg-white px-3 text-xs font-black text-[#183B38] shadow-[2px_2px_0px_#134E4A] focus:outline-none transition"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              >
                <option value="">Simpan di Bank Kuis Pribadi</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} (Jilid {room.targetJilid})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-[#64748B]">
                Jika dipilih, kuis ini akan langsung muncul di kelas santri tersebut.
              </p>
            </div>
          )}
        </StickerCard>

        {/* Section 2: Pertanyaan */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E0E7FF] text-[#4338CA]">
                <HelpCircle size={16} />
              </span>
              <h2 className="text-sm font-black text-[#183B38]">
                Daftar Soal ({questions.length})
              </h2>
            </div>
            <StickerButton
              variant="outline"
              size="sm"
              onClick={addQuestion}
            >
              <Plus size={14} className="mr-1" /> Tambah Soal
            </StickerButton>
          </div>

          {questions.map((question, index) => (
            <StickerCard
              key={index}
              variant="elevated"
              className="p-5 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-[#134E4A]/20">
                <span className="text-xs font-black uppercase tracking-wider text-[#0D9488]">
                  Soal Nomor {index + 1}
                </span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="p-1 text-[#94A3B8] hover:text-[#DC2626] transition"
                    title="Hapus soal ini"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <InputField
                label="Pertanyaan"
                placeholder="Tuliskan teks pertanyaan di sini..."
                value={question.prompt}
                onChange={(e) => updateQuestion(index, "prompt", e.target.value)}
              />

              <div>
                <label className="block text-xs font-bold text-[#183B38] mb-2">
                  Pilihan Jawaban (Pilih radio untuk menandai kunci jawaban yang benar)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = question.answerIndex === optionIndex;
                    return (
                      <div
                        key={optionIndex}
                        className={`flex items-center gap-2.5 rounded-xl border-2 p-2.5 transition-all ${
                          isCorrect
                            ? "border-[#134E4A] bg-[#DCFCE7] shadow-[2px_2px_0_#134E4A]"
                            : "border-[#134E4A] bg-white hover:bg-[#FEF08A]"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`answer-${index}`}
                          className="h-4 w-4 text-[#0D9488] accent-[#0D9488] cursor-pointer"
                          checked={isCorrect}
                          onChange={() => {
                            setQuestions((prev) => {
                              const copy = [...prev];
                              copy[index] = { ...copy[index], answerIndex: optionIndex };
                              return copy;
                            });
                          }}
                        />
                        <input
                          type="text"
                          className="flex-1 bg-transparent text-xs font-medium text-[#183B38] focus:outline-none"
                          placeholder={`Pilihan ${optionIndex + 1}`}
                          value={question.options[optionIndex]}
                          onChange={(e) => {
                            const next = [...question.options] as [string, string, string, string];
                            next[optionIndex] = e.target.value;
                            updateQuestion(index, "options", next);
                          }}
                        />
                        {isCorrect && (
                          <span className="text-[10px] font-black text-[#15803D] uppercase">
                            Kunci
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </StickerCard>
          ))}

          <StickerButton
            variant="outline"
            size="md"
            className="w-full border-dashed"
            onClick={addQuestion}
          >
            <Plus size={16} className="mr-1" /> Tambah Soal Berikutnya
          </StickerButton>

          {errors.length > 0 && (
            <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-xs font-bold text-[#991B1B] space-y-1">
              <p className="font-black">Mohon perbaiki kesalahan berikut:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2">
            <StickerButton
              variant="primary"
              size="lg"
              className="w-full"
              loading={saving}
              disabled={!title || questions.length === 0}
              onClick={handleSave}
            >
              Simpan & Terbitkan Kuis
            </StickerButton>
          </div>
        </div>
      </div>
    </div>
  );
}
