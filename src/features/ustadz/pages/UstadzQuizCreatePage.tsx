import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { InputField } from "@/components/ui/InputField";
import { ArrowLeft, Plus, Trash2 } from "@/components/ui/CustomIcons";
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

  // Ref untuk Auto-Scroll
  const questionsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const owned = await listOwnedClassrooms(user?.id);
      if (owned.ok) setRooms(owned.data);
    };
    void load();
  }, [user?.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      questionsEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  };

  const updateQuestion = (
    index: number,
    field: "prompt" | "options",
    value: string | string[],
  ) => {
    setQuestions((prev) => {
      const next = [...prev];
      const current = { ...next[index] };
      if (field === "prompt") current.prompt = value as string;
      else
        current.options = [...(value as string[])] as [
          string,
          string,
          string,
          string,
        ];
      next[index] = current;
      return next;
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { prompt: "", options: ["", "", "", ""], answerIndex: 0 },
    ]);
    scrollToBottom();
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
        navigate("/arena/create", {
          state: { selectedCustomQuizId: result.quiz?.id },
        });
      } else {
        navigate("/ustadz/kuis");
      }
    } else {
      setErrors(result.errors);
    }
  };

  return (
    <div
      className={
        isMember
          ? "min-h-screen bg-[#F8FAFC] p-4 md:p-6"
          : "w-full max-w-3xl mx-auto pb-10"
      }
    >
      <div className="space-y-5">
        {/* Header navigation */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-black text-[#134E4A] tracking-tight">
              {isMember ? "Buat Kuis Arena" : "Buat Kuis Baru"}
            </h1>
            <p className="text-xs font-semibold text-[#183B38]/70">
              {isMember
                ? "Rancang soal untuk dimainkan bersama teman"
                : "Rancang instrumen evaluasi materi untuk santri"}
            </p>
          </div>
        </div>

        {/* Section 1: Informasi Kuis */}
        <StickerCard
          variant="elevated"
          className="p-5 md:p-6 space-y-4 bg-white border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A]"
        >
          <div className="mb-2 border-b-[3px] border-[#0D9488] pb-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#134E4A]">
              Pengaturan Kuis
            </h2>
          </div>

          <InputField
            label="Judul Kuis"
            placeholder="Contoh: Pengenalan Huruf Hijaiyah"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="bg-[#F8FAFC]"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#183B38] mb-1.5">
                Kategori Materi
              </label>
              <select
                className="w-full h-11 rounded-xl border-2 border-[#134E4A] bg-[#F8FAFC] px-3 text-xs font-black text-[#183B38] shadow-[2px_2px_0px_#134E4A] focus:outline-none"
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
                Target Jilid
              </label>
              <select
                className="w-full h-11 rounded-xl border-2 border-[#134E4A] bg-[#F8FAFC] px-3 text-xs font-black text-[#183B38] shadow-[2px_2px_0px_#134E4A] focus:outline-none"
                value={targetJilid ?? ""}
                onChange={(e) =>
                  setTargetJilid(
                    e.target.value === ""
                      ? null
                      : (Number(e.target.value) as JilidNumber),
                  )
                }
              >
                <option value="">Umum (Tanpa Jilid)</option>
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
                Tugaskan ke Kelas
              </label>
              <select
                className="w-full h-11 rounded-xl border-2 border-[#134E4A] bg-[#F8FAFC] px-3 text-xs font-black text-[#183B38] shadow-[2px_2px_0px_#134E4A] focus:outline-none"
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
            </div>
          )}
        </StickerCard>

        {/* Section 2: Pertanyaan */}
        <div className="space-y-4">
          <div className="mb-2 flex items-center justify-between border-b-[3px] border-[#F59E0B] pb-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#134E4A]">
              Daftar Soal ({questions.length})
            </h2>
            <StickerButton variant="outline" size="sm" onClick={addQuestion}>
              <Plus size={14} className="mr-1" /> Tambah
            </StickerButton>
          </div>

          {questions.map((question, index) => (
            <StickerCard
              key={index}
              variant="elevated"
              className="p-4 sm:p-5 space-y-4 bg-white border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
            >
              <div className="flex items-center justify-between border-b-2 border-dashed border-[#134E4A]/20 pb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#134E4A] text-[10px] font-black text-white">
                  {index + 1}
                </span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#EF4444] hover:underline"
                  >
                    <Trash2 size={12} /> Hapus
                  </button>
                )}
              </div>

              <InputField
                placeholder="Tuliskan teks pertanyaan di sini..."
                value={question.prompt}
                onChange={(e) =>
                  updateQuestion(index, "prompt", e.target.value)
                }
                className="bg-[#F8FAFC] font-bold"
              />

              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Pilih jawaban yang benar:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = question.answerIndex === optionIndex;
                    return (
                      <div
                        key={optionIndex}
                        onClick={() => {
                          setQuestions((prev) => {
                            const copy = [...prev];
                            copy[index] = {
                              ...copy[index],
                              answerIndex: optionIndex,
                            };
                            return copy;
                          });
                        }}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-lg border-2 p-2 transition-all ${
                          isCorrect
                            ? "border-[#0D9488] bg-[#CCFBF1] shadow-[1.5px_1.5px_0_#0D9488]"
                            : "border-[#134E4A]/30 bg-[#F8FAFC] hover:border-[#134E4A]"
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${isCorrect ? "border-[#0D9488] bg-[#0D9488]" : "border-[#CBD5E1] bg-white"}`}
                        >
                          {isCorrect && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <input
                          type="text"
                          className={`flex-1 bg-transparent text-xs font-bold focus:outline-none ${isCorrect ? "text-[#134E4A]" : "text-[#64748B]"}`}
                          placeholder={`Pilihan ${String.fromCharCode(65 + optionIndex)}`}
                          value={question.options[optionIndex]}
                          onChange={(e) => {
                            const next = [...question.options] as [
                              string,
                              string,
                              string,
                              string,
                            ];
                            next[optionIndex] = e.target.value;
                            updateQuestion(index, "options", next);
                          }}
                          onClick={(e) => e.stopPropagation()} // Mencegah klik input memicu pilih radio
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </StickerCard>
          ))}

          {/* Ref untuk Auto-scroll */}
          <div ref={questionsEndRef} className="h-4" />

          {errors.length > 0 && (
            <div className="rounded-xl border-2 border-[#EF4444] bg-[#FEF2F2] p-4 text-xs font-bold text-[#991B1B] shadow-[2px_2px_0px_#EF4444]">
              <p className="font-black mb-1">Mohon perbaiki:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="sticky bottom-4 pt-2">
            <StickerButton
              variant="primary"
              size="lg"
              className="w-full shadow-[4px_4px_0px_#134E4A]"
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
