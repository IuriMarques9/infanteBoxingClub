-- ─── Permitir categoria 'avatar' em document_metadata ──────────
-- O CHECK original não incluía 'avatar', pelo que cada upload de
-- foto de perfil falhava silenciosamente: o ficheiro era enviado
-- para o Storage mas o INSERT na metadata era recusado e o código
-- aplicação fazia rollback do Storage. Esta migração adiciona
-- 'avatar' ao conjunto de categorias válidas.

alter table public.document_metadata
  drop constraint if exists document_metadata_categoria_check;

alter table public.document_metadata
  add constraint document_metadata_categoria_check
  check (categoria in (
    'cc','declaracao','inspecao_medica','seguro',
    'autorizacao','contrato','avatar','outro'
  ));

notify pgrst, 'reload schema';
