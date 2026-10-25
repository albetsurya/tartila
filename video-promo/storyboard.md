# Tartila Promo Video — Storyboard

**App:** Tartila (React 19 / PWA — Ngaji Ceria, Quiz, Arena, Kamar Tila, Mini Games)
**Duration:** 41 seconds @ 30 fps = 1,230 frames
**Resolution:** 1920×1080 (16:9) primary · 1080×1920 (9:16) secondary
**Frame rate:** 30 fps
**Codec:** H.264, CRF 12

## Shot Cards

| Card | Primary Use | Why |
|------|-------------|-----|
| `spotlight-hero-card` | Brand intro (logo + tagline) | Warm, inviting center-focus with gentle parallax |
| `type-and-filter` | Ngaji Ceria + Quiz learning | Natural fit for answer selection and audio waveform feedback |
| `zoom-punch` | Arena multiplayer | Energetic feel, punchy timing matches battle rhythm |
| `rapid-cut` | Mini Games montage | Efficient quick cuts for hub icons (0.5s each) |
| `kinetic-text` | CTA slide + tagline reveal | Bold, animated type-to-life that grabs attention |

## Shot Card -> Scene Usage

| Feature | Shot Card | Rationale |
|---------|-----------|-----------|
| Ngaji Ceria (Interactive Tilawati) | `type-and-filter` | Shows audio waveform + visual recitation feedback |
| Quiz Center | `type-and-filter` | Natural for multiple-choice answer selection |
| Arena | `zoom-punch` | High-energy for competitive fights, quick timing |
| Kamar Tila | `spotlight-hero-card` | Mascot focus, draggable interaction feel |
| Mini Games | `rapid-cut` | Quick cuts across 4 hub game icons |

## Scene Breakdown

| # | Timecode (0-indexed) | Frame Range | Shot Card | Visual | Audio/SFX |
|---|----------------------|-------------|-----------|--------|-----------|
| 0 | 0s–3s | 0–90 | `spotlight-hero-card` | Logo fade-in → mascot lands → tagline | BGM swell, whoosh |
| 1 | 3s–10s | 90–300 | `type-and-filter` | Ngaji Ceria: child selects surah, audio waveform active | Chime on correct rec |
| 2 | 10s–15s | 300–450 | `type-and-filter` | Quiz: answer options filter in, progress ring | Pop + victory chime |
| 3 | 15s–20s | 450–600 | `zoom-punch` | Arena: VS combat, question pop, punch zoom | Battle drum + whoosh |
| 4 | 20s–25s | 600–750 | `spotlight-hero-card` | Kamar Tila: Tito/Tila mascot, drag + help menu | Tap + gentle pop |
| 5 | 25s–30s | 750–900 | `rapid-cut` | Mini Games: 4 game icons cascade 0.5s each | Quick tap sequence |
| 6 | 30s–36s | 900–1080 | `rapid-cut` | Montage: 6 rapid cuts (ngaji→quiz→arena→kamar→games→Siap) | Whoosh per cut |
| 7 | 36s–41s | 1080–1230 | `kinetic-text` | CTA: logo + tagline + app URL/QR on brand gradient | BGM final swell, impact hit |

## Color Palette (from tailwind.config.js)

| Token | Hex | Use |
|-------|-----|-----|
| `primary` | `#22C55E` | Primary green, buttons, accents |
| `primaryHover` | `#16A34A` | Hover state |
| `teal` | `#14B8A6` | Secondary accent |
| `gold` | `#FBBF24` | Brand gold, hover highlights |
| `goldDark` | `#EAA012` | Darker gold for contrast |
| `bg` | `#F0FDF4` | Background (mint cream) |
| `card` | `#FFFFFF` | White cards |
| `stroke` | `#07473C` | Dark teal strokes, text |

## Typography

| Family | Weights | Use |
|--------|---------|-----|
| `Gabarito` | 700, 800, 900 | Display headings, mascot eye path |
| `Plus Jakarta Sans` | 400–700 | Body text, UI labels |
| `Scheherazade New` | 400, 700 | Arabic quranic text |

## Animation + Motion Tokens

| Feature | Easing | Over-shoot | Notes |
|---------|--------|------------|-------|
| Brand intro | `Easing.out(Easing.back(1.7))` | 1.7x | Logo "lands" with squash feel |
| Feature titles | `EASE_OUT` | 0 | Clean, child-friendly |
| Quiz answers | `EASE_OUT` | 0 | Gentle fade-up |
| Arena zoom | `Easing.out(Easing.elastic())` | Yes | High energy, lives the game vibe |
| Kamar mascot | `EASE_IN_OUT` | 0 | Smooth, friendly |
| CTA | `Easing.out(Easing.back(1.5))` | 1.5x | Bold text entrance |
| Montage cuts | `EASE_OUT` | 0 | Fast, clean transitions |

## Deliverables

| File | Status |
|------|--------|
| `storyboard.md` | Done (above) |
| `/out/tartila-promo-16x9.mp4` | To render |
| `/out/tartila-promo-9x16.mp4` | To render |
| Source Remotion project | `video-promo/src/` |
| Thumbnail (1280×720) | To generate |
