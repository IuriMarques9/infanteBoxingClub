-- Adicionar FK de activity_log.admin_id → profiles.id
-- Sem esta FK, o PostgREST não consegue resolver o JOIN embutido
-- `.select('*, profiles:admin_id(email)')` e retorna sempre null,
-- fazendo com que a coluna "Admin" mostre sempre o fallback 'Admin'.

-- 1. Tornar nullable: admins eliminados ficam como NULL nos logs (preserva histórico)
alter table public.activity_log
  alter column admin_id drop not null;

-- 2. Limpar referências a admins já eliminados (sem profile correspondente)
update public.activity_log
set admin_id = null
where admin_id is not null
  and not exists (
    select 1 from public.profiles p where p.id = activity_log.admin_id
  );

-- 3. FK com on delete set null (eliminar admin → logs ficam mas admin_id fica null)
alter table public.activity_log
  add constraint fk_activity_log_admin
  foreign key (admin_id)
  references public.profiles (id)
  on delete set null;

notify pgrst, 'reload schema';
