-- ─── PAGAMENTOS POLIMÓRFICOS ──────────────────────────────────────
-- A tabela `pagamentos` passa a suportar múltiplos tipos de transacção:
--   cota   → mensalidade (mes_referencia obrigatório)
--   seguro → seguro anual (sem mes_referencia, ano via data_pagamento)
--   loja   → venda de merchandise (futuro — sem mes_referencia)
--   evento → inscrição em evento (futuro — sem mes_referencia)
--   outro  → casos avulsos
--
-- Backfill automático: cria entradas tipo='seguro' a partir do flag
-- legacy `seguro_pago`/`seguro_ano_pago` em `membros`. Idempotente
-- (não duplica se a migration correr 2×).

-- 1. Novas colunas
alter table public.pagamentos
  add column if not exists tipo text not null default 'cota'
    check (tipo in ('cota','seguro','loja','evento','outro')),
  add column if not exists descricao text,
  add column if not exists referencia_id uuid;

-- 2. mes_referencia passa a opcional (seguros/loja/eventos não usam)
alter table public.pagamentos alter column mes_referencia drop not null;

-- 3. Índices úteis
create index if not exists idx_pagamentos_tipo on public.pagamentos (tipo);
create index if not exists idx_pagamentos_data on public.pagamentos (data_pagamento desc);

-- 4. Backfill: migrar seguros existentes em `membros` para entradas reais
--    O valor é inferido pelo flag `is_competicao` (45 ou 32 €).
--    Idempotente via NOT EXISTS clause.
insert into public.pagamentos (membro_id, tipo, valor, descricao, data_pagamento, admin_id)
select
  m.id,
  'seguro',
  case when m.is_competicao then 45 else 32 end,
  concat('Seguro ', m.seguro_ano_pago, ' · ', coalesce(m.seguro_pago, 'desconhecido')),
  to_timestamp(m.seguro_ano_pago::text || '-01-01', 'YYYY-MM-DD'),
  coalesce(m.created_by, auth.uid())
from public.membros m
where m.seguro_pago is not null
  and m.seguro_ano_pago is not null
  and not exists (
    select 1 from public.pagamentos p
    where p.membro_id = m.id
      and p.tipo = 'seguro'
      and extract(year from p.data_pagamento)::int = m.seguro_ano_pago
  );

notify pgrst, 'reload schema';
