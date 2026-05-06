-- ─── Eventos: link externo (CTA) ──────────────────────────────
-- Adiciona suporte a:
--   * `cta_url` — URL externo (ex: página oficial do evento, formulário
--                 de inscrição). Quando preenchido, o botão na landing
--                 leva o visitante para esse link num separador novo.
--                 Quando NULL, o botão simplesmente não aparece.

alter table public.eventos
  add column if not exists cta_url text;

notify pgrst, 'reload schema';
