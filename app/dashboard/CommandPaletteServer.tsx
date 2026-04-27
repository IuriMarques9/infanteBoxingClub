import { createClient } from '@/lib/supabase/server'
import CommandPalette from './CommandPalette'

// ─── WRAPPER SERVER PARA O COMMAND PALETTE ─────────────────────
// Vai buscar lista enxuta de membros (id, nome, turma) e passa-a
// para o componente client. Limita a 200 para evitar payloads grandes.
export default async function CommandPaletteServer() {
  const supabase = await createClient()
  const { data } = await (supabase
    .from('membros')
    .select('id, nome, turma')
    .order('nome', { ascending: true })
    .limit(200) as any)

  return <CommandPalette allMembers={data || []} />
}
