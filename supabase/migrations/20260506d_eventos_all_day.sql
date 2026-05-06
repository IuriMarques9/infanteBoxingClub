-- ─── Eventos: dia inteiro (sem hora) ─────────────────────────
-- Quando `all_day = true`, o evento é considerado "de dia inteiro":
--   * UI grava a data com hora 00:00 (apenas como referência)
--   * Render esconde a hora — só mostra a data
--   * Aplica-se ao evento todo (date e date_end)

alter table public.eventos
  add column if not exists all_day boolean not null default false;

notify pgrst, 'reload schema';
