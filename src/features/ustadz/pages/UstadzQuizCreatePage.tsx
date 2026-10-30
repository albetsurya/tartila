import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { InputField } from "@/components/ui/InputField";
import { ChevronLeftSvg, SparklesSvg } from "@/components/ui/CustomIcons";
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
    <div className={isMember ? "min-h-screen bg-[#F0FDF4] p-4 md:p-6" : ""}>
      <div className="w-full max-w-3xl mx-auto space-y-4">
        {isMember && (
          <div className="rounded-3xl border-[3px] border-[#134E4A] bg-[#FEF3C7] p-5 shadow-[4px_4px_0px_#134E4A] space-y-2">
            <button
              type="button"
              onClick={() => navigate("/arena/create")}
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#134E4A] hover:underline"
            >
              <ChevronLeftSvg size={16} /> Kembali ke Arena
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border-2 border-[#134E4A] bg-[#0D9488] text-white text-[10px] font-black shadow-[1.5px_1.5px_0px_#134E4A]">
                <SparklesSvg size={12} stroke="#FFFFFF" /> KUIS KASUAL
              </span>
            </div>
            <h1 className="font-display text-2xl font-black text-[#134E4A]">
              Buat Kuis Sendiri
            </h1>
            <p className="text-xs font-bold text-[#134E4A]/80">
              Buat soal tebak-tebakan seru, tentukan kunci jawaban, lalu mainkan bersama teman di Tartila Arena!
            </p>
          </div>
        )}

        <StickerCard className="space-y-3 p-4">
          <div>
            <label className="text-xs font-black uppercase text-[#134E4A]/70">
              Judul Kuis
            </label>
            <InputField
              placeholder="Mis. Pengenalan Harakat Dasar"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-[#134E4A]/70">
              Materi
            </label>
            <select
              className="mt-1 w-full rounded-xl border-2 border-[#134E4A] bg-white px-3 py-2 text-xs font-black text-[#134E4A]"
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
            <label className="text-xs font-black uppercase text-[#134E4A]/70">
              Target Jilid (opsional)
            </label>
            <select
              className="mt-1 w-full rounded-xl border-2 border-[#134E4A] bg-white px-3 py-2 text-xs font-black text-[#134E4A]"
              value={targetJilid ?? ""}
              onChange={(e) =>
                setTargetJilid(
                  e.target.value === "" ? null : (Number(e.target.value) as JilidNumber),
                )
              }
            >
              <option value="">Tanpa target jilid</option>
              {JILID_OPTIONS.map((jilid) => (
                <option key={jilid} value={jilid}>
                  Jilid {jilid}
                </option>
              ))}
            </select>
          </div>

          {!isMember && (
            <div>
              <label className="text-xs font-black uppercase text-[#134E4A]/70">
                Tugaskan ke kelas (opsional)
              </label>
              <select
                className="mt-1 w-full rounded-xl border-2 border-[#134E4A] bg-white px-3 py-2 text-xs font-black text-[#134E4A]"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              >
                <option value="">Simpan di bank pribadi</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] font-semibold text-[#134E4A]/60">
                Jika dipilih, kuis muncul di kelas santri pada halaman kelas.
              </p>
            </div>
          )}
        </StickerCard>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#134E4A]">
              Pertanyaan ({questions.length})
            </h2>
            <StickerButton variant="secondary" size="sm" onClick={addQuestion}>
              + Tambah
            </StickerButton>
          </div>

          {questions.map((question, index) => (
            <StickerCard key={index} className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-[#134E4A]">
                  Soal {index + 1}
                </p>
                <StickerButton
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(index)}
                >
                  Hapus
                </StickerButton>
              </div>
              <InputField
                placeholder="Teks pertanyaan"
                value={question.prompt}
                onChange={(e) => updateQuestion(index, "prompt", e.target.value)}
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`answer-${index}`}
                      className="h-4 w-4 accent-[#0D9488]"
                      checked={question.answerIndex === optionIndex}
                      onChange={() => {
                        setQuestions((prev) => {
                          const copy = [...prev];
                          copy[index] = { ...copy[index], answerIndex: optionIndex };
                          return copy;
                        });
                      }}
                    />
                    <InputField
                      placeholder={`Pilihan ${optionIndex + 1}`}
                      value={question.options[optionIndex]}
                      onChange={(e) => {
                        const next = [...question.options] as [string, string, string, string];
                        next[optionIndex] = e.target.value;
                        updateQuestion(index, "options", next);
                      }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-semibold text-[#134E4A]/60">
                Klik ikon radio pada pilihan yang benar (opsi ke-{" "}
                {question.answerIndex + 1}).
              </p>
            </StickerCard>
          ))}

          <StickerButton
            className="w-full"
            loading={saving}
            disabled={!title || questions.length === 0}
            onClick={handleSave}
          >
            Simpan Kuis
          </StickerButton>

          {errors.length > 0 && (
            <ul className="rounded-xl border-2 border-[#FF6B6B] bg-[#FFF0F0] p-2 text-[10px] font-bold text-[#7C2D12]">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
