export type GhostVariant = "clip" | "asset" | "text";

export interface GhostInfo {
  variant: GhostVariant;
  title: string;
  sub?: string;
  /** Kelas warna jenis klip, mis. "te-kind-baris". */
  toneClass?: string;
}

const BADGE: Record<GhostVariant, string> = {
  clip: "♪",
  asset: "▶",
  text: "文",
};

/**
 * Membangun elemen "hantu" drag berbentuk mini-klip yang menyusut,
 * menggantikan label teks generik ("Klip audio").
 * Dipakai untuk drag mouse (setDragImage) maupun sentuh (ghost mengikuti jari).
 */
export function buildDragGhost(info: GhostInfo): HTMLDivElement {
  const ghost = document.createElement("div");
  ghost.className = `te-drag-ghost${info.toneClass ? ` ${info.toneClass}` : ""}`;

  if (info.variant !== "text") {
    const wave = document.createElement("div");
    wave.className = "te-drag-ghost-wave";
    wave.setAttribute("aria-hidden", "true");
    ghost.appendChild(wave);
  }

  const body = document.createElement("div");
  body.className = "te-drag-ghost-body";

  const title = document.createElement("strong");
  title.textContent = info.title;
  if (info.variant === "text") {
    title.className = "te-arabic";
    title.dir = "rtl";
  }
  body.appendChild(title);

  if (info.sub) {
    const sub = document.createElement("small");
    sub.textContent = info.sub;
    body.appendChild(sub);
  }
  ghost.appendChild(body);

  const badge = document.createElement("span");
  badge.className = "te-drag-ghost-badge";
  badge.textContent = BADGE[info.variant];
  badge.setAttribute("aria-hidden", "true");
  ghost.appendChild(badge);

  ghost.dataset.t0 = String(Date.now());
  return ghost;
}

/** Membersihkan seluruh sisa ghost dari DOM secara instan. */
export function purgeStrayGhosts() {
  document.querySelectorAll(".te-drag-ghost").forEach((el) => el.remove());
}

/**
 * Menyiapkan ghost drag kustom untuk HTML5 native DnD via setDragImage.
 * Mencegah ghost ganda dan memastikan ghost selalu muncul di Chromium/Linux.
 */
export function attachDragImage(
  event: React.DragEvent,
  info: GhostInfo,
): HTMLElement {
  purgeStrayGhosts();
  const ghost = buildDragGhost(info);
  // Posisikan di dalam viewport tetapi di belakang background agar browser
  // dapat merender raster tile snapshot sebelum drag dimulai.
  ghost.style.position = "fixed";
  ghost.style.left = "0px";
  ghost.style.top = "0px";
  ghost.style.zIndex = "-9999";
  ghost.style.pointerEvents = "none";
  document.body.appendChild(ghost);

  const w = ghost.offsetWidth || 184;
  const h = ghost.offsetHeight || 60;
  const offsetX = Math.round(w / 2);
  const offsetY = Math.round(h / 2);

  try {
    event.dataTransfer.setDragImage(ghost, offsetX, offsetY);
  } catch {
    /* fallback jika browser tidak mengizinkan setDragImage */
  }

  return ghost;
}

/**
 * Auto-scroll tepi selama touch-drag: hanya menggeser scroller ketika
 * titik sentuh berada di dalam zona tepi DAN masih bisa scroll ke arah itu.
 * Di area tengah tidak pernah menyentuh scrollLeft.
 */
export function startTouchEdgeScroll(
  scroller: HTMLElement | null,
  getClientX: () => number | null,
  opts?: { zone?: number; min?: number; max?: number },
): () => void {
  if (!scroller) return () => undefined;
  const zone = opts?.zone ?? 56;
  const min = opts?.min ?? 2;
  const max = opts?.max ?? 18;
  let raf = 0;
  const tick = () => {
    const x = getClientX();
    if (x !== null && scroller.scrollWidth > scroller.clientWidth + 1) {
      const rect = scroller.getBoundingClientRect();
      const dL = x - rect.left;
      const dR = rect.right - x;
      let speed = 0;
      if (dL >= 0 && dL < zone && scroller.scrollLeft > 0) {
        const t = (zone - dL) / zone;
        speed = -(min + t * (max - min));
      } else if (
        dR >= 0 &&
        dR < zone &&
        scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth - 1
      ) {
        const t = (zone - dR) / zone;
        speed = min + t * (max - min);
      }
      if (speed !== 0) scroller.scrollLeft += speed;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/**
 * Menempelkan ghost tepat di titik pointer (tengah ghost = titik sentuh),
 * dijepit agar tidak keluar layar.
 */
export function placeGhostOnPoint(
  ghost: HTMLElement,
  clientX: number,
  clientY: number,
) {
  placeGhostWithSize(ghost, clientX, clientY);
}

function placeGhostWithSize(
  ghost: HTMLElement,
  clientX: number,
  clientY: number,
  size?: { w: number; h: number },
) {
  const w = size?.w || ghost.offsetWidth || 184;
  const h = size?.h || ghost.offsetHeight || 84;
  const margin = 8;
  const maxX = Math.max(margin, window.innerWidth - w - margin);
  const maxY = Math.max(margin, window.innerHeight - h - margin);
  ghost.style.left = `${Math.min(Math.max(clientX - w / 2, margin), maxX)}px`;
  ghost.style.top = `${Math.min(Math.max(clientY - h / 2, margin), maxY)}px`;
}

/** Animasi kilat singkat pada klip yang baru di-drop agar terasa "mendarat". */
export function flashDroppedClip(clipId: string | null) {
  if (!clipId) return;
  requestAnimationFrame(() => {
    const element = document.querySelector<HTMLElement>(
      `[data-clip-id="${CSS.escape(clipId)}"]`,
    );
    if (!element) return;
    element.classList.remove("te-just-dropped");
    void element.offsetWidth;
    element.classList.add("te-just-dropped");
    window.setTimeout(() => element.classList.remove("te-just-dropped"), 650);
  });
}
