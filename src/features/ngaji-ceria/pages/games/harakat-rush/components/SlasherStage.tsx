import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { HARAKAT_LIST } from "../data/harakat-list";
import type { HarakatId } from "../data/harakat-list";
import { FRUIT_VARIANTS } from "../data/fruit-variants";
import { CipratanJusSvg, SabetanPedangSvg, AwanPutihSvg, BatangBambuSvg, LantaiDojoSvg } from "@/components/ui/Illustrations";
import type { SlashResultKind } from "../hooks/useSlasherGame";

export interface SlasherStageProps {
  isPlaying: boolean;
  currentTarget: HarakatId;
  onResult: (kind: SlashResultKind, symbol?: string) => void;
}

interface SlashItem {
  id: number;
  role: "correct" | "decoy";
  harakat: (typeof HARAKAT_LIST)[number];
  fruitIndex: number; // acak dari FRUIT_VARIANTS
  x: number; // px dari kiri container
  y: number; // px dari atas container
  vx: number;
  vy: number;
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
const GRAVITY = 1500;
const ITEM_RADIUS = 52;

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
  const onResultRef = useRef(onResult);
  targetRef.current = currentTarget;
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

    // Volé pertama selalu berpeluang besar menjadi target, sisanya campuran
    const isCorrect = Math.random() < 0.5;
    const harakat = isCorrect
      ? HARAKAT_LIST.find((h) => h.id === targetRef.current) ??
        HARAKAT_LIST[Math.floor(Math.random() * HARAKAT_LIST.length)]
      : HARAKAT_LIST[Math.floor(Math.random() * HARAKAT_LIST.length)];

    const x = 70 + Math.random() * (w - 140);
    const centerPull = ((w / 2 - x) / w) * 160;
    const vx = (Math.random() * 2 - 1) * 110 + centerPull;
    const vy = -(900 + Math.random() * 260);

    itemsRef.current.push({
      id: idSeq.current++,
      role: isCorrect ? "correct" : "decoy",
      harakat,
      fruitIndex: Math.floor(Math.random() * FRUIT_VARIANTS.length),
      x,
      y: h + 70,
      vx,
      vy,
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

  const sliceItem = (item: SlashItem, angle: number, fxX: number, fxY: number) => {
    item.isSliced = true;
    const kind: SlashResultKind = item.role === "correct" ? "correct" : "wrong";
    onResultRef.current(kind, item.harakat.symbol);
    addSlashFx(fxX, fxY, angle);
    setTimeout(() => {
      itemsRef.current = itemsRef.current.filter((it) => it.id !== item.id);
      domRefs.current.delete(item.id);
      syncItems();
    }, 800);
  };

  // Game loop: spawn volé, fisika gravitasi, marka swipe, dan daur ulang
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.06);
      lastTime = now;
      const container = containerRef.current;
      if (!container) {
        animId = requestAnimationFrame(tick);
        return;
      }
      const w = container.clientWidth;
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
        spawnTimer.current = 1300 + Math.random() * 500;
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
            onResultRef.current("miss", item.harakat.symbol);
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
        if (d < ITEM_RADIUS) {
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
          animate={{ x: ["0%", "125%"] }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        >
          <AwanPutihSvg size={130} className="opacity-90" />
        </motion.div>
        <motion.div
          className="absolute left-[-16%] top-24 w-24"
          animate={{ x: ["0%", "170%"] }}
          transition={{ repeat: Infinity, duration: 80, ease: "linear", delay: 14 }}
        >
          <AwanPutihSvg size={100} className="opacity-75" />
        </motion.div>
      </div>

      {/* DEKORASI: bambu di tepi dasar + lantai dojo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0">
        <div className="absolute bottom-16 left-2 w-16 sm:w-20">
          <motion.div
            animate={{ rotate: [-3, 2, -3] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            style={{ transformOrigin: "bottom center" }}
          >
            <BatangBambuSvg size={170} className="opacity-90" />
          </motion.div>
        </div>
        <div className="absolute bottom-16 right-2 w-16 sm:w-20">
          <motion.div
            animate={{ rotate: [2, -3, 2] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1.2 }}
            style={{ transformOrigin: "bottom center" }}
          >
            <BatangBambuSvg size={170} className="opacity-90" />
          </motion.div>
        </div>
        {/* Papan dojo di tengah + garis lantai penuh */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <LantaiDojoSvg size={190} />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-14 border-t-[4px] border-[#134E4A] bg-[#92400E]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(69,26,3,0.35) 0 3px, transparent 3px 46px)",
          }}
        />
      </div>

      {/* Objek buah (dipos via RAF, ref array aman melewati re-render) */}
      {itemsRef.current.map((item) => {
        const fruit = FRUIT_VARIANTS[item.fruitIndex];
        const highlight = item.harakat.id === targetRef.current;
        return (
          <div
            key={item.id}
            ref={(el) => {
              if (el) domRefs.current.set(item.id, el);
              else domRefs.current.delete(item.id);
            }}
            className="pointer-events-none absolute left-0 top-0 will-change-transform"
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
                    <fruit.FruitSliced size={96} className="drop-shadow-[3px_3px_0px_rgba(19,78,74,0.8)]" />
                  </motion.div>
                  <motion.div
                    initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                    animate={{ x: 56, y: 84, rotate: 40, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0"
                    style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}
                  >
                    <fruit.FruitSliced size={96} className="drop-shadow-[3px_3px_0px_rgba(19,78,74,0.8)]" />
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  className="relative flex h-24 w-24 items-center justify-center"
                  style={{
                    filter: highlight
                      ? "drop-shadow(0 0 0 4px #FDE68A)"
                      : undefined,
                  }}
                >
                  <fruit.FruitWhole
                    size={96}
                    className="drop-shadow-[4px_5px_0px_rgba(19,78,74,0.75)]"
                  />
                  {/* OVERLAY HARAKAT: stiker putih di tengah buah, lapisan teratas */}
                  <span
                    className="absolute z-10 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[#134E4A] bg-white"
                    style={
                      highlight
                        ? { boxShadow: "0 0 0 4px #FDE68A, 2px 3px 0px rgba(19,78,74,0.6)" }
                        : { boxShadow: "2px 3px 0px rgba(19,78,74,0.6)" }
                    }
                  >
                    <span className="font-arabic text-2xl font-black leading-none text-[#134E4A]">
                      {item.harakat.symbol}
                    </span>
                  </span>
                  {highlight && (
                    <span className="absolute -top-2 z-10 rounded-md border-[2px] border-[#134E4A] bg-[#FDE68A] px-1.5 py-[1px] text-[8px] font-black text-[#134E4A]">
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
