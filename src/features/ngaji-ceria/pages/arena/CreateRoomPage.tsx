import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  SparklesSvg,
  PlusSvg,
  CheckSvg,
  XSvg,
  Volume2,
  Volume2Svg,
  AlertTriangleSvg,
  RocketSvg,
  GamepadSvg,
  CrownSvg,
  TilawatiLearningSvg,
  FireSvg,
  StarSvg,
  ZapSvg,
  BookOpenSvg,
  PencilSvg,
} from "@/components/ui/CustomIcons";
import { TargetTahfidzSvg } from "@/components/ui/Illustrations";
import { SOAL_TILAWATI, SOAL_TAJWID, SOAL_NABI } from "../../data/quiz";
import { clearBotSimulatorState } from "../../hooks/useBotSimulator";
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
  badgeBg: string;
  cardAccent: string;
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
      text:
        typeof optText === "string" ? optText : (optText as any)?.text || "",
      isCorrect: optIdx === q.answerIndex,
    })),
    correctAnswer: OPTION_IDS[q.answerIndex] || "A",
    timeLimitSeconds: 20,
    points: 1000,
  }));
}

/** Ilustrasi Piala Turnamen & Kartu VS Kompak dengan Comic Burst */
const ArenaMabarHeroSvg = ({
  className = "w-20 h-16",
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 180 140"
    fill="none"
    className={`${className} shrink-0 overflow-visible`}
  >
    {/* Comic Starburst Background */}
    <path
      d="M90 6 L108 26 L136 16 L128 42 L156 54 L132 72 L144 98 L114 94 L102 120 L86 98 L60 116 L58 90 L30 92 L46 68 L24 50 L52 40 L48 14 L74 28 Z"
      fill="#FEF08A"
      stroke="#134E4A"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <ellipse cx="90" cy="128" rx="56" ry="7" fill="#134E4A" />

    {/* Kartu Kiri */}
    <g transform="rotate(-14 42 56)">
      <rect
        x="14"
        y="26"
        width="40"
        height="52"
        rx="8"
        fill="#38BDF8"
        stroke="#134E4A"
        strokeWidth="3.5"
      />
      <circle
        cx="34"
        cy="52"
        r="10"
        fill="#FFFBEB"
        stroke="#134E4A"
        strokeWidth="2.5"
      />
      <text
        x="34"
        y="57"
        textAnchor="middle"
        fontSize="12"
        fontWeight="900"
        fill="#134E4A"
      >
        ب
      </text>
    </g>

    {/* Kartu Kanan */}
    <g transform="rotate(14 138 56)">
      <rect
        x="120"
        y="26"
        width="40"
        height="52"
        rx="8"
        fill="#FB7185"
        stroke="#134E4A"
        strokeWidth="3.5"
      />
      <circle
        cx="140"
        cy="52"
        r="10"
        fill="#FFFBEB"
        stroke="#134E4A"
        strokeWidth="2.5"
      />
      <text
        x="140"
        y="57"
        textAnchor="middle"
        fontSize="12"
        fontWeight="900"
        fill="#134E4A"
      >
        ؟
      </text>
    </g>

    {/* Piala Emas Tengah */}
    <path
      d="M56 26 H124 L116 74 C114 88 102 94 90 94 C78 94 66 88 64 74 L56 26 Z"
      fill="#FACC15"
      stroke="#134E4A"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <rect
      x="64"
      y="102"
      width="52"
      height="14"
      rx="5"
      fill="#0D9488"
      stroke="#134E4A"
      strokeWidth="3.5"
    />
    <circle
      cx="90"
      cy="58"
      r="14"
      fill="#EF4444"
      stroke="#134E4A"
      strokeWidth="3.5"
    />
    <path
      d="M93 46 L83 58 H91 L87 70 L99 56 H91 L93 46 Z"
      fill="#FEF08A"
      stroke="#134E4A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const PackCardArtworkSvg = ({ packId }: { packId: string }) => {
  if (packId === "pack-tilawati") {
    return (
      <svg
        viewBox="0 0 100 80"
        fill="none"
        className="pointer-events-none absolute -right-2 -bottom-2 w-18 h-14 opacity-20 group-hover:opacity-35 transition-opacity"
      >
        <rect
          x="28"
          y="18"
          width="60"
          height="46"
          rx="6"
          transform="rotate(-8 28 18)"
          fill="#F59E0B"
          stroke="#134E4A"
          strokeWidth="3"
        />
        <circle
          cx="58"
          cy="40"
          r="11"
          fill="#FEF08A"
          stroke="#134E4A"
          strokeWidth="2.5"
        />
      </svg>
    );
  }

  if (packId === "pack-tajwid") {
    return (
      <svg
        viewBox="0 0 100 80"
        fill="none"
        className="pointer-events-none absolute -right-2 -bottom-2 w-18 h-14 opacity-20 group-hover:opacity-35 transition-opacity"
      >
        <circle
          cx="64"
          cy="46"
          r="24"
          fill="#FB7185"
          stroke="#134E4A"
          strokeWidth="3"
        />
        <circle
          cx="64"
          cy="46"
          r="13"
          fill="#FFFBEB"
          stroke="#134E4A"
          strokeWidth="2.5"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      className="pointer-events-none absolute -right-2 -bottom-2 w-18 h-14 opacity-20 group-hover:opacity-35 transition-opacity"
    >
      <rect
        x="40"
        y="20"
        width="44"
        height="44"
        rx="9"
        transform="rotate(12 40 20)"
        fill="#FB923C"
        stroke="#134E4A"
        strokeWidth="3"
      />
    </svg>
  );
};

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isUstadz = Boolean(user?.is_ustadz || isUstadzUser(user));

  const userTier: TierType = (user as any)?.subscription_type || "vip";
  const tierLimits = {
    free: { maxQ: 10, maxP: 10 },
    vip: { maxQ: 25, maxP: 25 },
    premium: { maxQ: 50, maxP: 50 },
  }[userTier];

  const CASUAL_PACKS: CasualGamePack[] = [
    {
      id: "pack-tilawati",
      title: "Kuis Tilawati Jilid Ceria",
      badge: "Populer",
      badgeBg: "bg-[#059669]",
      cardAccent: "bg-[#FEF9C3]",
      description:
        "Hafalan bentuk huruf, harakat, dan panjang pendek bacaan tilawati.",
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
      badgeBg: "bg-[#E11D48]",
      cardAccent: "bg-[#FFE4E6]",
      description:
        "Tebak hukum nun sukun, tanwin, mim sukun, dan mad dengan cepat.",
      icon: TargetTahfidzSvg,
      iconBg: "bg-[#FECDD3]",
      category: "tajwid",
      registryId: "ayat-scramble",
      questions: SOAL_TAJWID.slice(0, 10),
    },
    {
      id: "pack-nabi",
      title: "Cerdas Cermat Kisah Nabi",
      badge: "Wawasan",
      badgeBg: "bg-[#0284C7]",
      cardAccent: "bg-[#E0F2FE]",
      description:
        "Kuis seru tentang mukjizat 25 nabi dan kisah teladan sahabat.",
      icon: StarSvg,
      iconBg: "bg-[#BAE6FD]",
      category: "nabi",
      registryId: "quiz-hub",
      questions: SOAL_NABI.slice(0, 10),
    },
    {
      id: "pack-mix",
      title: "Campuran Seru (Random Mix)",
      badge: "Campuran",
      badgeBg: "bg-[#EA580C]",
      cardAccent: "bg-[#FFEDD5]",
      description:
        "Paket komplit gabungan soal tilawati, tajwid, dan sirah nabi.",
      icon: FireSvg,
      iconBg: "bg-[#FED7AA]",
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
          badgeBg: "bg-[#7C3AED]",
          cardAccent: "bg-[#F3E8FF]",
          description: `${q.questions.length} soal kuis buatanmu sendiri.`,
          icon: SparklesSvg,
          iconBg: "bg-[#DDD6FE]",
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

  const handleCreateCasualRoom = async () => {
    const pack =
      allCasualPacks.find((p) => p.id === selectedPackId) || allCasualPacks[0];
    setLoading(true);
    setErrorMsg("");

    try {
      clearBotSimulatorState();
      const created = await arenaRoomService.createRoom({
        hostId: user?.id || `member-${Date.now().toString(36)}`,
        hostName: user?.name || user?.username || "Sahabat Ngaji",
        roomType: "casual",
        title: pack.title,
        questions: pack.questions,
      });
      if (!created.ok) {
        setErrorMsg(created.message);
        return;
      }
      const room = created.data;

      sessionStorage.setItem(`arena_is_host_${room.pin}`, "true");
      sessionStorage.setItem("arena_room_pin", room.pin);
      sessionStorage.setItem("arena_room_id", room.id);

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
      clearBotSimulatorState();
      const created = await arenaRoomService.createRoom({
        hostId: user?.id || `ustadz-${Date.now().toString(36)}`,
        hostName: user?.name || user?.username || "Ustadz",
        roomType: "exam",
        kkm: Number(kkm) || 75,
        questions: selectedQuestions,
      });
      if (!created.ok) {
        setErrorMsg(created.message);
        return;
      }
      const room = created.data;

      sessionStorage.setItem(`arena_is_host_${room.pin}`, "true");
      sessionStorage.setItem("arena_room_pin", room.pin);
      sessionStorage.setItem("arena_room_id", room.id);

      navigate(`/arena/lobby/${room.pin}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membuat room ujian resmi.");
    } finally {
      setLoading(false);
    }
  };

  if (!isUstadz) {
    const activePack =
      allCasualPacks.find((p) => p.id === selectedPackId) || allCasualPacks[0];
    const ActivePackIcon = activePack.icon;

    return (
      <NgajiCeriaLayout
        title="Buat Room Mabar Arena"
        showBack={true}
        onBack={() => navigate("/member/ngaji-ceria/games")}
      >
        <div className="relative w-full bg-[#F0FDF4] pb-24 lg:pb-6 overflow-x-hidden select-none">
          {/* Latar Action Halftone + Diagonal Speed-Lines */}
          <div
            className="pointer-events-none fixed inset-0 opacity-20 z-0"
            style={{
              backgroundImage: "radial-gradient(#0D9488 2px, transparent 2px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            className="pointer-events-none fixed inset-0 opacity-[0.05] z-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, #134E4A 0px, #134E4A 2px, transparent 2px, transparent 18px)",
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 pt-2.5">
            {errorMsg && (
              <div className="mb-2.5 flex items-center gap-2 p-2.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEE2E2] text-[#991B1B] text-xs font-black shadow-[3px_3px_0px_#134E4A]">
                <AlertTriangleSvg size={16} className="shrink-0" /> {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
              {/* Banner Kiri & Peluncuran Cepat */}
              <div className="lg:col-span-5">
                <section className="relative overflow-hidden rounded-2xl border-[3.5px] border-[#134E4A] bg-[#FEF3C7] p-3.5 sm:p-4 shadow-[4px_4px_0px_#134E4A]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border-2 border-[#134E4A] bg-[#0D9488] text-white text-[9px] font-black uppercase shadow-[1.5px_1.5px_0px_#134E4A]">
                          <GamepadSvg size={11} stroke="#FFFFFF" /> ARENA MABAR
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] text-[9px] font-black uppercase">
                          <ZapSvg size={11} />
                          <span>Live Battle</span>
                        </span>
                      </div>

                      <h1 className="font-display text-base sm:text-xl font-black text-[#134E4A] leading-tight">
                        Buka Lobi & Tantang Teman!
                      </h1>
                      <p className="mt-0.5 text-[10.5px] sm:text-xs font-bold text-[#134E4A]/80 leading-snug">
                        Pilih Deck Kuis favoritmu, bagikan PIN, dan rebut podium
                        #1!
                      </p>
                    </div>

                    <ArenaMabarHeroSvg className="w-20 h-16 sm:w-24 sm:h-20 shrink-0" />
                  </div>

                  {/* Ringkasan & Tombol di Desktop */}
                  <div className="hidden lg:block mt-3 pt-3 border-t-[2px] border-dashed border-[#134E4A]/25 space-y-2.5">
                    <div className="p-2.5 rounded-xl border-[2.5px] border-[#134E4A] bg-white shadow-[2.5px_2.5px_0px_#134E4A] flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-xl border-2 border-[#134E4A] ${activePack.iconBg} flex items-center justify-center shrink-0`}
                      >
                        <ActivePackIcon
                          size={20}
                          className="text-[#134E4A]"
                          stroke="#134E4A"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-[9px] font-black uppercase tracking-wider text-[#0D9488]">
                          Deck Siap Dimainkan ({activePack.questions.length}{" "}
                          Soal)
                        </span>
                        <p className="font-display font-black text-sm text-[#134E4A] truncate">
                          {activePack.title}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleCreateCasualRoom}
                      className="w-full py-3 px-4 rounded-xl border-[3px] border-[#134E4A] bg-[#0D9488] hover:bg-[#0F766E] text-white font-display font-black text-sm uppercase tracking-wide shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RocketSvg size={18} />
                      <span>
                        {loading
                          ? "Menyiapkan PIN..."
                          : "Buat PIN & Buka Lobi!"}
                      </span>
                    </button>
                  </div>
                </section>
              </div>

              {/* Pemilih Deck Kuis Kanan */}
              <div className="lg:col-span-7">
                <section className="flex flex-col rounded-2xl border-[3.5px] border-[#134E4A] bg-white p-3 sm:p-4 shadow-[4px_4px_0px_#134E4A]">
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b-[2px] border-dashed border-[#134E4A]/20">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-[#FEF08A] border-2 border-[#134E4A] flex items-center justify-center shrink-0">
                        <SparklesSvg size={12} stroke="#134E4A" />
                      </div>
                      <h2 className="font-display text-sm sm:text-base font-black text-[#134E4A] truncate">
                        Pilih Deck Kuis ({allCasualPacks.length})
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/member/ngaji-ceria/quiz/create")
                      }
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg border-[2px] border-[#134E4A] bg-[#FEF08A] hover:bg-[#FDE047] px-2.5 py-1 text-[10px] sm:text-[11px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                    >
                      <PlusSvg size={12} />
                      <span>Buat Kuis Sendiri</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5">
                    {allCasualPacks.map((pack) => {
                      const isSelected = selectedPackId === pack.id;
                      const quizBased = isQuizBasedPack(pack);
                      const PackIcon = pack.icon;

                      return (
                        <motion.button
                          key={pack.id}
                          type="button"
                          disabled={!quizBased}
                          whileTap={quizBased ? { scale: 0.98 } : undefined}
                          onClick={() => {
                            triggerBibiReaction("click");
                            soundManager.playSfx("tap");
                            setSelectedPackId(pack.id);
                          }}
                          className={`group relative overflow-hidden p-2.5 rounded-xl border-[3px] border-[#134E4A] text-left transition-all flex items-start gap-2.5 disabled:opacity-50 cursor-pointer ${
                            isSelected
                              ? "bg-[#CCFBF1] shadow-[3px_3px_0px_#134E4A] ring-2 ring-[#0D9488]"
                              : `${pack.cardAccent} hover:bg-[#FEF3C7] shadow-[2px_2px_0px_#134E4A]`
                          }`}
                        >
                          <PackCardArtworkSvg packId={pack.id} />

                          <div
                            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border-[2.5px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] ${pack.iconBg} text-[#134E4A] shrink-0`}
                          >
                            <PackIcon
                              size={20}
                              className="text-[#134E4A]"
                              stroke="#134E4A"
                            />
                          </div>

                          <div className="relative z-10 min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span
                                className={`text-[8.5px] font-black px-1.5 py-0.5 rounded border border-[#134E4A] text-white uppercase ${pack.badgeBg}`}
                              >
                                {pack.badge}
                              </span>
                              <span className="text-[9.5px] font-black text-[#134E4A]/70">
                                {pack.questions.length} Soal
                              </span>
                            </div>

                            <h3 className="font-display font-black text-xs sm:text-[13px] text-[#134E4A] leading-snug truncate">
                              {pack.title}
                            </h3>
                            <p className="mt-0.5 text-[10px] font-bold text-[#134E4A]/70 line-clamp-1 leading-tight">
                              {pack.description}
                            </p>
                          </div>

                          <div
                            className={`relative z-10 shrink-0 self-center w-5 h-5 rounded-md border-2 border-[#134E4A] flex items-center justify-center ${
                              isSelected
                                ? "bg-[#0D9488] text-white"
                                : "bg-white/80 text-transparent"
                            }`}
                          >
                            <CheckSvg size={11} stroke="currentColor" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Sticky Dock Mobile */}
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-2.5 bg-gradient-to-t from-[#F0FDF4] via-[#F0FDF4]/95 to-transparent">
            <div className="max-w-xl mx-auto rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFBEB] p-2 shadow-[0_-3px_0px_#134E4A,3px_3px_0px_#134E4A] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1 pl-1">
                <div
                  className={`w-8 h-8 rounded-lg border-2 border-[#134E4A] ${activePack.iconBg} flex items-center justify-center shrink-0`}
                >
                  <ActivePackIcon
                    size={16}
                    className="text-[#134E4A]"
                    stroke="#134E4A"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[8.5px] font-black uppercase text-[#0D9488] leading-none">
                    Deck Aktif ({activePack.questions.length} Soal)
                  </span>
                  <p className="font-display font-black text-[11px] text-[#134E4A] truncate mt-0.5">
                    {activePack.title}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleCreateCasualRoom}
                className="shrink-0 py-2.5 px-3.5 rounded-xl border-[2.5px] border-[#134E4A] bg-[#0D9488] active:bg-[#0F766E] text-white font-display font-black text-xs uppercase shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
              >
                <RocketSvg size={14} />
                <span>{loading ? "Membuat..." : "Buat PIN!"}</span>
              </button>
            </div>
          </div>
        </div>
      </NgajiCeriaLayout>
    );
  }

  return (
    <NgajiCeriaLayout
      title="Buat Room Ujian Resmi Ustadz"
      showBack={true}
      onBack={() => navigate("/member/ngaji-ceria/games")}
    >
      <div className="relative w-full bg-[#F0FDF4] pb-28 overflow-x-hidden select-none">
        <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 pt-3 space-y-3">
          <section className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] p-3 sm:p-4 shadow-[4px_4px_0px_#134E4A] space-y-2.5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border-2 border-[#134E4A] bg-[#EA580C] text-white text-[9px] font-black uppercase shadow-[1.5px_1.5px_0px_#134E4A]">
                  <CrownSvg size={11} stroke="#FFFFFF" /> PANEL USTADZ
                </span>
                <h1 className="font-display text-sm sm:text-lg font-black text-[#134E4A]">
                  Konfigurasi Room Ujian TPQ
                </h1>
              </div>

              <span className="rounded-lg border-2 border-[#134E4A] bg-white px-2 py-0.5 text-[9.5px] font-black text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]">
                Tier {userTier.toUpperCase()} · Maks {tierLimits.maxQ} Soal
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-0.5">
              <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl border-2 border-[#134E4A] bg-white">
                <span className="text-[9.5px] font-black uppercase text-[#134E4A] pl-1">
                  Mode:
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setRoomType("latihan")}
                    className={`py-0.5 px-2 rounded-md border border-[#134E4A] text-[10px] font-black cursor-pointer ${
                      roomType === "latihan"
                        ? "bg-[#0D9488] text-white"
                        : "bg-gray-100 text-[#134E4A]"
                    }`}
                  >
                    Latihan
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoomType("ujian_resmi")}
                    className={`py-0.5 px-2 rounded-md border border-[#134E4A] text-[10px] font-black cursor-pointer ${
                      roomType === "ujian_resmi"
                        ? "bg-[#EA580C] text-white"
                        : "bg-gray-100 text-[#134E4A]"
                    }`}
                  >
                    Ujian Resmi
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl border-2 border-[#134E4A] bg-white">
                <span className="text-[9.5px] font-black uppercase text-[#134E4A] pl-1">
                  KKM:
                </span>
                <input
                  type="range"
                  min={50}
                  max={95}
                  step={5}
                  value={kkm}
                  onChange={(e) => setKkm(Number(e.target.value))}
                  className="flex-1 accent-[#0D9488] cursor-pointer"
                />
                <span className="px-1.5 py-0.5 rounded-md border border-[#134E4A] bg-[#FEF08A] font-black text-[11px] text-[#134E4A]">
                  {kkm}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsRandomized(!isRandomized)}
                className={`p-1.5 rounded-xl border-2 border-[#134E4A] text-[11px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isRandomized
                    ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                    : "bg-white text-[#134E4A]"
                }`}
              >
                {isRandomized ? (
                  <CheckSvg size={13} stroke="#FFFFFF" />
                ) : (
                  <XSvg size={13} stroke="currentColor" />
                )}
                <span>{isRandomized ? "Soal Diacak" : "Soal Berurutan"}</span>
              </button>
            </div>
          </section>

          <section className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-3 sm:p-4 shadow-[4px_4px_0px_#134E4A] space-y-2.5">
            <div className="flex border-b-2 border-dashed border-[#134E4A]/20 pb-2 gap-1.5 flex-wrap justify-between items-center">
              <div className="flex gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab("bank")}
                  className={`px-2.5 py-1 rounded-lg border-2 border-[#134E4A] font-black text-[11px] cursor-pointer ${
                    activeTab === "bank"
                      ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                      : "bg-[#F0FDF4] text-[#134E4A]"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpenSvg size={13} />
                    <span>Bank Soal ({availableBank.length})</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("manual")}
                  className={`px-2.5 py-1 rounded-lg border-2 border-[#134E4A] font-black text-[11px] cursor-pointer ${
                    activeTab === "manual"
                      ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                      : "bg-[#F0FDF4] text-[#134E4A]"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <PencilSvg size={13} />
                    <span>+ Soal Manual</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("audio")}
                  className={`px-2.5 py-1 rounded-lg border-2 border-[#134E4A] font-black text-[11px] cursor-pointer ${
                    activeTab === "audio"
                      ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                      : "bg-[#F0FDF4] text-[#134E4A]"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Volume2Svg size={13} />
                    <span>+ Soal Audio</span>
                  </span>
                </button>
              </div>

              {activeTab === "bank" && (
                <div className="flex gap-1">
                  {(["tilawati", "tajwid", "nabi"] as QuestionCategory[]).map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2 py-0.5 rounded-md border-2 border-[#134E4A] text-[10px] font-black capitalize cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-[#FEF08A] text-[#134E4A]"
                            : "bg-white text-[#134E4A]/70"
                        }`}
                      >
                        {cat}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>

            {activeTab === "bank" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 max-h-64 overflow-y-auto p-1">
                {availableBank.map((q) => {
                  const isSelected = selectedQuestions.some(
                    (item) => item.id === q.id,
                  );
                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleQuestionSelection(q)}
                      className={`p-2 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2 ${
                        isSelected
                          ? "border-[#134E4A] bg-[#CCFBF1] shadow-[2px_2px_0px_#134E4A]"
                          : "border-[#134E4A]/25 bg-white hover:border-[#134E4A]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border-2 border-[#134E4A] flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-[#0D9488] text-white" : "bg-white"
                        }`}
                      >
                        {isSelected && <CheckSvg size={11} stroke="#FFFFFF" />}
                      </div>
                      <p className="text-[11.5px] font-black text-[#134E4A] line-clamp-1 flex-1">
                        {q.prompt}
                      </p>
                      <span className="text-[9.5px] font-bold text-[#134E4A]/60 shrink-0">
                        {q.timeLimitSeconds}d
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "manual" && (
              <form onSubmit={handleAddManualQuestion} className="space-y-2">
                <textarea
                  rows={2}
                  required
                  value={manualPrompt}
                  onChange={(e) => setManualPrompt(e.target.value)}
                  placeholder="Tulis pertanyaan kuis di sini..."
                  className="w-full rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] p-2 text-[11.5px] font-bold focus:outline-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {manualOptions.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-md border-2 border-[#134E4A] bg-[#0D9488] text-white flex items-center justify-center font-black text-[11px] shrink-0">
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
                        className="flex-1 rounded-md border-2 border-[#134E4A] px-2 py-1 text-[11.5px] font-bold focus:outline-none"
                      />
                      <input
                        type="radio"
                        name="correctOption"
                        checked={manualCorrect === opt.id}
                        onChange={() => setManualCorrect(opt.id)}
                        className="w-4 h-4 accent-[#0D9488]"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] font-black text-[11px] shadow-[2px_2px_0px_#134E4A] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusSvg size={13} /> Tambahkan ke Daftar Soal
                </button>
              </form>
            )}

            {activeTab === "audio" && (
              <form onSubmit={handleAddAudioQuestion} className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    required
                    value={audioPrompt}
                    onChange={(e) => setAudioPrompt(e.target.value)}
                    placeholder="Perintah tebak audio..."
                    className="rounded-xl border-2 border-[#134E4A] p-2 text-[11.5px] font-bold focus:outline-none"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      className="flex-1 rounded-xl border-2 border-[#134E4A] px-2 py-1.5 text-[11px] font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const audio = new Audio(
                          getAudioUrl(audioUrl) ?? audioUrl,
                        );
                        audio.play();
                      }}
                      className="px-2.5 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] cursor-pointer"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {audioOptions.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-md border-2 border-[#134E4A] bg-[#0D9488] text-white flex items-center justify-center font-black text-[11px] shrink-0">
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
                        className="flex-1 rounded-md border-2 border-[#134E4A] px-2 py-1 text-[11.5px] font-bold focus:outline-none"
                      />
                      <input
                        type="radio"
                        name="correctAudioOption"
                        checked={audioCorrect === opt.id}
                        onChange={() => setAudioCorrect(opt.id)}
                        className="w-4 h-4 accent-[#0D9488]"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] font-black text-[11px] shadow-[2px_2px_0px_#134E4A] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusSvg size={13} /> Tambahkan Soal Audio
                </button>
              </form>
            )}
          </section>
        </div>

        <div className="fixed bottom-0 inset-x-0 z-40 p-2.5 bg-gradient-to-t from-[#F0FDF4] via-[#F0FDF4]/95 to-transparent">
          <div className="max-w-5xl mx-auto rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFBEB] p-2 sm:px-3 shadow-[4px_4px_0px_#134E4A] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md border-2 border-[#134E4A] bg-[#FEF08A] text-[11px] font-black text-[#134E4A]">
                {selectedQuestions.length} / {tierLimits.maxQ} Soal
              </span>
              <span className="hidden sm:inline text-[11px] font-bold text-[#134E4A]/70">
                KKM {kkm} · {isRandomized ? "Acak" : "Urut"}
              </span>
            </div>

            <button
              type="button"
              disabled={loading || selectedQuestions.length === 0}
              onClick={handleCreateExamRoom}
              className="py-2 px-3.5 rounded-xl border-[2px] border-[#134E4A] bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-[11px] sm:text-xs shadow-[3px_3px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <RocketSvg size={16} />
              <span>
                {loading
                  ? "Membuat Room..."
                  : `Buka Room (${selectedQuestions.length} Soal)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
