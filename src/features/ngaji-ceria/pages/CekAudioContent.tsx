import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { latinToArabic } from "../utils/translit";
import { sanitizeAudioUrl } from "../utils/audioUrl";
import type { PageQuizData, QuizQuestion } from "../data/tilawatiQuizTypes";
import { loadTilawatiDataset } from "../data/tilawatiPageDatasets";
import { getQuestionAudioUrl } from "../data/tilawatiAudioQuestionMap";
import { invalidatePublishedTimeline } from "../services/tilawatiEditorApi";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
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

const parseHintTone = (hintTone: string): {
  notes: NoteOption[];
  repeat: RepeatOption;
} => {
  const lower = hintTone.toLowerCase();
  const notes: NoteOption[] = [];

  // Check for specific sequences first (order matters in the string)
  const hasNaikMultiple =
    lower.includes("naik") && lower.indexOf("naik") !== lower.lastIndexOf("naik");

  // Datar-Naik-Naik-Turun: has Datar + Naik twice + Turun
  if (
    lower.includes("datar") &&
    hasNaikMultiple &&
    lower.includes("turun")
  ) {
    notes.push("Datar-Naik-Naik-Turun");
  } else if (lower.includes("datar") && lower.includes("naik") && lower.includes("turun")) {
    notes.push("Datar-Naik-Turun");
  } else if (lower.includes("datar") && lower.includes("turun")) {
    notes.push("Datar-Turun");
  } else {
    // Single notes - check in order Datar, Naik, Turun
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
  if (notes.length === 1) {
    return `Rost: Nada ${notes[0]}`;
  }
  return repeat === "1x"
    ? `Rost: ${notes.join(" — ")}`
    : `Rost: ${notes.join(" — ")} (${repeat})`;
};

type EditorSegment = {
  sourceAudioUrl: string;
  start: string;
  end: string;
};

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

  const [datasets, setDatasets] = useState<Record<number, Record<number, PageQuizData>>>({});
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(true);

  // Preload dataset jilid 1-5 (Jilid 2-6 lazy-loaded)
  useEffect(() => {
    let alive = true;
    Promise.all([1, 2, 3, 4, 5].map((j) => loadTilawatiDataset(j)))
      .then((results) => {
        if (alive) {
          setDatasets(Object.fromEntries(results.map((d, i) => [i + 1, d])));
        }
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
  const editorDraftParse = editorDraft
    ? parseHintTone(editorDraft.hintTone)
    : { notes: [] as NoteOption[], repeat: "1x" as RepeatOption };
  const [editedHintTones, setEditedHintTones] = useState<Record<string, string>>({});
  const [cardSaveMessage, setCardSaveMessage] = useState("");
  const [editorSegments, setEditorSegments] = useState<EditorSegment[]>([]);
  const [editorBusy, setEditorBusy] = useState(false);
  const [editorMessage, setEditorMessage] = useState("");
  const [timelineClips, setTimelineClips] = useState<TimelineClip[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineMessage, setTimelineMessage] = useState("");
  const [selectedTimelineUrl, setSelectedTimelineUrl] = useState("");
  const [timelineStart, setTimelineStart] = useState("0");
  const [timelineEnd, setTimelineEnd] = useState("");
  const [timelineCutPoint, setTimelineCutPoint] = useState("0");
  const [selectedMergeUrls, setSelectedMergeUrls] = useState<string[]>([]);
  const [draggingTimelineHandle, setDraggingTimelineHandle] = useState<
    "start" | "end" | "cut" | null
  >(null);
  const [draggingTimelineUrl, setDraggingTimelineUrl] = useState("");
  const [draggingTextId, setDraggingTextId] = useState("");
  const [timelineTextLinks, setTimelineTextLinks] = useState<
    Record<string, string>
  >({});
  const [timelineTextAdditions, setTimelineTextAdditions] = useState<
    QuizQuestion[]
  >([]);
  const selectedTimelineElement = useRef<HTMLButtonElement | null>(null);

  // Check if current page is kelipatan 6 (Latihan-latihan bacaan)
  const isKelipatanEnam = hal % 6 === 0;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [jilid, hal]);

  useEffect(() => {
    let cancelled = false;
    setTimelineLoading(true);
    setTimelineMessage("");
    fetch(`/api/tilawati-editor?action=list&jilid=${jilid}&hal=${hal}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.ok)
          throw new Error(result.message || "Gagal membaca timeline audio");
        return result as {
          clips: TimelineClip[];
          textLinks?: Record<string, string>;
          textAdditions?: QuizQuestion[];
        };
      })
      .then((result) => {
        if (!cancelled) {
          setTimelineClips(result.clips);
          setTimelineTextLinks(result.textLinks || {});
          setTimelineTextAdditions(result.textAdditions || []);
          setSelectedTimelineUrl("");
          setTimelineStart("0");
          setTimelineEnd("");
          setTimelineCutPoint("0");
          setSelectedMergeUrls([]);
        }
      })
      .catch((error) => {
        if (!cancelled)
          setTimelineMessage(
            error instanceof Error ? error.message : String(error),
          );
      })
      .finally(() => {
        if (!cancelled) setTimelineLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [jilid, hal]);

  const playAudio = (id: number | string, url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (!url) {
      setPlayingId(null);
      setPlayErrorId(id);
      return;
    }
    setPlayingId(id);
    setPlayErrorId(null);
    const audio = new Audio(sanitizeAudioUrl(url) ?? url);
    audioRef.current = audio;
    audio.play().catch((e) => {
      console.warn("Direct slice play failed", e);
      setPlayingId(null);
      setPlayErrorId(id);
    });
    audio.onended = () => {
      setPlayingId(null);
    };
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
      } catch {
        // Persistensi lokal tidak boleh mengganggu pemutaran audio.
      }
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

  const selectedTimelineClip =
    timelineClips.find((clip) => clip.audioUrl === selectedTimelineUrl) || null;
  const timelineTotalDuration = timelineClips.reduce(
    (total, clip) => total + clip.duration,
    0,
  );

  const selectTimelineClip = (clip: TimelineClip) => {
    setSelectedTimelineUrl(clip.audioUrl);
    setTimelineStart("0");
    setTimelineEnd(String(clip.duration.toFixed(3)));
    setTimelineCutPoint(String((clip.duration / 2).toFixed(3)));
    if (editorDraft) {
      setEditorDraft({
        ...editorDraft,
        sourceAudioUrl: clip.audioUrl,
        start: "0",
        end: String(clip.duration.toFixed(3)),
      });
    }
  };

  const selectEditorSourceAudio = (audioUrl: string) => {
    const clip = timelineClips.find((item) => item.audioUrl === audioUrl);
    setSelectedTimelineUrl(audioUrl);
    if (!editorDraft) return;
    const duration = clip?.duration || 0;
    setEditorDraft({
      ...editorDraft,
      sourceAudioUrl: audioUrl,
      start: "0",
      end: duration ? String(duration.toFixed(3)) : editorDraft.end,
    });
    if (clip) {
      setTimelineStart("0");
      setTimelineEnd(String(duration.toFixed(3)));
      setTimelineCutPoint(String((duration / 2).toFixed(3)));
    }
  };

  useEffect(() => {
    if (!draggingTimelineHandle || !selectedTimelineClip) return;
    const handlePointerMove = (event: PointerEvent) => {
      const element = selectedTimelineElement.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const ratio = Math.min(
        1,
        Math.max(0, (event.clientX - rect.left) / rect.width),
      );
      const value = ratio * selectedTimelineClip.duration;
      if (draggingTimelineHandle === "start") {
        const end = Number(timelineEnd) || selectedTimelineClip.duration;
        setTimelineStart(
          String(Math.min(value, Math.max(0, end - 0.001)).toFixed(3)),
        );
      } else if (draggingTimelineHandle === "end") {
        const start = Number(timelineStart) || 0;
        setTimelineEnd(
          String(
            Math.max(
              value,
              Math.min(selectedTimelineClip.duration, start + 0.001),
            ).toFixed(3),
          ),
        );
      } else {
        setTimelineCutPoint(String(value.toFixed(3)));
      }
    };
    const handlePointerUp = () => setDraggingTimelineHandle(null);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    draggingTimelineHandle,
    selectedTimelineClip,
    timelineEnd,
    timelineStart,
  ]);

  const refetchTimeline = useCallback(() => {
    let cancelled = false;
    setTimelineLoading(true);
    setTimelineMessage("");
    fetch(`/api/tilawati-editor?action=list&jilid=${jilid}&hal=${hal}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.ok)
          throw new Error(result.message || "Gagal membaca timeline audio");
        return result as {
          clips: TimelineClip[];
          text_links?: Record<string, string>;
          textAdditions?: QuizQuestion[];
        };
      })
      .then((result) => {
        if (!cancelled) {
          setTimelineClips(result.clips);
          setTimelineTextLinks(result.text_links || {});
          setTimelineTextAdditions(result.textAdditions || []);
          setSelectedTimelineUrl("");
          setTimelineStart("0");
          setTimelineEnd("");
          setTimelineCutPoint("0");
          setSelectedMergeUrls([]);
        }
      })
      .catch((error) => {
        if (!cancelled)
          setTimelineMessage(
            error instanceof Error ? error.message : String(error),
          );
      })
      .finally(() => {
        if (!cancelled) setTimelineLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [jilid, hal]);

  useEffect(() => {
    return refetchTimeline();
  }, [refetchTimeline]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ jilid?: number; page?: number }>).detail;
      if (detail?.jilid === jilid && detail?.page === hal) {
        void refetchTimeline();
      }
    };
    window.addEventListener("ngajiceria:timeline-published", handler);
    return () =>
      window.removeEventListener("ngajiceria:timeline-published", handler);
  }, [jilid, hal, refetchTimeline]);

  const previewTimelineSelection = () => {
    if (!selectedTimelineClip) return;
    const audio = new Audio(sanitizeAudioUrl(selectedTimelineClip.audioUrl) ?? selectedTimelineClip.audioUrl);
    audioRef.current?.pause();
    audioRef.current = audio;
    const start = Number(timelineStart) || 0;
    const end = Number(timelineEnd) || selectedTimelineClip.duration;
    audio.onloadedmetadata = () => {
      audio.currentTime = Math.min(start, audio.duration || start);
      void audio.play();
    };
    audio.ontimeupdate = () => {
      if (audio.currentTime >= end) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
    audio.load();
  };

  const closeEditor = () => {
    if (editorBusy) return;
    setEditingQuestion(null);
    setEditorDraft(null);
    setEditorSegments([]);
    setEditorMessage("");
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

  const saveTimelineLayout = async (
    audioOrder: string[],
    textLinks = timelineTextLinks,
    textAdditions = timelineTextAdditions,
  ) => {
    await editorRequest("save-layout", {
      jilid,
      page: hal,
      audioOrder,
      textLinks,
      textAdditions,
    });
  };

  const reorderTimelineClip = async (targetAudioUrl: string) => {
    if (!draggingTimelineUrl || draggingTimelineUrl === targetAudioUrl) return;
    const currentOrder = timelineClips.map((clip) => clip.audioUrl);
    const fromIndex = currentOrder.indexOf(draggingTimelineUrl);
    const toIndex = currentOrder.indexOf(targetAudioUrl);
    if (fromIndex < 0 || toIndex < 0) return;
    currentOrder.splice(fromIndex, 1);
    currentOrder.splice(toIndex, 0, draggingTimelineUrl);
    setDraggingTimelineUrl("");
    try {
      await saveTimelineLayout(currentOrder);
      reloadAfterEditorSave();
    } catch (error) {
      setTimelineMessage(
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  const linkTextToAudio = async (questionId: string, audioUrl: string) => {
    const nextLinks = { ...timelineTextLinks, [questionId]: audioUrl };
    setTimelineTextLinks(nextLinks);
    setDraggingTextId("");
    setDraggingTimelineUrl("");
    try {
      await saveTimelineLayout(
        timelineClips.map((clip) => clip.audioUrl),
        nextLinks,
      );
      reloadAfterEditorSave();
    } catch (error) {
      setTimelineMessage(
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  const addTimelineText = async () => {
    const arabic = window.prompt("Masukkan teks Arab baru untuk halaman ini:");
    if (!arabic?.trim()) return;
    const transliteration =
      window.prompt("Masukkan transliterasi, pisahkan dengan koma:", "") || "";
    const parts = transliteration
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    const addition: QuizQuestion = {
      id: `custom-${Date.now()}`,
      arabic: arabic.trim(),
      transliterationParts: parts,
      options: parts,
      hintTone: "Rost: Baris",
      audioUrl: "",
      audioMappingComplete: true,
    };
    const nextAdditions = [...timelineTextAdditions, addition];
    try {
      await saveTimelineLayout(
        timelineClips.map((clip) => clip.audioUrl),
        timelineTextLinks,
        nextAdditions,
      );
      reloadAfterEditorSave();
    } catch (error) {
      setTimelineMessage(
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  const toggleMergeClip = (audioUrl: string) => {
    setSelectedMergeUrls((current) =>
      current.includes(audioUrl)
        ? current.filter((url) => url !== audioUrl)
        : [...current, audioUrl],
    );
  };

  const splitSelectedTimelineClip = async () => {
    if (!selectedTimelineClip) return;
    setTimelineMessage("Memotong audio...");
    try {
      await editorRequest("split", {
        audioUrl: selectedTimelineClip.audioUrl,
        cutAt: timelineCutPoint,
      });
      reloadAfterEditorSave();
    } catch (error) {
      setTimelineMessage(
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  const deleteSelectedTimelineClip = async () => {
    if (!selectedTimelineClip) return;
    if (
      !window.confirm(
        `Hapus klip ${selectedTimelineClip.filename} dari project?`,
      )
    )
      return;
    setTimelineMessage("Menghapus klip...");
    try {
      await editorRequest("delete-clip", {
        audioUrl: selectedTimelineClip.audioUrl,
      });
      reloadAfterEditorSave();
    } catch (error) {
      setTimelineMessage(
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  const mergeSelectedTimelineClips = async () => {
    if (!editorDraft || selectedMergeUrls.length < 2) return;
    const segments = selectedMergeUrls
      .map((url) => timelineClips.find((clip) => clip.audioUrl === url))
      .filter((clip): clip is TimelineClip => Boolean(clip))
      .map((clip) => ({
        sourceAudioUrl: clip.audioUrl,
        start: "0",
        end: String(clip.duration),
      }));
    if (!segments.length) return;
    setEditorBusy(true);
    setEditorMessage("");
    try {
      await editorRequest("merge", {
        key: editorKey,
        outputAudioUrl: editorDraft.outputAudioUrl,
        segments,
      });
      reloadAfterEditorSave();
    } catch (error) {
      setEditorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setEditorBusy(false);
    }
  };

  const reloadAfterEditorSave = () => {
    invalidatePublishedTimeline(jilid, hal);
  };

  const saveEditorText = async () => {
    if (!editingQuestion || !editorDraft) return;
    setEditorBusy(true);
    setEditorMessage("");
    try {
      await editorRequest("save-text", {
        key: editorKey,
        arabic: editorDraft.arabic,
        transliterationParts: editorDraft.transliteration
          .split(/[\n,]/)
          .map((part) => part.trim())
          .filter(Boolean),
        hintTone: editorDraft.hintTone,
      });
      reloadAfterEditorSave();
    } catch (error) {
      setEditorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setEditorBusy(false);
    }
  };

  const editorKey = editingQuestion
    ? `${jilid}:${hal}:${editingQuestion.question.id}`
    : "";

  const saveHintTone = async (key: string, hintTone: string) => {
    try {
      await editorRequest("save-text", { key, hintTone });
      setEditedHintTones((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setCardSaveMessage("Tersimpan");
      setTimeout(() => setCardSaveMessage(""), 1200);
      reloadAfterEditorSave();
    } catch (error) {
      setCardSaveMessage(error instanceof Error ? error.message : String(error));
    }
  };

  const saveEditorAudio = async (action: "cut" | "merge") => {
    if (!editingQuestion || !editorDraft || !editorDraft.outputAudioUrl) return;
    setEditorBusy(true);
    setEditorMessage("");
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
      reloadAfterEditorSave();
    } catch (error) {
      setEditorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setEditorBusy(false);
    }
  };

  const deleteEditorAudio = async () => {
    if (!editingQuestion || !editingQuestion.audioUrl) return;
    if (!window.confirm("Hapus file audio ini dari project?")) return;
    setEditorBusy(true);
    setEditorMessage("");
    try {
      await editorRequest("delete-audio", {
        key: editorKey,
        audioUrl: editingQuestion.audioUrl,
      });
      reloadAfterEditorSave();
    } catch (error) {
      setEditorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setEditorBusy(false);
    }
  };

  const deleteEditorItem = async () => {
    if (!editingQuestion) return;
    if (!window.confirm("Hapus item teks dan pemetaan audio ini dari dataset?"))
      return;
    setEditorBusy(true);
    setEditorMessage("");
    try {
      await editorRequest("delete-item", {
        key: editorKey,
        audioUrl: editingQuestion.audioUrl,
      });
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

  const hasPublishedData = timelineClips.some((c) => c.isPublished);

  // Jika di Timeline Editor sudah ada data published, jadikan sebagai Single Source of Truth
  const audioItems = hasPublishedData
    ? timelineClips.map((clip, index) => {
        const questionKey = `${jilid}:${hal}:${clip.id || index}`;
        const cleanClipArabic = (clip.teksArab || "").replace(/\s+/g, "");
        const matchedQ = pageData?.questions.find(
          (q) =>
            (cleanClipArabic &&
              q.arabic.replace(/\s+/g, "") === cleanClipArabic) ||
            String(q.id) === String(clip.id),
        );
        return {
          id: clip.id || `clip-${index + 1}`,
          index,
          sequence: clip.sequence || index + 1,
          teksArab: clip.teksArab || matchedQ?.arabic || "",
          teksLatin:
            clip.teksLatin ||
            matchedQ?.transliterationParts.join(" - ") ||
            "",
          durasi: clip.durasi ?? clip.duration ?? 0,
          audioUrl: clip.audioUrl,
          filename: clip.filename,
          type: clip.type || "isi",
          isPublished: true,
          hintTone:
            matchedQ?.hintTone ||
            (clip.type === "header"
              ? "Rost: Judul / Pembuka"
              : `Rost: Baris ${index + 1}`),
          rawQuestion: matchedQ,
          questionKey,
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

  const testableAudioItems = audioItems.filter((item) => Boolean(item.audioUrl));
  const testedCount = testableAudioItems.filter(
    (item) =>
      testedAudio[item.questionKey] ||
      testedAudio[getQuestionKey(item.index)] ||
      testedAudio[`${jilid}:${hal}:${item.id}`],
  ).length;

  return (
    <div
      className={
        admin
          ? "mx-auto max-w-3xl p-4 pb-24 md:p-6"
          : "p-4 max-w-md mx-auto min-h-screen bg-[#F0FDF4]/50"
      }
    >
      {/* Jilid Selector Tabs (1 to 5) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 scrollbar-none">
        {[1, 2, 3, 4, 5].map((j) => (
          <button
            key={j}
            onClick={() => {
              updatePage(j, 1);
              if (audioRef.current) audioRef.current.pause();
              setPlayingId(null);
            }}
            className={`flex-1 min-w-[54px] py-2 rounded-xl font-black text-xs transition-all active:scale-95 text-center ${
              jilid === j
                ? admin
                  ? "bg-[var(--admin-accent)] text-white shadow-[3px_3px_0_var(--admin-border)]"
                  : "bg-[#0D9488] text-white shadow-md shadow-[#0D9488]/20 scale-100"
                : admin
                  ? "bg-[var(--admin-surface)] text-[var(--admin-text)] border-2 border-[var(--admin-border)]"
                  : "bg-white text-[#134e4a]/70 border border-gray-200 hover:bg-[#F0FDF4]"
            }`}
          >
            Jilid {j}
          </button>
        ))}
      </div>

      {/* Header Controls */}
      <div
        className={
          admin
            ? "admin-surface flex items-center justify-between mb-4 p-3.5"
            : "flex items-center justify-between mb-4 bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100"
        }
      >
          <button
            onClick={() => updatePage(jilid, Math.max(1, hal - 1))}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F0FDFA] text-[#134e4a]/70 active:scale-95 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-center">
            <div className="text-[10px] font-black tracking-widest text-[#0D9488] uppercase">
              TILAWATI JILID {jilid}
            </div>
            <div className="font-black text-xl text-teal-900">
              Halaman {hal}
            </div>
          </div>
          <button
            onClick={() => updatePage(jilid, Math.min(44, hal + 1))}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F0FDFA] text-[#134e4a]/70 active:scale-95 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {pageData && (
          <div
            className={
              admin
                ? "admin-surface mb-4 flex items-center justify-between gap-3 px-4 py-3"
                : "mb-4 flex items-center justify-between gap-3 rounded-2xl border border-[#0D9488]/20 bg-[#0D9488]/10 px-4 py-3"
            }
          >
            <div>
              <div className="text-xs font-black text-[#0F766E]">
                Status uji halaman
              </div>
              <div className="text-[10px] text-[#0F766E]/70">
                Tandai halaman ini jika seluruh audio dan teks sudah final.
              </div>
              <div className="mt-1 text-[10px] font-black text-[#0F766E]">
                {testedCount}/{testableAudioItems.length} item audio teruji
              </div>
            </div>
            <label className="shrink-0 flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-[#0D9488] shadow-sm cursor-pointer hover:bg-[#F0FDF4] transition-colors">
              <input
                type="checkbox"
                checked={Boolean(testedAudio[`${jilid}:${hal}:page`])}
                onChange={(event) => setAudioTested(-1, event.target.checked)}
                className="w-4 h-4 accent-[#0D9488]"
              />
              Halaman Lolos
            </label>
          </div>
        )}

        <section
          className={
            admin
              ? "admin-surface mb-4 flex items-center justify-between gap-3 px-4 py-3"
              : "mb-4 flex items-center justify-between gap-3 rounded-2xl border border-[#0D9488]/20 bg-[#0D9488]/10 px-4 py-3"
          }
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#0F766E]">
              <span>Timeline halaman</span>
              {hasPublishedData && (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-black text-white">
                  <Check size={10} className="stroke-[3]" /> Terpublikasi
                </span>
              )}
            </div>
            <h3 className="truncate text-sm font-black text-[#0F766E]">
              Audio Hal {hal} · {audioItems.length} klip
              {hasPublishedData && " (Sinkron Timeline Editor)"}
            </h3>
          </div>
            <button
              type="button"
              onClick={() =>
                navigate(`${timelineLocalHref}?jilid=${jilid}&hal=${hal}`)
              }
              className="shrink-0 rounded-lg bg-[#0D9488] px-3 py-2 text-[10px] font-black text-white shadow-sm transition active:scale-95 flex items-center gap-1.5"
            >
              <span>Editor Lokal</span>
              <ChevronRight size={12} />
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(`${timelineCloudHref}?jilid=${jilid}&hal=${hal}`)
              }
              className="shrink-0 rounded-lg bg-[#0F766E] px-3 py-2 text-[10px] font-black text-white shadow-sm transition active:scale-95 flex items-center gap-1.5"
            >
              <span>Cloud Editor</span>
              <ChevronRight size={12} />
            </button>
        </section>

        {editingQuestion && editorDraft && (
          <section
            className={
              admin
                ? "admin-surface mb-4 p-4"
                : "mb-4 rounded-2xl border-2 border-[#0D9488]/30 bg-[#F0FDF4] p-4 shadow-sm"
            }
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-[#0F766E]">
                  Editor permanen
                </div>
                <h3 className="text-base font-black text-[#134e4a]">
                  Edit teks & audio item
                </h3>
                <p className="mt-1 text-[10px] leading-relaxed text-[#0F766E]">
                  Hasil simpan ditulis ke file project. Jalankan Vite dev server
                  agar endpoint editor tersedia.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                disabled={editorBusy}
                className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-black text-[#134e4a]/70 shadow-sm disabled:opacity-50"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black text-[#134e4a]">
                Teks Arab
                <textarea
                  value={editorDraft.arabic}
                  onChange={(event) =>
                    setEditorDraft({
                      ...editorDraft,
                      arabic: event.target.value,
                    })
                  }
                  rows={3}
                  dir="rtl"
                  className="mt-1 w-full rounded-xl border border-gray-100 bg-white p-3 text-right font-arabic text-xl leading-relaxed outline-none focus:border-[#0D9488]"
                />
              </label>
              <label className="block text-xs font-black text-[#134e4a]">
                Transliterasi: satu bagian per baris (Auto-generate teks Arab)
                <textarea
                  value={editorDraft.transliteration}
                  onChange={(event) => {
                    const val = event.target.value;
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
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-gray-100 bg-white p-3 text-sm outline-none focus:border-[#0D9488]"
                />
              </label>
              <label className="block text-xs font-black text-[#134e4a]">
                Nada / keterangan
                <div className="mt-1 flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-100 bg-white p-3">
                  <span className="truncate text-[#134e4a]">{editorDraft.hintTone}</span>
                </div>
              </label>

              <div className="grid grid-cols-1 gap-2">
                <label className="text-xs font-black text-[#134e4a]">
                  Sumber audio dari halaman ini
                  <select
                    value={editorDraft.sourceAudioUrl}
                    onChange={(event) =>
                      selectEditorSourceAudio(event.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-gray-100 bg-white p-3 text-xs outline-none focus:border-[#0D9488]"
                  >
                    <option value="">Pilih audio yang tersedia...</option>
                    {timelineClips.map((clip) => (
                      <option key={clip.audioUrl} value={clip.audioUrl}>
                        #{clip.sequence} · {clip.type} · {clip.filename} ·{" "}
                        {clip.duration.toFixed(2)} detik
                      </option>
                    ))}
                  </select>
                  <span className="mt-1 block text-[10px] font-medium text-[#0F766E]">
                    Daftar diambil dari seluruh audio pada Jilid {jilid} Halaman{" "}
                    {hal}.
                  </span>
                </label>
                <label className="text-xs font-black text-[#134e4a]">
                  Simpan hasil ke URL audio
                  <input
                    value={editorDraft.outputAudioUrl}
                    onChange={(event) =>
                      setEditorDraft({
                        ...editorDraft,
                        outputAudioUrl: event.target.value,
                      })
                    }
                    placeholder="/audio/tilawati/..."
                    className="mt-1 w-full rounded-xl border border-gray-100 bg-white p-3 text-xs outline-none focus:border-[#0D9488]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs font-black text-[#134e4a]">
                  Mulai (detik)
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={editorDraft.start}
                    onChange={(event) =>
                      setEditorDraft({
                        ...editorDraft,
                        start: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-100 bg-white p-3 text-sm outline-none focus:border-[#0D9488]"
                  />
                </label>
                <label className="text-xs font-black text-[#134e4a]">
                  Selesai (detik)
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={editorDraft.end}
                    onChange={(event) =>
                      setEditorDraft({
                        ...editorDraft,
                        end: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-100 bg-white p-3 text-sm outline-none focus:border-[#0D9488]"
                  />
                </label>
              </div>

              {editorSegments.length > 0 && (
                <div className="rounded-xl border border-gray-100 bg-white p-3">
                  <div className="mb-2 text-xs font-black text-[#134e4a]">
                    Segmen gabungan
                  </div>
                  <div className="space-y-1 text-[10px] text-[#134e4a]/70">
                    {editorSegments.map((segment, index) => (
                      <div
                        key={`${segment.sourceAudioUrl}-${index}`}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="truncate">
                          {index + 1}. {segment.sourceAudioUrl} ({segment.start}
                          –{segment.end}s)
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditorSegments((current) =>
                              current.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            )
                          }
                          className="shrink-0 font-black text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
                  {editorMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={saveEditorText}
                  disabled={editorBusy}
                  className="rounded-xl bg-[#134e4a] px-3 py-2.5 text-xs font-black text-white disabled:opacity-50"
                >
                  Simpan teks
                </button>
                <button
                  type="button"
                  onClick={() => saveEditorAudio("cut")}
                  disabled={
                    editorBusy ||
                    !editorDraft.sourceAudioUrl ||
                    !editorDraft.outputAudioUrl
                  }
                  className="rounded-xl bg-[#0D9488] px-3 py-2.5 text-xs font-black text-white disabled:opacity-50"
                >
                  Potong & simpan
                </button>
                <button
                  type="button"
                  onClick={addEditorSegment}
                  disabled={
                    editorBusy ||
                    !editorDraft.sourceAudioUrl ||
                    !editorDraft.end
                  }
                  className="rounded-xl border border-[#0D9488]/30 bg-white px-3 py-2.5 text-xs font-black text-[#0F766E] disabled:opacity-50"
                >
                  Tambah segmen
                </button>
                <button
                  type="button"
                  onClick={() => saveEditorAudio("merge")}
                  disabled={
                    editorBusy ||
                    editorSegments.length === 0 ||
                    !editorDraft.outputAudioUrl
                  }
                  className="rounded-xl border border-[#0D9488]/40 bg-white px-3 py-2.5 text-xs font-black text-[#0F766E] disabled:opacity-50"
                >
                  Gabungkan segmen
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-[#D1FAE5] pt-3">
                <button
                  type="button"
                  onClick={deleteEditorAudio}
                  disabled={editorBusy || !editingQuestion.audioUrl}
                  className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-black text-red-700 disabled:opacity-50"
                >
                  Hapus audio
                </button>
                <button
                  type="button"
                  onClick={deleteEditorItem}
                  disabled={editorBusy}
                  className="rounded-xl bg-red-700 px-3 py-2.5 text-xs font-black text-white disabled:opacity-50"
                >
                  Hapus item
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Content List */}
        {audioItems.length > 0 ? (
          <div className="space-y-3 pb-24">
            {audioItems.map((item) => {
              const isPlaying = playingId === item.id;
              const isTested = Boolean(
                testedAudio[item.questionKey] ||
                  testedAudio[getQuestionKey(item.index)] ||
                  testedAudio[`${jilid}:${hal}:${item.id}`],
              );
              const effectiveHintTone =
                editedHintTones[item.questionKey] ?? item.hintTone;
              const effectiveParse = parseHintTone(effectiveHintTone);
              return (
                <div
                  key={item.id}
                  className={`flex flex-col p-4 border-2 transition-colors ${
                    isPlaying
                      ? "border-[#0D9488] bg-[#F2FDF5]"
                      : "border-gray-100 bg-white"
                  } ${admin ? "admin-surface !shadow-[3px_3px_0_var(--admin-border)] rounded-xl" : "rounded-[20px] shadow-sm"}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-black text-[#134e4a]/50 uppercase tracking-wider">
                          #{item.sequence} · {item.type}
                        </span>
                        {item.isPublished && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-800 border border-emerald-300">
                            <Check size={11} className="text-emerald-600 stroke-[3]" />
                            Data Final Publish
                          </span>
                        )}
                        {item.durasi > 0 && (
                          <span className="inline-flex items-center gap-1 font-mono text-[9px] font-black text-[#0F766E] bg-[#CCFBF1]/70 px-1.5 py-0.5 rounded border border-[#0D9488]/30">
                            <ClockSvg size={10} stroke="#0F766E" />
                            <span>{item.durasi.toFixed(2)}s</span>
                          </span>
                        )}
                      </div>
                      <div className="font-arabic text-3xl mb-1 leading-normal text-right pr-2 text-teal-900">
                        {item.teksArab || "(Teks Arab belum terhubung)"}
                      </div>
                      {item.teksLatin && (
                        <div className="text-xs font-bold text-[#134e4a]/50">
                          [{item.teksLatin}]
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const questionObj: QuizQuestion = item.rawQuestion || {
                            id: typeof item.id === "number" ? item.id : item.index,
                            arabic: item.teksArab,
                            transliterationParts: item.teksLatin
                              ? item.teksLatin.split(" - ")
                              : [],
                            options: item.teksLatin
                              ? item.teksLatin.split(" - ")
                              : [],
                            hintTone: item.hintTone || "Rost: Baris",
                            audioUrl: item.audioUrl || "",
                            audioMappingComplete: true,
                          };
                          openEditor(questionObj, item.index, item.audioUrl);
                        }}
                        className="rounded-xl border border-[#0D9488]/30 bg-[#F0FDF4] px-2.5 py-2 text-[10px] font-black text-[#0F766E]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (isPlaying) {
                            audioRef.current?.pause();
                            setPlayingId(null);
                          } else {
                            playAudio(item.id, item.audioUrl);
                          }
                        }}
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform active:scale-90 ${
                          isPlaying
                            ? "bg-red-500 shadow-md"
                            : "bg-[#0D9488] shadow-md shadow-[#0D9488]/20"
                        }`}
                      >
                        {isPlaying ? (
                          <Pause size={16} />
                        ) : (
                          <Play size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px]">
                    <span
                      className="font-mono text-[#134e4a]/40 truncate pr-4 max-w-[200px]"
                      title={item.audioUrl}
                    >
                      {item.audioUrl
                        ? item.audioUrl.split("/").pop()
                        : "Audio belum tersedia"}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {NOTE_BADGES.map((badge) => {
                        const isSelected = effectiveParse.notes.includes(badge.value);
                        return (
                          <button
                            key={badge.value}
                            type="button"
                            onClick={() => {
                              const nextNotes: NoteOption[] = isSelected
                                ? effectiveParse.notes.filter((n) => n !== badge.value)
                                : [...effectiveParse.notes, badge.value];
                              setEditedHintTones((prev) => ({
                                ...prev,
                                [item.questionKey]: generateHintTone(nextNotes, effectiveParse.repeat),
                              }));
                            }}
                            className={`rounded-full border-2 px-2.5 py-1 font-black text-xs transition-all ${
                              isSelected
                                ? "border-[#FF6B6B] bg-[#FF6B6B] text-white shadow-[3px_3px_0px_#DC2626]"
                                : "border-[#134E4A] bg-white text-[#134E4A] hover:bg-[#F0FDF4]"
                            }`}
                          >
                            {badge.label}
                          </button>
                        );
                      })}
                      <div className="flex items-center gap-1.5 ml-1">
                        {REPEAT_BADGES.map((badge) => {
                          const isSelected = effectiveParse.repeat === badge.value;
                          return (
                            <button
                              key={badge.value}
                              type="button"
                              onClick={() => {
                                setEditedHintTones((prev) => ({
                                  ...prev,
                                  [item.questionKey]: generateHintTone(effectiveParse.notes, badge.value),
                                }));
                              }}
                              className={`rounded-full border-2 px-2.5 py-1 font-black text-xs transition-all ${
                                isSelected
                                  ? "border-[#0D9488] bg-[#0D9488] text-white shadow-[3px_3px_0px_#0D9488]"
                                  : "border-[#134E4A] bg-white text-[#134E4A] hover:bg-[#F0FDF4]"
                              }`}
                            >
                              {badge.label}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          saveHintTone(item.questionKey, effectiveHintTone)
                        }
                        className="shrink-0 rounded-xl border border-[#0D9488]/30 bg-[#F0FDF4] px-2.5 py-2 text-[10px] font-black text-[#0F766E]"
                      >
                        Simpan
                      </button>
                    </div>
                    {!item.audioUrl ? (
                      <span
                        className={`shrink-0 rounded px-2 py-0.5 font-black ${
                          admin
                            ? "border-2 border-[var(--admin-border)] bg-[var(--admin-danger-soft)] text-red-700"
                            : "bg-red-100 text-red-700"
                        }`}
                        title="File audio tidak ditemukan untuk item ini"
                      >
                        404 · Audio Hilang
                      </span>
                    ) : playErrorId === item.id ? (
                      <span
                        className={`shrink-0 rounded px-2 py-0.5 font-black ${
                          admin
                            ? "border-2 border-[var(--admin-border)] bg-[var(--admin-danger-soft)] text-red-700"
                            : "bg-red-100 text-red-700"
                        }`}
                        title="File audio gagal diputar (rusak atau tidak dapat dimuat)"
                      >
                        Gagal Putar
                      </span>
                    ) : null}
                    <label
                      className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 font-black transition-colors ${
                        item.audioUrl
                          ? "cursor-pointer text-[#0F766E] hover:bg-[#E2F5E8]"
                          : "cursor-not-allowed text-[#134e4a]/40"
                      }`}
                      title={
                        item.audioUrl
                          ? "Tandai sudah diuji"
                          : "Audio belum tersedia"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={isTested}
                        onChange={(e) =>
                          setAudioTested(item.questionKey, e.target.checked)
                        }
                        className="h-4 w-4 accent-[#0D9488]"
                      />
                      <span>{isTested ? "Teruji" : "Uji"}</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className={
              admin
                ? "admin-surface p-6 text-center pb-10"
                : "bg-white rounded-2xl p-6 border border-gray-100 text-center shadow-sm pb-10"
            }
          >
            <div className="w-12 h-12 rounded-full bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center mx-auto mb-3 font-black text-lg">
              {jilid}
            </div>
            <h3 className="font-black text-base text-teal-900 mb-1">
              Tilawati Jilid {jilid} - Halaman {hal}
            </h3>
            <p className="text-xs text-[#134e4a]/50 mb-4 max-w-xs mx-auto">
              Audio rekaman master per halaman siap diputar melalui tombol di
              atas untuk audit dan verifikasi makhraj & irama.
            </p>
          </div>
        )}
      </div>
    );
}
