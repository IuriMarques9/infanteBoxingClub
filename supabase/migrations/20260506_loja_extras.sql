alter table public.store_products
  add column if not exists published boolean not null default true,
  add column if not exists sort_order int not null default 0,
  add column if not exists category text;

update public.store_products
set sort_order = sub.rn
from (
  select id, row_number() over (order by created_at desc) as rn
  from public.store_products
) sub
where public.store_products.id = sub.id and public.store_products.sort_order = 0;

create index if not exists idx_store_products_sort on public.store_products(sort_order);
create index if not exists idx_store_products_published on public.store_products(published);

notify pgrst, 'reload schema';
