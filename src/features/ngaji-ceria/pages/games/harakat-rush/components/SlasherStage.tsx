import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  HARAKAT_LIST,
  getSlasherItems,
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

export interface SlasherStageProps {
  isPlaying: boolean;
  currentTarget: string;
  mode?: SlasherMode;
  onResult: (kind: SlashResultKind, symbol?: string) => void;
}

interface SlashItem {
  id: number;
  role: "correct" | "decoy";
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
const BASE_ITEM_RADIUS = 52;

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
  currentTarget,
  mode = "harakat",
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
  const modeRef = useRef(mode);
  const onResultRef = useRef(onResult);
  targetRef.current = currentTarget;
  modeRef.current = mode;
  onResultRef.current = onResult;

  const [slashFx, setSlashFx] = useState<SlashFx[]>([]);
  const fxSeq = useRef(0);

  const [, forceSync] = useState(0);
  const syncItems = () => forceSync((v) => v + 1);

  const clearItems = () => {
    itemsRef.current = [];
    domRefs.current.clear();
    syncItems();
  };

  const spawnItem = () => {
    const container = containerRef.current;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const pool = getSlasherItems(modeRef.current);
    const isCorrect = Math.random() < 0.5;
    const target = isCorrect
      ? pool.find((item) => item.id === targetRef.current) ??
        pool[Math.floor(Math.random() * pool.length)] ??
        HARAKAT_LIST[0]
      : pool[Math.floor(Math.random() * pool.length)] ?? HARAKAT_LIST[0];

    // FASE 2: Perhitungan Fisika & Peluncuran Tepat Melewati Tengah Layar (Eye-Level)
    // Titik puncak (apex) diatur di area tengah pandangan (34% - 46% tinggi layar)
    const apexY = h * (0.34 + Math.random() * 0.12);
    const spawnY = h + 70;
    const deltaY = spawnY - apexY;
    const vy = -Math.sqrt(2 * GRAVITY * deltaY);
    const tApex = -vy / GRAVITY; // Waktu tempuh ke puncak parabola (~1.0s)

    // Titik tengah X tujuan (antara 38% - 62% lebar layar)
    const targetX = w * (0.38 + Math.random() * 0.24);

    // Titik spawn dari sisi kiri (14% - 34%) atau sisi kanan (66% - 86%)
    const spawnFromLeft = Math.random() < 0.5;
    const x = spawnFromLeft
      ? w * (0.14 + Math.random() * 0.2)
      : w * (0.66 + Math.random() * 0.2);

    // Kecepatan horizontal terukur agar melintas persis di titik tengah saat puncak
    const vx = (targetX - x) / tApex;

    // FASE 3: Penyesuaian Hitbox Berdasarkan Panjang Teks Arab
    const textLen = target.symbol.length;
    const hitboxRadius = textLen > 6 ? 68 : textLen > 2 ? 60 : BASE_ITEM_RADIUS;

    itemsRef.current.push({
      id: idSeq.current++,
      role: isCorrect ? "correct" : "decoy",
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
    if (item.isSliced) return;
    item.isSliced = true;
    item.sliceAngle = (slashAngle * 180) / Math.PI;

    addSlashFx(hitX, hitY, slashAngle);

    if (item.role === "correct") {
      onResultRef.current("correct", item.target.symbol);
    } else {
      onResultRef.current("wrong", item.target.symbol);
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

      // 1. Spawn gelombang lemparan
      spawnTimer.current -= dt * 1000;
      if (spawnTimer.current <= 0 && itemsRef.current.length < MAX_ITEMS) {
        const volley = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < volley; i++) {
          setTimeout(
            () => {
              if (isPlaying) spawnItem();
            },
            i * (140 + Math.random() * 120)
          );
        }
        spawnTimer.current = 1350 + Math.random() * 500;
      }

      // 2. Fisika parabola
      const keep: SlashItem[] = [];
      for (const item of itemsRef.current) {
        if (item.isSliced) {
          keep.push(item);
          continue;
        }
        item.vy += GRAVITY * dt;
        item.x += item.vx * dt;
        item.y += item.vy * dt;

        const el = domRefs.current.get(item.id);
        if (el) {
          el.style.transform = `translate(${item.x}px, ${item.y}px)`;
        }

        // Melewati bawah layar tanpa ditebas
        if (item.y > h + 90 && item.vy > 0) {
          if (item.role === "correct") {
            onResultRef.current("miss", item.target.symbol);
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
  }, [isPlaying]);

  // Deteksi geseran: pointer/touch yang melintasi objek
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isPlaying) return;

    const toLocal = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleDown = (e: PointerEvent) => {
      slicingRef.current = true;
      prevPointRef.current = toLocal(e);
      trailRef.current = [];
    };

    const handleMove = (e: PointerEvent) => {
      if (!slicingRef.current) return;
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
        if (item.isSliced) continue;
        const d = distPointToSegment(item.x, item.y, prev.x, prev.y, p.x, p.y);
        // Menggunakan hitboxRadius dinamis sesuai panjang teks
        if (d < item.hitboxRadius) {
          sliceItem(item, angle, item.x, item.y);
        }
      }
    };

    const handleUp = () => {
      slicingRef.current = false;
      prevPointRef.current = null;
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
              {item.isSliced ? (
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
              ) : (
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: fruit.id === "watermelon" ? 1.2 : 1, opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  className={`relative flex items-center justify-center ${
                    fruit.id === "watermelon" ? "h-28 w-28" : "h-24 w-24"
                  }`}
                  style={{
                    filter: highlight
                      ? "drop-shadow(0 0 0 4px #FDE68A)"
                      : undefined,
                  }}
                >
                  <fruit.FruitWhole
                    size={fruit.id === "watermelon" ? 120 : 96}
                    className="drop-shadow-[4px_5px_0px_rgba(19,78,74,0.75)]"
                  />
                  {/* OVERLAY TEKS TARGET: Stiker putih dengan font Arab dinamis & responsif */}
                  <span
                    className={`absolute z-10 flex items-center justify-center border-[3px] border-[#134E4A] bg-white transition-all ${
                      textLen > 6
                        ? "h-11 min-w-[76px] max-w-[104px] px-2.5 rounded-2xl"
                        : textLen > 2
                          ? "h-11 min-w-[58px] max-w-[84px] px-2 rounded-2xl"
                          : "h-11 w-11 rounded-full"
                    }`}
                    style={
                      highlight
                        ? { boxShadow: "0 0 0 3px #FDE68A, 2px 3px 0px rgba(19,78,74,0.6)" }
                        : { boxShadow: "2px 3px 0px rgba(19,78,74,0.6)" }
                    }
                  >
                    <span
                      className={`font-arabic font-black leading-none text-[#134E4A] whitespace-nowrap text-center ${
                        textLen > 8
                          ? "text-[11px]"
                          : textLen > 6
                            ? "text-xs"
                            : textLen > 2
                              ? "text-base"
                              : "text-2xl"
                      }`}
                    >
                      {symbolText}
                    </span>
                  </span>

                  {/* FASE 1: Label TARGET Lebih Kontras, Berpola Neo-Brutalism dengan Hard Shadow */}
                  {highlight && (
                    <span className="absolute -top-3 z-20 whitespace-nowrap rounded-md border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                      TARGET
                    </span>
                  )}
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

      {/* FX sabetan pedang mengikuti arah swipe */}
      {slashFx.map((fx) => (
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
