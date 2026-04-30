-- Campo de nome de apresentação para admins
-- Permite que o super admin preencha o nome real de cada administrador,
-- que passa a aparecer na coluna "Admin" do histórico de atividade.
alter table public.profiles
  add column if not exists nome text;

notify pgrst, 'reload schema';
