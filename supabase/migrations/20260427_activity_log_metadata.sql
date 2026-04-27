-- ─── D2: metadata jsonb em activity_log ─────────────────────────
-- Adiciona o campo `metadata` (jsonb, default '{}') à tabela
-- `activity_log` para guardar payload estruturado por evento
-- (ex.: diff antes/depois de um EDITAR_*, IDs relacionados).
-- Usado pelo drawer de detalhe na página /dashboard/logs.

alter table public.activity_log
  add column if not exists metadata jsonb not null default '{}'::jsonb;

comment on column public.activity_log.metadata is
  'Payload estruturado da ação (ex: {before: {...}, after: {...}}).';
