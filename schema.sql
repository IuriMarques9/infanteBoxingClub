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
