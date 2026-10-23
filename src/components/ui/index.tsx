// src/components/ui/index.ts

// 1. Komponen Ikon (Neo-Brutalism Custom Icons)
export * from "./CustomIcons";
export * from "./Illustrations";
export * from "./InteractiveIcons";
export { GameCard } from "./GameCard";

// 2. Komponen Standar
export { Button } from "./Button";
export { Avatar } from "./Avatar";
export { AvatarWithBadge } from "./AvatarWithBadge";

// 3. Komponen Sticker (Neo-Brutalism)
export { StickerButton } from "./StickerButton";
export { StickerCard } from "./StickerCard";
export { InputField } from "./InputField";
export { StatCard } from "./StatCard";
export { PageHero } from "./PageHero";
export { SectionHeader } from "./SectionHeader";
export { NotificationBell } from "./NotificationBell";

// 4. Maskot Resmi: Tito (dengan alias backwards-compatibility)
export { TilaCompanion, BibiCompanion, TilaCompanion as TitoCompanion } from "./TilaCompanion";
export { TitoMascot, TilaMascot, BibiMascot } from "./TilaMascot";
export type {
  TitoMood,
  TitoDirection,
  TitoAnimation,
  TitoAccessoryType,
  TitoMascotProps,
  TilaMood,
  TilaDirection,
  TilaAnimation,
  TilaAccessoryType,
  TilaMascotProps,
  BibiMood,
  BibiDirection,
  BibiAnimation,
  BibiAccessoryType,
  BibiMascotProps,
} from "./TilaMascot";
export { TitoMascot2D, TitoWave, BibiMascot2D, BibiWave } from "./BibiMascot2D";
export type {
  TitoMascot2DProps,
  TitoMascotVariant,
  TitoWaveProps,
  BibiMascot2DProps,
  BibiMascotVariant,
  BibiWaveProps,
} from "./BibiMascot2D";
