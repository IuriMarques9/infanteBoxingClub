'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ─── SERVER ACTIONS PARA GESTÃO DE DOCUMENTOS ─────────────────
// Upload/Delete/SignedURL para documentos associados a membros.
// Mantém a tabela `document_metadata` sincronizada com o Storage.

const ALLOWED_CATEGORIAS = [
  'cc',
  'declaracao',
  'inspecao_medica',
  'seguro',
  'autorizacao',
  'contrato',
  'avatar',
  'outro',
] as const

export type DocCategoria = (typeof ALLOWED_CATEGORIAS)[number]

const CATEGORIA_LABEL: Record<DocCategoria, string> = {
  cc: 'Documento de Identificação',
  declaracao: 'Declaração dos Pais',
  inspecao_medica: 'Inspeção Médica',
  seguro: 'Comprovativo de Seguro',
  autorizacao: 'Autorização',
  contrato: 'Contrato',
  avatar: 'Avatar',
  outro: 'Documento',
}

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient()
  const membroId = formData.get('membro_id') as string
  const categoria = formData.get('categoria') as DocCategoria
  const file = formData.get('file') as File

  if (!ALLOWED_CATEGORIAS.includes(categoria)) {
    return { error: 'Categoria inválida' }
  }
  if (!file || file.size === 0) return { error: 'Ficheiro vazio' }

  // Avatar: só JPG/PNG/WEBP. Defesa em profundidade — o cliente já
  // restringe via accept, mas validamos no servidor para evitar SVG
  // (XSS) ou HEIC (não renderiza em browsers não-Apple).
  if (categoria === 'avatar') {
    const ALLOWED_AVATAR_MIME = ['image/jpeg', 'image/png', 'image/webp']
    if (!ALLOWED_AVATAR_MIME.includes(file.type)) {
      return { error: 'Formato de avatar não suportado. Usa JPG, PNG ou WEBP.' }
    }
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `membros/${membroId}/${Date.now()}_${safeName}`

  const { error: uploadError } = await supabase.storage
    .from('documentos')
    .upload(storagePath, file)
  if (uploadError) return { error: uploadError.message }

  const { error: metaError } = await (supabase.from('document_metadata') as any).insert({
    membro_id: membroId,
    storage_path: storagePath,
    file_name: file.name,
    categoria,
    mime_type: file.type || null,
    size_bytes: file.size,
  })
  if (metaError) {
    // rollback storage
    await supabase.storage.from('documentos').remove([storagePath])
    return { error: metaError.message }
  }

  const { data: membro } = await (supabase.from('membros').select('nome').eq('id', membroId).single() as any)
  const nomeMembro = membro?.nome || 'membro'
  const categoriaLabel = CATEGORIA_LABEL[categoria] ?? 'Documento'

  await (supabase.from('activity_log') as any).insert({
    action: 'UPLOAD_DOCUMENTO',
    description: `Enviou ${categoriaLabel} de ${nomeMembro}`,
    entity_type: 'documento',
    entity_id: membroId,
  })

  revalidatePath(`/dashboard/membros/${membroId}`)
  return { ok: true }
}

export async function deleteDocument(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { data: meta } = await (supabase
    .from('document_metadata')
    .select('storage_path, categoria, membro_id')
    .eq('id', id)
    .single() as any)

  if (!meta) return { error: 'Documento não encontrado' }

  await supabase.storage.from('documentos').remove([meta.storage_path])
  await supabase.from('document_metadata').delete().eq('id', id)

  const { data: membro } = await (supabase.from('membros').select('nome').eq('id', meta.membro_id).single() as any)
  const nomeMembro = membro?.nome || 'membro'
  const categoriaLabel = CATEGORIA_LABEL[meta.categoria as DocCategoria] ?? 'Documento'

  await (supabase.from('activity_log') as any).insert({
    action: 'ELIMINAR_DOCUMENTO',
    description: `Eliminou ${categoriaLabel} de ${nomeMembro}`,
    entity_type: 'documento',
    entity_id: meta.membro_id,
  })

  revalidatePath(`/dashboard/membros/${meta.membro_id}`)
  return { ok: true }
}

export async function getDocumentSignedUrl(storagePath: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from('documentos')
    .createSignedUrl(storagePath, 60)
  if (error) return { error: error.message }
  return { url: data.signedUrl }
}
