-- Adiciona coluna EN para a categoria do produto.
alter table public.store_products
  add column if not exists category_en text;
