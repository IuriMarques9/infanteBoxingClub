-- ─── LIMPAR DESCRIÇÕES ANTIGAS DE DOCUMENTOS NO ACTIVITY_LOG ─────
-- Antes: `Enviou documento "Insp. Med. Verso.webp" (inspecao_medica) para o membro`
-- Depois: `Enviou Inspeção Médica de Eva Verissimo`
--
-- Os registos antigos têm o nome do ficheiro e o slug da categoria embutidos
-- na descrição. Esta migração extrai a categoria, mapeia para um label humano
-- e cruza com `membros` para obter o nome real, gerando descrições coerentes
-- com o novo formato gerado pelas server actions em `documents-actions.ts`.

-- 1. UPLOAD_DOCUMENTO — descrições antigas têm o slug entre parênteses.
update public.activity_log al
set description = 'Enviou ' || sub.categoria_label || ' de ' || coalesce(sub.membro_nome, 'membro')
from (
  select
    al2.id,
    case substring(al2.description from '\(([^)]+)\) para o membro')
      when 'cc'              then 'Documento de Identificação'
      when 'declaracao'      then 'Declaração dos Pais'
      when 'inspecao_medica' then 'Inspeção Médica'
      when 'seguro'          then 'Comprovativo de Seguro'
      when 'autorizacao'     then 'Autorização'
      when 'contrato'        then 'Contrato'
      when 'avatar'          then 'Avatar'
      when 'outro'           then 'Documento'
      else 'Documento'
    end as categoria_label,
    m.nome as membro_nome
  from public.activity_log al2
  left join public.membros m on m.id = al2.entity_id
  where al2.action = 'UPLOAD_DOCUMENTO'
    and al2.description like 'Enviou documento "%'
) sub
where al.id = sub.id;

-- 2. ELIMINAR_DOCUMENTO — descrições antigas só têm o nome do ficheiro,
-- não a categoria. Como o documento já foi apagado de `document_metadata`,
-- não há forma de recuperar a categoria original. Substituímos por uma
-- forma genérica que pelo menos inclui o nome do membro.
update public.activity_log al
set description = 'Eliminou um documento de ' || coalesce(m.nome, 'membro')
from public.membros m
where al.entity_id = m.id
  and al.action = 'ELIMINAR_DOCUMENTO'
  and al.description like 'Eliminou o documento "%';

-- Logs de eliminação onde o membro também foi eliminado (orfãos): só
-- limpam o nome do ficheiro.
update public.activity_log
set description = 'Eliminou um documento'
where action = 'ELIMINAR_DOCUMENTO'
  and description like 'Eliminou o documento "%';
