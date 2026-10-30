import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  GamepadSvg,
  CrownSvg,
  TilawatiLearningSvg,
  FireSvg,
  StarSvg,
} from "@/components/ui/CustomIcons";
import { TargetTahfidzSvg } from "@/components/ui/Illustrations";
import { SOAL_TILAWATI, SOAL_TAJWID, SOAL_NABI } from "../../data/quiz";
import type {
  UniversalQuestion,
  QuestionCategory,
} from "../../data/quiz/types";
import { GAME_METADATA_REGISTRY } from "../NgajiCeriaGamesPage";
import { arenaRoomService } from "@/services/arenaRoomService";
import { listQuizzes, type Quiz } from "@/services/quizBankService";
import { useAuth } from "@/contexts/AuthContext";
import { isUstadzUser } from "@/lib/roles";
import { getAudioUrl } from "../../utils/audioUrl";
import { soundManager } from "../../services/soundManager";
import { triggerBibiReaction } from "@/utils/tilaEvent";

type TabType = "bank" | "manual" | "audio";
type TierType = "free" | "vip" | "premium";

interface CasualGamePack {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    stroke?: string;
  }>;
  iconBg: string;
  category: QuestionCategory;
  questions: UniversalQuestion[];
  registryId?: string;
}

const isQuizBasedPack = (pack: CasualGamePack): boolean =>
  GAME_METADATA_REGISTRY[pack.registryId ?? ""]?.isQuizBased !== false;

const OPTION_IDS = ["A", "B", "C", "D"] as const;

function quizToUniversalQuestions(quiz: Quiz): UniversalQuestion[] {
  return quiz.questions.map((q, idx) => ({
    id: q.id || `custom-q-${quiz.id}-${idx}`,
    type: "multiple_choice",
    category: "tilawati",
    title: quiz.title || `Soal ${idx + 1}`,
    prompt: q.prompt,
    options: (q.options || []).map((optText, optIdx) => ({
      id: OPTION_IDS[optIdx] || String.fromCharCode(65 + optIdx),
      text: typeof optText === "string" ? optText : (optText as any)?.text || "",
      isCorrect: optIdx === q.answerIndex,
    })),
    correctAnswer: OPTION_IDS[q.answerIndex] || "A",
    timeLimitSeconds: 20,
    points: 1000,
  }));
}

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isUstadz = Boolean(user?.is_ustadz || isUstadzUser(user));

  // Tier logic
  const userTier: TierType = (user as any)?.subscription_type || "vip";
  const tierLimits = {
    free: { maxQ: 10, maxP: 10 },
    vip: { maxQ: 25, maxP: 25 },
    premium: { maxQ: 50, maxP: 50 },
  }[userTier];

  // ----------------------------------------------------
  // Casual Member State
  // ----------------------------------------------------
  const CASUAL_PACKS: CasualGamePack[] = [
    {
      id: "pack-tilawati",
      title: "Kuis Tilawati Jilid Ceria",
      badge: "Populer",
      description:
        "Uji hafalan bentuk huruf, harakat, dan panjang pendek bacaan tilawati bersama teman.",
      icon: TilawatiLearningSvg,
      iconBg: "bg-[#FEF08A]",
      category: "tilawati",
      registryId: "tilawati-memory",
      questions: SOAL_TILAWATI.slice(0, 10),
    },
    {
      id: "pack-tajwid",
      title: "Tantangan Tajwid Arena",
      badge: "Tantangan",
      description:
        "Tebak hukum nun sukun, tanwin, mim sukun, dan mad dengan cepat & tepat.",
      icon: TargetTahfidzSvg,
      iconBg: "bg-[#FEE2E2]",
      category: "tajwid",
      registryId: "ayat-scramble",
      questions: SOAL_TAJWID.slice(0, 10),
    },
    {
      id: "pack-nabi",
      title: "Cerdas Cermat Kisah Nabi",
      badge: "Wawasan",
      description:
        "Kuis seru tentang mukjizat 25 nabi dan kisah teladan sahabat Rasulullah SAW.",
      icon: StarSvg,
      iconBg: "bg-[#FEF08A]",
      category: "nabi",
      registryId: "quiz-hub",
      questions: SOAL_NABI.slice(0, 10),
    },
    {
      id: "pack-mix",
      title: "Campuran Seru (Random Mix)",
      badge: "Campuran",
      description:
        "Paket komplit gabungan soal tilawati, tajwid, dan sirah nabi untuk santri istiqomah.",
      icon: FireSvg,
      iconBg: "bg-[#FFEDD5]",
      category: "tilawati",
      registryId: "quiz-hub",
      questions: [
        ...SOAL_TILAWATI.slice(0, 4),
        ...SOAL_TAJWID.slice(0, 3),
        ...SOAL_NABI.slice(0, 3),
      ],
    },
  ];

  const [customPacks, setCustomPacks] = useState<CasualGamePack[]>([]);
  const [selectedPackId, setSelectedPackId] = useState<string>("pack-tilawati");

  useEffect(() => {
    let cancelled = false;
    const fetchCustom = async () => {
      try {
        const quizzes = await listQuizzes();
        if (cancelled) return;
        const mapped: CasualGamePack[] = quizzes.map((q) => ({
          id: `custom-quiz-${q.id}`,
          title: q.title,
          badge: "Kuis Sendiri",
          description: `${q.questions.length} soal kuis buatan Anda.`,
          icon: SparklesSvg,
          iconBg: "bg-[#CCFBF1]",
          category: "tilawati",
          questions: quizToUniversalQuestions(q),
        }));
        setCustomPacks(mapped);

        const stateQuizId = (location.state as any)?.selectedCustomQuizId;
        if (stateQuizId) {
          setSelectedPackId(`custom-quiz-${stateQuizId}`);
        }
      } catch (err) {
        console.warn("[CreateRoomPage] Gagal memuat kuis custom:", err);
      }
    };
    fetchCustom();
    return () => {
      cancelled = true;
    };
  }, [location.state]);

  const allCasualPacks = useMemo(() => {
    return [...customPacks, ...CASUAL_PACKS];
  }, [customPacks]);

  // ----------------------------------------------------
  // Ustadz Exam Form State
  // ----------------------------------------------------
  const [activeTab, setActiveTab] = useState<TabType>("bank");
  const [roomType, setRoomType] = useState<"latihan" | "ujian_resmi">(
    "ujian_resmi",
  );
  const [kkm, setKkm] = useState(75);
  const [isRandomized, setIsRandomized] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<QuestionCategory>("tilawati");
  const [selectedQuestions, setSelectedQuestions] = useState<
    UniversalQuestion[]
  >([...SOAL_TILAWATI.slice(0, 5)]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Manual Question State (Ustadz Only)
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

  // Audio Question State (Ustadz Only)
  const [audioPrompt, setAudioPrompt] = useState("");
  const [audioUrl, setAudioUrl] = useState(
    "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
  );
  const [audioOptions, setAudioOptions] = useState([
    { id: "A", text: "Al-Ikhlas" },
    { id: "B", text: "Al-Falaq" },
    { id: "C", text: "An-Nas" },
    { id: "D", text: "Al-Fatihah" },
  ]);
  const [audioCorrect, setAudioCorrect] = useState("A");

  const availableBank = {
    tilawati: SOAL_TILAWATI,
    tajwid: SOAL_TAJWID,
    nabi: SOAL_NABI,
  }[selectedCategory];

  const toggleQuestionSelection = (q: UniversalQuestion) => {
    const isSelected = selectedQuestions.some((item) => item.id === q.id);
    if (isSelected) {
      setSelectedQuestions(
        selectedQuestions.filter((item) => item.id !== q.id),
      );
    } else {
      if (selectedQuestions.length >= tierLimits.maxQ) {
        alert(
          `Batas tier ${userTier.toUpperCase()} adalah maksimal ${tierLimits.maxQ} soal.`,
        );
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

    const newQ: UniversalQuestion = {
      id: `manual-${Date.now()}`,
      type: "multiple_choice",
      category: selectedCategory,
      title: manualTitle.trim() || "Soal Kuis Ujian",
      prompt: manualPrompt.trim(),
      arabicPrompt: manualArabic.trim() || undefined,
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

  // ----------------------------------------------------
  // Handle Create Room (Supabase + Local Mock)
  // ----------------------------------------------------
  const handleCreateCasualRoom = async () => {
    const pack =
      allCasualPacks.find((p) => p.id === selectedPackId) || allCasualPacks[0];
    setLoading(true);
    setErrorMsg("");

    try {
      const room = await arenaRoomService.createRoom({
        hostId: user?.id || `member-${Date.now().toString(36)}`,
        hostName: user?.name || user?.username || "Sohabat Ngaji",
        roomType: "casual",
        title: pack.title,
        questions: pack.questions,
      });

      // Simpan soal ke tabel room_questions
      await arenaRoomService.saveRoomQuestions(room.id, pack.questions);

      // Simpan session host & room_id di sessionStorage
      sessionStorage.setItem(`arena_is_host_${room.pin}`, "true");
      sessionStorage.setItem("arena_room_pin", room.pin);
      sessionStorage.setItem("arena_room_id", room.id);

      // Redirect ke halaman lobi
      navigate(`/arena/lobby/${room.pin}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membuat room main kasual.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExamRoom = async () => {
    if (selectedQuestions.length === 0) {
      setErrorMsg("Pilih minimal 1 soal untuk memulai ujian.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const room = await arenaRoomService.createRoom({
        hostId: user?.id || `ustadz-${Date.now().toString(36)}`,
        hostName: user?.name || user?.username || "Ustadz",
        roomType: "exam",
        kkm: Number(kkm) || 75,
        questions: selectedQuestions,
      });

      // Simpan soal ke tabel room_questions
      await arenaRoomService.saveRoomQuestions(room.id, selectedQuestions);

      // Simpan session host & room_id di sessionStorage
      sessionStorage.setItem(`arena_is_host_${room.pin}`, "true");
      sessionStorage.setItem("arena_room_pin", room.pin);
      sessionStorage.setItem("arena_room_id", room.id);

      // Redirect ke halaman lobi
      navigate(`/arena/lobby/${room.pin}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membuat room ujian resmi.");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // VIEW MEMBER: FORM KASUAL SEDERHANA
  // ====================================================
  if (!isUstadz) {
    return (
      <NgajiCeriaLayout title="Buat Room Main Bersama Teman">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          {/* Header Banner Kasual */}
          <div className="rounded-3xl border-[3px] border-[#134E4A] bg-[#FEF3C7] dark:bg-[#F0FDF4] p-6 shadow-[5px_5px_0px_#134E4A] text-[#134E4A] dark:text-[#FFFFFF]">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#0D9488] text-white text-xs font-black shadow-[2px_2px_0px_#134E4A]">
                <GamepadSvg size={14} stroke="#FFFFFF" /> ROOM MAIN KASUAL
              </span>
              <span className="text-xs font-black text-[#134E4A]/60 dark:text-[#94A3B8]">
                Santai & Mabar
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-black text-[#134E4A] dark:text-[#FFFFFF]">
              Buat Room Main Bersama Teman
            </h1>
            <p className="mt-1.5 text-xs md:text-sm font-bold text-[#134E4A]/80 dark:text-[#94A3B8]">
              Pilih kuis yang ingin kamu mainkan, buat PIN, lalu bagikan ke
              teman-temanmu untuk mulai tebak-tebakan bersama!
            </p>
          </div>

          {/* Pemilihan Paket Kuis / Game Sederhana */}
          <div className="rounded-3xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-6 shadow-[5px_5px_0px_#134E4A] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg md:text-xl font-black text-[#134E4A] dark:text-[#FFFFFF] flex items-center gap-2">
                <SparklesSvg
                  size={18}
                  stroke="#134E4A"
                  className="text-[#134E4A] dark:text-[#134E4A]"
                />{" "}
                Pilih Game / Kuis
              </h2>
              <span className="text-xs font-bold text-[#134E4A]/60 dark:text-[#94A3B8]">
                10 Soal per ronde
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {allCasualPacks.map((pack) => {
                const isSelected = selectedPackId === pack.id;
                const quizBased = isQuizBasedPack(pack);
                const PackIcon = pack.icon;
                return (
                  <button
                    key={pack.id}
                    type="button"
                    disabled={!quizBased}
                    onClick={() => {
                      triggerBibiReaction("click");
                      soundManager.playSfx("tap");
                      setSelectedPackId(pack.id);
                    }}
                    className={`p-4 rounded-2xl border-[3px] text-left transition-all flex flex-col justify-between gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSelected
                        ? "border-[#134E4A] bg-[#CCFBF1] dark:bg-[#064e43] shadow-[4px_4px_0px_#134E4A] -translate-y-1 text-[#134E4A] dark:text-[#E6FFFA]"
                        : "border-[#134E4A] bg-[#FFFFFF] hover:bg-[#F0FDF4] dark:hover:bg-slate-800 shadow-[3px_3px_0px_#134E4A] hover:-translate-y-0.5"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl border-[2.5px] border-[#134E4A] dark:border-white/80 shadow-[2.5px_2.5px_0px_#134E4A] dark:shadow-[2.5px_2.5px_0px_#000000] ${pack.iconBg} text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488] shrink-0`}
                        >
                          <PackIcon
                            size={26}
                            className="text-[#134E4A]"
                            stroke="#134E4A"
                          />
                        </div>
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border-2 border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] ${
                            isSelected
                              ? "bg-[#047857] text-white"
                              : "bg-[#065F46] text-white"
                          }`}
                        >
                          {pack.badge}
                        </span>
                      </div>
                      <h3 className="font-display font-black text-sm md:text-base text-[#134E4A] dark:text-[#FFFFFF]">
                        {pack.title}
                      </h3>
                      <p className="mt-1 text-xs font-bold text-[#134E4A]/70 dark:text-[#94A3B8] line-clamp-2">
                        {pack.description}
                      </p>
                      {!quizBased && (
                        <span className="mt-1 inline-block w-fit px-2 py-0.5 rounded-md border-2 border-[#134E4A] bg-[#FEE2E2] text-[#991B1B] text-[10px] font-black">
                          Hanya tersedia untuk Single Player
                        </span>
                      )}
                      {isSelected && pack.id.startsWith("custom-quiz-") && (
                        <span className="mt-1 inline-block px-2 py-0.5 rounded-md border-2 border-[#134E4A] bg-[#0D9488] text-white text-[10px] font-black shadow-[1.5px_1.5px_0px_#134E4A]">
                          Kuis Sendiri
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#134E4A]/10 dark:border-white/10 text-xs font-black">
                      <span className="text-[#0D9488] dark:text-[#2DD4BF]">
                        {pack.questions.length} Soal Pilihan
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[#0D9488] dark:text-[#2DD4BF]">
                          <CheckSvg size={14} stroke="#0D9488" /> Terpilih
                        </span>
                      ) : (
                        <span className="text-[#134E4A]/40 dark:text-[#94A3B8]">
                          Pilih Ini
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tombol Buat Kuis Sendiri (Custom Quiz) */}
          <button
            type="button"
            onClick={() => navigate("/member/ngaji-ceria/quiz/create")}
            className="w-full py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] text-[#134E4A] font-black text-lg md:text-xl shadow-[5px_5px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#0D9488] hover:text-white flex items-center justify-center gap-2"
          >
            <PlusSvg size={24} />
            <span>Buat Kuis Sendiri</span>
          </button>

          {/* Notifikasi Error */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl border-2 border-[#134E4A] bg-[#FEE2E2] text-red-800 text-xs font-black shadow-[2px_2px_0px_#134E4A]">
              <AlertTriangleSvg size={16} className="shrink-0" /> {errorMsg}
            </div>
          )}

          {/* Tombol Buat PIN */}
          <div className="pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleCreateCasualRoom}
              className="w-full py-4 md:py-5 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-lg md:text-xl shadow-[5px_5px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#0F766E] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <RocketSvg size={24} />
              <span>
                {loading ? "Membuat PIN Room..." : "Buat PIN & Buka Lobi Main"}
              </span>
            </button>
          </div>
        </div>
      </NgajiCeriaLayout>
    );
  }

  // ====================================================
  // VIEW USTADZ: FORM UJIAN RESMI LENGKAP
  // ====================================================
  return (
    <NgajiCeriaLayout title="Buat Room Ujian Resmi Ustadz">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Banner Header Ustadz */}
        <div className="rounded-3xl border-[3px] border-[#134E4A] bg-[#FEF3C7] dark:bg-[#F0FDF4] p-5 shadow-[4px_4px_0px_#134E4A]">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#EA580C] text-white text-xs font-black shadow-[2px_2px_0px_#134E4A]">
                <CrownSvg size={14} stroke="#FFFFFF" /> PANEL UJIAN USTADZ
              </span>
              <h1 className="mt-2 text-2xl md:text-3xl font-black text-[#134E4A] dark:text-[#FFFFFF]">
                Buat Room Ujian Resmi TPQ
              </h1>
              <p className="mt-1 text-sm font-bold text-[#134E4A]/80 dark:text-[#94A3B8]">
                Atur KKM kelulusan, anti-cheat tab-switch, dan tentukan bank
                soal ujian santri.
              </p>
            </div>
            <div className="rounded-2xl border-2 border-[#134E4A] bg-[#FFFFFF] px-4 py-3 shadow-[3px_3px_0px_#134E4A] text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 dark:text-[#94A3B8] block">
                Paket Akun
              </span>
              <span className="font-display text-lg font-black text-[#0D9488] dark:text-[#2DD4BF] uppercase">
                {userTier}
              </span>
              <span className="text-[10px] font-bold text-[#134E4A]/80 dark:text-[#94A3B8] block">
                Maks {tierLimits.maxQ} Soal · {tierLimits.maxP} Santri
              </span>
            </div>
          </div>
        </div>

        {/* Pengaturan Kuis & Ujian */}
        <div className="rounded-3xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-5 shadow-[4px_4px_0px_#134E4A] space-y-4">
          <h2 className="text-lg font-black text-[#134E4A] dark:text-[#FFFFFF] flex items-center gap-2">
            <SettingsSvg
              size={20}
              stroke="#134E4A"
              className="text-[#134E4A] dark:text-[#134E4A]"
            />{" "}
            Pengaturan Ujian
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#134E4A]/70 dark:text-[#94A3B8] mb-1">
                Tipe Pelaksanaan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRoomType("latihan")}
                  className={`py-2 px-3 rounded-xl border-2 border-[#134E4A] text-xs font-black transition-all ${
                    roomType === "latihan"
                      ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                      : "bg-[#F0FDF4] dark:bg-slate-800 text-[#134E4A] dark:text-[#FFFFFF]"
                  }`}
                >
                  Latihan Kelas
                </button>
                <button
                  type="button"
                  onClick={() => setRoomType("ujian_resmi")}
                  className={`py-2 px-3 rounded-xl border-2 border-[#134E4A] text-xs font-black transition-all ${
                    roomType === "ujian_resmi"
                      ? "bg-[#EA580C] text-white shadow-[2px_2px_0px_#134E4A]"
                      : "bg-[#F0FDF4] dark:bg-slate-800 text-[#134E4A] dark:text-[#FFFFFF]"
                  }`}
                >
                  Ujian Resmi
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#134E4A]/70 dark:text-[#94A3B8] mb-1">
                Standar KKM Kelulusan
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={50}
                  max={95}
                  step={5}
                  value={kkm}
                  onChange={(e) => setKkm(Number(e.target.value))}
                  className="flex-1 accent-[#0D9488]"
                />
                <span className="w-12 text-center py-1.5 rounded-lg border-2 border-[#134E4A] bg-[#FEF3C7] dark:bg-slate-800 font-black text-sm text-[#134E4A] dark:text-[#FFFFFF]">
                  {kkm}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#134E4A]/70 dark:text-[#94A3B8] mb-1">
                Acak Urutan Soal
              </label>
              <button
                type="button"
                onClick={() => setIsRandomized(!isRandomized)}
                className={`w-full py-2 px-3 rounded-xl border-2 border-[#134E4A] text-xs font-black flex items-center justify-center gap-2 transition-all ${
                  isRandomized
                    ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                    : "bg-gray-100 dark:bg-slate-800 text-[#134E4A] dark:text-[#FFFFFF]"
                }`}
              >
                {isRandomized ? (
                  <CheckSvg size={14} stroke="#FFFFFF" />
                ) : (
                  <XSvg size={14} stroke="currentColor" />
                )}
                {isRandomized ? "Soal Diacak (Aktif)" : "Urut Sesuai Daftar"}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Pemilihan Bank Soal & Input */}
        <div className="rounded-3xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-5 shadow-[4px_4px_0px_#134E4A] space-y-4">
          <div className="flex border-b-2 border-[#134E4A]/20 dark:border-white/10 pb-3 gap-2 flex-wrap justify-between items-center">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("bank")}
                className={`px-4 py-2 rounded-xl border-2 border-[#134E4A] font-black text-xs transition-all ${
                  activeTab === "bank"
                    ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                    : "bg-[#F0FDF4] dark:bg-slate-800 text-[#134E4A] dark:text-[#FFFFFF]"
                }`}
              >
                Bank Soal ({availableBank.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className={`px-4 py-2 rounded-xl border-2 border-[#134E4A] font-black text-xs transition-all ${
                  activeTab === "manual"
                    ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                    : "bg-[#F0FDF4] dark:bg-slate-800 text-[#134E4A] dark:text-[#FFFFFF]"
                }`}
              >
                + Buat Soal Manual
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("audio")}
                className={`px-4 py-2 rounded-xl border-2 border-[#134E4A] font-black text-xs transition-all ${
                  activeTab === "audio"
                    ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                    : "bg-[#F0FDF4] dark:bg-slate-800 text-[#134E4A] dark:text-[#FFFFFF]"
                }`}
              >
                + Soal Tebak Audio
              </button>
            </div>

            <span className="text-xs font-black text-[#134E4A] dark:text-[#FFFFFF] bg-[#FEF3C7] dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-[#134E4A]">
              Terpilih: {selectedQuestions.length} Soal
            </span>
          </div>

          {activeTab === "bank" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {(["tilawati", "tajwid", "nabi"] as QuestionCategory[]).map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg border-2 border-[#134E4A] text-xs font-black capitalize transition-all ${
                        selectedCategory === cat
                          ? "bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
                          : "bg-white dark:bg-slate-800 text-[#134E4A]/70 dark:text-[#94A3B8]"
                      }`}
                    >
                      Kategori {cat}
                    </button>
                  ),
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                {availableBank.map((q) => {
                  const isSelected = selectedQuestions.some(
                    (item) => item.id === q.id,
                  );
                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleQuestionSelection(q)}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? "border-[#134E4A] bg-[#CCFBF1] dark:bg-[#064e43] shadow-[3px_3px_0px_#134E4A]"
                          : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#134E4A]"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg border-2 border-[#134E4A] flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-[#0D9488] text-white"
                            : "bg-white dark:bg-slate-900"
                        }`}
                      >
                        {isSelected && <CheckSvg size={14} stroke="#FFFFFF" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase bg-[#134E4A]/10 dark:bg-white/10 text-[#134E4A] dark:text-[#FFFFFF] px-1.5 py-0.5 rounded">
                            {q.type}
                          </span>
                          <span className="text-xs font-bold text-[#134E4A]/60 dark:text-[#94A3B8]">
                            {q.timeLimitSeconds}d
                          </span>
                        </div>
                        <p className="text-xs font-black text-[#134E4A] dark:text-[#FFFFFF] mt-1 line-clamp-2">
                          {q.prompt}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "manual" && (
            <form onSubmit={handleAddManualQuestion} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-[#134E4A] dark:text-[#FFFFFF] mb-1">
                  Pertanyaan Kuis *
                </label>
                <textarea
                  rows={2}
                  required
                  value={manualPrompt}
                  onChange={(e) => setManualPrompt(e.target.value)}
                  placeholder="Tulis soal kuis di sini..."
                  className="w-full rounded-xl border-2 border-[#134E4A] bg-white dark:bg-slate-900 text-[#134E4A] dark:text-[#FFFFFF] p-2.5 text-xs font-bold shadow-[2px_2px_0px_#134E4A] focus:outline-none"
                />
              </div>

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
                      className="flex-1 rounded-xl border-2 border-[#134E4A] bg-white dark:bg-slate-900 text-[#134E4A] dark:text-[#FFFFFF] px-3 py-1.5 text-sm font-bold shadow-[1px_1px_0px_#134E4A] focus:outline-none"
                    />
                    <input
                      type="radio"
                      name="correctOption"
                      checked={manualCorrect === opt.id}
                      onChange={() => setManualCorrect(opt.id)}
                      className="w-5 h-5 accent-[#0D9488]"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="mt-3 w-full py-2.5 rounded-xl border-2 border-[#134E4A] bg-[#0D9488] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <PlusSvg size={16} stroke="#FFFFFF" /> Tambah Soal Manual ke
                Ujian
              </button>
            </form>
          )}

          {activeTab === "audio" && (
            <form onSubmit={handleAddAudioQuestion} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-[#134E4A] dark:text-[#FFFFFF] mb-1">
                  Pertanyaan / Perintah *
                </label>
                <input
                  type="text"
                  required
                  value={audioPrompt}
                  onChange={(e) => setAudioPrompt(e.target.value)}
                  placeholder="Dengarkan audio dan tebak ayat ini..."
                  className="w-full rounded-xl border-2 border-[#134E4A] bg-white dark:bg-slate-900 text-[#134E4A] dark:text-[#FFFFFF] p-2.5 text-xs font-bold shadow-[2px_2px_0px_#134E4A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#134E4A] dark:text-[#FFFFFF] mb-1">
                  URL Audio (MP3 / EveryAyah / Local) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="flex-1 rounded-xl border-2 border-[#134E4A] bg-white dark:bg-slate-900 text-[#134E4A] dark:text-[#FFFFFF] px-3 py-2 text-xs font-mono shadow-[2px_2px_0px_#134E4A] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const audio = new Audio(
                        getAudioUrl(audioUrl) ?? audioUrl,
                      );
                      audio.play();
                    }}
                    className="px-3 py-2 rounded-xl border-2 border-[#134E4A] bg-[#CCFBF1] dark:bg-[#064e43] text-[#134E4A] dark:text-[#FFFFFF] font-black text-xs shadow-[2px_2px_0px_#134E4A]"
                  >
                    <Volume2 size={16} stroke="currentColor" />
                  </button>
                </div>
              </div>

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
                      className="flex-1 rounded-xl border-2 border-[#134E4A] bg-white dark:bg-slate-900 text-[#134E4A] dark:text-[#FFFFFF] px-3 py-1.5 text-sm font-bold shadow-[1px_1px_0px_#134E4A] focus:outline-none"
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
                <PlusSvg size={16} stroke="#FFFFFF" /> Tambah Soal Audio ke
                Ujian
              </button>
            </form>
          )}
        </div>

        {errorMsg && (
          <div className="flex items-center gap-1.5 p-3 rounded-2xl border-2 border-[#134E4A] bg-[#FEE2E2] text-red-800 text-xs font-black shadow-[2px_2px_0px_#134E4A]">
            <AlertTriangleSvg size={14} className="shrink-0" /> {errorMsg}
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            disabled={loading || selectedQuestions.length === 0}
            onClick={handleCreateExamRoom}
            className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-lg shadow-[6px_6px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all disabled:opacity-50"
          >
            {loading ? (
              "Membuat Room Ujian..."
            ) : (
              <>
                <RocketSvg size={22} /> Buka Room Ujian (
                {selectedQuestions.length} Soal)
              </>
            )}
          </button>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
