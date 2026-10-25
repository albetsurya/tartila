import { Composition, registerRoot } from 'remotion';
import { TartilaPromo } from './TartilaPromo';

export const FPS = 30;

// 16:9 master timeline — 41s @30fps
export const SHOTS = {
  hook: { from: 0, to: 90 },      // 0.0s - 3.0s
  ngaji: { from: 90, to: 300 },   // 3.0s - 10.0s
  quiz: { from: 300, to: 450 },   // 10.0s - 15.0s
  arena: { from: 450, to: 600 },  // 15.0s - 20.0s
  kamar: { from: 600, to: 750 },  // 20.0s - 25.0s
  games: { from: 750, to: 900 },  // 25.0s - 30.0s
  montage: { from: 900, to: 1080 }, // 30.0s - 36.0s
  cta: { from: 1080, to: 1230 },  // 36.0s - 41.0s
} as const;

export const TOTAL_FRAMES = SHOTS.cta.to; // 1230

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="TartilaPromo"
        component={TartilaPromo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ bgm: true }}
      />
      <Composition
        id="TartilaPromo916"
        component={TartilaPromo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ bgm: true, vertical: true }}
      />
    </>
  );
}

registerRoot(RemotionRoot);
