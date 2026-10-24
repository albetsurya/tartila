import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  SparklesSvg,
  PlusSvg,
  CheckSvg,
  XSvg,
  Volume2,
  SettingsSvg,
  AlertTriangleSvg,
  RocketSvg,
} from "@/components/ui/CustomIcons";
import { SOAL_TILAWATI, SOAL_TAJWID, SOAL_NABI } from "../../data/quiz";
import type { UniversalQuestion, QuestionCategory } from "../../data/quiz/types";
import { arenaApi } from "../../services/arenaApi";
import { useAuth } from "@/contexts/AuthContext";
import { getAudioUrl } from "../../utils/audioUrl";

type TabType = "bank" | "manual" | "audio";
type TierType = "free" | "vip" | "premium";

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Tier logic
  const userTier: TierType = (user as any)?.subscription_type || "vip";
  const tierLimits = {
    free: { maxQ: 5, maxP: 5 },
    vip: { maxQ: 20, maxP: 15 },
    premium: { maxQ: 50, maxP: 50 },
  }[userTier];

  // Form State
  const [activeTab, setActiveTab] = useState<TabType>("bank");
  const [roomType, setRoomType] = useState<"latihan" | "ujian_resmi">("latihan");
  const [kkm, setKkm] = useState(75);
  const [isRandomized, setIsRandomized] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>("tilawati");
  const [selectedQuestions, setSelectedQuestions] = useState<UniversalQuestion[]>([
    ...SOAL_TILAWATI.slice(0, 3),
  ]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Manual Question State
  const [manualTitle, setManualTitle] = useState("");
  const [manualPrompt, setManualPrompt] = useState("");
  const [manualArabic, setManualArabic] = useState("");
  const [manualOptions, setManualOptions] = useState([
    { id: "A", text: "" },
    { id: "B", text: "" },
    { id: "C", text: "" },
    { id: "D", text: "" },
  ]);
  const [manualCorrect, setManualCorrect] = useState("A");

  // Audio Question State
  const [audioPrompt, setAudioPrompt] = useState("");
  const [audioUrl, setAudioUrl] = useState("https://everyayah.com/data/Alafasy_128kbps/112001.mp3");
  const [audioOptions, setAudioOptions] = useState([
    { id: "A", text: "Al-Ikhlas" },
    { id: "B", text: "Al-Falaq" },
    { id: "C", text: "An-Nas" },
    { id: "D", text: "Al-Fatihah" },
  ]);
  const [audioCorrect, setAudioCorrect] = useState("A");

  // Bank Soal helper
  const availableBank = {
    tilawati: SOAL_TILAWATI,
    tajwid: SOAL_TAJWID,
    nabi: SOAL_NABI,
  }[selectedCategory];

  const toggleQuestionSelection = (q: UniversalQuestion) => {
    const isSelected = selectedQuestions.some((item) => item.id === q.id);
    if (isSelected) {
      setSelectedQuestions(selectedQuestions.filter((item) => item.id !== q.id));
    } else {
      if (selectedQuestions.length >= tierLimits.maxQ) {
        alert(`Batas tier ${userTier.toUpperCase()} adalah maksimal ${tierLimits.maxQ} soal.`);
        return;
      }
      setSelectedQuestions([...selectedQuestions, q]);
    }
  };

  const handleAddManualQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPrompt.trim() || manualOptions.some((o) => !o.text.trim())) {
      alert("Harap lengkapi pertanyaan dan semua 4 pilihan jawaban.");
      return;
    }
    if (selectedQuestions.length >= tierLimits.maxQ) {
      alert(`Batas tier ${userTier.toUpperCase()} adalah ${tierLimits.maxQ} soal.`);
      return;
    }

    const newQ: UniversalQuestion = {
      id: `custom-${Date.now()}`,
      type: "multiple_choice",
      category: selectedCategory,
      title: manualTitle || "Soal Manual",
      prompt: manualPrompt,
      arabicPrompt: manualArabic || undefined,
      options: manualOptions.map((o) => ({
        ...o,
        isCorrect: o.id === manualCorrect,
      })),
      correctAnswer: manualCorrect,
      timeLimitSeconds: 20,
      points: 1000,
    };

    setSelectedQuestions([...selectedQuestions, newQ]);
    setManualTitle("");
    setManualPrompt("");
    setManualArabic("");
    setManualOptions([
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" },
    ]);
    alert("Soal berhasil ditambahkan ke daftar kuis!");
  };

  const handleAddAudioQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioPrompt.trim() || !audioUrl.trim()) {
      alert("Harap isi pertanyaan dan link audio.");
      return;
    }
    if (selectedQuestions.length >= tierLimits.maxQ) {
      alert(`Batas tier ${userTier.toUpperCase()} adalah ${tierLimits.maxQ} soal.`);
      return;
    }

    const newQ: UniversalQuestion = {
      id: `audio-${Date.now()}`,
      type: "audio_guess",
      category: selectedCategory,
      title: "Tebak Audio Ayat",
      prompt: audioPrompt,
      audioUrl: audioUrl,
      options: audioOptions.map((o) => ({
        ...o,
        isCorrect: o.id === audioCorrect,
      })),
      correctAnswer: audioCorrect,
      timeLimitSeconds: 25,
      points: 1000,
    };

    setSelectedQuestions([...selectedQuestions, newQ]);
    alert("Soal audio berhasil ditambahkan ke daftar kuis!");
  };

  const handleCreateRoom = async () => {
    if (selectedQuestions.length === 0) {
      setErrorMsg("Pilih minimal 1 soal untuk memulai room.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await arenaApi.createRoom({
        hostId: user?.id || "ustadz-demo",
        roomType,
        kkm: Number(kkm) || 75,
        isRandomized,
        tier: userTier,
        questions: selectedQuestions,
      });

      // Redirect ke host lobby
      navigate(`/arena/host/lobby/${res.pin}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membuat room. Periksa server WebSocket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NgajiCeriaLayout title="Buat Room Tartila Arena">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Banner Header Neo-Brutalism */}
        <div className="rounded-3xl border-[3px] border-[#134E4A] bg-[#FEF3C7] p-5 shadow-[4px_4px_0px_#134E4A]">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#0D9488] text-white text-xs font-black shadow-[2px_2px_0px_#134E4A]">
                <SparklesSvg size={14} /> TARTILA ARENA HOST
              </span>
              <h1 className="mt-2 text-2xl md:text-3xl font-black text-[#134E4A]">
                Buat Room Kuis & Ujian Real-Time
              </h1>
              <p className="mt-1 text-sm font-bold text-[#134E4A]/80">
                Pilih bank soal, atur KKM, dan bagikan PIN 6-digit ke santri untuk bermain bersama!
              </p>
            </div>
            {/* Tier Badge */}
            <div className="rounded-2xl border-2 border-[#134E4A] bg-white px-4 py-3 shadow-[3px_3px_0px_#134E4A] text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 block">
                Paket Akun
              </span>
              <span className="font-display text-lg font-black text-[#0D9488] uppercase">
                {userTier}
              </span>
              <span className="text-[10px] font-bold text-[#134E4A]/80 block">
                Maks {tierLimits.maxQ} Soal · {tierLimits.maxP} Santri
              </span>
            </div>
          </div>
        </div>

        {/* Pengaturan Kuis & Ujian */}
        <div className="rounded-3xl border-[3px] border-[#134E4A] bg-white p-5 shadow-[4px_4px_0px_#134E4A] space-y-4">
          <h2 className="text-lg font-black text-[#134E4A] flex items-center gap-2">
            <SettingsSvg size={20} /> Pengaturan Room
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tipe Room */}
            <div>
              <label className="block text-xs font-black uppercase text-[#134E4A]/70 mb-1">
                Tipe Permainan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRoomType("latihan")}
                  className={`py-2 px-3 rounded-xl border-2 border-[#134E4A] text-xs font-black transition-all ${
                    roomType === "latihan"
                      ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                      : "bg-[#F0FDF4] text-[#134E4A]"
                  }`}
                >
                  Latihan Ceria
                </button>
                <button
                  type="button"
                  onClick={() => setRoomType("ujian_resmi")}
                  className={`py-2 px-3 rounded-xl border-2 border-[#134E4A] text-xs font-black transition-all ${
                    roomType === "ujian_resmi"
                      ? "bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#134E4A]"
                      : "bg-[#F0FDF4] text-[#134E4A]"
                  }`}
                >
                  Ujian Resmi (Anti-Cheat)
                </button>
              </div>
            </div>

            {/* KKM */}
            <div>
              <label className="block text-xs font-black uppercase text-[#134E4A]/70 mb-1">
                Batas KKM (Kelulusan)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={kkm}
                  onChange={(e) => setKkm(Number(e.target.value))}
                  className="w-full rounded-xl border-2 border-[#134E4A] px-3 py-2 text-sm font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] focus:outline-none"
                />
                <span className="text-sm font-bold text-[#134E4A]">/ 100</span>
              </div>
            </div>

            {/* Acak Soal Toggle */}
            <div>
              <label className="block text-xs font-black uppercase text-[#134E4A]/70 mb-1">
                Acak Urutan Soal
              </label>
              <button
                type="button"
                onClick={() => setIsRandomized(!isRandomized)}
                className={`w-full py-2 px-3 rounded-xl border-2 border-[#134E4A] text-xs font-black shadow-[2px_2px_0px_#134E4A] transition-all flex items-center justify-center gap-2 ${
                  isRandomized ? "bg-[#CCFBF1] text-[#134E4A]" : "bg-gray-100 text-gray-600"
                }`}
              >
                {isRandomized ? (
                  <>
                    <CheckSvg size={14} /> Urutan Diacak
                  </>
                ) : (
                  <>
                    <XSvg size={14} /> Urutan Berurutan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Pemilihan / Pembuatan Soal */}
        <div className="rounded-3xl border-[3px] border-[#134E4A] bg-white p-5 shadow-[4px_4px_0px_#134E4A] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#134E4A]/20 pb-3 flex-wrap gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("bank")}
                className={`px-4 py-2 rounded-xl border-2 border-[#134E4A] text-xs font-black transition-all ${
                  activeTab === "bank"
                    ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                    : "bg-[#F0FDF4] text-[#134E4A]"
                }`}
              >
                Bank Soal Tartila
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className={`px-4 py-2 rounded-xl border-2 border-[#134E4A] text-xs font-black transition-all ${
                  activeTab === "manual"
                    ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                    : "bg-[#F0FDF4] text-[#134E4A]"
                }`}
              >
                Buat Manual
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("audio")}
                className={`px-4 py-2 rounded-xl border-2 border-[#134E4A] text-xs font-black transition-all ${
                  activeTab === "audio"
                    ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                    : "bg-[#F0FDF4] text-[#134E4A]"
                }`}
              >
                Upload / Audio Soal
              </button>
            </div>

            {/* Counter Soal Terpilih */}
            <div className="text-xs font-black px-3 py-1.5 rounded-xl border-2 border-[#134E4A] bg-[#FEF3C7] shadow-[2px_2px_0px_#134E4A]">
              Terpilih: {selectedQuestions.length} / {tierLimits.maxQ} Soal
            </div>
          </div>

          {/* TAB 1: BANK SOAL */}
          {activeTab === "bank" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {(["tilawati", "tajwid", "nabi"] as QuestionCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl border-2 border-[#134E4A] text-xs font-black uppercase transition-all ${
                      selectedCategory === cat
                        ? "bg-[#134E4A] text-white"
                        : "bg-white text-[#134E4A]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid gap-3">
                {availableBank.map((q) => {
                  const isChecked = selectedQuestions.some((item) => item.id === q.id);
                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleQuestionSelection(q)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 border-[#134E4A] transition-all flex items-start justify-between gap-3 ${
                        isChecked
                          ? "bg-[#CCFBF1] shadow-[3px_3px_0px_#134E4A]"
                          : "bg-white hover:bg-gray-50 shadow-[1px_1px_0px_#134E4A]"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-[#134E4A] bg-white">
                            {q.type}
                          </span>
                          <span className="text-xs font-bold text-[#134E4A]/70">
                            {q.title}
                          </span>
                        </div>
                        <p className="text-sm font-black text-[#134E4A]">{q.prompt}</p>
                        {q.arabicPrompt && (
                          <p className="game-arabic text-xl text-[#0D9488]">{q.arabicPrompt}</p>
                        )}
                      </div>
                      <div
                        className={`w-6 h-6 rounded-lg border-2 border-[#134E4A] flex items-center justify-center shrink-0 ${
                          isChecked ? "bg-[#0D9488] text-white" : "bg-white"
                        }`}
                      >
                        {isChecked && <CheckSvg size={14} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BUAT MANUAL */}
          {activeTab === "manual" && (
            <form onSubmit={handleAddManualQuestion} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-[#134E4A] mb-1">
                  Judul Topik
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Hukum Nun Sukun"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#134E4A] px-3 py-2 text-sm font-bold shadow-[2px_2px_0px_#134E4A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-[#134E4A] mb-1">
                  Teks Pertanyaan *
                </label>
                <textarea
                  rows={2}
                  placeholder="Tuliskan pertanyaan kuis..."
                  value={manualPrompt}
                  onChange={(e) => setManualPrompt(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#134E4A] px-3 py-2 text-sm font-bold shadow-[2px_2px_0px_#134E4A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-[#134E4A] mb-1">
                  Teks Arab (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: مَنْ يَقُولُ"
                  value={manualArabic}
                  onChange={(e) => setManualArabic(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#134E4A] px-3 py-2 text-sm font-bold shadow-[2px_2px_0px_#134E4A] focus:outline-none text-right font-arabic text-lg"
                />
              </div>

              {/* 4 Pilihan Jawaban */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {manualOptions.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl border-2 border-[#134E4A] bg-[#0D9488] text-white flex items-center justify-center font-black text-sm shrink-0">
                      {opt.id}
                    </span>
                    <input
                      type="text"
                      placeholder={`Pilihan ${opt.id}`}
                      value={opt.text}
                      onChange={(e) => {
                        const copy = [...manualOptions];
                        copy[idx].text = e.target.value;
                        setManualOptions(copy);
                      }}
                      className="flex-1 rounded-xl border-2 border-[#134E4A] px-3 py-1.5 text-sm font-bold shadow-[1px_1px_0px_#134E4A] focus:outline-none"
                    />
                    <input
                      type="radio"
                      name="correctOption"
                      checked={manualCorrect === opt.id}
                      onChange={() => setManualCorrect(opt.id)}
                      className="w-5 h-5 accent-[#0D9488]"
                      title="Tandai sebagai kunci jawaban"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="mt-3 w-full py-2.5 rounded-xl border-2 border-[#134E4A] bg-[#0D9488] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <PlusSvg size={16} /> Tambah Soal Manual ke Kuis
              </button>
            </form>
          )}

          {/* TAB 3: UPLOAD AUDIO */}
          {activeTab === "audio" && (
            <form onSubmit={handleAddAudioQuestion} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-[#134E4A] mb-1">
                  Pertanyaan Soal Audio *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Ayat apakah yang dibacakan?"
                  value={audioPrompt}
                  onChange={(e) => setAudioPrompt(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#134E4A] px-3 py-2 text-sm font-bold shadow-[2px_2px_0px_#134E4A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#134E4A] mb-1">
                  URL Audio (MP3 / EveryAyah / Local) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="flex-1 rounded-xl border-2 border-[#134E4A] px-3 py-2 text-xs font-mono shadow-[2px_2px_0px_#134E4A] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const audio = new Audio(getAudioUrl(audioUrl) ?? audioUrl);
                      audio.play();
                    }}
                    className="px-3 py-2 rounded-xl border-2 border-[#134E4A] bg-[#CCFBF1] text-[#134E4A] font-black text-xs shadow-[2px_2px_0px_#134E4A]"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>

              {/* Pilihan jawaban audio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {audioOptions.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl border-2 border-[#134E4A] bg-[#0D9488] text-white flex items-center justify-center font-black text-sm shrink-0">
                      {opt.id}
                    </span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const copy = [...audioOptions];
                        copy[idx].text = e.target.value;
                        setAudioOptions(copy);
                      }}
                      className="flex-1 rounded-xl border-2 border-[#134E4A] px-3 py-1.5 text-sm font-bold shadow-[1px_1px_0px_#134E4A] focus:outline-none"
                    />
                    <input
                      type="radio"
                      name="correctAudioOption"
                      checked={audioCorrect === opt.id}
                      onChange={() => setAudioCorrect(opt.id)}
                      className="w-5 h-5 accent-[#0D9488]"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="mt-3 w-full py-2.5 rounded-xl border-2 border-[#134E4A] bg-[#0D9488] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <PlusSvg size={16} /> Tambah Soal Audio ke Kuis
              </button>
            </form>
          )}
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="flex items-center gap-1.5 p-3 rounded-2xl border-2 border-[#134E4A] bg-[#FEE2E2] text-red-800 text-xs font-black shadow-[2px_2px_0px_#134E4A]">
            <AlertTriangleSvg size={14} className="shrink-0" /> {errorMsg}
          </div>
        )}

        {/* Action Button Create Room */}
        <div className="pt-2">
          <button
            type="button"
            disabled={loading || selectedQuestions.length === 0}
            onClick={handleCreateRoom}
            className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-lg shadow-[6px_6px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all disabled:opacity-50"
          >
            {loading ? (
              "Membuat Room Arena..."
            ) : (
              <>
                <RocketSvg size={22} /> Buka Room Kuis ({selectedQuestions.length} Soal)
              </>
            )}
          </button>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
