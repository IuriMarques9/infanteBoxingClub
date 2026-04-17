-- Criação das Tabelas Principais do Supabase (Executar no SQL Editor online)

-- Tabela de Perfis Base (Admins/Users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger para criar Profile ao Registar novo User Auth
create or function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Tabela: Modalidades (Aulas)
create table public.modalidades (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  horario_text text,
  imageUrl text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela: Eventos
create table public.eventos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date timestamp with time zone not null,
  location text,
  description text,
  imageUrl text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela: Store Products
create table public.store_products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric not null,
  description text,
  imageUrl text,
  in_stock boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS) - Permissões

-- Ativar RLS
alter table public.modalidades enable row level security;
alter table public.eventos enable row level security;
alter table public.store_products enable row level security;

-- Qualquer pessoa (público) pode VER (select) as modalidades, eventos, e loja
create policy "Public Access Modalidades" on public.modalidades for select using (true);
create policy "Public Access Eventos" on public.eventos for select using (true);
create policy "Public Access Store" on public.store_products for select using (true);

-- Apenas Admin logados (auth.role() = 'authenticated') podem inserir/atualizar/apagar
create policy "Admin Write Modalidades" on public.modalidades for all using (auth.role() = 'authenticated');
create policy "Admin Write Eventos" on public.eventos for all using (auth.role() = 'authenticated');
create policy "Admin Write Store" on public.store_products for all using (auth.role() = 'authenticated');

-- STORAGE: Buckets para imagens
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict (id) do nothing;

create policy "Public Access to Images" on storage.objects for select using ( bucket_id = 'images' );
create policy "Admin Insert to Images" on storage.objects for insert with check ( bucket_id = 'images' and auth.role() = 'authenticated' );
create policy "Admin Update to Images" on storage.objects for update using ( bucket_id = 'images' and auth.role() = 'authenticated' );
create policy "Admin Delete to Images" on storage.objects for delete using ( bucket_id = 'images' and auth.role() = 'authenticated' );


------------------------------------------------------------------------------------------------------
-- NOVO MODULO CRM: MEMBROS, PAGAMENTOS E HORARIOS
------------------------------------------------------------------------------------------------------

create table public.membros (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  email text,
  telefone text,
  data_nascimento date,
  turma text not null check(turma in ('gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres')),
  is_competicao boolean default false,
  is_isento boolean default false,             -- ISENTO: marcado manualmente por um admin (membro não precisa de pagar)
  created_by uuid default auth.uid(),          -- AUDITORIA: Quem criou este registo
  updated_by uuid default auth.uid(),          -- AUDITORIA: Quem fez a última edição
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.pagamentos (
  id uuid default gen_random_uuid() primary key,
  membro_id uuid references public.membros(id) on delete cascade not null,
  mes_referencia text not null,                -- Exemplo: "2026-04"
  valor numeric not null,
  data_pagamento timestamp with time zone default timezone('utc'::text, now()) not null,
  admin_id uuid not null default auth.uid()    -- AUDITORIA: Qual admin registou este pagamento
);

create table public.horarios (
  id uuid default gen_random_uuid() primary key,
  turma text not null check(turma in ('gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres')),
  descricao text not null,                     -- Ex: "Segunda, Quarta e Sexta"
  hora text not null,                          -- Ex: "19:00 às 20:00"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── TABELA DE AUDITORIA (ACTIVITY LOG) ────────────────────────
-- Regista TODAS as ações executadas por qualquer administrador.
-- Exemplos: "Criou membro João", "Editou turma de Maria", "Registou pagamento Abril".
-- Isto permite saber quem fez o quê e quando, crucial para múltiplos admins.
create table public.activity_log (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid not null default auth.uid(),   -- Quem executou a ação
  action text not null,                        -- Ex: "CRIAR_MEMBRO", "EDITAR_MEMBRO", "REGISTAR_PAGAMENTO"
  description text not null,                   -- Ex: "Criou o membro João Silva na turma Leões"
  entity_type text,                            -- Ex: "membro", "pagamento", "horario"
  entity_id uuid,                              -- ID do objeto afetado
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para proteção
alter table public.membros enable row level security;
alter table public.pagamentos enable row level security;
alter table public.horarios enable row level security;
alter table public.activity_log enable row level security;

-- Apenas admins autenticados podem interagir com a gestão de membros e tesouraria
create policy "Admins acessam Membros" on public.membros for all using (auth.role() = 'authenticated');
create policy "Admins acessam Pagamentos" on public.pagamentos for all using (auth.role() = 'authenticated');
create policy "Admins acessam Log" on public.activity_log for all using (auth.role() = 'authenticated');

-- Horários podem ser vistos pelo público na Landing Page
create policy "Public Access to Horarios" on public.horarios for select using (true);
create policy "Admins Write Horarios" on public.horarios for all using (auth.role() = 'authenticated');

-- STORAGE: Bucket restrito para documentos confidenciais (Não Público)
insert into storage.buckets (id, name, public) values ('documentos', 'documentos', false) on conflict (id) do nothing;
-- Apenas admins podem ver, inserir ou apagar documentos dos membros
create policy "Admin Select Documentos" on storage.objects for select using ( bucket_id = 'documentos' and auth.role() = 'authenticated' );
create policy "Admin Insert Documentos" on storage.objects for insert with check ( bucket_id = 'documentos' and auth.role() = 'authenticated' );
create policy "Admin Delete Documentos" on storage.objects for delete using ( bucket_id = 'documentos' and auth.role() = 'authenticated' );


