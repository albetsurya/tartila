# Ngaji Ceria — Agent Handoff & Workflow Log

> Handoff document for the next AI agent / developer continuing the `ngaji-ceria` revamp.
> Read this fully before changing code. Paths and statuses below reflect the **actual** implementation.

---

## 1. PROJECT CONTEXT

- **Project Name:** Ngaji Ceria (inside the `sabil/tartila` repo)
- **Working directory:** `/home/albet-surya-kembara/Documents/productivity/projects/sabil/tartila`
- **Tech Stack:** Vite + React 19 + Tailwind v4 (CSS-first via `@tailwindcss/vite`), `react-router-dom`, FontAwesome icons wrapped in `src/components/ui/FontAwesomeIcons.tsx`.
- **Current Phase:** Phase 2 — Refactoring Quiz Models & Logic.
- **Verification commands (all currently green):**
  - Typecheck: `npx tsc -b`
  - Lint: `npx oxlint <path>`
  - Build: `npm run build` (`tsc -b && vite build`)

---

## 2. DESIGN SYSTEM RULES (Emerald Oasis & Sunset Coral)

These are the **exact** tokens. Do not guess or introduce new hues.

| Role | Token | Notes |
| --- | --- | --- |
| Background (Mint Cloud) | `#F0FDF4` | Page canvas: `bg-[#F0FDF4]` |
| Text / Contour (Deep Teal) | `#134E4A` | `text-[#134E4A]`; deep panels `bg-[#134E4A]` |
| Primary Action (Teal Emerald) | `#0D9488` | `bg-[#0D9488] hover:bg-[#0f766e] text-white` |
| Accent / Error (Coral Glow) | `#FF6B6B` | `bg-[#FF6B6B] text-white`, `border-[#FF6B6B]`, tints `bg-[#FF6B6B]/10`, `border-[#FF6B6B]/20` |
| Gold (Audio Matching only) | `#FBBF24` | 4th matching button (`bg-[#FBBF24]`) |
| Card base | — | `bg-white rounded-2xl / rounded-3xl shadow-sm border border-gray-100` |

- **Soft tints** (instead of legacy off-brand colors): use `/10`–`/20` opacity of Teal or Coral, or `gray-100`/`gray-200` borders. Avoid `#D1FAE5`, `#fff0f0`, `#2E7D32`, `#1E3E1A`, `#2A1A10`, `#94A3B8` (removed during the sweep).
- **Typography:** rounded fonts only. Defined in `src/styles/theme.css`:
  - `--font-sans: "Nunito", "Quicksand", ui-rounded, …`
  - `--font-display: "Baloo 2", "Nunito", ui-rounded, …` (use `font-display`)
  - `--font-rounded: "Quicksand", "Nunito", ui-rounded, …`
  - Arabic: `font-arabic`, `text-3xl` or larger, `dir="rtl"`, high contrast `text-[#134E4A]`.
- **Shapes/shadows:** cards `rounded-2xl`/`rounded-3xl`; buttons `rounded-full`; soft shadows `shadow-sm` (stronger feedback/CTA may use `shadow-md`/`shadow-lg`).
- **Token source of truth:** `src/styles/theme.css` (CSS vars `--c-bg`, `--c-text`, `--c-accent`, `--c-accent-2`, plus `--color-*` and `--font-*` theme entries).

---

## 3. COMPLETED WORK (What was just done)

### 3.1 Five quiz model components — `src/features/ngaji-ceria/components/quiz-models/`
1. `ModelFillInTheBlank.tsx` — dashed-teal drop zone ("Pilih kepingan huruf di bawah"), `grid-cols-4` letter bank with selected/used state (`border-[#0D9488] bg-[#F0FDF4] opacity-50`), coral `Hapus`, `Periksa Jawaban` CTA with `bg-gray-300` disabled state. Also renders the Arabic prompt + a circular audio button that delegates to `onPlayAudio` when provided.
2. `ModelMultipleChoiceText.tsx` — white `text-5xl` question box, 2-col option grid, selected `border-[#0D9488] bg-[#F0FDF4]`, correct `border-green-500 bg-green-50`, wrong `border-[#FF6B6B] bg-[#FF6B6B]/10`.
3. `ModelMultipleChoiceAudio.tsx` — large circular audio prompt (`bg-[#0D9488]/20`, `animate-ping` while playing), vertical options, slide-up feedback bottom sheet (`fixed bottom-0 rounded-t-3xl`) with "Masya Allah, Hebat Sekali!" + `Lanjut →`.
4. `ModelAudioMatching.tsx` — Arabic card + 2×2 buttons colored/paired by shape (Teal/Coral/Deep-Teal/Gold ↔ circle/square/triangle/diamond, inline SVG shapes), speaker left + shape right.
5. `ModelMaterialCard.tsx` — mint box `border-2 border-[#0D9488]`, white pill "Sentuh untuk Bunyikan" (delegates to `onPlayAudio`), coral-tinted instruction box with `Info`, `rounded-full` `Lanjut →`.

Supporting files in the same folder: `types.ts` (model interfaces + flexible `QuestionData`), `index.ts` (barrel exports), `quizModelRandomizer.ts`, `QuizEngine.tsx`.

### 3.2 Randomizer — `src/features/ngaji-ceria/components/quiz-models/quizModelRandomizer.ts`
- `getAvailableModels(data)` inspects available data and returns the viable models:
  - `fill-in-the-blank` — Arabic + array `correctAnswer` + `availableLetters`.
  - `multiple-choice-text` — Arabic + `options.length >= 2` **and** `options` contains the correct reading (`correctAnswer` joined if array).
  - `multiple-choice-audio` — same as above **plus** `audioUrl`.
  - `audio-matching` — only when `audioShapes.length >= 2`.
- `getRandomQuizModel(data)` returns a random viable model; fallback chain = `multiple-choice-text` (if options exist) → `fill-in-the-blank`. `material` is **excluded** from randomization (learning step, not a question).
- Array answers are normalized with `answer.join(" ")` so MCQ availability works with the existing `string[]` dataset.

### 3.3 Engine — `src/features/ngaji-ceria/components/quiz-models/QuizEngine.tsx`
- Accepts flexible `QuestionData` + `questionIndex`, plus `onAnswerSubmit`, `onNext`, `onPlayAudio`, `isAudioPlaying`.
- Picks the model with `useMemo` keyed on a stable string `${questionIndex ?? -1}:${question.id}:${question.type}` (so it re-rolls on Next but stays fixed across re-renders such as audio playing). `type: "material"` bypasses randomization.
- Adapts `QuestionData` into each model's strict props and `switch`es on the assigned model.

### 3.4 Page refactor — `src/features/ngaji-ceria/pages/NgajiCeriaQuizPage.tsx`
- Maps `QuizQuestion` → `QuestionData` via `toQuestionData(question, allQuestions)`; passes `questionIndex={currentIdx}` to `QuizEngine`.
- **Option 1 IS ALREADY IMPLEMENTED** (see §4): sibling-reading distractors are derived and shuffled here.
- Page keeps the header/progress, Ta'awudz intro phase, `useTilawatiAudio` auto-play, star awarding and navigation. The old inline slots/options-bank/footer were removed because the models now own selection/submit/feedback.

---

## 4. CURRENT STATE & KNOWN ISSUES

### 4.1 The Data Problem
- The Tilawati dataset (`src/features/ngaji-ceria/data/tilawatiQuiz*`) stores `correctAnswer`-equivalent data as `transliterationParts: string[]`, and has **no** `audioShapes` and **no** single-string correct answer.

### 4.2 Consequence & Resolution (Option 1 — IMPLEMENTED)
- Without intervention the randomizer would only ever pick `fill-in-the-blank` for regular questions.
- **Option 1 is implemented** inside `NgajiCeriaQuizPage.tsx`:
  - `shuffleArray<T>()` — Fisher–Yates shuffle of a copy.
  - `buildMcqOptions(correct, siblingReadings)` — dedupes sibling readings, removes any equal to the correct reading, shuffles, takes up to **3** distractors, then shuffles `[correct, ...distractors]` so the correct answer is **not** always first.
  - `toQuestionData(question, allQuestions)` — for regular questions returns:
    - `options` = derived MCQ options (full readings, correct one included),
    - `availableLetters` = the raw token bank (`question.options`),
    - `correctAnswer` = `question.transliterationParts` (array, keeps fill-in working).
  - `questionData` is memoized: `useMemo(() => …, [activeJilid, activePageNum, currentIdx, question?.id])` — stable per question, so options/positions do not reshuffle on re-render.

### 4.3 Remaining / watch-outs
- **Fallbacks work as required:** pages with a single question (no siblings → `< 2` options) fall back to `fill-in-the-blank`; missing `audioShapes` never selects `audio-matching`.
- **MCQ distractors are transliteration readings** reused from sibling questions on the same page. They can occasionally be visually similar; tune the distractor count/selection if quality matters.
- **`audio-matching` is currently unreachable** until the dataset provides `audioShapes` (arrays of `{ id, audioUrl, shape }`).
- Two **pre-existing** `react-hooks/exhaustive-deps` warnings remain in the page's `useEffect`s (they existed before this phase). The two `useMemo` deps in `QuizEngine.tsx` and the page intentionally use `// eslint-disable-next-line react-hooks/exhaustive-deps` with stable primitive keys.
- No git repo is initialized in this workspace.

---

## 5. NEXT ACTION ITEMS (To-Do List for the Next Agent)

1. **Option 1 — DONE.** Verify the randomized MCQ distractors/positions behave as intended at runtime (open `/member/ngaji-ceria/quiz/play?jilid=1&hal=1`). Only revisit/tune if distractor quality is poor.
2. **Apply the Design System to the remaining pages** (Home, Explore/Map, Profile, Leaderboard, Games list, Library) using the exact tokens in §2. Many were already swept in a prior pass — verify and finish any stragglers; re-check for legacy hexes (`#D1FAE5`, `#fff0f0`, `#2E7D32`, `#1E3E1A`, `#2A1A10`, `#94A3B8`).
3. **Test the Quiz Engine end-to-end:** confirm randomization re-rolls on Next, stays stable while audio plays, `onPlayAudio`/`isAudioPlaying` still drive playback in the fill-in/material models, and that answering + progression (stars/award) still work. Ensure no double audio.
4. **(Optional) Data enrichment for full variety:** add `audioShapes` (and/or single-string answers) to the dataset to unlock `audio-matching`.

---

## 6. IMPORTANT FILE MAP

- `src/styles/theme.css` — Tailwind v4 color + font tokens (source of truth).
- `src/features/ngaji-ceria/components/quiz-models/` — all quiz-model code:
  - `types.ts` — model prop types + flexible `QuestionData`.
  - `quizModelRandomizer.ts` — `getAvailableModels` / `getRandomQuizModel`.
  - `QuizEngine.tsx` — `switch` on the randomly assigned model.
  - `ModelFillInTheBlank.tsx`, `ModelMultipleChoiceText.tsx`, `ModelMultipleChoiceAudio.tsx`, `ModelAudioMatching.tsx`, `ModelMaterialCard.tsx`.
  - `index.ts` — barrel exports.
- `src/features/ngaji-ceria/pages/NgajiCeriaQuizPage.tsx` — host page + `toQuestionData` mapper (Option 1 lives here).
- `src/features/ngaji-ceria/data/tilawatiQuizTypes.ts` / `tilawatiQuizData.ts` + `tilawatiQuizJilid1..6.ts` — dataset (`QuizQuestion` / `PageQuizData`).
- `src/features/ngaji-ceria/services/tilawatiAudio.ts` — `usePublishedTilawati` / `useTilawatiAudio` audio pipeline.
- `src/components/ui/FontAwesomeIcons.tsx` — icon set used by the models (`Volume2`, `Check`, `X`, `Info`, `RefreshCw`, `Sparkles`, …).

> ⚠️ Path corrections vs. older notes: `quizModelRandomizer.ts` and `QuizEngine.tsx` live under `components/quiz-models/`, **not** `utils/` or `components/` root.
