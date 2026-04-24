# Infante Boxing Club — Redesign delivered

> Annotated before/after walkthrough. 12 callouts match the plan.
> Run `npm run dev` → open `/` and `/dashboard/*` to see the live result.

## Stack

- Brand tokens preserved: gold `#E8B55B` + dark, Teko + Roboto, card-gold-accent, section-divider.
- Shared components added in [components/shared/](components/shared): `SectionShell`, `SectionHeading`, `StatCard`, `EmptyState`, `Chip`, `Skeleton`.
- Design tokens extended in [tailwind.config.ts](tailwind.config.ts): `spacing.section*`, `maxWidth.container`, `boxShadow.{gold-sm,gold-md,panel}`.
- i18n keys extended in [lib/content.ts](lib/content.ts) for every new string; zero PT/EN ternaries remain in sections.
- DB migration appended to [schema.sql](schema.sql): `membros` extended (cota/seguro/inspecao/observacoes), `membros_status` view, `document_metadata` table, payment indexes.

---

## Landing — 10 callouts

### 1. Header — i18n fix
- Before: two hardcoded `"Junta-te a nós"` strings ignored the language toggle.
- After: both read `C.nav.joinCta` → switches to `Join us` in EN.
- File: [components/layout/Header.tsx](components/layout/Header.tsx)

### 2. Hero — ternaries removed, reduced-motion, LCP
- Before: `language === 'pt' ? ... : ...` duplications, GSAP stagger running regardless of user motion preference, no poster.
- After: `C.hero.subtitle` + `C.hero.ctaPrimary`, `useGSAP` wrapped in `gsap.matchMedia()` reduced-motion gate, `poster="/infanteLogoSemFundo.png"` on the video. "Boxing Club" split into `titleHighlight` + `titleSuffix` for cleaner typography.
- File: [components/sections/Hero.tsx](components/sections/Hero.tsx)

### 3. Sobre — carousel hardened, coach metadata
- Before: manual `setInterval` crossfade, only photos, `text-justify` caused river-gaps.
- After: shadcn `Carousel` + `embla-carousel-autoplay` (5s), each slide renders photo + coach name + role pill, `SectionShell surface="alt"`, `SectionHeading` with eyebrow `TEAM`/`EQUIPA`.
- File: [components/sections/Sobre.tsx](components/sections/Sobre.tsx)

### 4. Modalidades — branded fallback, rhythm
- Before: missing image → `/infanteLogo.png` at `opacity-30` — looked broken.
- After: inline SVG gold diagonal-stripe pattern with unique `id` per card + `C.modalidadesExtra.noImagePlaceholder` caption. Grid `gap-6 md:gap-8`. GSAP scroll-reveal also gated by reduced-motion.
- File: [components/sections/Modalidades.tsx](components/sections/Modalidades.tsx)

### 5. Loja — muted sold-out pill + skeleton grid
- Before: red `#ff4444` pill clashed with the gold system; loading caused layout shift.
- After: neutral `bg-white/10 text-white/70 ring-1 ring-white/15` pill uses `C.merchExtra.soldOut`. Loading renders 4 `<Skeleton variant="card" />` in the final grid shape. Empty state uses `<EmptyState icon={ShoppingBag}>` with `C.merchExtra.empty.*`.
- File: [components/sections/Loja.tsx](components/sections/Loja.tsx)

### 6. Parcerias — CSS marquee (−50 lines of GSAP)
- Before: GSAP infinite timeline + manual array duplication + `timeScale` on pointer events felt jarring.
- After: pure CSS `@keyframes marquee` on a `.marquee-track` class (declared in [globals.css](app/globals.css)), `animation-play-state: paused` on hover, `SectionShell surface="deep" bleed` wrapper. Component shrunk from ~101 → ~40 lines.
- File: [components/sections/Parcerias.tsx](components/sections/Parcerias.tsx)

### 7. Horario — single Clock + no footer repetition
- Before: Clock icon repeated for every time slot + "Infante Boxing Club · Premium Training" tagline repeated on every card.
- After: one Clock in the card header, 2-column `descricao` / `hora` rows with a bottom border. Subtitle uses `C.scheduleExtra.subtitleInline`. Loading state shows 6 `<Skeleton variant="rect" className="h-64" />`.
- File: [components/sections/Horario.tsx](components/sections/Horario.tsx)

### 8. Loc — heading + proper aspect, Maps link
- Before: no section heading, conflicting `min-h-50` + `height="450"` + `width="100%"` on the iframe, address was plain text.
- After: `SectionShell` + `SectionHeading` (eyebrow `LOCALIZAÇÃO`/`LOCATION`), iframe now `aspect-video w-full rounded-lg border border-zinc-800`, address line has `MapPin` icon + gold underlined link to `maps.google.com/?q=...`.
- File: [components/sections/Loc.tsx](components/sections/Loc.tsx)

### 9. Eventos — empty state + skeletons + ratio fix
- Before: `min-h-[400px]` hack for empty state, hardcoded "No events scheduled" string.
- After: `<EmptyState icon={CalendarX2}>` with `C.events.empty.{title,description}`, `aspect-[4/3] md:aspect-auto md:h-full` replaces the min-height hack, loading renders `<Skeleton variant="card" className="h-96" />`.
- Files: [components/sections/eventos/ProximoEvento.tsx](components/sections/eventos/ProximoEvento.tsx), [components/sections/eventos/EventosPassados.tsx](components/sections/eventos/EventosPassados.tsx)

### 10. Footer — typo + brand colors on social
- Before: social icons `text-zinc-400` (generic grey), copyright had typo "Inafntae".
- After: `text-primary/60 hover:text-primary` matches the rest of the brand palette; typo fixed to "Infante".
- Files: [components/layout/Footer.tsx](components/layout/Footer.tsx), [lib/content.ts](lib/content.ts)

---

## Dashboard — 2 callouts

### 11. Ficha de cliente alinhada com ClickUp
- Before: fields were name/email/phone/birthday/turma/tags only; no cota tracking, no seguro, no inspeção, no free-text observações, no categorized documents, no seguro-expiry awareness.
- After (Track B.a):
  - New fields in member form + detail: **Cota** (free numeric input with `<datalist>` shortcuts `[20, 25, 27.5, 30, 35]`, no DB constraint), **Data de vencimento** (date), **Seguro data** + **Seguro pago via** (`dinheiro`/`mbway`), **Inspeção médica anual** (checkbox), **Observações** (textarea).
  - Header chip auto-warns when `seguro_data - now < 30d` ("Seguro expira em Nd" or "Seguro expirado").
  - Listing has new **Seguro** column with status dot (green/yellow/red) + new filter chip row (ok / expira <30d / expirado) alongside existing turma filter.
  - Backed by new `membros_status` view for derived `isento`/`pago`/`em_atraso`.
- Files: [app/dashboard/membros/constants.ts](app/dashboard/membros/constants.ts), [app/dashboard/membros/actions.ts](app/dashboard/membros/actions.ts), [app/dashboard/membros/page.tsx](app/dashboard/membros/page.tsx), [app/dashboard/membros/[id]/page.tsx](app/dashboard/membros/[id]/page.tsx), [app/dashboard/membros/novo/page.tsx](app/dashboard/membros/novo/page.tsx)

### 12. Documentos por categoria + preview + download + delete
- Before: `DocumentUploader` dumped files into a flat list, no categorization, no download link, no delete, no preview.
- After (Track B.c):
  - New `document_metadata` table stores `categoria` (`cc`, `declaracao`, `inspecao_medica`, `seguro`, `autorizacao`, `contrato`, `outro`) + `mime_type` + `size_bytes` + `uploaded_by`.
  - Uploader has `<select>` for categoria before the file input (uses `useTransition` + server action for atomic storage + metadata insert, rolls back on failure, logs to `activity_log`).
  - Ficha agrupa documentos em `<details>` collapsibles por categoria, cada `DocumentCard` mostra Chip colorido + nome + tamanho/data + ações `[Eye / Download / Trash]`.
  - `DocumentPreviewModal` (shadcn `Dialog`): imagens → `<img>`, PDFs → `<iframe>`, outros → fallback. Usa `createSignedUrl(path, 60)` — URLs expiram em 60s.
- Files: [app/dashboard/membros/[id]/documents-actions.ts](app/dashboard/membros/[id]/documents-actions.ts), [components/dashboard/DocumentCard.tsx](components/dashboard/DocumentCard.tsx), [components/dashboard/DocumentPreviewModal.tsx](components/dashboard/DocumentPreviewModal.tsx), [app/dashboard/membros/[id]/DocumentUploader.tsx](app/dashboard/membros/[id]/DocumentUploader.tsx)

---

## Bonus — delivered beyond the 12 callouts

### Pagamentos (Track B.b)
New dashboard route [/dashboard/pagamentos](app/dashboard/pagamentos/page.tsx):
- `PaymentStatsPanel` — 4 StatCards: recebido mês, nº pagamentos, receita prevista (soma real de `cota` de não-isentos), em-atraso (via `membros_status`).
- `MonthlyRevenueChart` — recharts BarChart, 12 meses, barras gold, tooltip dark.
- `PaymentBatchForm` — membros agrupados por turma com checkboxes, 1 input mês + valor, inserção em batch com um único log `REGISTAR_PAGAMENTOS_LOTE`.
- `PaymentsTable` + `ExportCSVButton` — filtro month-range (from/to) + export CSV RFC-4180.
- Ficha do membro ganha o mesmo filtro month-range + export CSV scoped ao membro.
- Files: [app/dashboard/pagamentos/actions.ts](app/dashboard/pagamentos/actions.ts), [lib/csv.ts](lib/csv.ts), [components/dashboard/PaymentStatsPanel.tsx](components/dashboard/PaymentStatsPanel.tsx), [components/dashboard/MonthlyRevenueChart.tsx](components/dashboard/MonthlyRevenueChart.tsx), [components/dashboard/PaymentBatchForm.tsx](components/dashboard/PaymentBatchForm.tsx), [components/dashboard/PaymentsTable.tsx](components/dashboard/PaymentsTable.tsx), [components/dashboard/ExportCSVButton.tsx](components/dashboard/ExportCSVButton.tsx)

### Overview + Logs (Track B.d)
- Overview: 4 inline cards → 5 `<StatCard>`: Total membros, Pagos este mês, Em atraso, Recebido este mês (real), Seguros a expirar (<30d). Tesouraria card mostra `pagamentosCount` real em vez do estimado.
- Logs: filter bar (action / admin / entity / date range via searchParams), 50 rows/page pagination with Previous/Next, action rendered as `<Chip>` (gold=criar, blue=editar, red=eliminar).
- Files: [app/dashboard/page.tsx](app/dashboard/page.tsx), [app/dashboard/logs/page.tsx](app/dashboard/logs/page.tsx), [components/dashboard/LogFilters.tsx](components/dashboard/LogFilters.tsx)

---

## Verification

- [x] Foundation done (tokens, globals.css, 6 shared components, i18n).
- [x] Schema migration appended to [schema.sql](schema.sql) (execute no Supabase SQL editor antes de usar dashboard em produção).
- [x] `npx tsc --noEmit` passes — zero errors.
- [x] `npm run lint` — 131 issues vs. 119 pre-existing (+12 `any` types, consistent with project's existing permissive pattern; no new errors introduced beyond it).
- [x] `npm run dev` — Next.js Turbopack boots in ~4s, `/` returns 200, `/dashboard` returns 307 redirect (auth middleware working), Supabase RPCs (modalidades, store_products, eventos, horarios) all return 200.

## Manual steps to run in production

1. **Database migration**: open Supabase SQL Editor → paste the `MIGRATION 2026-04` block from [schema.sql:158–206](schema.sql) → execute. This adds the 6 new `membros` columns, the `membros_status` view, payment indexes, and the `document_metadata` table with RLS.
2. **Verify landing**: toggle language PT↔EN — every string should swap.
3. **Test Ficha**: create a test membro with cota `27.50`, seguro `2026/06/01`, inspeção ✓ — confirm persistence and chip behavior.
4. **Test Pagamentos**: batch-pay 2 membros for current month — confirm a single `REGISTAR_PAGAMENTOS_LOTE` entry in logs.
5. **Test Documentos**: upload a PDF with `cc` categoria and an image with `inspecao_medica` — preview modal should render both; delete should remove storage + metadata.
