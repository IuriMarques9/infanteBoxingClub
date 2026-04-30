-- ─── Impedir pagamentos duplicados (membro × mês) ───────────────
-- Antes desta migração era possível registar duas vezes o mesmo
-- mês para o mesmo membro. Limpa duplicados antigos (mantém o
-- registo de menor ctid — i.e. o primeiro inserido) e cria índice
-- único para impedir futuros duplicados a nível de BD.

delete from public.pagamentos p1
using public.pagamentos p2
where p1.ctid > p2.ctid
  and p1.membro_id      = p2.membro_id
  and p1.mes_referencia = p2.mes_referencia;

create unique index if not exists uq_pagamentos_membro_mes
  on public.pagamentos (membro_id, mes_referencia);
