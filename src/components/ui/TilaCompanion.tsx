import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import {
  TilaMascot,
  type TilaAnimation,
  type TilaMood,
  type TilaHoldItem,
} from "./TilaMascot";

import {
  getBibiTips,
  type BibiTip,
} from "@/features/ngaji-ceria/data/bibiPageTips";
import {
  StickerButton,
  StickerCard,
  X,
  BookOpen,
  HandsPraying,
  HelpCircle,
  Home,
  Lightbulb,
  Sparkles,
  Eye,
  EyeOff,
} from "../ui";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { TilaReactionType } from "@/utils/tilaEvent";
import { useEconomyStore } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import { getMascotName } from "@/utils/mascotHelper";

export interface PageTipConfig {
  jilid: number;
  hal: number;
  onOpenGuide: () => void;
  onTipStateChange?: (state: {
    visible: boolean;
    hasAppeared: boolean;
  }) => void;
  guideButtonRef?: RefObject<HTMLElement | null>;
}

interface TilaCompanionProps {
  size?: number;
  autoRoam?: boolean;
  reactiveSpeech?: boolean;
  className?: string;
  pageTip?: PageTipConfig;
  gender?: "boy" | "girl";
}

export type BibiCompanionProps = TilaCompanionProps;

const HIDDEN_STORAGE_KEY = "tila-companion-hidden";

export type TilaPoseReaction =
  | "laugh"
  | "shock"
  | "shy"
  | "greet"
  | "hold"
  | "sleep"
  | "spin"
  | "quiz-complete"
  | "complete"
  | "perfect"
  | "pray"
  | "read"
  | "starry"
  | "proud"
  | "confused"
  | "love"
  | "wink"
  | "dizzy"
  | "cheer"
  | "sing"
  | "peek"
  | "shiver"
  | "peck"
  | "roll"
  | "cry"
  | "angry"
  | "play-invite"; // TAMBAHAN: Pose ajak main

type CompanionReaction = TilaReactionType | TilaPoseReaction;

interface PoseStep {
  mood: TilaMood;
  anim?: TilaAnimation;
  speech?: string;
  holdItem?: TilaHoldItem;
  duration: number;
}

function buildPoseSteps(
  type: CompanionReaction,
  name: string,
): PoseStep[] | null {
  switch (type) {
    case "laugh":
      return [
        {
          mood: "laughing",
          anim: "bounce",
          speech: "Hahaha! Seru banget!",
          duration: 3200,
        },
      ];
    case "shock":
      return [
        {
          mood: "shocked",
          anim: "bounce",
          speech: "Waaah! Kaget!",
          duration: 2600,
        },
      ];
    case "shy":
      return [
        {
          mood: "shy",
          anim: "float",
          speech: "Hihi... malu ah",
          duration: 3200,
        },
      ];
    case "greet":
      return [
        {
          mood: "greeting",
          anim: "float",
          speech: `Halo! Aku ${name}`,
          duration: 3400,
        },
      ];
    case "hold":
      return [
        {
          mood: "holding",
          anim: "float",
          holdItem: "star",
          speech: "Ini bintang untukmu!",
          duration: 3600,
        },
      ];
    case "sleep":
      return [{ mood: "sleeping", anim: "perch", duration: 8000 }];
    case "spin":
      return [
        {
          mood: "excited",
          anim: "spinning",
          speech: "Wiii! Putar putar!",
          duration: 2200,
        },
      ];
    case "quiz-complete":
    case "complete":
    case "perfect":
      return [
        {
          mood: "excited",
          anim: "cheer",
          speech: "Yeay! Kamu hebat sekali!",
          duration: 2600,
        },
        {
          mood: "holding",
          anim: "float",
          holdItem: "star",
          speech: "Bintang untukmu!",
          duration: 3400,
        },
      ];
    case "pray":
      return [
        {
          mood: "praying",
          anim: "float",
          speech: "Aamiin... Yuk berdoa dulu.",
          duration: 4500,
        },
      ];
    case "read":
      return [
        {
          mood: "reading",
          anim: "float",
          speech: "Belajar itu seru, lho!",
          duration: 4500,
        },
      ];
    case "starry":
      return [
        {
          mood: "starry",
          anim: "bounce",
          speech: "Waaah, indahnya!",
          duration: 3500,
        },
      ];
    case "proud":
      return [
        {
          mood: "proud",
          anim: "salute",
          speech: "Siap! Semangat terus!",
          duration: 3500,
        },
      ];
    case "confused":
      return [
        {
          mood: "confused",
          anim: "float",
          speech: "Hmm, apa ya maksudnya?",
          duration: 3000,
        },
      ];
    case "love":
      return [
        {
          mood: "love",
          anim: "float",
          speech: "Aku sayang kamu!",
          duration: 3200,
        },
      ];
    case "wink":
      return [
        { mood: "winking", anim: "float", speech: "Ciaat!", duration: 2200 },
      ];
    case "dizzy":
      return [
        {
          mood: "dizzy",
          anim: "float",
          speech: "Aduh, pusing~ pelan-pelan ya.",
          duration: 2800,
        },
      ];
    case "cheer":
      return [
        {
          mood: "excited",
          anim: "cheer",
          speech: "Horeee! Hebat!",
          duration: 4000,
        },
      ];
    case "sing":
      return [
        { mood: "happy", anim: "singing", speech: "Lalala~", duration: 4500 },
      ];
    case "peek":
      return [
        {
          mood: "shy",
          anim: "peek",
          speech: "Halo... aku di sini.",
          duration: 3500,
        },
      ];
    case "shiver":
      return [
        {
          mood: "sad",
          anim: "shiver",
          speech: "Hiiy... dingin!",
          duration: 3000,
        },
      ];
    case "peck":
      return [
        {
          mood: "happy",
          anim: "peckRight",
          speech: "Tok tok tok!",
          duration: 2200,
        },
      ];
    case "roll":
      return [
        {
          mood: "excited",
          anim: "rolling",
          speech: "Wush wush!",
          duration: 2200,
        },
      ];
    case "cry":
      return [
        {
          mood: "crying",
          anim: "float",
          speech: "Hiks... jangan diulangin ya.",
          duration: 3000,
        },
      ];
    case "angry":
      return [
        {
          mood: "angry",
          anim: "float",
          speech: "Hmph! Jangan nakal ya.",
          duration: 2500,
        },
      ];
    // TAMBAHAN: Pose Ajak Main
    case "play-invite":
      return [
        {
          mood: "excited",
          anim: "cheer",
          speech: "Ayo main kuis atau game seru bareng aku!",
          duration: 4000,
        },
      ];
    default:
      return null;
  }
}

/** Picu pose maskot dari mana saja */
export function triggerTilaPose(pose: TilaPoseReaction): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("tila-react", { detail: pose }));
}

export function isBottomNavTab(pathname: string): boolean {
  const clean = pathname.replace(/\/$/, "");
  return (
    clean === "/member/ngaji-ceria" ||
    clean === "/member/ngaji-ceria/map" ||
    clean === "/member/ngaji-ceria/games" ||
    clean === "/member/ngaji-ceria/profile"
  );
}

// Tambahkan pose ajak main ke dalam daftar idle agar lebih interaktif
const IDLE_POSES: TilaPoseReaction[] = [
  "read",
  "starry",
  "wink",
  "sing",
  "peek",
  "love",
  "confused",
  "play-invite", // TAMBAHAN
  "cheer", // TAMBAHAN
];

export function isTilaCompanionExcluded(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "");

  if (
    normalized.includes("/kamar-tila") ||
    normalized.includes("/kamar-tito") ||
    normalized.includes("/kamar-bibi")
  ) {
    return true;
  }

  if (normalized.startsWith("/admin") || normalized.startsWith("/ustadz")) {
    return true;
  }

  if (normalized.includes("/quiz/play")) {
    return true;
  }

  if (normalized.includes("/lab-irama")) {
    return true;
  }

  if (
    normalized.includes("/practice") ||
    normalized.includes("/rhythm-memory") ||
    normalized.includes("/tilawati-memory") ||
    normalized.includes("/games/memory")
  ) {
    return true;
  }

  if (
    normalized.includes("/games/hijaiyah-pop") ||
    (normalized.includes("/games/") &&
      normalized !== "/member/ngaji-ceria/games") ||
    (normalized.startsWith("/member/ngaji-ceria/games/") &&
      normalized !== "/member/ngaji-ceria/games")
  ) {
    return true;
  }

  return false;
}

export function TilaCompanion({
  size = 110,
  autoRoam = true,
  reactiveSpeech = true,
  className = "",
  pageTip,
  gender,
}: TilaCompanionProps) {
  const navigate = useNavigate();
  const location = useLocation();

  if (
    location.pathname === "/member/ngaji-ceria/profile" ||
    location.pathname.startsWith("/member/ngaji-ceria/leaderboard") ||
    location.pathname.includes("/arena-kartu") ||
    location.pathname.includes("/explore/practice")
  ) {
    return null;
  }

  const isNavTab = isBottomNavTab(location.pathname);

  const showMascotStore = useEconomyStore((s) => s.showMascot);
  const setShowMascot = useEconomyStore((s) => s.setShowMascot);
  const storeGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const effectiveGender = gender ?? (storeGender === "girl" ? "girl" : "boy");
  const mascotName = getMascotName(effectiveGender);

  const scrollMessages = [
    `Hai! ${mascotName} temani kamu ya`,
    "Yuk scroll pelan-pelan",
    "Banyak yang menarik di bawah!",
    `${mascotName} ikut kamu terus`,
    "Kamu rajin menjelajah!",
    "Sampai bawah nih, hebat!",
  ];

  const [isHidden, setIsHidden] = useState<boolean>(() => {
    if (typeof showMascotStore === "boolean") return !showMascotStore;
    if (typeof window === "undefined") return false;
    try {
      const val =
        window.localStorage.getItem(HIDDEN_STORAGE_KEY) ??
        window.localStorage.getItem("bibi-companion-hidden");
      return val === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof showMascotStore === "boolean") {
      setIsHidden(!showMascotStore);
    }
  }, [showMascotStore]);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const custom = e as CustomEvent<{ hidden: boolean }>;
      const next = custom.detail?.hidden;
      if (
        typeof next === "boolean" &&
        next !== isHiddenRef.current &&
        !isTransitioningRef.current
      ) {
        setIsHidden(next);
      }
    };
    window.addEventListener("tila:toggle-visibility", handleToggle);
    return () =>
      window.removeEventListener("tila:toggle-visibility", handleToggle);
  }, []);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [mood, setMood] = useState<TilaMood>(() =>
    isNavTab ? "happy" : "excited",
  );
  const [anim, setAnim] = useState<TilaAnimation>(() =>
    isNavTab ? "float" : "fly",
  );
  const [speech, setSpeech] = useState<string | undefined>(() =>
    isNavTab ? undefined : `Halo! ${mascotName} datang terbang!`,
  );
  const [talking, setTalking] = useState<boolean>(() => !isNavTab);
  const [rotation, setRotation] = useState(0);
  const [holdItem, setHoldItem] = useState<TilaHoldItem>("star");

  const [tipVisible, setTipVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState<BibiTip | null>(null);
  const [tipIndex, setTipIndex] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const flyY = useMotionValue(0);
  const zigzagX = useMotionValue(0);

  const middleRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const milestoneIndex = useRef(0);
  const walkTimer = useRef<number | null>(null);
  const idleTimer = useRef<number | null>(null);
  const boredomTimer = useRef<number | null>(null);
  const approachTimer = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const showTimerRef = useRef<number | null>(null);
  const directionTimerRef = useRef<number | null>(null); // TAMBAHAN: Timer untuk auto-balik badan

  const skipVisibilityAnimationRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);
  const transitionIdRef = useRef(0);

  const hasAppearedRef = useRef(false);

  const poseTimersRef = useRef<number[]>([]);
  const poseLockRef = useRef(false);
  const isHiddenRef = useRef(isHidden);
  isHiddenRef.current = isHidden;
  const isTransitioningRef = useRef(isTransitioning);
  isTransitioningRef.current = isTransitioning;

  const clearPoseTimers = useCallback(() => {
    poseTimersRef.current.forEach((id) => window.clearTimeout(id));
    poseTimersRef.current = [];
  }, []);

  const schedulePose = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    poseTimersRef.current.push(id);
  }, []);

  const endPose = useCallback(() => {
    clearPoseTimers();
    poseLockRef.current = false;
    setAnim("float");
    setMood("happy");
    setTalking(false);
    setSpeech(undefined);
  }, [clearPoseTimers]);

  const runPose = useCallback(
    (steps: PoseStep[]) => {
      if (isHiddenRef.current || steps.length === 0) return;

      clearPoseTimers();
      poseLockRef.current = true;

      let elapsed = 0;
      steps.forEach((step) => {
        schedulePose(() => {
          setMood(step.mood);
          setAnim(step.anim ?? "float");
          setSpeech(step.speech);
          setTalking(Boolean(step.speech));
          if (step.holdItem) setHoldItem(step.holdItem);
        }, elapsed);
        elapsed += step.duration;
      });

      schedulePose(() => {
        poseLockRef.current = false;
        setAnim("float");
        setMood("happy");
        setTalking(false);
        setSpeech(undefined);
      }, elapsed);
    },
    [clearPoseTimers, schedulePose],
  );

  const onTipStateChangeRef = useRef(pageTip?.onTipStateChange);
  useEffect(() => {
    onTipStateChangeRef.current = pageTip?.onTipStateChange;
  }, [pageTip?.onTipStateChange]);

  const notifyTipChange = useCallback(
    (visible: boolean, hasAppeared: boolean) => {
      onTipStateChangeRef.current?.({ visible, hasAppeared });
    },
    [],
  );

  const tips = pageTip ? getBibiTips(pageTip.jilid, pageTip.hal) : [];

  useEffect(() => {
    try {
      window.localStorage.setItem(HIDDEN_STORAGE_KEY, isHidden ? "1" : "0");
    } catch {
      // ignore
    }
  }, [isHidden]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null)
        window.clearTimeout(transitionTimerRef.current);
      if (directionTimerRef.current !== null)
        window.clearTimeout(directionTimerRef.current);
      poseTimersRef.current.forEach((id) => window.clearTimeout(id));
      poseTimersRef.current = [];
    };
  }, []);

  const flyToGuide = useCallback(() => {
    const target = pageTip?.guideButtonRef?.current;
    const middle = middleRef.current;
    if (!target || !middle) return;

    const tRect = target.getBoundingClientRect();
    const mRect = middle.getBoundingClientRect();
    if (tRect.width === 0 && tRect.height === 0) return;

    const targetCenterX = tRect.left + tRect.width / 2;
    const targetCenterY = tRect.top - mRect.height / 2 - 20;
    const dx = targetCenterX - (mRect.left + mRect.width / 2);
    const dy = targetCenterY - (mRect.top + mRect.height / 2);

    setAnim("fly");
    setMood("excited");
    setSpeech("Panduannya di sini ya!");
    setTalking(true);
    setRotation((prev) => prev + 360);

    animate(zigzagX, dx, { duration: 1.0, ease: "easeInOut" });
    animate(flyY, dy, { duration: 1.0, ease: "easeInOut" });
    animate(scale, 0.7, { duration: 0.6, ease: "easeOut" });

    window.setTimeout(() => setTalking(false), 2000);

    window.setTimeout(() => {
      setSpeech(undefined);
      animate(zigzagX, 0, { duration: 1.1, ease: "easeInOut" });
      animate(flyY, 0, { duration: 1.1, ease: "easeInOut" });
      animate(scale, 1, { duration: 0.6, ease: "easeOut" });
      window.setTimeout(() => {
        setAnim("float");
        setMood("happy");
      }, 1000);
    }, 3500);
  }, [pageTip?.guideButtonRef, scale, zigzagX, flyY]);

  const flyToGuideRef = useRef<() => void>(() => {});
  useEffect(() => {
    flyToGuideRef.current = flyToGuide;
  }, [flyToGuide]);

  useEffect(() => {
    if (poseLockRef.current) {
      clearPoseTimers();
      poseLockRef.current = false;
    }

    const saved =
      localStorage.getItem("tila-companion-pos") ??
      localStorage.getItem("bibi-companion-pos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        x.set(parsed.x);
        y.set(parsed.y);
      } catch (e) {}
    }

    if (skipVisibilityAnimationRef.current) {
      skipVisibilityAnimationRef.current = false;
      return;
    }

    if (isHidden || isNavTab) {
      zigzagX.set(0);
      flyY.set(0);
      scale.set(1);
      setRotation(0);
      setAnim("float");
      setMood("happy");
      setTalking(false);
      setSpeech(undefined);
      return;
    }

    const startX =
      (typeof window !== "undefined" ? window.innerWidth : 1000) + 100;
    const flyDuration = 1.4;

    zigzagX.set(startX);
    flyY.set(-60);
    scale.set(0.3);

    setAnim("fly");
    setMood("excited");
    setTalking(true);

    animate(zigzagX, [startX, startX * 0.65, startX * 0.25, 0], {
      duration: flyDuration,
      ease: "easeOut",
    });
    animate(flyY, [-60, -20, 0], { duration: flyDuration, ease: "easeOut" });
    animate(scale, [0.3, 0.8, 1.05, 1], {
      duration: flyDuration,
      ease: "easeOut",
    });

    const timer = window.setTimeout(() => {
      setAnim("float");
      setMood("happy");
      setTalking(false);
      setRotation(0);
      zigzagX.set(0);
      flyY.set(0);
      scale.set(1);
    }, flyDuration * 1000);

    const speechTimer = window.setTimeout(() => {
      setSpeech(undefined);
    }, 2500);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(speechTimer);
    };
  }, [
    isHidden,
    location.pathname,
    isNavTab,
    x,
    y,
    zigzagX,
    flyY,
    scale,
    clearPoseTimers,
  ]);

  useEffect(() => {
    const handleReaction = (e: Event) => {
      const customEvent = e as CustomEvent<CompanionReaction>;
      const type = customEvent.detail;

      if (type === "wake") {
        endPose();
        return;
      }
      const poseSteps = buildPoseSteps(type, mascotName);
      if (poseSteps) {
        runPose(poseSteps);
        return;
      }

      switch (type) {
        case "play":
          runPose([
            {
              mood: "excited",
              anim: "bounce",
              speech: "Ayo semangat!",
              duration: 2500,
            },
          ]);
          break;
        case "exit":
          runPose([
            {
              mood: "sad",
              anim: "float",
              speech: "Hati-hati ya! Sampai jumpa",
              duration: 3000,
            },
          ]);
          break;
        case "success":
          runPose([
            {
              mood: "excited",
              anim: "bounce",
              speech: "Yeay! Hebat sekali!",
              duration: 3000,
            },
          ]);
          break;
        case "error":
          runPose([
            {
              mood: "sad",
              anim: "float",
              speech: "Yah, coba lagi ya...",
              duration: 3000,
            },
          ]);
          break;
        default:
          setMood("happy");
          setSpeech("Hai!");
          setTalking(true);
          break;
      }

      setTimeout(() => setTalking(false), 3000);
      setTimeout(() => setAnim("float"), 2000);
    };

    window.addEventListener("tila-react", handleReaction);
    window.addEventListener("bibi-react", handleReaction);
    return () => {
      window.removeEventListener("tila-react", handleReaction);
      window.removeEventListener("bibi-react", handleReaction);
    };
  }, [scale, mascotName, runPose, endPose]);

  useEffect(() => {
    if (showTimerRef.current) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (!pageTip || tips.length === 0) {
      setTipVisible(false);
      hasAppearedRef.current = false;
      notifyTipChange(false, false);
      return;
    }

    if (isHidden) {
      setTipVisible(false);
      hasAppearedRef.current = true;
      notifyTipChange(false, true);
      return;
    }

    setTipVisible(false);
    setTipIndex(0);
    setCurrentTip(tips[0]);
    hasAppearedRef.current = false;
    notifyTipChange(false, false);

    showTimerRef.current = window.setTimeout(() => {
      setTipVisible(true);
      hasAppearedRef.current = true;
      notifyTipChange(true, true);
    }, 1200);

    hideTimerRef.current = window.setTimeout(() => {
      setTipVisible(false);
      notifyTipChange(false, hasAppearedRef.current);
      if (hasAppearedRef.current) {
        window.setTimeout(() => flyToGuideRef.current(), 80);
      }
    }, 9000);

    return () => {
      if (showTimerRef.current) {
        window.clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [pageTip?.jilid, pageTip?.hal, isHidden]);

  const handleNextTip = () => {
    if (!tips.length) return;
    const next = (tipIndex + 1) % tips.length;
    setTipIndex(next);
    setCurrentTip(tips[next]);
  };

  const handleDismissTip = () => {
    if (showTimerRef.current) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setTipVisible(false);
    notifyTipChange(false, hasAppearedRef.current);
    if (hasAppearedRef.current) {
      window.setTimeout(() => flyToGuideRef.current(), 80);
    }
  };

  const handleOpenGuide = () => {
    if (!pageTip) return;
    if (showTimerRef.current) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setTipVisible(false);
    notifyTipChange(false, hasAppearedRef.current);
    setTimeout(() => {
      pageTip.onOpenGuide();
    }, 220);
  };

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let scrollTimeout: number | null = null;
    let fastScrollTimeout: number | null = null;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      if (isHidden) return;
      if (boredomTimer.current) clearTimeout(boredomTimer.current);
      if (poseLockRef.current) return;

      if (Math.abs(delta) > 100) {
        if (fastScrollTimeout) clearTimeout(fastScrollTimeout);
        fastScrollTimeout = window.setTimeout(() => {
          if (!poseLockRef.current) {
            runPose([
              {
                mood: "dizzy",
                anim: "float",
                speech: "Aduh pusing~ pelan-pelan ya",
                duration: 2500,
              },
            ]);
          }
        }, 150);
      } else if (Math.abs(delta) > 15) {
        if (delta > 0) {
          animate(scale, 1.15, { duration: 0.5, ease: "easeOut" });
        } else {
          animate(scale, 1, { duration: 0.5, ease: "easeOut" });
        }

        setRotation((prev) => {
          const norm = prev % 360;
          return norm === 180 || norm === -180
            ? prev + 180
            : prev + (delta > 0 ? 10 : -10);
        });
        setAnim("fly");
        if (walkTimer.current !== null) window.clearTimeout(walkTimer.current);
        walkTimer.current = window.setTimeout(() => setAnim("float"), 800);
      }

      if (reactiveSpeech && milestoneIndex.current < scrollMessages.length) {
        if (currentY > milestoneIndex.current * 800 && currentY > 400) {
          const nextMilestone = milestoneIndex.current;
          setSpeech(scrollMessages[nextMilestone]);
          setTalking(true);

          if (nextMilestone === scrollMessages.length - 1) {
            runPose([
              {
                mood: "excited",
                anim: "cheer",
                speech: scrollMessages[nextMilestone],
                duration: 4000,
              },
            ]);
          } else {
            setMood("excited");
            setRotation((prev) => prev + 360);
            animate(scale, 1.3, { duration: 0.4 });
            setTimeout(() => animate(scale, 1, { duration: 0.4 }), 2000);
            window.setTimeout(() => setTalking(false), 3000);
          }
          milestoneIndex.current += 1;
        }
      }

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        if (poseLockRef.current) return;
        runPose([
          {
            mood: "confused",
            anim: "float",
            speech: `Hmph, ${mascotName} bosan nih...`,
            duration: 2500,
          },
        ]);
      }, 15000);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (fastScrollTimeout) clearTimeout(fastScrollTimeout);
    };
  }, [reactiveSpeech, isHidden, scale, mascotName, scrollMessages, runPose]);

  useEffect(() => {
    if (isHidden || isHelpOpen) return;

    idleTimer.current = window.setInterval(() => {
      if (poseLockRef.current) return;
      const randomPose =
        IDLE_POSES[Math.floor(Math.random() * IDLE_POSES.length)];
      const steps = buildPoseSteps(randomPose, mascotName);

      if (steps) {
        runPose(steps);
      }
    }, 25000);

    return () => {
      if (idleTimer.current) clearInterval(idleTimer.current);
    };
  }, [isHidden, isHelpOpen, mascotName, runPose]);

  const handleDragEnd = () => {
    localStorage.setItem(
      "tila-companion-pos",
      JSON.stringify({ x: x.get(), y: y.get() }),
    );
  };

  const handleTap = useCallback(() => {
    if (isHidden || isTransitioning) return;

    if (poseLockRef.current) endPose();

    if (showTimerRef.current) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    const hasTips = Boolean(pageTip && tips.length > 0);
    const nextAppeared = hasAppearedRef.current || hasTips;

    animate(scale, 1.8, { type: "spring", stiffness: 100, damping: 12 });
    setSpeech(`Hai! Ini yang bisa ${mascotName} bantu`);
    setTalking(true);
    setAnim("bounce");
    setRotation((prev) => prev + 360);

    setTipVisible(false);
    hasAppearedRef.current = nextAppeared;
    notifyTipChange(false, nextAppeared);

    setTimeout(() => setIsHelpOpen(true), 600);

    if (approachTimer.current) clearTimeout(approachTimer.current);
    approachTimer.current = window.setTimeout(() => {
      animate(scale, 1, { type: "spring", stiffness: 100, damping: 12 });
      setTalking(false);
      setAnim("float");
      setMood("excited");
    }, 2500);
  }, [
    isHidden,
    isTransitioning,
    scale,
    pageTip,
    tips.length,
    notifyTipChange,
    mascotName,
    endPose,
  ]);

  const handleHide = () => {
    if (isTransitioning || isHidden) return;

    const transitionId = ++transitionIdRef.current;
    const flyDuration = 1.0;

    setIsTransitioning(true);
    setIsHelpOpen(false);
    setTipVisible(false);

    if (showTimerRef.current) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    clearPoseTimers();
    poseLockRef.current = false;

    const hasTips = Boolean(pageTip && tips.length > 0);
    const nextAppeared = hasAppearedRef.current || hasTips;

    hasAppearedRef.current = nextAppeared;
    notifyTipChange(false, nextAppeared);

    setSpeech(`Dadah! ${mascotName} pergi dulu ya`);
    setMood("sad");
    setTalking(true);
    setAnim("fly");

    setRotation((prev) => Math.round(prev / 180) * 180 + 180);

    animate(
      zigzagX,
      [
        zigzagX.get(),
        zigzagX.get() + 50,
        zigzagX.get() - 30,
        -window.innerWidth - 150,
      ],
      { duration: flyDuration, ease: "easeIn" },
    );
    animate(flyY, [flyY.get(), -40, -100], {
      duration: flyDuration,
      ease: "easeIn",
    });
    animate(scale, [scale.get(), 0.8, 0], {
      duration: flyDuration,
      ease: "easeIn",
    });

    if (transitionTimerRef.current !== null)
      window.clearTimeout(transitionTimerRef.current);

    transitionTimerRef.current = window.setTimeout(() => {
      if (transitionId !== transitionIdRef.current) return;

      skipVisibilityAnimationRef.current = true;

      setIsHidden(true);
      setShowMascot(false);
      setIsTransitioning(false);
      setTalking(false);

      zigzagX.set(0);
      flyY.set(0);
      scale.set(1);

      transitionTimerRef.current = null;
    }, flyDuration * 1000);
  };

  const handleCall = () => {
    if (isTransitioning || !isHidden) return;

    const transitionId = ++transitionIdRef.current;
    const flyDuration = 1.4;

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }

    skipVisibilityAnimationRef.current = true;

    setIsTransitioning(true);
    setIsHidden(false);
    setShowMascot(true);

    setSpeech(`Hai! ${mascotName} kembali!`);
    setMood("excited");
    setTalking(true);
    setAnim("fly");
    setRotation((prev) => Math.round(prev / 180) * 180 + 90);

    const startX = window.innerWidth + 100;

    zigzagX.set(startX);
    flyY.set(-60);
    scale.set(0.3);

    animate(zigzagX, [startX, startX * 0.65, startX * 0.25, 0], {
      duration: flyDuration,
      ease: "easeOut",
    });
    animate(flyY, [-60, -20, 0], { duration: flyDuration, ease: "easeOut" });
    animate(scale, [0.3, 0.8, 1.05, 1], {
      duration: flyDuration,
      ease: "easeOut",
    });

    if (transitionTimerRef.current !== null)
      window.clearTimeout(transitionTimerRef.current);

    transitionTimerRef.current = window.setTimeout(() => {
      if (transitionId !== transitionIdRef.current) return;

      setAnim("float");
      setMood("happy");
      setTalking(false);
      setRotation(0);
      setIsTransitioning(false);

      zigzagX.set(0);
      flyY.set(0);
      scale.set(1);

      transitionTimerRef.current = null;
    }, flyDuration * 1000);
  };

  const handleAction = (path: string) => {
    setIsHelpOpen(false);
    navigate(path);
  };

  if (isTilaCompanionExcluded(location.pathname)) {
    return null;
  }

  return (
    <>
      <motion.button
        onClick={isHidden ? handleCall : handleHide}
        disabled={isTransitioning}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: isTransitioning ? 1.05 : 1 }}
        whileHover={!isTransitioning ? { y: -2 } : undefined}
        whileTap={!isTransitioning ? { scale: 0.95 } : undefined}
        aria-label={
          isTransitioning
            ? isHidden
              ? `Memanggil ${mascotName}`
              : `Menunggu ${mascotName} pergi`
            : isHidden
              ? `Panggil ${mascotName}`
              : `Sembunyikan ${mascotName}`
        }
        aria-busy={isTransitioning}
        className={`fixed bottom-28 right-4 z-50 flex h-12 items-center justify-center gap-2 rounded-full border-[3px] border-[#134E4A] px-4 shadow-[3px_3px_0px_#134E4A] transition-colors ${
          isHidden ? "bg-[#FEF08A] text-[#134E4A]" : "bg-white text-[#134E4A]"
        } ${isTransitioning ? "cursor-wait" : "active:translate-y-[2px] active:shadow-none"}`}
        title={
          isTransitioning
            ? isHidden
              ? `${mascotName} sedang dipanggil`
              : `${mascotName} sedang berpamitan`
            : isHidden
              ? `Panggil ${mascotName}`
              : `Sembunyikan ${mascotName}`
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          {isTransitioning ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z"
                  fill="#FEF08A"
                  stroke="#134E4A"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  animate={{ rotate: 180 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ transformOrigin: "12px 10px" }}
                />
              </svg>
              <span className="text-sm font-black">
                {isHidden ? "Memanggil..." : "Pamit..."}
              </span>
            </motion.div>
          ) : isHidden ? (
            <motion.div
              key="show"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5C12 3.5 13.5 2.5 14.5 3.5"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M5 19V13C5 8.5 8.2 5 12.5 5C16.8 5 20 8.5 20 13V19C20 19.6 19.6 20 19 20H6C5.4 20 5 19.6 5 19Z"
                  fill="#38BDF8"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9.5" cy="11" r="1.5" fill="#134E4A" />
                <circle cx="15.5" cy="11" r="1.5" fill="#134E4A" />
                <path
                  d="M11.5 11.5L13.5 11.5L12.5 13Z"
                  fill="#FBBF24"
                  stroke="#134E4A"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 4L20.5 2.5M21.5 6.5L23 6"
                  stroke="#FF6B6B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-sm font-black">Panggil</span>
            </motion.div>
          ) : (
            <motion.div
              key="hide"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="flex items-center gap-2"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 15H6M3 19H8"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M9 14C8.5 9.5 11.5 6 15.5 6C19.5 6 22 9 21.5 13.5C21 17.5 17.5 19.5 13.5 19C10.5 18.5 9.3 16.5 9 14Z"
                  fill="#38BDF8"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 10L18 11.2L16.5 12.4"
                  stroke="#134E4A"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21.5 11L23.5 12L21.2 13.2Z"
                  fill="#FBBF24"
                  stroke="#134E4A"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-black">Pamit</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AppBottomSheet
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title={`Ada yang bisa ${mascotName} bantu?`}
      >
        <div className="space-y-2.5">
          <StickerButton
            variant="primary"
            fullWidth
            onClick={() => handleAction("/member/ngaji-ceria/explore/tilawati")}
            className="justify-start"
          >
            <BookOpen size={18} className="mr-2" /> Lanjut Belajar
          </StickerButton>
          <StickerButton
            variant="secondary"
            fullWidth
            onClick={() => handleAction("/member/ngaji-ceria/explore/doa")}
            className="justify-start"
          >
            <HandsPraying size={18} className="mr-2 text-[#FF6B6B]" /> Doa
            Harian
          </StickerButton>
          <StickerButton
            variant="secondary"
            fullWidth
            onClick={() => handleAction("/member/ngaji-ceria/profile")}
            className="justify-start"
          >
            <HelpCircle size={18} className="mr-2 text-[#0D9488]" /> Kritik &
            Saran
          </StickerButton>
          <StickerButton
            variant="danger"
            fullWidth
            onClick={() => handleAction("/member/ngaji-ceria")}
            className="justify-start"
          >
            <Home size={18} className="mr-2" /> Kembali ke Beranda
          </StickerButton>
        </div>
      </AppBottomSheet>

      <AnimatePresence>
        {!isHidden && (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.1}
            dragConstraints={{
              left: -window.innerWidth + 150,
              right: 20,
              top: -window.innerHeight + 200,
              bottom: 20,
            }}
            onDrag={(_, info) => {
              const dx = info?.delta?.x ?? 0;
              setRotation((prev) => prev + dx * 1.5);
            }}
            onDragEnd={handleDragEnd}
            style={{ x, y }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`fixed bottom-28 right-0 z-[70] pointer-events-auto cursor-grab active:cursor-grabbing ${className}`}
          >
            <div className="relative flex items-center justify-center">
              <AnimatePresence>
                {tipVisible && currentTip && pageTip && !isHelpOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.2,
                      x: 60,
                      y: 80,
                      transition: { duration: 0.22, ease: "easeIn" },
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute bottom-full right-2 mb-4 z-50 w-[220px] max-w-[calc(100vw-32px)]"
                  >
                    <div className="relative rounded-2xl border-[3px] border-[#134E4A] bg-white p-3 shadow-[3px_3px_0px_#134E4A]">
                      <div className="absolute -bottom-2 right-10 w-3 h-3 bg-white border-b-[3px] border-r-[3px] border-[#134E4A] rotate-45" />
                      <button
                        onClick={handleDismissTip}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#FF6B6B] text-white border-2 border-[#134E4A] flex items-center justify-center text-xs font-black active:scale-90"
                      >
                        <X size={12} className="stroke-[3]" />
                      </button>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Lightbulb size={12} className="text-[#FF6B6B]" />
                        <span className="text-[9px] font-black text-[#FF6B6B] uppercase tracking-wider">
                          {mascotName} Says
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#134E4A] leading-relaxed">
                        {currentTip.text}
                      </p>
                      <div className="flex gap-2 mt-2.5">
                        {tips.length > 1 && (
                          <button
                            onClick={handleNextTip}
                            className="rounded-lg bg-[#F0FDF4] py-1.5 px-2 text-[9px] font-black text-[#134E4A] border-2 border-[#134E4A] active:translate-y-[1px]"
                          >
                            Tips Lain
                          </button>
                        )}
                        <button
                          onClick={handleOpenGuide}
                          className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-[#0D9488] py-1.5 text-[10px] font-black text-white border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none"
                        >
                          <BookOpen size={10} /> Buka Panduan
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                ref={middleRef}
                style={{
                  scale,
                  y: flyY,
                  x: zigzagX,
                  originX: 0.5,
                  originY: 0.5,
                  width: "fit-content",
                  height: "fit-content",
                }}
              >
                <motion.div
                  animate={{
                    y:
                      autoRoam && anim !== "fly" && !isHelpOpen
                        ? [0, -8, 0]
                        : 0,
                    x:
                      autoRoam && anim !== "fly" && !isHelpOpen
                        ? [0, 5, -5, 0]
                        : 0,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: anim === "fly" ? 1 : 3.5,
                    ease: "easeInOut",
                  }}
                >
                  <TilaMascot
                    size={size}
                    mood={mood}
                    animation={anim}
                    talking={talking}
                    speech={tipVisible ? undefined : speech}
                    onTap={handleTap}
                    rotation={rotation}
                    gender={effectiveGender}
                    holdItem={holdItem}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Aliases for compatibility
export const TitoCompanion = TilaCompanion;
export const BibiCompanion = TilaCompanion;

export function isMascotVisible(): boolean {
  if (typeof window === "undefined") return true;
  return (
    window.localStorage.getItem(HIDDEN_STORAGE_KEY) !== "1" &&
    window.localStorage.getItem("bibi-companion-hidden") !== "1"
  );
}

export function setMascotVisible(visible: boolean): void {
  if (typeof window === "undefined") return;
  useEconomyStore.getState().setShowMascot(visible);
}
