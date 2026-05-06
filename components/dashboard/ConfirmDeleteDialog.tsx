'use client'

import * as React from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// ─── DIÁLOGO DE CONFIRMAÇÃO PARA AÇÕES IRREVERSÍVEIS ────────────
// Wrapper sobre AlertDialog do shadcn já alinhado ao tema dark.
// Garante o copy padrão "Esta ação não pode ser revertida." e
// botão de confirmação a vermelho em todas as eliminações.
//
// Modos:
//   • controlado: passar `open` + `onOpenChange` (sem `trigger`)
//   • não controlado: passar `trigger` (botão) e o componente
//     gere o estado internamente.

interface Props {
  title: string
  description?: React.ReactNode
  confirmLabel?: string
  pendingLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function ConfirmDeleteDialog({
  title,
  description = 'Esta ação não pode ser revertida.',
  confirmLabel = 'Eliminar',
  pendingLabel = 'A eliminar…',
  cancelLabel = 'Cancelar',
  onConfirm,
  trigger,
  open,
  onOpenChange,
}: Props) {
  const [pending, setPending] = React.useState(false)
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            className="disabled:opacity-60 disabled:cursor-wait"
            onClick={async (e) => {
              e.preventDefault()
              if (pending) return
              setPending(true)
              try {
                await onConfirm()
              } finally {
                // Em redirects o componente é unmount, mas mantemos
                // o reset para casos onde a action volta sem redirect.
                setPending(false)
              }
            }}
          >
            {pending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> {pendingLabel}
              </span>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
