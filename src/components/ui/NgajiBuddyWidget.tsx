import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import { BibiMascot, type BibiAnimation, type BibiMood } from "./BibiMascot";

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
  User,
} from ".";
import { BibiReactionType } from "@/utils/bibiEvent";

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

interface NgajiBuddyWidgetProps {
  size?: number;
  autoRoam?: boolean;
  reactiveSpeech?: boolean;
  className?: string;
  pageTip?: PageTipConfig;
}

const HIDDEN_STORAGE_KEY = "ngaji-buddy-widget-hidden";

const SCROLL_MESSAGES = [
  "Assalamualaikum! Yuk ngaji bareng",
  "Yuk scroll pelan-pelan",
  "Banyak ilmu seru di bawah!",
  "Aku temani kamu belajar terus",
  "MasyaAllah, rajin sekali!",
  "Sampai bawah nih, hebat!",
];

export function NgajiBuddyWidget({
  size = 125,
  autoRoam = true,
  reactiveSpeech = true,
  className = "",
  pageTip,
}: NgajiBuddyWidgetProps) {
  const navigate = useNavigate();

  const [isHidden, setIsHidden] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(HIDDEN_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [mood, setMood] = useState<BibiMood>("excited");
  const [anim, setAnim] = useState<BibiAnimation>("fly");
  const [speech, setSpeech] = useState<string | undefined>(
    "Assalamualaikum! Siap ngaji?",
  );
  const [talking, setTalking] = useState(true);
  const [rotation, setRotation] = useState(0);

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

  const hasAppearedRef = useRef(false);

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
      // ignore quota / private mode
    }
  }, [isHidden]);

  const flyToGuide = useCallback(() => {
    const target = pageTip?.guideButtonRef?.current;
    const middle = middleRef.current;
    if (!target || !middle) return;

    const tRect = target.getBoundingClientRect();
    const mRect = middle.getBoundingClientRect();
    if (tRect.width === 0 && tRect.height === 0) return;

    const targetCenterX = tRect.left - 20;
    const targetCenterY = tRect.top + tRect.height / 2;
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
    const saved = localStorage.getItem("ngaji-buddy-widget-pos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        x.set(parsed.x);
        y.set(parsed.y);
      } catch (e) {}
    }
  }, [x, y]);

  useEffect(() => {
    if (isHidden) return;
    setRotation(180);
    const timer = setTimeout(() => {
      setAnim("float");
      setMood("happy");
      setTalking(false);
      setRotation(0);
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleReaction = (e: Event) => {
      const customEvent = e as CustomEvent<BibiReactionType>;
      const type = customEvent.detail;

      switch (type) {
        case "play":
          setMood("excited");
          setSpeech("Bismillah, ayo semangat!");
          setTalking(true);
          setAnim("bounce");
          setRotation((prev) => prev + 360);
          animate(scale, 1.4, { duration: 0.3 });
          setTimeout(() => animate(scale, 1, { duration: 0.3 }), 800);
          break;
        case "exit":
          setMood("sad");
          setSpeech("Hati-hati ya! Sampai jumpa");
          setTalking(true);
          setAnim("float");
          setRotation((prev) => prev + 45);
          setTimeout(() => setRotation((prev) => prev - 90), 500);
          setTimeout(() => setRotation((prev) => prev + 45), 1000);
          break;
        case "success":
          setMood("excited");
          setSpeech("Alhamdulillah! Hebat sekali!");
          setTalking(true);
          setAnim("bounce");
          setRotation((prev) => prev + 360);
          break;
        case "error":
          setMood("sad");
          setSpeech("Belum tepat, yuk coba lagi!");
          setTalking(true);
          setAnim("float");
          break;
        default:
          setMood("happy");
          setSpeech("Assalamualaikum!");
          setTalking(true);
          break;
      }

      setTimeout(() => setTalking(false), 3000);
      setTimeout(() => setAnim("float"), 2000);
    };

    window.addEventListener("bibi-react", handleReaction);
    return () => window.removeEventListener("bibi-react", handleReaction);
  }, [scale]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      if (isHidden) return;
      if (boredomTimer.current) clearTimeout(boredomTimer.current);

      if (Math.abs(delta) > 15) {
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

      if (reactiveSpeech && milestoneIndex.current < SCROLL_MESSAGES.length) {
        if (currentY > milestoneIndex.current * 800 && currentY > 400) {
          setSpeech(SCROLL_MESSAGES[milestoneIndex.current]);
          setTalking(true);
          setMood("excited");
          setRotation((prev) => prev + 360);

          animate(scale, 1.3, { duration: 0.4 });
          setTimeout(() => animate(scale, 1, { duration: 0.4 }), 2000);
          window.setTimeout(() => setTalking(false), 3000);
          milestoneIndex.current += 1;
        }
      }

      boredomTimer.current = window.setTimeout(() => {
        setRotation((prev) => prev + 180);
        setMood("sleepy");
        setSpeech("Hmm, yuk lanjut belajarnya...");
        setTalking(true);
        setTimeout(() => setTalking(false), 2500);
      }, 15000);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reactiveSpeech, isHidden, scale]);

  useEffect(() => {
    if (isHidden || isHelpOpen) return;

    const startIdleTimer = () => {
      if (idleTimer.current) clearInterval(idleTimer.current);
      idleTimer.current = window.setInterval(() => {
        const direction = Math.random() > 0.5 ? 45 : -45;
        setRotation((prev) => prev + direction);
        setMood("thinking");
        setTimeout(() => {
          setRotation((prev) => prev - direction);
          setMood("happy");
        }, 1500);
      }, 6000);
    };

    startIdleTimer();
    return () => {
      if (idleTimer.current) clearInterval(idleTimer.current);
    };
  }, [isHidden, isHelpOpen]);

  const handleDragEnd = () => {
    localStorage.setItem(
      "ngaji-buddy-widget-pos",
      JSON.stringify({ x: x.get(), y: y.get() }),
    );
  };

  const handleTap = useCallback(() => {
    if (isHidden) return;

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

    animate(scale, 1.6, { type: "spring", stiffness: 100, damping: 12 });
    setMood("happy");
    setSpeech("Hai! Ada yang mau dipelajari?");
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
  }, [isHidden, scale, pageTip, tips.length, notifyTipChange]);

  const handleHide = () => {
    setIsHelpOpen(false);

    if (showTimerRef.current) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    try {
      window.localStorage.setItem(HIDDEN_STORAGE_KEY, "1");
    } catch {
      // ignore
    }

    const hasTips = Boolean(pageTip && tips.length > 0);
    const nextAppeared = hasAppearedRef.current || hasTips;

    setTipVisible(false);
    hasAppearedRef.current = nextAppeared;
    notifyTipChange(false, nextAppeared);

    setSpeech("Sampai jumpa! Panggil aku lagi ya");
    setMood("sad");
    setTalking(true);
    setAnim("fly");
    setRotation((prev) => Math.round(prev / 180) * 180 + 180);

    const startX = x.get();
    const flyDuration = 2.6;

    animate(
      zigzagX,
      [startX, startX + 80, startX - 120, -window.innerWidth - 200],
      { duration: flyDuration, ease: "easeInOut" },
    );
    animate(flyY, [0, -30, 0, -50], { duration: flyDuration });
    animate(scale, [1, 1.1, 0.8, 0], { duration: flyDuration });

    setTimeout(() => {
      setIsHidden(true);
      setTalking(false);
      zigzagX.set(0);
      flyY.set(0);
      scale.set(1);
    }, flyDuration * 1000);
  };

  const handleCall = () => {
    try {
      window.localStorage.setItem(HIDDEN_STORAGE_KEY, "0");
    } catch {
      // ignore
    }

    setIsHidden(false);
    setSpeech("Assalamualaikum! Aku kembali!");
    setMood("excited");
    setTalking(true);
    setAnim("fly");

    const targetX = x.get();
    const startX = window.innerWidth + 200;
    const flyDuration = 2.6;

    flyY.set(-80);
    scale.set(0);
    zigzagX.set(startX);
    setRotation((prev) => Math.round(prev / 180) * 180 + 90);

    animate(
      zigzagX,
      [startX, startX - 150, startX - 300, targetX + 80, targetX],
      { duration: flyDuration, ease: "easeOut" },
    );
    animate(flyY, [-80, 0], { duration: flyDuration });
    animate(scale, [0, 0.8, 1.15, 1], { duration: flyDuration });

    setTimeout(() => {
      setAnim("float");
      setTalking(false);
      setRotation((prev) => Math.round(prev / 180) * 180 + 180);
    }, flyDuration * 1000);
  };

  const handleAction = (path: string) => {
    setIsHelpOpen(false);
    navigate(path);
  };

  return (
    <>
      <motion.button
        onClick={isHidden ? handleCall : handleHide}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-28 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-[3px_3px_0px_#134E4A] border-[3px] border-[#134E4A] transition-all active:translate-y-[2px] active:shadow-none ${
          isHidden ? "bg-[#0D9488] text-white" : "bg-white text-[#FF6B6B]"
        }`}
        title={isHidden ? "Panggil Teman Ngaji" : "Sembunyikan Teman Ngaji"}
      >
        {isHidden ? (
          <User size={22} className="text-white" />
        ) : (
          <HandsPraying size={22} className="text-[#134E4A]" />
        )}
      </motion.button>

      <AnimatePresence>
        {isHelpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 pb-24 px-4 backdrop-blur-sm"
            onClick={() => setIsHelpOpen(false)}
          >
            <StickerCard
              className="w-full max-w-sm p-5 rounded-[24px] shadow-[8px_8px_0px_#134E4A]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-black text-lg text-[#134E4A]">
                  Yuk pilih kegiatan belajarmu!
                </h3>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="rounded-full bg-gray-100 p-1.5 text-[#134E4A]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2.5">
                <StickerButton
                  variant="primary"
                  fullWidth
                  onClick={() => handleAction("/member/ngaji-ceria/quiz")}
                  className="justify-start"
                >
                  <BookOpen size={18} className="mr-2" /> Lanjut Belajar
                </StickerButton>
                <StickerButton
                  variant="secondary"
                  fullWidth
                  onClick={() =>
                    handleAction("/member/ngaji-ceria/explore/doa")
                  }
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
                  <HelpCircle size={18} className="mr-2 text-[#0D9488]" />{" "}
                  Kritik & Saran
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
            </StickerCard>
          </motion.div>
        )}
      </AnimatePresence>

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
            className={`fixed bottom-28 right-0 z-40 pointer-events-auto cursor-grab active:cursor-grabbing ${className}`}
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
                        <X size={12} />
                      </button>

                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Lightbulb size={12} className="text-[#FF6B6B]" />
                        <span className="text-[9px] font-black text-[#FF6B6B] uppercase tracking-wider">
                          Tips Mengaji
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
                  <BibiMascot
                    size={size}
                    mood={mood}
                    animation={anim}
                    talking={talking}
                    speech={tipVisible ? undefined : speech}
                    onTap={handleTap}
                    rotation={rotation}
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
