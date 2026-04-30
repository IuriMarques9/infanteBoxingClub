'use client'

import { useState, useTransition } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '@/components/dashboard/ConfirmDeleteDialog'
import { eliminarMembro } from '../actions'

// Botão de eliminar membro (página de perfil) com confirmação
// obrigatória via AlertDialog. Substitui o submit imediato anterior.
export default function DeleteMembroButton({
  id,
  nome,
}: {
  id: string
  nome: string
}) {
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()

  function handleConfirm() {
    start(async () => {
      try {
        const fd = new FormData()
        fd.append('id', id)
        await eliminarMembro(fd)
        // server action faz redirect; este toast só dispara em caso de erro
      } catch (e: any) {
        // NEXT_REDIRECT é um throw legítimo do redirect — ignorar
        if (e?.digest?.startsWith?.('NEXT_REDIRECT')) {
          toast.success(`${nome} eliminado`)
          throw e
        }
        toast.error(e?.message || 'Falha ao eliminar')
        setOpen(false)
      }
    })
  }

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={setOpen}
      title={`Eliminar ${nome}?`}
      description="Esta ação não pode ser revertida. Todos os pagamentos, documentos e registos associados serão removidos."
      confirmLabel={pending ? 'A eliminar…' : 'Eliminar'}
      onConfirm={handleConfirm}
      trigger={
        <button
          type="button"
          disabled={pending}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-all disabled:opacity-60 disabled:cursor-wait"
        >
          {pending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> A eliminar…
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" /> Eliminar
            </>
          )}
        </button>
      }
    />
  )
}
