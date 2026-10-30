/**
 * Manajer audio terpusat Ngaji Ceria.
 *
 * - SFX: dimainkan instan via Web Audio API (pool buffer di memori).
 * - Mute persisten di localStorage, dipakai toggle suara global & in-game.
 */

export type SfxName =
  | "tap" | "pop" | "correct" | "wrong" | "streak"
  | "powerup" | "victory" | "defeat" | "gameover"
  // Kuis & Progress: correct/wrong, level-up, badge, reward, coin
  | "answer-correct" | "answer-wrong" | "level-up" | "badge-earned" | "chest-open" | "coin-collect"
  | "punch" | "block" | "shuffle";

// Freesound fallback — butuh VITE_FREE_SOUND_API_KEY dari freesound.org
export const freesound = new (await import('./freesoundService')).FreesoundService;

const SFX_FILES: Record<SfxName, string | null> = {
  tap: "tap.mp3",
  pop: "pop.ogg",
  correct: "correct.ogg",
  wrong: "wrong.ogg",
  streak: "streak.ogg",
  powerup: "powerup.ogg",
  victory: "victory.ogg",
  defeat: "defeat.ogg",
  gameover: "gameover.ogg",
  // Kuis & Progress
  "answer-correct": "answer-correct.mp3",
  "answer-wrong": "answer-wrong.ogg",
  "level-up": "level-up.mp3",
  "badge-earned": "badge-earned.ogg",
  "chest-open": "chest-open.mp3",
  "coin-collect": "coin-collect.mp3",
  // Disintesis prosedural (lihat synthPunch/synthBlock).
  punch: null,
  block: null,
  // Baru: shuffle SFX untuk memory game
  shuffle: null,
};

const MUTE_KEY = "ngajiceria:sound:muted";
const BASE = `${import.meta.env.BASE_URL}audio/ngaji-ceria`;

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

class SoundManager {
  muted = readMuted();
  private listeners = new Set<() => void>();
  private ctx: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private loading = new Map<string, Promise<AudioBuffer | null>>();

  constructor() {
    if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
      window.addEventListener("pointerdown", () => this.unlock(), { passive: true });
      window.addEventListener("keydown", () => this.unlock());
    }
  }

  /** Browser mengizinkan autoplay setelah gesture pertama, termasuk sesudah unmute. */
  unlock() {
    if (this.muted) return;
    this.ensureCtx();
  }

  get isMuted() { return this.muted; }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    try {
      localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
    } catch { /* abaikan */ }
    if (!muted) this.unlock();
    this.emit();
  }

  toggleMuted() {
    this.setMuted(!this.muted);
  }

  private ensureCtx(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume().catch(() => {});
      return this.ctx;
    }
    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      return this.ctx;
    } catch {
      return null;
    }
  }

  private loadBuffer(name: SfxName): Promise<AudioBuffer | null> {
    const file = SFX_FILES[name];
    if (!file) return Promise.resolve(null);
    const cached = this.buffers.get(file);
    if (cached) return Promise.resolve(cached);
    const pending = this.loading.get(file);
    if (pending) return pending;
    const job = (async () => {
      try {
        const ctx = this.ensureCtx();
        if (!ctx) return null;
        const response = await fetch(`${BASE}/sfx/${file}`);
        if (!response.ok) return null;
        const data = await response.arrayBuffer();
        const buffer = await ctx.decodeAudioData(data);
        this.buffers.set(file, buffer);
        return buffer;
      } catch {
        return null;
      } finally {
        this.loading.delete(file);
      }
    })();
    this.loading.set(file, job);
    return job;
  }

  /** Pemanasan cache agar SFX pertama tanpa jeda (panggil saat layar mulai). */
  preload(names: SfxName[] = ["tap", "pop", "correct", "wrong"]) {
    names.forEach((name) => { void this.loadBuffer(name); });
  }

  /** Mainkan SFX instan; fallback ke Freesound jika file lokal tidak ditemukan. */
  playSfx(name: SfxName, volume = 1) {
    if (this.muted) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;

    // Coba file lokal pertama
    const localFile = SFX_FILES[name];
    if (localFile) {
      void this.loadBuffer(name).then((buffer) => {
        if (this.muted) return;
        if (!buffer) {
          // File lokal tidak ditemukan, coba Freesound fallback
          this.playFreesoundFallback(name, volume, ctx);
        } else {
          try {
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const gain = ctx.createGain();
            gain.gain.value = volume;
            source.connect(gain).connect(ctx.destination);
            source.start();
          } catch { /* abaikan */ }
        }
      });
    } else {
      // Tidak ada file lokal, langsung ke Freesound
      this.playFreesoundFallback(name, volume, ctx);
    }
  }

  private async playFreesoundFallback(name: SfxName, volume: number, ctx: AudioContext) {
    try {
      const result = await freesound.findFallbackSfx(name);
      if (!result || !result.url) return;

      // Fetch audio dari Freesound preview URL
      const response = await fetch(result.url);
      if (!response.ok) return;

      const arrayBuffer = await response.arrayBuffer();
      const buffer = await ctx.decodeAudioData(arrayBuffer);

      if (this.muted) return;
      try {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.value = volume;
        source.connect(gain).connect(ctx.destination);
        source.start();
      } catch { /* abaikan */ }
    } catch (err) {
      console.error('[Freesound fallback] error:', err);
    }
  }

  private synthBlip(ctx: AudioContext, name: SfxName, volume: number) {
    // Nada darurat bila file SFX belum tersedia.
    const freq = name === "wrong" || name === "defeat" || name === "gameover" ? 196 : 660;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18 * volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch { /* abaikan */ }
  }

  /** Pukulan kartun: whoosh-thud dari noise + sinus rendah. */
  private synthPunch(ctx: AudioContext, volume: number) {
    try {
      const duration = 0.22;
      const noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const source = ctx.createBufferSource();
      source.buffer = noise;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + duration);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5 * volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      source.connect(filter).connect(gain).connect(ctx.destination);
      source.start();
    } catch { /* abaikan */ }
  }

  /** Tangkisan: ketukan tumpul pendek. */
  private synthBlock(ctx: AudioContext, volume: number) {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.3 * volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch { /* abaikan */ }
  }
}

export const soundManager = new SoundManager();
