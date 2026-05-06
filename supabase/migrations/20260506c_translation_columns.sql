-- Adiciona colunas EN para conteúdo editado pelo admin.
-- O conteúdo PT continua a ser a fonte; o EN é preenchido automaticamente
-- ao guardar (via MyMemory) e pode ser editado manualmente no futuro.

alter table public.store_products
  add column if not exists name_en text,
  add column if not exists description_en text;

alter table public.eventos
  add column if not exists title_en text,
  add column if not exists description_en text,
  add column if not exists location_en text;
