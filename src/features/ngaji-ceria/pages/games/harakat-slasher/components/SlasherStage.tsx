import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  HARAKAT_LIST,
  getSlasherItems,
  extractHarakat,
  matchesSlasherTarget,
  type SlasherMode,
  type SlasherTargetItem,
} from "../data/harakat-list";
import { FRUIT_VARIANTS } from "../data/fruit-variants";
import {
  CipratanJusSvg,
  SabetanPedangSvg,
  AwanPutihSvg,
  BatangBambuSvg,
  LantaiDojoSvg,
} from "@/components/ui/Illustrations";
import type { SlashResultKind } from "../hooks/useSlasherGame";
import { normalizeArabicText } from "@/utils/arabic";

export interface SlasherStageProps {
  isPlaying: boolean;
  isPaused?: boolean;
  currentTarget: string;
  currentTargetItem?: SlasherTargetItem;
  mode?: SlasherMode;
  gameMode?: "practice" | "challenge";
  levelConfig?: {
    spawnRate?: number;
    fallSpeed?: number;
    distractorRatio?: number;
    targetLength?: number;
  };
  onResult: (
    kind: SlashResultKind,
    symbol?: string,
    item?: SlasherTargetItem
  ) => void;
}

/**
 * Helper untuk membuat buah target (Bab 6.2 & 6.3):
 * - Mode harakat: Buah yang muncul WAJIB memiliki tanda harakat yang sama dengan target
 *   (misal target Fathah -> buah berupa بَ, تَ, نَ, مَ, dll).
 * - Mode lainnya: Menggunakan target asli.
 */
function generateTargetItem(
  pool: readonly SlasherTargetItem[],
  _targetLength: number,
  targetItem: SlasherTargetItem
): SlasherTargetItem {
  const isHarakatMode =
    targetItem.targetMode === "harakat" || targetItem.category === "harakat";
  if (!isHarakatMode) {
    return targetItem;
  }
  const targetHarakat =
    targetItem.harakatName ?? extractHarakat(targetItem.symbol);
  if (!targetHarakat) return targetItem;

  const matchingPool = pool.filter(
    (p) => (p.harakatName ?? extractHarakat(p.symbol)) === targetHarakat
  );
  if (!matchingPool.length) return targetItem;

  const item = matchingPool[Math.floor(Math.random() * matchingPool.length)];
  return {
    ...item,
    targetMode: "harakat",
    harakatName: targetHarakat,
  };
}

/**
 * Helper untuk membuat buah pengecoh (Bab 6.3):
 * - Mode harakat: Buah pengecoh WAJIB memiliki harakat BERBEDA dari target
 *   (misal target Fathah -> buah pengecoh berupa Kasrah, Dhammah, Sukun).
 * - Mode lainnya: teks simbol tidak boleh sama persis dengan target.
 */
function generateDecoyItem(
  pool: readonly SlasherTargetItem[],
  _targetLength: number,
  targetItem: SlasherTargetItem
): SlasherTargetItem {
  if (!pool || pool.length === 0) {
    return HARAKAT_LIST[0];
  }
  const isHarakatMode =
    targetItem.targetMode === "harakat" || targetItem.category === "harakat";

  if (isHarakatMode) {
    const targetHarakat =
      targetItem.harakatName ?? extractHarakat(targetItem.symbol);
    // Pengecoh TIDAK boleh memiliki harakat yang sama dengan target!
    const decoyPool = pool.filter(
      (p) => (p.harakatName ?? extractHarakat(p.symbol)) !== targetHarakat
    );
    const availablePool = decoyPool.length > 0 ? decoyPool : pool;
    const item =
      availablePool[Math.floor(Math.random() * availablePool.length)] ||
      availablePool[0];
    return {
      ...item,
      targetMode: "harakat",
      harakatName: item.harakatName ?? extractHarakat(item.symbol) ?? undefined,
    };
  }

  // Mode syllable / huruf / kata / ayat: simbol tidak boleh sama persis
  const normalizedTarget = normalizeArabicText(targetItem.symbol);
  const decoyPool = pool.filter(
    (p) => normalizeArabicText(p.symbol) !== normalizedTarget
  );
  const availablePool = decoyPool.length > 0 ? decoyPool : pool;
  return (
    availablePool[Math.floor(Math.random() * availablePool.length)] ||
    availablePool[0]
  );
}

interface SlashItem {
  id: number;
  role: "correct" | "decoy" | "bomb";
  target: SlasherTargetItem;
  fruitIndex: number; // acak dari FRUIT_VARIANTS
  x: number; // px dari kiri container
  y: number; // px dari atas container
  vx: number;
  vy: number;
  hitboxRadius: number;
  isSliced: boolean;
  sliceAngle: number;
}

interface SlashFx {
  id: number;
  x: number;
  y: number;
  angle: number;
}

const MAX_ITEMS = 14;
const GRAVITY = 1180; // Gravitasi disesuaikan agar buah melayang nyaman dan stabil di mata
const BASE_ITEM_RADIUS = 64; // Hitbox toleran dan ramah anak (radius 64px)

// Jarak titik ke segmen untuk deteksi swipe memotong objek
function distPointToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + dx * t;
  const cy = ay + dy * t;
  return Math.hypot(px - cx, py - cy);
}

export default function SlasherStage({
  isPlaying,
  isPaused = false,
  currentTarget,
  currentTargetItem,
  mode = "harakat",
  gameMode = "challenge",
  levelConfig,
  onResult,
}: SlasherStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<SlashItem[]>([]);
  const domRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const idSeq = useRef(0);
  const spawnTimer = useRef(500);
  const prevPointRef = useRef<{ x: number; y: number } | null>(null);
  const slicingRef = useRef(false);
  const trailRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const trailPathRef = useRef<SVGPathElement | null>(null);
  const trailGlowRef = useRef<SVGPathElement | null>(null);
  const targetRef = useRef(currentTarget);
  const currentTargetItemRef = useRef<SlasherTargetItem>(
    currentTargetItem ?? {
      id: currentTarget,
      name: currentTarget,
      symbol: currentTarget,
      category: mode,
    }
  );
  if (currentTargetItem) {
    currentTargetItemRef.current = currentTargetItem;
  }
  const levelConfigRef = useRef(levelConfig);
  levelConfigRef.current = levelConfig;
  const modeRef = useRef(mode);
  const gameModeRef = useRef(gameMode);
  gameModeRef.current = gameMode;
  const onResultRef = useRef(onResult);
  targetRef.current = currentTarget;
  modeRef.current = mode;
  onResultRef.current = onResult;

  // FAIR SPAWNER: Reset batch agar buah target yang baru langsung diprioritaskan
  useEffect(() => {
    targetRef.current = currentTarget;
    if (currentTargetItem) {
      currentTargetItemRef.current = currentTargetItem;
    }
    modeRef.current = mode;
    waveState.current = {
      batchSize: 5,
      spawnedInBatch: 0,
      targetsInBatch: 0,
      consecutiveDecoys: 0,
    };
  }, [currentTarget, currentTargetItem, mode]);

  const [slashFx, setSlashFx] = useState<SlashFx[]>([]);
  const fxSeq = useRef(0);
  const shouldReduceMotion = useReducedMotion();

  // FAIR SPAWNER: Menjamin minimal 2 buah target per siklus 5 buah dan anti-overlap
  const waveState = useRef({
    batchSize: 5,
    spawnedInBatch: 0,
    targetsInBatch: 0,
    consecutiveDecoys: 0,
  });

  // COLLISION & GESTURE INTEGRITY: Anti-double-hit & penalti maksimal 1 per gesture
  const gestureProcessedIds = useRef<Set<number>>(new Set());
  const gesturePenalized = useRef<boolean>(false);

  const [, forceSync] = useState(0);
  const syncItems = () => forceSync((v) => v + 1);

  const clearItems = () => {
    itemsRef.current = [];
    domRefs.current.clear();
    waveState.current = {
      batchSize: 5,
      spawnedInBatch: 0,
      targetsInBatch: 0,
      consecutiveDecoys: 0,
    };
    gestureProcessedIds.current.clear();
    gesturePenalized.current = false;
    syncItems();
  };

  const spawnItem = () => {
    const container = containerRef.current;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const pool = getSlasherItems(modeRef.current);
    const distractorRatio = levelConfigRef.current?.distractorRatio ?? 0.35;
    const targetLength = Math.max(1, levelConfigRef.current?.targetLength ?? 1);

    // SISTEM SPAWN ADIL (Fair Spawner):
    // Setiap siklus 5 buah WAJIB ada minimal 2 buah target, dan maksimal 2 pengecoh beruntun
    const ws = waveState.current;
    const remainingInBatch = ws.batchSize - ws.spawnedInBatch;
    const neededTargets = 2 - ws.targetsInBatch;

    let isDecoy: boolean;
    if (remainingInBatch <= neededTargets) {
      isDecoy = false;
    } else if (ws.consecutiveDecoys >= 2) {
      isDecoy = false;
    } else {
      isDecoy = Math.random() < distractorRatio;
    }

    ws.spawnedInBatch++;
    if (!isDecoy) {
      ws.targetsInBatch++;
      ws.consecutiveDecoys = 0;
    } else {
      ws.consecutiveDecoys++;
    }

    if (ws.spawnedInBatch >= ws.batchSize) {
      ws.spawnedInBatch = 0;
      ws.targetsInBatch = 0;
      ws.consecutiveDecoys = 0;
    }

    const isChallenge = gameModeRef.current === "challenge";
    // HAZARD BOM (Bab 6.11): Muncul di Challenge Mode secara terukur (~12%), hanya jika target batch sudah ada
    const allowBomb =
      isChallenge &&
      ws.targetsInBatch >= 1 &&
      ws.consecutiveDecoys < 2 &&
      Math.random() < 0.12;

    const currentItem = currentTargetItemRef.current;
    let target: SlasherTargetItem;
    let role: "correct" | "decoy" | "bomb";

    if (allowBomb) {
      role = "bomb";
      target = {
        id: `hazard-bomb-${idSeq.current}`,
        name: "Bom Bahaya",
        symbol: "BOM",
        category: modeRef.current,
      };
    } else {
      target = isDecoy
        ? generateDecoyItem(pool, targetLength, currentItem)
        : generateTargetItem(pool, targetLength, currentItem);
      const isMatch = matchesSlasherTarget(currentItem, target);
      role = isMatch ? "correct" : "decoy";
    }

    // FASE 2: Perhitungan Fisika & Peluncuran Tepat Melewati Tengah Layar (Eye-Level)
    const fallSpeed = levelConfigRef.current?.fallSpeed ?? 10;
    const currentGravity = GRAVITY * (fallSpeed / 10);

    const apexY = h * (0.34 + Math.random() * 0.12);
    const spawnY = h + 70;
    const deltaY = spawnY - apexY;
    const vy = -Math.sqrt(2 * currentGravity * deltaY);
    const tApex = -vy / currentGravity; // Waktu tempuh ke puncak parabola

    // ANTI-OVERLAP: Berikan jarak horizontal minimal (>= 90px) antar buah yang aktif
    const minPadding = Math.max(90, w * 0.18);
    const activeItems = itemsRef.current.filter(
      (it) => !it.isSliced && it.y > h * 0.35
    );

    let x = 0;
    let spawnFromLeft = Math.random() < 0.5;

    for (let attempt = 0; attempt < 8; attempt++) {
      const candidateX = spawnFromLeft
        ? w * (0.12 + Math.random() * 0.22)
        : w * (0.66 + Math.random() * 0.22);
      const isOverlapping = activeItems.some(
        (it) => Math.abs(it.x - candidateX) < minPadding
      );
      if (!isOverlapping || attempt === 7) {
        x = candidateX;
        break;
      }
      spawnFromLeft = !spawnFromLeft;
    }

    let targetX = w * (0.38 + Math.random() * 0.24);
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidateTargetX = w * (0.36 + Math.random() * 0.28);
      const isApexOverlapping = activeItems.some(
        (it) => Math.abs(it.vx * tApex + it.x - candidateTargetX) < 70
      );
      if (!isApexOverlapping || attempt === 4) {
        targetX = candidateTargetX;
        break;
      }
    }
    const vx = (targetX - x) / tApex;

    // FASE 3: Penyesuaian Hitbox Toleran (Lebih Ramah Anak)
    const textLen = target.symbol.length;
    const hitboxRadius =
      textLen > 6 ? 82 : textLen > 2 ? 74 : BASE_ITEM_RADIUS;

    itemsRef.current.push({
      id: idSeq.current++,
      role,
      target,
      fruitIndex: Math.floor(Math.random() * FRUIT_VARIANTS.length),
      x,
      y: spawnY,
      vx,
      vy,
      hitboxRadius,
      isSliced: false,
      sliceAngle: Math.random() * 90 - 45,
    });
    syncItems();
  };

  const addSlashFx = (x: number, y: number, angle: number) => {
    if (shouldReduceMotion) return;
    const fx: SlashFx = { id: fxSeq.current++, x, y, angle };
    setSlashFx((f) => [...f, fx]);
    setTimeout(
      () => setSlashFx((f) => f.filter((it) => it.id !== fx.id)),
      320
    );
  };

  const sliceItem = (
    item: SlashItem,
    slashAngle: number,
    hitX: number,
    hitY: number
  ) => {
    if (item.isSliced || gestureProcessedIds.current.has(item.id)) return;
    item.isSliced = true;
    gestureProcessedIds.current.add(item.id);
    item.sliceAngle = (slashAngle * 180) / Math.PI;

    addSlashFx(hitX, hitY, slashAngle);

    if (item.role === "bomb") {
      // HAZARD BOM (Bab 6.11): Kurangi 1 nyawa, mainkan SFX salah, reset combo
      onResultRef.current("bomb", "BOM", item.target);
    } else {
      const isCorrect = matchesSlasherTarget(
        currentTargetItemRef.current,
        item.target
      );

      if (isCorrect) {
        onResultRef.current("correct", item.target.symbol, item.target);
      } else {
        // Penalti maksimal 1 kali per gesture swipe sesuai Bab 6.5
        if (!gesturePenalized.current) {
          gesturePenalized.current = true;
          onResultRef.current("wrong", item.target.symbol, item.target);
        }
      }
    }

    syncItems();
    setTimeout(() => {
      itemsRef.current = itemsRef.current.filter((it) => it.id !== item.id);
      domRefs.current.delete(item.id);
      syncItems();
    }, 850);
  };

  // Game tick loop: fisika + render posisi lewat direct DOM transform
  useEffect(() => {
    if (isPaused) {
      return;
    }
    if (!isPlaying) {
      clearItems();
      return;
    }

    let lastT = performance.now();
    let animId = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      const container = containerRef.current;
      if (!container) return;
      const h = container.clientHeight;

      // 1. Spawn gelombang lemparan berdasarkan spawnRate level
      spawnTimer.current -= dt * 1000;
      if (spawnTimer.current <= 0 && itemsRef.current.length < MAX_ITEMS) {
        const volley = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < volley; i++) {
          setTimeout(
            () => {
              if (isPlaying) spawnItem();
            },
            i * (120 + Math.random() * 100)
          );
        }
        const spawnRate = levelConfigRef.current?.spawnRate ?? 1000;
        spawnTimer.current = spawnRate * (0.8 + Math.random() * 0.4);
      }

      // 2. Fisika parabola dinamis
      const keep: SlashItem[] = [];
      const fallSpeed = levelConfigRef.current?.fallSpeed ?? 10;
      const currentGravity = GRAVITY * (fallSpeed / 10);

      for (const item of itemsRef.current) {
        if (item.isSliced) {
          keep.push(item);
          continue;
        }
        item.vy += currentGravity * dt;
        item.x += item.vx * dt;
        item.y += item.vy * dt;

        const el = domRefs.current.get(item.id);
        if (el) {
          el.style.transform = `translate(${item.x}px, ${item.y}px)`;
        }

        // Melewati bawah layar tanpa ditebas:
        // Penalti Jatuh: Hanya Buah Target yang mengurangi nyawa. Pengecoh & Bom lolos tanpa penalti.
        if (item.y > h + 90 && item.vy > 0) {
          if (item.role === "bomb") {
            // Bom lolos ke bawah: berhasil dihindari, tidak ada penalti (Bab 6.11)
            domRefs.current.delete(item.id);
            continue;
          }
          const isTargetMatch = matchesSlasherTarget(
            currentTargetItemRef.current,
            item.target
          );
          if (isTargetMatch) {
            onResultRef.current("miss", item.target.symbol, item.target);
          }
          domRefs.current.delete(item.id);
          continue;
        }
        keep.push(item);
      }
      itemsRef.current = keep;

      // 3. Jejak swipe menghilang perlahan
      const cut = now - 170;
      trailRef.current = trailRef.current.filter((p) => p.t > cut);
      if (trailRef.current.length >= 2) {
        const d = trailRef.current
          .map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`)
          .join(" ");
        trailPathRef.current?.setAttribute("d", d);
        trailGlowRef.current?.setAttribute("d", d);
      } else {
        trailPathRef.current?.setAttribute("d", "");
        trailGlowRef.current?.setAttribute("d", "");
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isPaused]);

  // Deteksi geseran: pointer/touch yang melintasi objek
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isPlaying) return;

    const toLocal = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleDown = (e: PointerEvent) => {
      if (isPaused) return;
      slicingRef.current = true;
      gestureProcessedIds.current.clear();
      gesturePenalized.current = false;
      const p = toLocal(e);
      prevPointRef.current = p;
      trailRef.current = [];

      // DUKUNGAN TAP INSTAN: Jika anak menekan langsung pada buah (Bab 6.5)
      for (const item of itemsRef.current) {
        if (item.isSliced) continue;
        const dist = Math.hypot(p.x - item.x, p.y - item.y);
        if (dist < item.hitboxRadius) {
          sliceItem(item, 0, item.x, item.y);
          break;
        }
      }
    };

    const handleMove = (e: PointerEvent) => {
      if (!slicingRef.current || isPaused) return;
      const p = toLocal(e);
      const prev = prevPointRef.current;
      prevPointRef.current = p;
      if (!prev) return;
      const dist = Math.hypot(p.x - prev.x, p.y - prev.y);
      if (dist < 6) return;

      const angle = Math.atan2(p.y - prev.y, p.x - prev.x);
      trailRef.current.push({ ...p, t: performance.now() });
      if (trailRef.current.length > 14) trailRef.current.shift();

      for (const item of itemsRef.current) {
        if (item.isSliced || gestureProcessedIds.current.has(item.id)) continue;
        const d = distPointToSegment(item.x, item.y, prev.x, prev.y, p.x, p.y);
        // Menggunakan hitboxRadius dinamis toleran ramah anak
        if (d < item.hitboxRadius) {
          sliceItem(item, angle, item.x, item.y);
        }
      }
    };

    const handleUp = () => {
      slicingRef.current = false;
      prevPointRef.current = null;
      gestureProcessedIds.current.clear();
      gesturePenalized.current = false;
    };

    container.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      container.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [isPlaying]);

  useEffect(() => clearItems, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden touch-none"
      style={{ touchAction: "none" }}
    >
      {/* DEKORASI: awan parallax drift lambat */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-52 overflow-hidden">
        <motion.div
          className="absolute left-[-12%] top-4 w-32"
          animate={{ x: [0, 480] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        >
          <AwanPutihSvg size={110} />
        </motion.div>
        <motion.div
          className="absolute right-[-10%] top-14 w-28 opacity-80"
          animate={{ x: [0, -480] }}
          transition={{ repeat: Infinity, duration: 34, ease: "linear" }}
        >
          <AwanPutihSvg size={95} />
        </motion.div>
      </div>

      {/* DEKORASI: bambu kiri & kanan gaya dojo */}
      <div className="pointer-events-none absolute -bottom-6 -left-3 z-0 w-24 sm:w-28 opacity-90">
        <BatangBambuSvg size={220} />
      </div>
      <div className="pointer-events-none absolute -bottom-6 -right-3 z-0 w-24 sm:w-28 opacity-90 scale-x-[-1]">
        <BatangBambuSvg size={220} />
      </div>

      {/* DEKORASI: lantai tatami dojo di bawah */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 z-0 h-16">
        <LantaiDojoSvg size={180} className="w-full h-full object-cover" />
      </div>

      {/* RENDER ITEM BUAH YANG DITERBANGKAN */}
      {itemsRef.current.map((item) => {
        const fruit = FRUIT_VARIANTS[item.fruitIndex % FRUIT_VARIANTS.length];
        const highlight = item.role === "correct";
        const symbolText = item.target.symbol;
        const textLen = symbolText.length;

        return (
          <div
            key={item.id}
            ref={(node) => {
              if (node) domRefs.current.set(item.id, node);
              else domRefs.current.delete(item.id);
            }}
            className="pointer-events-none absolute left-0 top-0 z-20 will-change-transform"
            style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              {item.role === "bomb" ? (
                item.isSliced ? (
                  <div
                    className="relative h-24 w-24 flex items-center justify-center"
                    style={{ transform: `rotate(${item.sliceAngle}deg)` }}
                  >
                    {shouldReduceMotion ? (
                      <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="flex items-center justify-center"
                      >
                        <div className="h-16 w-16 rounded-full border-[3px] border-[#134E4A] bg-[#DC2626] flex items-center justify-center shadow-[2px_2px_0px_#134E4A]">
                          <span className="font-black text-white text-[10px] uppercase tracking-wider">
                            BOM
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.3, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="h-20 w-20 rounded-full border-[3.5px] border-[#134E4A] bg-[#DC2626] flex items-center justify-center shadow-[3px_3px_0px_#134E4A]">
                          <span className="font-black text-white text-xs uppercase tracking-wider">
                            DUARR
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.18 }}
                    className="relative flex items-center justify-center h-24 w-24"
                  >
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-[3.5px] border-[#134E4A] bg-[#1F2937] shadow-[4px_4px_0px_#134E4A]">
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <span className="h-2 w-2 rounded-full bg-[#EF4444] animate-ping" />
                        <span className="h-2.5 w-1 bg-[#F59E0B] rounded-t" />
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#EF4444]">
                          BOM
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              ) : item.isSliced ? (
                shouldReduceMotion ? (
                  <div className="relative h-24 w-24 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="flex items-center justify-center"
                    >
                      <fruit.FruitSliced
                        size={fruit.id === "watermelon" ? 120 : 96}
                        className="drop-shadow-[3px_3px_0px_rgba(19,78,74,0.8)]"
                      />
                    </motion.div>
                  </div>
                ) : (
                  <div
                    className="relative h-24 w-24"
                    style={{ transform: `rotate(${item.sliceAngle}deg)` }}
                  >
                    {/* Splatter jus sesuai warna buah */}
                    <motion.div
                      initial={{ scale: 0.4, opacity: 0.9 }}
                      animate={{ scale: 1.15, opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="absolute -z-10 inset-[-26px]"
                    >
                      <CipratanJusSvg size={140} />
                      {[
                        [-34, -26, 9],
                        [30, -34, 7],
                        [38, 28, 11],
                        [-40, 30, 6],
                      ].map(([dx, dy, r], i) => (
                        <span
                          key={i}
                          className="absolute rounded-full border-2 border-[#134E4A]"
                          style={{
                            left: 68 + dx,
                            top: 68 + dy,
                            width: r * 2,
                            height: r * 2,
                            backgroundColor: fruit.color,
                          }}
                        />
                      ))}
                    </motion.div>
                    {/* Dua potongan slicedImg terbang berlawanan */}
                    <motion.div
                      initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                      animate={{ x: -54, y: 70, rotate: -46, opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-0"
                      style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
                    >
                      <fruit.FruitSliced size={fruit.id === "watermelon" ? 120 : 96} className="drop-shadow-[3px_3px_0px_rgba(19,78,74,0.8)]" />
                    </motion.div>
                    <motion.div
                      initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                      animate={{ x: 56, y: 84, rotate: 40, opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-0"
                      style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}
                    >
                      <fruit.FruitSliced size={fruit.id === "watermelon" ? 120 : 96} className="drop-shadow-[3px_3px_0px_rgba(19,78,74,0.8)]" />
                    </motion.div>
                  </div>
                )
              ) : (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: fruit.id === "watermelon" ? 1.2 : 1, opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  className={`relative flex items-center justify-center ${
                    fruit.id === "watermelon" ? "h-28 w-28" : "h-24 w-24"
                  }`}
                >
                  <fruit.FruitWhole
                    size={fruit.id === "watermelon" ? 120 : 96}
                    className="drop-shadow-[4px_5px_0px_rgba(19,78,74,0.75)]"
                  />
                  {/* OVERLAY TEKS (Neo-Brutalism HTML Overlay Responsif) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="bg-[#FFFBEB] border-[3px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] rounded-full px-3 py-1 min-h-[36px] w-fit flex items-center justify-center max-w-[130px]">
                      <span
                        dir="rtl"
                        className={`font-arabic font-black whitespace-nowrap text-[#134E4A] leading-normal ${
                          symbolText.length <= 3 ? "text-xl" : "text-sm sm:text-base"
                        }`}
                      >
                        {symbolText}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );
      })}

      {/* Jejak pedang swipe */}
      <svg className="pointer-events-none absolute inset-0 z-40 h-full w-full">
        <path
          ref={trailGlowRef}
          stroke="#134E4A"
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.9}
        />
        <path
          ref={trailPathRef}
          stroke="#FDE68A"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* FX sabetan pedang mengikuti arah swipe (dinonaktifkan jika prefers-reduced-motion aktif) */}
      {!shouldReduceMotion &&
        slashFx.map((fx) => (
          <motion.div
            key={fx.id}
            initial={{ opacity: 1, scale: 0.7, rotate: (fx.angle * 180) / Math.PI }}
            animate={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-1/2"
            style={{ left: fx.x, top: fx.y }}
          >
            <SabetanPedangSvg size={120} />
          </motion.div>
        ))}
    </div>
  );
}
