'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  UserPlus, Loader2, Trash2, KeyRound, Mail, X,
  ShieldCheck, Clock,
} from 'lucide-react'
import { criarAdmin, eliminarAdmin, reporPassword, type AdminRow } from './actions'
import { formatRelativeTime } from '@/lib/activity-log-labels'

export default function AdminsListClient({ admins, currentId }: { admins: AdminRow[]; currentId: string | null }) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [resetTarget, setResetTarget] = useState<AdminRow | null>(null)
  const [pending, start] = useTransition()

  async function handleCreate(formData: FormData) {
    start(async () => {
      const res = await criarAdmin(formData)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Administrador criado')
        setShowCreate(false)
        router.refresh()
      }
    })
  }

  async function handleDelete(admin: AdminRow) {
    if (admin.id === currentId) {
      toast.error('Não podes eliminar a tua própria conta.')
      return
    }
    if (!window.confirm(`Eliminar o administrador "${admin.email}"?\nA conta perderá acesso à dashboard.`)) return
    start(async () => {
      const fd = new FormData()
      fd.append('id', admin.id)
      const res = await eliminarAdmin(fd)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Administrador eliminado')
        router.refresh()
      }
    })
  }

  async function handleResetPassword(formData: FormData) {
    start(async () => {
      const res = await reporPassword(formData)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Password atualizada')
        setResetTarget(null)
        router.refresh()
      }
    })
  }

  return (
    <>
      <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
            {admins.length} administrador{admins.length !== 1 ? 'es' : ''}
          </p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8B55B] text-black text-xs font-bold uppercase tracking-widest hover:bg-[#C99C4A] shadow-[0_0_15px_rgba(232,181,91,0.3)] transition-all"
          >
            <UserPlus className="w-4 h-4" /> Novo Admin
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {admins.length === 0 ? (
            <p className="p-12 text-center text-white/30 italic">Nenhum administrador registado.</p>
          ) : (
            admins.map(a => (
              <div key={a.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="w-11 h-11 rounded-full bg-[#E8B55B]/10 border border-[#E8B55B]/30 flex items-center justify-center text-[#E8B55B] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-medium truncate flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-white/40" />
                      {a.email}
                    </p>
                    {a.id === currentId && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E8B55B]/15 text-[#E8B55B] border border-[#E8B55B]/30">
                        Tu
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-[11px] mt-1 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {a.last_sign_in_at ? `Último login ${formatRelativeTime(a.last_sign_in_at)}` : 'Nunca fez login'}
                    </span>
                    <span>·</span>
                    <span>Conta criada em {new Date(a.created_at).toLocaleDateString('pt-PT')}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setResetTarget(a)}
                    disabled={pending}
                    title="Repor password"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sky-300 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-all disabled:opacity-40"
                  >
                    <KeyRound className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(a)}
                    disabled={pending || a.id === currentId}
                    title={a.id === currentId ? 'Não podes eliminar a tua própria conta' : 'Eliminar admin'}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-red-300 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dialog: criar admin */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => !pending && setShowCreate(false)}>
          <div className="bg-[#121212] border border-[#E8B55B]/20 rounded-2xl shadow-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-headline font-bold text-[#E8B55B] tracking-wider">Novo Administrador</h3>
                <p className="text-white/50 text-xs mt-1">A conta é criada confirmada — pode entrar logo.</p>
              </div>
              <button type="button" onClick={() => !pending && setShowCreate(false)} aria-label="Fechar" className="w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/5 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form action={handleCreate} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  autoFocus
                  placeholder="exemplo@infante.pt"
                  className="w-full px-3 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Password (mín. 8)</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-3 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm"
                />
                <p className="text-[10px] text-white/30 mt-1">Comunica-a com segurança ao novo admin — ele pode mudar depois.</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} disabled={pending} className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5">
                  Cancelar
                </button>
                <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#E8B55B] hover:bg-[#C99C4A] disabled:opacity-50">
                  {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog: repor password */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => !pending && setResetTarget(null)}>
          <div className="bg-[#121212] border border-sky-500/20 rounded-2xl shadow-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-headline font-bold text-sky-300 tracking-wider">Repor Password</h3>
                <p className="text-white/50 text-xs mt-1 truncate">Para <span className="text-white/80 font-medium">{resetTarget.email}</span></p>
              </div>
              <button type="button" onClick={() => !pending && setResetTarget(null)} aria-label="Fechar" className="w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/5 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form action={handleResetPassword} className="space-y-4">
              <input type="hidden" name="id" value={resetTarget.id} />
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Nova password (mín. 8)</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  autoFocus
                  className="w-full px-3 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setResetTarget(null)} disabled={pending} className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5">
                  Cancelar
                </button>
                <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-50">
                  {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Atualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
