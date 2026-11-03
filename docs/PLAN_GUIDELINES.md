# Rencana Penyusunan Guidelines Tambahan

## Fase 1: Fondasi Krusial (P0)

- [ ] `ENVIRONMENT_AND_DEPLOYMENT_GUIDELINES.md`
      Fokus: Peta environment (Lokal vs Prod), variabel env wajib, setup OAuth Callback, dan dokumentasi Cloudflare `_middleware.ts`.
- [ ] `DATABASE_AND_SECURITY_GUIDELINES.md`
      Fokus: Peta skema (Go vs Supabase), template RLS policy, trigger ekonomi, normalisasi role, aturan migrasi via file SQL.

## Fase 2: Domain Spesifik (P1)

- [ ] `ARABIC_TYPOGRAPHY_AND_CONTENT_GUIDELINES.md`
      Fokus: Font standar, aturan CSS Arab (line-height, RTL), normalisasi Unicode (buang Tatweel), pemisahan baseLetter & harakat untuk logika game.

## Fase 3: Proses & Testing (P2)

- [ ] `TESTING_AND_QA_GUIDELINES.md`
      Fokus: Aturan unit test (Vitest) untuk logika game & ekonomi, E2E test (Playwright), dan Pre-PR Checklist.
- [ ] (Opsional) Update `GUIDELINES.md` utama untuk menambahkan aturan kapan pakai Zustand vs Context vs Local State.

---

_Status: Ditunda sampai perbaikan Game (P0 Game Design) selesai._
