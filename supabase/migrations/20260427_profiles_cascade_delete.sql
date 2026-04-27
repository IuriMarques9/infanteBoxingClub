-- ─── ELIMINAÇÃO DE ADMINS ──────────────────────────────────────
-- Quando se elimina um utilizador via `auth.admin.deleteUser()`,
-- o Postgres tenta apagar a linha em `auth.users`. Como a tabela
-- `public.profiles` referencia `auth.users(id)` sem `ON DELETE
-- CASCADE`, o delete falha com erro de foreign key.
--
-- Esta migration recria a foreign key com `ON DELETE CASCADE` —
-- ao apagar o user, o profile correspondente é apagado em
-- automático.
--
-- Adiciona também uma política RLS que permite ao service_role
-- (usado pelo `lib/supabase/admin.ts`) apagar profiles. O
-- service_role já bypassa RLS por defeito, mas explicitamos a
-- política para evitar surpresas se a RLS for endurecida no futuro.

-- 1) Recriar FK com CASCADE
alter table public.profiles
  drop constraint if exists profiles_id_fkey;

alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id) references auth.users(id)
  on delete cascade;

-- 2) Garantir que RLS está ligado e service_role consegue tudo.
alter table public.profiles enable row level security;

drop policy if exists "service role full access" on public.profiles;
create policy "service role full access"
  on public.profiles
  for all
  to service_role
  using (true)
  with check (true);

-- 3) Permitir aos admins autenticados ler profiles (para JOINs em
-- activity_log, etc.). Já deve existir; idempotente.
drop policy if exists "authenticated read profiles" on public.profiles;
create policy "authenticated read profiles"
  on public.profiles
  for select
  to authenticated
  using (true);
