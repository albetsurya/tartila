import {
  AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing, Img, staticFile, Audio,
} from 'remotion';
import * as React from 'react';

// === TARTILA BRAND TOKENS (from tailwind.config.js) ===
const COLORS = {
  primary: '#22C55E',
  primaryHover: '#16A34A',
  teal: '#14B8A6',
  gold: '#FBBF24',
  goldDark: '#EAA012',
  bg: '#F0FDF4',
  card: '#FFFFFF',
  stroke: '#07473C',
  text: '#053B33',
};

const EASE_OUT = Easing.out(Easing.cubic);

const SHOTS = {
  hook: { from: 0, to: 90 },
  ngaji: { from: 90, to: 300 },
  quiz: { from: 300, to: 450 },
  arena: { from: 450, to: 600 },
  kamar: { from: 600, to: 750 },
  games: { from: 750, to: 900 },
  montage: { from: 900, to: 1080 },
  cta: { from: 1080, to: 1230 },
} as const;

export const TOTAL_FRAMES = SHOTS.cta.to;

export interface TartilaPromoProps {
  bgm?: boolean;
  vertical?: boolean;
}

// Layout context for 16:9 vs 9:16 adaptation
const LayoutContext = React.createContext<{ unit: number }>({ unit: 1 });

function withLayout<P>(Component: React.ComponentType<P>) {
  return function WithLayout(props: P & { width?: number; height?: number }) {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const unit = height / 1080; // 16:9=1, 9:16=1.778
    return (
      <LayoutContext.Provider value={{ unit }}>
        <Component {...props} _layout={{ unit, isVertical: height > width }} />
      </LayoutContext.Provider>
    );
  };
}

type SceneProps = { _layout?: { unit: number; isVertical: boolean } };

const IndonesianText = {
  hook: 'Belajar Mengaji Jadi Seru!',
  ngaji: 'Ngaji Ceria: Belajar Tilawati Interaktif',
  quiz: 'Quiz: Kuis Hafalan Al-Qur\'an',
  arena: 'Arena: Pertempuran Multi-Pemain',
  kamar: 'Kamar Tila: Bermain dengan Maskot',
  games: 'Mini-Game: Main dan Belajar',
};

function Watermark() {
  return (
    <AbsoluteFill style={{ position: 'absolute', top: 24, right: 24, pointerEvents: 'none' }}>
      <div style={{
        fontFamily: "'Gabarito', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.7)',
        fontWeight: 600,
      }}>TARTILA</div>
    </AbsoluteFill>
  );
}

function Subtitle({ text }: { text: string }) {
  const { unit } = React.useContext(LayoutContext);
  const h = useCurrentFrame();
  const opacity = interpolate(h, [0, 15, 60], [0, 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{
      position: 'absolute', bottom: 48, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity,
    }}>
      <div style={{
        fontFamily: "'Gabarito', sans-serif", fontSize: Math.max(36, 30 * unit), fontWeight: 700, color: '#ffffff',
        textAlign: 'center', padding: '12px 24px', textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        background: 'rgba(0,0,0,0.3)', borderRadius: 24,
      }}>
        {text}
      </div>
    </AbsoluteFill>
  );
}

function SceneShell({ children, bg, subtitle }: { children: React.ReactNode; bg: string; subtitle: string }) {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AbsoluteFill style={{
        background: bg,
        backgroundBlendMode: 'overlay',
      }} />
      <Watermark />
      <Subtitle text={subtitle} />
      {children}
    </AbsoluteFill>
  );
}

// ============================================================
// Main component
// ============================================================
export const TartilaPromo = ({ bgm = true }: TartilaPromoProps) => {
  const frame = useCurrentFrame();

  if (frame < SHOTS.hook.to) return <HookScene frame={frame} />;
  if (frame < SHOTS.ngaji.to) return <NgajiScene frame={frame - SHOTS.ngaji.from} />;
  if (frame < SHOTS.quiz.to) return <QuizScene frame={frame - SHOTS.quiz.from} />;
  if (frame < SHOTS.arena.to) return <ArenaScene frame={frame - SHOTS.arena.from} />;
  if (frame < SHOTS.kamar.to) return <KamarScene frame={frame - SHOTS.kamar.from} />;
  if (frame < SHOTS.games.to) return <GamesScene frame={frame - SHOTS.games.from} />;
  if (frame < SHOTS.montage.to) return <MontageScene frame={frame - SHOTS.montage.from} />;
  return <CtaScene frame={frame - SHOTS.cta.from} />;
};

// ============================================================
// Scene components
// ============================================================
function HookScene({ frame }: { frame: number }) {
  const scale = interpolate(frame, [0, 60], [0.5, 1], { easing: EASE_OUT, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const taglineOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const mascotScale = interpolate(frame, [30, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <SceneShell bg="linear-gradient(135deg, #dcfce9 0%, #ffffff 100%)" subtitle={IndonesianText.hook}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Audio src={staticFile('bgm-teal.mp3')} volume={0.2} />
        <div style={{ transform: `scale(${scale})`, opacity: opacity }}>
          <Img src={staticFile('logo.svg')} style={{ width: 400, height: 'auto' }} />
        </div>
        <div style={{
          position: 'absolute', top: '58%', left: '50%', transform: `translateX(-50%) scale(${mascotScale})`,
          opacity: frame >= 30 ? 1 : 0,
        }}>
          <MascotSVG />
        </div>
        <div style={{
          position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'Gabarito', sans-serif", opacity: taglineOpacity,
          color: COLORS.primary, fontSize: 48, fontWeight: 800,
          textShadow: '0 4px 24px rgba(0,0,0,0.12)',
        }}>
          {IndonesianText.hook}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

function MascotSVG() {
  return (
    <svg width="140" height="140" viewBox="0 0 512 512" fill="none">
      <ellipse cx="256" cy="240" r="95" fill={COLORS.gold} stroke={COLORS.stroke} strokeWidth="8" />
      <circle cx="256" cy="225" r="19.5" fill="#008F7A" />
      <circle cx="268" cy="216" r="7.5" fill="#fff" />
      <path d="M 237 204 Q 250 198 263 204 L 250 224 Z" fill="#FF6B6B" />
      <circle cx="195" cy="215" r="18" fill="#FF6B6B" />
      <circle cx="317" cy="215" r="18" fill="#FF6B6B" />
    </svg>
  );
}

function NgajiScene({ frame }: { frame: number }) {
  const opacity = interpolate(frame, [-15, 0, 120, 150], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const f = useCurrentFrame();
  const t = (f - SHOTS.ngaji.from + 90) % 150;
  const whooshVolume = frame < 15 ? 0.4 * (1 - frame / 15) : 0;

  return (
    <SceneShell bg={`linear-gradient(135deg, ${COLORS.teal}08 0%, ${COLORS.bg} 100%`} subtitle={IndonesianText.ngaji}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
        <Audio src={staticFile('audio/sfx/transition/whoosh-fast.mp3')} volume={whooshVolume} />
        <div style={{ opacity }}>
          <PhoneDevice>
            <div style={{
              width: '100%', height: '100%', background: 'linear-gradient(135deg, #dcfce9 0%, #ffffff 100%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 24, boxSizing: 'border-box',
            }}>
              <div style={{ fontFamily: "'Scheherazade New', serif", fontSize: 36, color: COLORS.text, marginBottom: 16 }}>
                ﴾الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
              </div>
              <div style={{ width: '80%', height: 6, background: COLORS.primary, borderRadius: 3, marginBottom: 12 }} />
              <AudioWave />
              <div style={{ marginTop: 20, fontFamily: 'sans-serif', fontSize: 18, color: COLORS.text, textAlign: 'center' }}>
                "Bismillahirrahmanirrahim..."
              </div>
            </div>
          </PhoneDevice>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

function AudioWave() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40, width: 240 }}>
      {Array.from({ length: 12 }).map((_, i) => <Bar key={i} index={i} />)}
    </div>
  );
}

function Bar({ index }: { index: number }) {
  const frame = useCurrentFrame();
  const h = 4 + Math.sin(((frame + index * 2) % 48) / 48 * Math.PI * 2) * 6;
  return <div style={{ width: 6, height: Math.max(3, h), background: COLORS.teal, borderRadius: 2 }} />;
}

function PhoneDevice({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 420, height: 720, background: '#e5e5e5', borderRadius: 56,
      padding: 18, position: 'relative', boxShadow: '0 32px 64px rgba(0,0,0,0.25)',
    }}>
      <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: 36, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// Scene 2: QUIZ
// ============================================================
function QuizScene({ frame }: { frame: number }) {
  const opacity = interpolate(frame, [-15, 0, 120, 150], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const barWidth = interpolate(frame, [0, 45, 75, 150], [0, 100, 100, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const f = useCurrentFrame();
  const whooshVolume = frame < 15 ? 0.35 * (1 - frame / 15) : 0;
  const popVolume = frame >= 35 && frame <= 55 ? 0.25 : 0;

  return (
    <SceneShell bg={`linear-gradient(135deg, ${COLORS.gold}08 0%, ${COLORS.bg} 100%)`} subtitle={IndonesianText.quiz}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
        <Audio src={staticFile('audio/sfx/transition/whoosh-fast.mp3')} volume={whooshVolume} />
        <Audio src={staticFile('audio/sfx/impact/hit-fast-exciting.mp3')} volume={popVolume} />
        <div style={{ opacity }}>
          <PhoneDevice>
            <div style={{
              width: '100%', height: '100%', background: 'linear-gradient(135deg, #fefce8 0%, #ffffff 100%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 24, boxSizing: 'border-box',
            }}>
              <h2 style={{ fontFamily: "'Gabarito', sans-serif", color: COLORS.text, fontSize: 26, margin: 0, marginBottom: 20, textAlign: 'center' }}>
                Quiz: Hafalan Al-Qur'an
              </h2>
              <div style={{ width: '90%', height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
                <div style={{ width: `${barWidth}%`, height: '100%', background: COLORS.gold, borderRadius: 4 }} />
              </div>
              <QuizOptions frame={frame} />
            </div>
          </PhoneDevice>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

function QuizOptions({ frame }: { frame: number }) {
  const options = ['Al-Fatihah', 'Al-Ikhlas', 'Al-Nas', 'Al-Falaq'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '90%' }}>
      {options.map((opt, i) => {
        const local = frame - 10 - i * 8;
        const opacity = interpolate(local, [0, 15, 60], [0, 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const px = interpolate(local, [0, 15], [-40, 0], { easing: EASE_OUT, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const [bg, border] = i === 1 ? [COLORS.primary, COLORS.primary] : [COLORS.stroke, COLORS.stroke];
        return (
          <div key={opt} style={{
            padding: 14, borderRadius: 20, fontFamily: 'sans-serif', fontSize: 18, fontWeight: 600,
            textAlign: 'center', cursor: 'pointer', opacity, transform: `translateX(${px}px)`,
            background: `linear-gradient(135deg, ${bg}15 0%, #ffffff 100%)`,
            border: `2px solid ${border}30`, color: COLORS.text,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}>
            {opt}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Scene 3: ARENA
// ============================================================
function ArenaScene({ frame }: { frame: number }) {
  const opponent = interpolate(frame, [0, 30], [85, 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const barOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const promptOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <SceneShell bg={`radial-gradient(circle at center, ${COLORS.teal}15 0%, ${COLORS.bg} 100%)`} subtitle={IndonesianText.arena}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
        <PhoneDevice>
          <div style={{
            width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 24, boxSizing: 'border-box', position: 'relative',
          }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 20 }}>
              <PlayerAvatar name="Tito" score={120} />
              <div style={{ fontFamily: 'sans-serif', color: '#94a3b8', fontSize: 20, fontWeight: 700 }}>VS</div>
              <PlayerAvatar name="Amira" score={Math.floor(opponent)} isPlayer={false} />
            </div>
            <div style={{ width: '90%', height: 16, background: '#334155', borderRadius: 8, overflow: 'hidden', display: 'flex', opacity: barOpacity, marginBottom: 20 }}>
              <div style={{ width: '75%', background: COLORS.primary }} />
              <div style={{ width: '25%', background: COLORS.gold }} />
            </div>
            <div style={{ opacity: promptOpacity, padding: '16px 32px', borderRadius: 28,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
              fontFamily: "'Gabarito', sans-serif", fontSize: 22, fontWeight: 700, color: '#fff',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.5)', }}>
              "Apa hukum kaidah idgam?"
            </div>
          </div>
        </PhoneDevice>
      </AbsoluteFill>
    </SceneShell>
  );
}

function PlayerAvatar({ name, score, isPlayer = true }: { name: string; score: number; isPlayer?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', background: isPlayer ? COLORS.primary : COLORS.gold,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '3px solid #ffffff', boxShadow: '0 0 20px rgba(0,0,0,0.3)',
      }}>
        <span style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>{name[0]}</span>
      </div>
      <div style={{ fontFamily: 'sans-serif', color: isPlayer ? '#ffffff' : '#94a3b8', textAlign: 'left' }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{name}</div>
        <div style={{ fontSize: 14 }}>Score: {score}</div>
      </div>
    </div>
  );
}

// ============================================================
// Scene 4: KAMAR
// ============================================================
function KamarScene({ frame }: { frame: number }) {
  return (
    <SceneShell bg={`linear-gradient(135deg, ${COLORS.primary}08 0%, ${COLORS.bg} 100%)`} subtitle={IndonesianText.kamar}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
        <PhoneDevice>
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #dcfce9 0%, #ffffff 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 24, boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)',
              fontFamily: "'Gabarito', sans-serif", fontSize: 20, fontWeight: 700, color: COLORS.text,
            }}>
              Kamar Tito &amp; Tila
            </div>
            <MascotBig />
            <HelpMenu frame={frame} />
            <TitoTilaToggle />
          </div>
        </PhoneDevice>
      </AbsoluteFill>
    </SceneShell>
  );
}

function MascotBig() {
  return (
    <svg width="160" height="200" viewBox="0 0 512 512" fill="none">
      <ellipse cx="256" cy="260" rx="105" ry="105" fill={COLORS.gold} stroke={COLORS.stroke} strokeWidth="8" />
      <path d="M 218 218 L 294 218 L 256 258 Z" fill={COLORS.goldDark} />
      <circle cx="195" cy="225" r="18" fill="#FF6B6B" />
      <circle cx="317" cy="225" r="18" fill="#FF6B6B" />
      <circle cx="256" cy="245" r="19.5" fill="#008F7A" />
      <circle cx="268" cy="236" r="7.5" fill="#fff" />
      <path d="M 237 214 Q 250 208 263 214 L 250 234 Z" fill="#FF6B6B" />
    </svg>
  );
}

function HelpMenu({ frame }: { frame: number }) {
  const opacity = interpolate(frame, [30, 50, 120, 150], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', top: 180, right: 20,
      width: 200, padding: 16, background: 'rgba(255,255,255,0.95)',
      borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      opacity, fontFamily: 'sans-serif', fontSize: 14, color: COLORS.text,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: COLORS.primary }}>Tips:</div>
      <ul style={{ paddingLeft: 16, lineHeight: 1.6 }}>
        <li>✓ Baca bareng Tito</li>
        <li>✓ Uji kemampuan</li>
        <li>✓ Kuis harian</li>
      </ul>
    </div>
  );
}

function TitoTilaToggle() {
  return (
    <div style={{
      position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: 12, padding: 8, background: COLORS.card,
      borderRadius: 28, border: `2px solid ${COLORS.stroke}30`,
    }}>
      <ToggleBtn label="Tito" color={COLORS.primary} active={true} />
      <ToggleBtn label="Tila" color={COLORS.gold} active={false} />
    </div>
  );
}

function ToggleBtn({ label, color, active }: { label: string; color: string; active: boolean }) {
  return (
    <div style={{
      padding: '8px 20px', borderRadius: 20, fontFamily: "'Gabarito', sans-serif",
      fontSize: 16, fontWeight: 700, cursor: 'pointer',
      background: active ? color : COLORS.bg, color: active ? '#fff' : COLORS.text,
      border: `2px solid ${color}30`,
    }}>
      {label}
    </div>
  );
}

// ============================================================
// Scene 5: MINI GAMES
// ============================================================
function GamesScene({ frame }: { frame: number }) {
  const games = [
    { name: 'Hijaiyah Pop', color: COLORS.primary },
    { name: 'Memory Ayat', color: COLORS.teal },
    { name: 'Tajwid Battle', color: COLORS.gold },
    { name: 'Nur Battle', color: COLORS.primaryHover },
  ];
  return (
    <SceneShell bg={`linear-gradient(135deg, ${COLORS.gold}08 0%, ${COLORS.bg} 100%)`} subtitle={IndonesianText.games}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
        <PhoneDevice>
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #fefce8 0%, #ffffff 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 24, boxSizing: 'border-box',
          }}>
            <h2 style={{ fontFamily: "'Gabarito', sans-serif", color: COLORS.text, fontSize: 26, margin: 0, marginBottom: 24, textAlign: 'center' }}>
              Mini Games
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, width: '100%' }}>
              {games.map((g, i) => <GameCard key={g.name} frame={frame - i * 12} name={g.name} color={g.color} />)}
            </div>
          </div>
        </PhoneDevice>
      </AbsoluteFill>
    </SceneShell>
  );
}

function GameCard({ frame, name, color }: { frame: number; name: string; color: string }) {
  const opacity = interpolate(frame, [0, 12, 90], [0, 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(frame, [0, 12], [-20, 0], { easing: EASE_OUT, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      padding: 18, borderRadius: 18, opacity, transform: `translateY(${y}px)`,
      background: `linear-gradient(135deg, ${color}20 0%, #ffffff 100%)`,
      border: `2px solid ${color}40`, textAlign: 'center',
      boxShadow: `0 8px 24px ${color}30`,
    }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>🎮</div>
      <div style={{ fontFamily: "'Gabarito', sans-serif", fontSize: 15, fontWeight: 700, color: COLORS.text }}>
        {name}
      </div>
    </div>
  );
}

// ============================================================
// Scene 6: MONTAGE
// ============================================================
function MontageScene({ frame }: { frame: number }) {
  const index = Math.min(Math.floor(frame / 30), 5);
  const scenes = [
    { bg: COLORS.primary, label: 'Ngaji Ceria' },
    { bg: COLORS.teal, label: 'Quiz' },
    { bg: COLORS.gold, label: 'Arena' },
    { bg: COLORS.goldDark, label: 'Kamar Tila' },
    { bg: COLORS.primaryHover, label: 'Mini Games' },
    { bg: COLORS.text, label: 'Siap!' },
  ];
  const scene = scenes[index];
  const progress = (frame % 30) / 30;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, backgroundImage: scene.bg as any }}>
      <Watermark />
      <Subtitle text={scene.label} />
      <MontageIcons frame={frame} />
    </AbsoluteFill>
  );
}

function MontageIcons({ frame }: { frame: number }) {
  const icons = ['📖', '🎯', '⚔️', '🐻', '🎮', '🌟'];
  const index = Math.floor(frame / 30);
  return (
    <div style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 16 }}>
      {icons.map((icon, i) => {
        const diff = Math.abs(i - index);
        const scale = diff === 0 ? 1.2 : diff === 1 ? 0.8 : 0.6;
        return <div key={i} style={{ fontSize: 48 * scale, opacity: diff === 0 ? 1 : diff === 1 ? 0.7 : 0.4 }}>{icon}</div>;
      })}
    </div>
  );
}

// ============================================================
// Scene 7: CTA
// ============================================================
function CtaScene({ frame }: { frame: number }) {
  const logoScale = interpolate(frame, [0, 45], [0.8, 1], { easing: EASE_OUT, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const taglineOpacity = interpolate(frame, [30, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const urlOpacity = interpolate(frame, [75, 115], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <SceneShell bg={`linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.teal} 50%, ${COLORS.gold} 100%)`} subtitle={IndonesianText.hook}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Audio src={staticFile('bgm-teal.mp3')} volume={0.25} loop />
        <div style={{ transform: `scale(${logoScale})`, marginBottom: 40 }}>
          <Img src={staticFile('logo.svg')} style={{ width: 280, height: 'auto' }} />
        </div>
        <div style={{
          fontFamily: "'Gabarito', sans-serif", fontSize: 56, fontWeight: 800, color: '#fff',
          opacity: taglineOpacity, marginBottom: 30,
          textShadow: '0 4px 24px rgba(0,0,0,0.15)', textAlign: 'center',
        }}>
          Belajar Mengaji Jadi Seru!
        </div>
        <div style={{
          fontFamily: 'sans-serif', fontSize: 20, color: '#fff', opacity: urlOpacity,
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <span>tartila.app</span>
          <Img src={staticFile('qr-tartila.png')} style={{ width: 120, height: 120 }} />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}
