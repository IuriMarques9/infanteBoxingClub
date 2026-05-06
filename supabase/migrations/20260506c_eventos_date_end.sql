-- ─── Eventos: data/hora de fim (multi-dia) ───────────────────
-- Adiciona suporte a eventos com mais que um dia ou com hora de fim:
--   * `date_end` — opcional. Quando NULL, é evento pontual (uma data/hora).
--                  Quando preenchido, marca o fim do evento (mesmo dia ou
--                  vários dias depois).
--
-- Lógica de "passado" passa a ser: coalesce(date_end, date) < now()
-- Lógica de "futuro/em curso": coalesce(date_end, date) >= now()

alter table public.eventos
  add column if not exists date_end timestamptz;

-- Garantir que data fim >= data início (defesa em profundidade).
alter table public.eventos
  drop constraint if exists eventos_date_end_after_start;
alter table public.eventos
  add constraint eventos_date_end_after_start
  check (date_end is null or date_end >= date);

notify pgrst, 'reload schema';
