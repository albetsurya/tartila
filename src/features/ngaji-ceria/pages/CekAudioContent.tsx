import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { latinToArabic } from "../utils/translit";
import { sanitizeAudioUrl } from "../utils/audioUrl";
import type { PageQuizData, QuizQuestion } from "../data/tilawatiQuizTypes";
import { loadTilawatiDataset } from "../data/tilawatiPageDatasets";
import { getQuestionAudioUrl } from "../data/tilawatiAudioQuestionMap";
import {
  invalidatePublishedTimeline,
  tilawatiEditorApi,
  saveTimelineEdit,
} from "../services/tilawatiEditorApi";
import {
  Play,
  Pause,
  Check,
  ClockSvg,
} from "../../../components/ui/CustomIcons";

export type CekAudioVariant = "member" | "admin";

type NoteOption =
  | "Datar"
  | "Naik"
  | "Turun"
  | "Datar-Turun"
  | "Datar-Naik-Turun"
  | "Datar-Naik-Naik-Turun";
type RepeatOption = "1x" | "2x" | "3x";

const NOTE_BADGES: { value: NoteOption; label: string }[] = [
  { value: "Datar", label: "Datar" },
  { value: "Naik", label: "Naik" },
  { value: "Turun", label: "Turun" },
  { value: "Datar-Turun", label: "Datar - Turun" },
  { value: "Datar-Naik-Turun", label: "Datar - Naik - Turun" },
  { value: "Datar-Naik-Naik-Turun", label: "Datar - Naik - Naik - Turun" },
];

const REPEAT_BADGES: { value: RepeatOption; label: string }[] = [
  { value: "1x", label: "1x" },
  { value: "2x", label: "2x" },
  { value: "3x", label: "3x" },
];

const parseHintTone = (
  hintTone: string,
): { notes: NoteOption[]; repeat: RepeatOption } => {
  const lower = hintTone.toLowerCase();
  const notes: NoteOption[] = [];
  const hasNaikMultiple =
    lower.includes("naik") &&
    lower.indexOf("naik") !== lower.lastIndexOf("naik");

  if (lower.includes("datar") && hasNaikMultiple && lower.includes("turun")) {
    notes.push("Datar-Naik-Naik-Turun");
  } else if (
    lower.includes("datar") &&
    lower.includes("naik") &&
    lower.includes("turun")
  ) {
    notes.push("Datar-Naik-Turun");
  } else if (lower.includes("datar") && lower.includes("turun")) {
    notes.push("Datar-Turun");
  } else {
    if (lower.includes("datar")) notes.push("Datar");
    if (lower.includes("naik")) notes.push("Naik");
    if (lower.includes("turun")) notes.push("Turun");
  }

  let repeat: RepeatOption = "1x";
  if (lower.includes("(3x)") || lower.includes(" 3x")) repeat = "3x";
  else if (lower.includes("(2x)") || lower.includes(" 2x")) repeat = "2x";
  else if (lower.includes("(1x)") || lower.includes(" 1x")) repeat = "1x";
  return { notes, repeat };
};

const generateHintTone = (
  notes: NoteOption[],
  repeat: RepeatOption,
): string => {
  if (notes.length === 0) return "Rost: Baris";
  if (notes.includes("Datar-Naik-Naik-Turun")) {
    return repeat === "1x"
      ? "Rost: Datar — Naik — Naik — Turun"
      : `Rost: Datar — Naik — Naik — Turun (${repeat})`;
  }
  if (notes.includes("Datar-Naik-Turun")) {
    return repeat === "1x"
      ? "Rost: Datar — Naik — Turun"
      : `Rost: Datar — Naik — Turun (${repeat})`;
  }
  if (notes.includes("Datar-Turun")) {
    return repeat === "1x"
      ? "Rost: Datar — Turun"
      : `Rost: Datar — Turun (${repeat})`;
  }
  if (notes.length === 1) return `Rost: Nada ${notes[0]}`;
  return repeat === "1x"
    ? `Rost: ${notes.join(" — ")}`
    : `Rost: ${notes.join(" — ")} (${repeat})`;
};

type EditorSegment = { sourceAudioUrl: string; start: string; end: string };
type EditorDraft = {
  arabic: string;
  transliteration: string;
  hintTone: string;
  sourceAudioUrl: string;
  outputAudioUrl: string;
  start: string;
  end: string;
};
type EditingQuestion = {
  questionIndex: number;
  question: QuizQuestion;
  audioUrl: string;
};

type TimelineClip = {
  id?: string;
  sequence: number;
  filename: string;
  type: "header" | "demo" | "footer" | "baris" | "isi" | string;
  duration: number;
  durasi?: number;
  audioUrl: string;
  teksArab?: string;
  teksLatin?: string;
  isPublished?: boolean;
};

const AUDIO_TEST_STORAGE_KEY = "ngaji-ceria:tilawati-audio-tested:v1";

export function CekAudioContent({ variant }: { variant: CekAudioVariant }) {
  const admin = variant === "admin";
  const timelineLocalHref = admin
    ? "/admin/timeline-local"
    : "/member/ngaji-ceria/cek-audio/timeline";
  const timelineCloudHref = admin
    ? "/admin/timeline-cloud"
    : "/member/ngaji-ceria/cek-audio/cloud-editor";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialJilid = Math.min(
    5,
    Math.max(1, Number(searchParams.get("jilid")) || 1),
  );
  const initialHal = Math.min(
    44,
    Math.max(1, Number(searchParams.get("hal")) || 1),
  );
  const [jilid, setJilid] = useState(initialJilid);
  const [hal, setHal] = useState(initialHal);

  const pageScrollRef = useRef<HTMLDivElement>(null);

  const [datasets, setDatasets] = useState<
    Record<number, Record<number, PageQuizData>>
  >({});
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([1, 2, 3, 4, 5].map((j) => loadTilawatiDataset(j)))
      .then((results) => {
        if (alive)
          setDatasets(Object.fromEntries(results.map((d, i) => [i + 1, d])));
      })
      .finally(() => {
        if (alive) setIsLoadingDatasets(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const pageData = datasets[jilid]?.[hal] ?? null;

  useEffect(() => {
    const paramJilid = Number(searchParams.get("jilid"));
    const paramHal = Number(searchParams.get("hal"));
    if (paramJilid && paramJilid !== jilid)
      setJilid(Math.min(5, Math.max(1, paramJilid)));
    if (paramHal && paramHal !== hal)
      setHal(Math.min(44, Math.max(1, paramHal)));
  }, [searchParams]);

  // Auto-scroll horizontal page numbers
  useEffect(() => {
    const activePageEl = document.getElementById(`page-btn-${hal}`);
    if (activePageEl && pageScrollRef.current) {
      const container = pageScrollRef.current;
      const scrollLeft =
        activePageEl.offsetLeft -
        container.offsetWidth / 2 +
        activePageEl.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [hal]);

  const updatePage = (newJilid: number, newHal: number) => {
    setJilid(newJilid);
    setHal(newHal);
    setSearchParams(
      { jilid: String(newJilid), hal: String(newHal) },
      { replace: true },
    );
  };

  const [playingId, setPlayingId] = useState<number | string | null>(null);
  const [playErrorId, setPlayErrorId] = useState<number | string | null>(null);
  const [testedAudio, setTestedAudio] = useState<Record<string, boolean>>(
    () => {
      try {
        const stored = window.localStorage.getItem(AUDIO_TEST_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    },
  );

  const [editingQuestion, setEditingQuestion] =
    useState<EditingQuestion | null>(null);
  const [editorDraft, setEditorDraft] = useState<EditorDraft | null>(null);
  const [editorTab, setEditorTab] = useState<"text" | "audio">("text");
  const [editorSegments, setEditorSegments] = useState<EditorSegment[]>([]);
  const [editorBusy, setEditorBusy] = useState(false);
  const [editorMessage, setEditorMessage] = useState("");

  const [timelineClips, setTimelineClips] = useState<TimelineClip[]>([]);
  const [publishedPayload, setPublishedPayload] = useState<any>(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineTextLinks, setTimelineTextLinks] = useState<
    Record<string, string>
  >({});
  const [timelineTextAdditions, setTimelineTextAdditions] = useState<
    QuizQuestion[]
  >([]);

  const isKelipatanEnam = hal % 6 === 0;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [jilid, hal]);

  const fetchTimelinePayload = useCallback(
    async (jilidValue: number, halValue: number, signal?: AbortSignal) => {
      const result = await tilawatiEditorApi.list(jilidValue, halValue, signal);
      const sourceClips = result.published?.timeline?.clips || result.clips;

      const clips: TimelineClip[] = sourceClips.map((rawClip, index) => {
        const clip = rawClip as any;
        const dur =
          clip.duration ||
          (clip.trimEnd !== undefined && clip.trimStart !== undefined
            ? clip.trimEnd - clip.trimStart
            : 0);
        return {
          id: clip.id || clip.audioUrl || "",
          sequence: index + 1,
          filename: clip.filename || clip.label || "",
          type: clip.type || clip.kind || "isi",
          duration: dur,
          durasi: dur,
          audioUrl: clip.audioUrl || clip.outputUrl || "",
          isPublished: Boolean(result.published),
        };
      });

      return {
        clips,
        textLinks: result.textLinks || {},
        textAdditions: result.textAdditions || [],
        published: result.published,
      };
    },
    [],
  );

  const refetchTimeline = useCallback(() => {
    let cancelled = false;
    const controller = new AbortController();
    setTimelineLoading(true);

    fetchTimelinePayload(jilid, hal, controller.signal)
      .then((result) => {
        if (!cancelled) {
          setTimelineClips(result.clips);
          setTimelineTextLinks(result.textLinks || {});
          setTimelineTextAdditions(result.textAdditions || []);
          setPublishedPayload(result.published);
        }
      })
      .finally(() => {
        if (!cancelled) setTimelineLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [jilid, hal, fetchTimelinePayload]);

  useEffect(() => {
    return refetchTimeline();
  }, [refetchTimeline]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ jilid?: number; page?: number }>)
        .detail;
      if (detail?.jilid === jilid && detail?.page === hal)
        void refetchTimeline();
    };
    window.addEventListener("ngajiceria:timeline-published", handler);
    return () =>
      window.removeEventListener("ngajiceria:timeline-published", handler);
  }, [jilid, hal, refetchTimeline]);

  const playAudio = (id: number | string, url: string) => {
    if (audioRef.current) audioRef.current.pause();
    if (!url) {
      setPlayingId(null);
      setPlayErrorId(id);
      return;
    }

    setPlayingId(id);
    setPlayErrorId(null);
    const audio = new Audio(sanitizeAudioUrl(url) ?? url);
    audioRef.current = audio;
    audio.play().catch(() => {
      setPlayingId(null);
      setPlayErrorId(id);
    });
    audio.onended = () => setPlayingId(null);
  };

  const getQuestionKey = (questionIndex: number) =>
    questionIndex === -1
      ? `${jilid}:${hal}:page`
      : `${jilid}:${hal}:${questionIndex}`;

  const setAudioTested = (keyOrIndex: number | string, tested: boolean) => {
    const key =
      typeof keyOrIndex === "number" && keyOrIndex === -1
        ? `${jilid}:${hal}:page`
        : typeof keyOrIndex === "string" && keyOrIndex.includes(":")
          ? keyOrIndex
          : `${jilid}:${hal}:${keyOrIndex}`;
    setTestedAudio((current) => {
      const next = { ...current, [key]: tested };
      try {
        window.localStorage.setItem(
          AUDIO_TEST_STORAGE_KEY,
          JSON.stringify(next),
        );
      } catch {}
      return next;
    });
  };

  const openEditor = (
    question: QuizQuestion,
    questionIndex: number,
    audioUrl: string,
  ) => {
    setEditingQuestion({ question, questionIndex, audioUrl });
    setEditorSegments([]);
    setEditorMessage("");
    setEditorTab("text");
    setEditorDraft({
      arabic: question.arabic,
      transliteration: question.transliterationParts.join("\n"),
      hintTone: question.hintTone,
      sourceAudioUrl: audioUrl,
      outputAudioUrl: audioUrl,
      start: "0",
      end: "",
    });

    if (audioUrl) {
      const audio = new Audio(sanitizeAudioUrl(audioUrl) ?? audioUrl);
      audio.onloadedmetadata = () => {
        setEditorDraft((current) =>
          current
            ? { ...current, end: String(audio.duration.toFixed(3)) }
            : current,
        );
      };
      audio.load();
    }
  };

  const closeEditor = () => {
    if (editorBusy) return;
    setEditingQuestion(null);
    setEditorDraft(null);
    setEditorSegments([]);
    setEditorMessage("");
  };

  const reloadAfterEditorSave = () => {
    invalidatePublishedTimeline(jilid, hal);
  };

  const editorKey = editingQuestion
    ? `${jilid}:${hal}:${editingQuestion.question.id}`
    : "";

  const saveEditorText = async () => {
    if (!editingQuestion || !editorDraft) return;
    setEditorBusy(true);
    try {
      await saveTimelineEdit(jilid, hal, {
        textEdit: {
          key: editorKey,
          arabic: editorDraft.arabic,
          transliterationParts: editorDraft.transliteration
            .split(/[\n,]/)
            .map((part) => part.trim())
            .filter(Boolean),
          hintTone: editorDraft.hintTone,
        },
      });
      closeEditor();
      reloadAfterEditorSave();
    } catch (error) {
      setEditorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setEditorBusy(false);
    }
  };

  const editorRequest = async (
    action: string,
    body: Record<string, unknown>,
  ) => {
    const response = await fetch(
      `/api/tilawati-editor?action=${encodeURIComponent(action)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    const result = await response.json();
    if (!response.ok || !result.ok)
      throw new Error(result.message || "Gagal menyimpan perubahan editor");
    return result;
  };

  const saveEditorAudio = async (action: "cut" | "merge") => {
    if (!editingQuestion || !editorDraft || !editorDraft.outputAudioUrl) return;
    setEditorBusy(true);
    try {
      const segments =
        action === "merge"
          ? editorSegments
          : [
              {
                sourceAudioUrl: editorDraft.sourceAudioUrl,
                start: editorDraft.start,
                end: editorDraft.end,
              },
            ];
      await editorRequest(action, {
        key: editorKey,
        sourceAudioUrl: editorDraft.sourceAudioUrl,
        outputAudioUrl: editorDraft.outputAudioUrl,
        start: editorDraft.start,
        end: editorDraft.end,
        segments,
      });
      closeEditor();
      reloadAfterEditorSave();
    } catch (error) {
      setEditorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setEditorBusy(false);
    }
  };

  const addEditorSegment = () => {
    if (!editorDraft?.sourceAudioUrl || !editorDraft.start || !editorDraft.end)
      return;
    setEditorSegments((segments) => [
      ...segments,
      {
        sourceAudioUrl: editorDraft.sourceAudioUrl,
        start: editorDraft.start,
        end: editorDraft.end,
      },
    ]);
  };

  const questionRows = pageData
    ? pageData.questions
        .map((q, questionIndex) => ({
          q,
          questionIndex,
          audioUrl:
            timelineTextLinks[String(q.id)] ||
            getQuestionAudioUrl(
              q,
              jilid,
              hal,
              questionIndex,
              Boolean(pageData.questions[0]?.isOpening),
            ),
        }))
        .filter(
          ({ questionIndex }) => !(isKelipatanEnam && questionIndex === 0),
        )
    : [];

  const hasPublishedData = Boolean(publishedPayload);

  const audioItems = hasPublishedData
    ? timelineClips.map((clip, index) => {
        const publishedTexts = publishedPayload?.timeline?.texts || [];
        const publishedQuestions = publishedPayload?.questions || [];
        const textEdits = publishedPayload?.textEdits || {};
        const currentQuestionKey = `${jilid}:${hal}:${clip.id || index}`;

        const textEdit = textEdits[currentQuestionKey];
        const textMatch = publishedTexts.find(
          (t: any) => String(t.clipId) === String(clip.id),
        );
        const questionMatch = publishedQuestions.find(
          (q: any) =>
            String(q.id) === String(textMatch?.id) ||
            (q.audioUrl && q.audioUrl === clip.audioUrl),
        );

        const cleanClipArabic = (clip.teksArab || "").replace(/\s+/g, "");
        const staticMatch = pageData?.questions.find(
          (q) =>
            (cleanClipArabic &&
              q.arabic.replace(/\s+/g, "") === cleanClipArabic) ||
            String(q.id) === String(clip.id),
        );

        return {
          id: clip.id || `clip-${index + 1}`,
          index,
          sequence: clip.sequence || index + 1,
          teksArab:
            textEdit?.arabic ||
            textMatch?.arabic ||
            questionMatch?.arabic ||
            staticMatch?.arabic ||
            clip.teksArab ||
            "",
          teksLatin:
            textEdit?.transliterationParts?.join(" - ") ||
            textMatch?.transliterationParts?.join(" - ") ||
            questionMatch?.transliterationParts?.join(" - ") ||
            staticMatch?.transliterationParts.join(" - ") ||
            clip.teksLatin ||
            "",
          durasi: clip.durasi ?? clip.duration ?? 0,
          audioUrl: clip.audioUrl,
          filename: clip.filename,
          type: clip.type || "isi",
          isPublished: true,
          hintTone:
            textEdit?.hintTone ||
            textMatch?.hintTone ||
            questionMatch?.hintTone ||
            staticMatch?.hintTone ||
            (clip.type === "header"
              ? "Rost: Judul"
              : `Rost: Baris ${index + 1}`),
          rawQuestion: questionMatch || staticMatch,
          questionKey: currentQuestionKey,
        };
      })
    : questionRows.map(({ q, questionIndex, audioUrl }, idx) => {
        const questionKey = getQuestionKey(questionIndex);
        const clipMatch = timelineClips.find(
          (c) =>
            c.audioUrl === audioUrl ||
            String(c.sequence) === String(questionIndex + 1),
        );
        return {
          id: q.id,
          index: idx,
          sequence: idx + 1,
          teksArab: q.arabic,
          teksLatin: q.transliterationParts.join(" - "),
          durasi: clipMatch?.duration || 0,
          audioUrl: audioUrl,
          filename: audioUrl ? audioUrl.split("/").pop() || "" : "",
          type: q.isOpening ? "header" : "isi",
          isPublished: false,
          hintTone: q.hintTone,
          rawQuestion: q,
          questionKey,
        };
      });

  // --- PERUBAHAN: Sorting item tanpa audio ke paling bawah ---
  const sortedAudioItems = [...audioItems].sort((a, b) => {
    if (a.audioUrl && !b.audioUrl) return -1;
    if (!a.audioUrl && b.audioUrl) return 1;
    return 0;
  });

  const testableAudioItems = audioItems.filter((item) =>
    Boolean(item.audioUrl),
  );
  const testedCount = testableAudioItems.filter(
    (item) =>
      testedAudio[item.questionKey] ||
      testedAudio[getQuestionKey(item.index)] ||
      testedAudio[`${jilid}:${hal}:${item.id}`],
  ).length;
  const currentDraftParse = editorDraft
    ? parseHintTone(editorDraft.hintTone)
    : { notes: [] as NoteOption[], repeat: "1x" as RepeatOption };

  return (
    <div
      className={
        admin
          ? "mx-auto max-w-6xl p-4 pb-24 md:p-6"
          : "p-4 max-w-6xl mx-auto min-h-screen bg-[#F0FDF4]/50 pb-24"
      }
    >
      {/* Jilid Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-2 scrollbar-none">
        {[1, 2, 3, 4, 5].map((j) => (
          <button
            key={j}
            onClick={() => {
              updatePage(j, 1);
              if (audioRef.current) audioRef.current.pause();
              setPlayingId(null);
            }}
            className={`flex-1 min-w-[54px] py-2 rounded-xl font-black text-xs transition-all active:scale-95 text-center ${jilid === j ? "bg-[#0D9488] text-white shadow-[3px_3px_0px_#134E4A]" : "bg-white text-[#134e4a]/70 border-2 border-[#134E4A]/20 hover:bg-[#F0FDF4]"}`}
          >
            Jilid {j}
          </button>
        ))}
      </div>

      {/* Horizontal Page Navigator (Tanpa Select) */}
      <div
        ref={pageScrollRef}
        className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide snap-x"
      >
        {Array.from({ length: 44 }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            id={`page-btn-${pageNum}`}
            onClick={() => updatePage(jilid, pageNum)}
            className={`snap-center shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all border-2 ${
              hal === pageNum
                ? "bg-[#FF6B6B] text-white border-[#134E4A] shadow-[2px_2px_0px_#134E4A] scale-110"
                : "bg-white text-[#134E4A] border-[#134E4A]/20 hover:border-[#134E4A]"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      {/* Status & Timeline Links */}
      <section className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 rounded-2xl border-2 border-[#134E4A] bg-white px-4 py-3 shadow-[3px_3px_0px_#134E4A]">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs font-black text-[#0F766E]">
              Halaman {hal}
            </div>
            <div className="text-[10px] font-bold text-gray-500">
              {testedCount}/{testableAudioItems.length} audio teruji
            </div>
          </div>
          <label className="flex items-center gap-1.5 rounded-lg border-2 border-[#0D9488]/30 bg-[#F0FDF4] px-3 py-1.5 text-xs font-black text-[#0F766E] cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(testedAudio[`${jilid}:${hal}:page`])}
              onChange={(event) => setAudioTested(-1, event.target.checked)}
              className="w-4 h-4 accent-[#0D9488]"
            />
            Lolos
          </label>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(`${timelineLocalHref}?jilid=${jilid}&hal=${hal}`)
            }
            className="rounded-lg bg-[#0D9488] px-3 py-2 text-[10px] font-black text-white shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none"
          >
            Editor Lokal
          </button>
          <button
            onClick={() =>
              navigate(`${timelineCloudHref}?jilid=${jilid}&hal=${hal}`)
            }
            className="rounded-lg bg-[#0F766E] px-3 py-2 text-[10px] font-black text-white shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none"
          >
            Cloud Editor
          </button>
        </div>
      </section>

      {/* GRID LAYOUT UNTUK KARTU AUDIO */}
      {sortedAudioItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 pb-24">
          {sortedAudioItems.map((item) => {
            const isPlaying = playingId === item.id;
            const hasAudio = Boolean(item.audioUrl);

            // Warna Card Orange/Merah jika tidak ada audio
            const cardColorClass = hasAudio
              ? isPlaying
                ? "border-[#0D9488] bg-[#F2FDF5] shadow-[3px_3px_0px_#0D9488]"
                : "border-[#134E4A] bg-white shadow-[3px_3px_0px_#134E4A]"
              : "border-[#DC2626] bg-[#FEF2F2] shadow-[3px_3px_0px_#DC2626]";

            return (
              <div
                key={item.id}
                className={`flex flex-col h-full p-2.5 md:p-3.5 border-2 transition-colors rounded-xl ${cardColorClass}`}
              >
                {/* Header Card */}
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`text-[9px] md:text-[10px] font-black px-1.5 py-0.5 rounded border uppercase ${hasAudio ? "text-[#134e4a]/60 bg-gray-100 border-gray-200" : "text-red-700 bg-red-100 border-red-200"}`}
                  >
                    #{item.sequence} · {item.type}
                  </span>
                  {item.durasi > 0 && (
                    <span className="flex items-center gap-1 font-mono text-[9px] font-black text-[#0F766E]">
                      <ClockSvg size={10} stroke="#0F766E" />
                      {item.durasi.toFixed(2)}s
                    </span>
                  )}
                </div>

                {/* Teks Arab & Latin */}
                <div className="flex-1 flex flex-col justify-center mb-2 md:mb-3">
                  <div className="font-arabic text-xl md:text-2xl text-right pr-1 md:pr-2 text-teal-900 leading-snug line-clamp-3">
                    {item.teksArab || "(Belum ada teks)"}
                  </div>
                  <div className="text-[10px] md:text-[11px] font-bold text-gray-500 line-clamp-2 mt-1">
                    [{item.teksLatin}]
                  </div>
                </div>

                {/* Hint Tone Badge */}
                <div className="mb-2 md:mb-3">
                  <span className="inline-block rounded bg-[#FEF08A] px-1.5 md:px-2 py-0.5 md:py-1 text-[8px] md:text-[9px] font-bold text-[#854D0E] border border-[#D97706] truncate w-full">
                    {item.hintTone}
                  </span>
                </div>

                {/* Actions (Footer Card) */}
                <div className="mt-auto pt-2 border-t-2 border-[#134E4A]/10 flex flex-wrap items-center justify-between gap-1.5 md:gap-2">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <button
                      disabled={!hasAudio}
                      onClick={() => {
                        if (!hasAudio) return;
                        isPlaying
                          ? (audioRef.current?.pause(), setPlayingId(null))
                          : playAudio(item.id, item.audioUrl);
                      }}
                      className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full text-white transition-transform active:scale-90 ${
                        !hasAudio
                          ? "bg-gray-400 cursor-not-allowed"
                          : isPlaying
                            ? "bg-red-500"
                            : "bg-[#0D9488]"
                      }`}
                    >
                      {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                    <button
                      onClick={() => {
                        const questionObj = item.rawQuestion || {
                          id: item.id,
                          arabic: item.teksArab,
                          transliterationParts: item.teksLatin
                            ? item.teksLatin.split(" - ")
                            : [],
                          options: [],
                          hintTone: item.hintTone || "Rost: Baris",
                          audioUrl: item.audioUrl || "",
                          audioMappingComplete: true,
                        };
                        openEditor(questionObj, item.index, item.audioUrl);
                      }}
                      className="rounded-lg border-2 border-[#134E4A] bg-white px-1.5 md:px-2 py-0.5 md:py-1 text-[9px] md:text-[10px] font-black text-[#134E4A] shadow-[1px_1px_0px_#134E4A] active:translate-y-[1px] active:shadow-none"
                    >
                      Edit
                    </button>
                  </div>
                  <label
                    className={`flex items-center gap-1 ${hasAudio ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <input
                      type="checkbox"
                      disabled={!hasAudio}
                      checked={Boolean(testedAudio[item.questionKey])}
                      onChange={(e) =>
                        setAudioTested(item.questionKey, e.target.checked)
                      }
                      className="h-3 w-3 md:h-3.5 md:w-3.5 accent-[#0D9488]"
                    />
                    <span className="text-[8px] md:text-[9px] font-black text-gray-500">
                      Uji
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border-2 border-[#134E4A] text-center shadow-[3px_3px_0px_#134E4A]">
          <p className="text-xs text-gray-500">Audio belum tersedia.</p>
        </div>
      )}

      {/* MODAL / BOTTOM SHEET EDITOR (Responsive) */}
      <AnimatePresence>
        {editingQuestion && editorDraft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditor}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center"
          >
            <motion.div
              initial={{ y: 50, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 50, scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-h-[90vh] md:max-h-[85vh] md:w-[650px] flex flex-col bg-[#F0FDF4] rounded-t-[32px] md:rounded-[32px] border-t-[3px] md:border-[3px] border-[#134E4A] shadow-[0px_-8px_0px_rgba(19,78,74,0.2)] md:shadow-[8px_8px_0px_#134E4A]"
            >
              <div className="flex items-center justify-between p-4 md:p-5 border-b-[3px] border-[#134E4A]/10 bg-white rounded-t-[32px] md:rounded-t-[28px]">
                <div>
                  <h3 className="font-black text-[#134E4A] text-lg md:text-xl">
                    Edit Item
                  </h3>
                  <p className="text-[10px] md:text-xs font-bold text-[#0D9488]">
                    #{editingQuestion.question.id}
                  </p>
                </div>
                <button
                  onClick={closeEditor}
                  className="rounded-full border-2 border-[#134E4A] bg-white p-2 shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none hover:bg-gray-50 transition-colors"
                >
                  <span className="font-black text-xs">Tutup</span>
                </button>
              </div>

              <div className="flex gap-2 p-2 md:p-4 bg-white border-b-2 border-[#134E4A]/10">
                <button
                  onClick={() => setEditorTab("text")}
                  className={`flex-1 rounded-xl py-2.5 text-xs md:text-sm font-black transition-all ${editorTab === "text" ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]" : "bg-white text-[#134E4A] border-2 border-[#134E4A]/20 hover:bg-gray-50"}`}
                >
                  Teks & Nada
                </button>
                <button
                  onClick={() => setEditorTab("audio")}
                  className={`flex-1 rounded-xl py-2.5 text-xs md:text-sm font-black transition-all ${editorTab === "audio" ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]" : "bg-white text-[#134E4A] border-2 border-[#134E4A]/20 hover:bg-gray-50"}`}
                >
                  Audio & Segmen
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-5">
                {editorTab === "text" && (
                  <>
                    <label className="block text-xs md:text-sm font-black text-[#134e4a]">
                      Teks Arab
                      <textarea
                        value={editorDraft.arabic}
                        onChange={(e) =>
                          setEditorDraft({
                            ...editorDraft,
                            arabic: e.target.value,
                          })
                        }
                        rows={2}
                        dir="rtl"
                        className="mt-1 w-full rounded-xl border-2 border-[#134E4A]/20 bg-white p-3 text-right font-arabic text-xl md:text-2xl leading-relaxed outline-none focus:border-[#0D9488]"
                      />
                    </label>
                    <label className="block text-xs md:text-sm font-black text-[#134e4a]">
                      Transliterasi
                      <textarea
                        value={editorDraft.transliteration}
                        onChange={(e) => {
                          const val = e.target.value;
                          const parts = val.split("\n");
                          const autoArabic = parts
                            .map((p) => latinToArabic(p.trim()))
                            .filter(Boolean)
                            .join(" ");
                          setEditorDraft({
                            ...editorDraft,
                            transliteration: val,
                            arabic: autoArabic || editorDraft.arabic,
                          });
                        }}
                        rows={2}
                        className="mt-1 w-full rounded-xl border-2 border-[#134E4A]/20 bg-white p-3 text-sm outline-none focus:border-[#0D9488]"
                      />
                    </label>
                    <div className="rounded-xl border-2 border-[#134E4A]/20 bg-white p-3 md:p-4">
                      <div className="text-xs md:text-sm font-black text-[#134e4a] mb-3">
                        Pengaturan Nada (Hint Tone)
                      </div>
                      <div className="mb-4 p-2 md:p-3 rounded-lg bg-[#FEF08A] border border-[#D97706] text-xs md:text-sm font-bold text-[#854D0E]">
                        {editorDraft.hintTone}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {NOTE_BADGES.map((badge) => {
                          const isSelected = currentDraftParse.notes.includes(
                            badge.value,
                          );
                          return (
                            <button
                              key={badge.value}
                              type="button"
                              onClick={() => {
                                let nextNotes = [...currentDraftParse.notes];
                                const isCombined = [
                                  "Datar-Turun",
                                  "Datar-Naik-Turun",
                                  "Datar-Naik-Naik-Turun",
                                ].includes(badge.value);
                                if (isSelected) {
                                  nextNotes = nextNotes.filter(
                                    (n) => n !== badge.value,
                                  );
                                } else {
                                  if (isCombined) {
                                    nextNotes = nextNotes.filter(
                                      (n) => !badge.value.includes(n),
                                    );
                                  } else {
                                    nextNotes = nextNotes.filter(
                                      (n) => !n.includes(badge.value),
                                    );
                                  }
                                  nextNotes.push(badge.value);
                                }
                                setEditorDraft({
                                  ...editorDraft,
                                  hintTone: generateHintTone(
                                    nextNotes,
                                    currentDraftParse.repeat,
                                  ),
                                });
                              }}
                              className={`rounded-full border-2 px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-black transition-all ${isSelected ? "border-[#FF6B6B] bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#DC2626]" : "border-[#134E4A] bg-white text-[#134E4A] active:bg-[#F0FDF4] hover:bg-gray-50"}`}
                            >
                              {badge.label}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {REPEAT_BADGES.map((badge) => {
                          const isSelected =
                            currentDraftParse.repeat === badge.value;
                          return (
                            <button
                              key={badge.value}
                              type="button"
                              onClick={() =>
                                setEditorDraft({
                                  ...editorDraft,
                                  hintTone: generateHintTone(
                                    currentDraftParse.notes,
                                    badge.value,
                                  ),
                                })
                              }
                              className={`rounded-full border-2 px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-black transition-all ${isSelected ? "border-[#0D9488] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]" : "border-[#134E4A] bg-white text-[#134E4A] active:bg-[#F0FDF4] hover:bg-gray-50"}`}
                            >
                              {badge.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
                {editorTab === "audio" && (
                  <>
                    <label className="block text-xs md:text-sm font-black text-[#134e4a]">
                      Sumber Audio
                      <select
                        value={editorDraft.sourceAudioUrl}
                        onChange={(e) => {
                          const clip = timelineClips.find(
                            (i) => i.audioUrl === e.target.value,
                          );
                          const duration = clip?.duration || 0;
                          setEditorDraft({
                            ...editorDraft,
                            sourceAudioUrl: e.target.value,
                            start: "0",
                            end: duration
                              ? String(duration.toFixed(3))
                              : editorDraft.end,
                          });
                        }}
                        className="mt-1 w-full rounded-xl border-2 border-[#134E4A]/20 bg-white p-3 text-xs md:text-sm outline-none focus:border-[#0D9488]"
                      >
                        <option value="">Pilih audio...</option>
                        {timelineClips.map((clip) => (
                          <option key={clip.audioUrl} value={clip.audioUrl}>
                            #{clip.sequence} · {clip.filename} (
                            {clip.duration.toFixed(2)}s)
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <label className="text-xs md:text-sm font-black text-[#134e4a]">
                        Mulai (s)
                        <input
                          type="number"
                          step="0.001"
                          value={editorDraft.start}
                          onChange={(e) =>
                            setEditorDraft({
                              ...editorDraft,
                              start: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded-xl border-2 border-[#134E4A]/20 bg-white p-3 text-sm outline-none focus:border-[#0D9488]"
                        />
                      </label>
                      <label className="text-xs md:text-sm font-black text-[#134e4a]">
                        Selesai (s)
                        <input
                          type="number"
                          step="0.001"
                          value={editorDraft.end}
                          onChange={(e) =>
                            setEditorDraft({
                              ...editorDraft,
                              end: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded-xl border-2 border-[#134E4A]/20 bg-white p-3 text-sm outline-none focus:border-[#0D9488]"
                        />
                      </label>
                    </div>
                    <label className="block text-xs md:text-sm font-black text-[#134e4a]">
                      Output URL
                      <input
                        value={editorDraft.outputAudioUrl}
                        onChange={(e) =>
                          setEditorDraft({
                            ...editorDraft,
                            outputAudioUrl: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-xl border-2 border-[#134E4A]/20 bg-white p-3 text-xs md:text-sm outline-none focus:border-[#0D9488]"
                      />
                    </label>
                    {editorSegments.length > 0 && (
                      <div className="rounded-xl border-2 border-[#134E4A]/20 bg-white p-3 md:p-4">
                        <div className="mb-2 text-xs md:text-sm font-black text-[#134e4a]">
                          Segmen Gabungan:
                        </div>
                        {editorSegments.map((seg, i) => (
                          <div
                            key={i}
                            className="text-[10px] md:text-xs text-gray-500 truncate mb-1"
                          >
                            {i + 1}. {seg.sourceAudioUrl} ({seg.start}-{seg.end}
                            s)
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 md:gap-3">
                      <button
                        onClick={addEditorSegment}
                        className="flex-1 rounded-xl border-2 border-[#134E4A] bg-white px-3 py-2.5 text-xs md:text-sm font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none hover:bg-gray-50"
                      >
                        Tambah Segmen
                      </button>
                      <button
                        onClick={() => saveEditorAudio("merge")}
                        disabled={editorSegments.length === 0}
                        className="flex-1 rounded-xl bg-[#0D9488] px-3 py-2.5 text-xs md:text-sm font-black text-white shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none disabled:opacity-50"
                      >
                        Gabung
                      </button>
                    </div>
                  </>
                )}
                {editorMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs md:text-sm font-bold text-red-700">
                    {editorMessage}
                  </div>
                )}
              </div>

              <div className="p-4 md:p-5 bg-white border-t-2 border-[#134E4A]/10 md:rounded-b-[28px] pb-6 md:pb-5">
                {editorTab === "text" ? (
                  <button
                    onClick={saveEditorText}
                    disabled={editorBusy}
                    className="w-full rounded-xl bg-[#134E4A] py-3.5 text-sm md:text-base font-black text-white shadow-[3px_3px_0px_#0D9488] active:translate-y-[2px] active:shadow-none disabled:opacity-50 transition-all"
                  >
                    {editorBusy ? "Menyimpan..." : "Simpan Teks & Nada"}
                  </button>
                ) : (
                  <button
                    onClick={() => saveEditorAudio("cut")}
                    disabled={
                      editorBusy ||
                      !editorDraft.sourceAudioUrl ||
                      !editorDraft.outputAudioUrl
                    }
                    className="w-full rounded-xl bg-[#0D9488] py-3.5 text-sm md:text-base font-black text-white shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none disabled:opacity-50 transition-all"
                  >
                    {editorBusy ? "Memproses..." : "Potong & Simpan Audio"}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
