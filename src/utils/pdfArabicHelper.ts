import type { jsPDF } from "jspdf";

export interface ArabicRenderOptions {
  fontSizePt?: number;
  color?: string;
  align?: "left" | "center" | "right";
  bold?: boolean;
  fontFamily?: string;
}

/**
 * Render Arabic text to an offscreen high-DPI canvas to preserve
 * authentic Arabic cursive shaping (tashkeel & ligatures) and RTL direction,
 * then embed it directly into a jsPDF document to avoid tofu/square boxes.
 */
export async function drawArabicText(
  doc: jsPDF,
  text: string,
  xMm: number,
  yMm: number,
  options: ArabicRenderOptions = {}
): Promise<{ widthMm: number; heightMm: number }> {
  if (typeof window === "undefined" || !text) {
    return { widthMm: 0, heightMm: 0 };
  }

  // Ensure browser fonts are loaded
  if (document.fonts && !document.fonts.status) {
    try {
      await document.fonts.ready;
    } catch {
      // noop
    }
  }

  const fontSizePt = options.fontSizePt || 14;
  const color = options.color || "#134E4A";
  const align = options.align || "center";
  const bold = options.bold ? "bold" : "normal";
  const fontFamily =
    options.fontFamily ||
    "'Scheherazade New', 'Noto Naskh Arabic', 'Amiri', 'Traditional Arabic', serif";

  // Convert pt to CSS px (1 pt = 1.333 px)
  const fontSizePx = fontSizePt * 1.3333;
  // Use 4x supersampling for ultra-crisp print quality (approx. 380 DPI)
  const pixelRatio = 4;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { widthMm: 0, heightMm: 0 };

  // Set font to measure
  ctx.font = `${bold} ${fontSizePx}px ${fontFamily}`;
  const metrics = ctx.measureText(text);

  const paddingPx = 6;
  const baseWidthPx = Math.ceil(metrics.width) + paddingPx * 2;
  const baseHeightPx = Math.ceil(fontSizePx * 2.0);

  canvas.width = Math.ceil(baseWidthPx * pixelRatio);
  canvas.height = Math.ceil(baseHeightPx * pixelRatio);

  // Re-apply styles on scaled context
  ctx.scale(pixelRatio, pixelRatio);
  ctx.font = `${bold} ${fontSizePx}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Render centered in the canvas
  ctx.fillText(text, baseWidthPx / 2, baseHeightPx / 2);

  // Convert CSS px to mm (1 px ≈ 0.264583 mm)
  const pxToMm = 0.264583;
  const widthMm = baseWidthPx * pxToMm;
  const heightMm = baseHeightPx * pxToMm;

  let drawX = xMm;
  if (align === "center") {
    drawX = xMm - widthMm / 2;
  } else if (align === "right") {
    drawX = xMm - widthMm;
  }

  // Center vertically around yMm
  const drawY = yMm - heightMm * 0.5;

  const dataUrl = canvas.toDataURL("image/png");
  doc.addImage(dataUrl, "PNG", drawX, drawY, widthMm, heightMm, undefined, "FAST");

  return { widthMm, heightMm };
}

/**
 * Draw official Neo-Brutalist circular Islamic seal with Arabic calligraphy
 */
export async function drawOfficialSeal(
  doc: jsPDF,
  xMm: number,
  yMm: number,
  sizeMm: number = 32
): Promise<void> {
  if (typeof window === "undefined") return;

  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // noop
    }
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const scale = 4;
  const sizePx = 200;
  canvas.width = sizePx * scale;
  canvas.height = sizePx * scale;

  ctx.scale(scale, scale);
  const cx = sizePx / 2;
  const cy = sizePx / 2;
  const radius = sizePx / 2 - 8;

  ctx.save();

  // Outer circle border (Teal Stamp)
  ctx.strokeStyle = "#0D9488";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Inner dashed circle
  ctx.strokeStyle = "#0D9488";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Center Arabic Calligraphy (تَرْتِيلَا)
  ctx.fillStyle = "#0D9488";
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 32px 'Scheherazade New', 'Noto Naskh Arabic', serif";
  ctx.fillText("تَرْتِيلَا", cx, cy - 6);

  // Latin Subtitle
  ctx.font = "bold 10px 'Plus Jakarta Sans', Arial, sans-serif";
  ctx.fillText("TERVERIFIKASI RESMI", cx, cy + 22);

  // Top Curved/Text
  ctx.font = "bold 9px 'Plus Jakarta Sans', Arial, sans-serif";
  ctx.fillText("LPQ • TPQ TARTILA NASIONAL", cx, cy - 32);

  ctx.restore();

  const dataUrl = canvas.toDataURL("image/png");
  doc.addImage(dataUrl, "PNG", xMm - sizeMm / 2, yMm - sizeMm / 2, sizeMm, sizeMm, undefined, "FAST");
}
