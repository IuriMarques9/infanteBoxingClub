'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  UserPlus, Loader2, Trash2, KeyRound, Mail, X,
  ShieldCheck, Clock, Pencil, Check,
} from 'lucide-react'
import { criarAdmin, eliminarAdmin, reporPassword, atualizarNomeAdmin, type AdminRow } from './actions'
import { formatRelativeTime } from '@/lib/activity-log-labels'
import ConfirmDeleteDialog from '@/components/dashboard/ConfirmDeleteDialog'

export default function AdminsListClient({ admins, currentId }: { admins: AdminRow[]; currentId: string | null }) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [resetTarget, setResetTarget] = useState<AdminRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminRow | null>(null)
  const [editingNomeId, setEditingNomeId] = useState<string | null>(null)
  const [nomeInput, setNomeInput] = useState('')
  const [pending, start] = useTransition()

  async function handleCreate(formData: FormData) {
    start(async () => {
      const res = await criarAdmin(formData)
      if (res.error) {
        toast.error(res.error)
      } else {
        const email = (formData.get('email') as string || '').trim()
        toast.success(`Convite enviado para ${email}`)
        setShowCreate(false)
        router.refresh()
      }
    })
  }

  function handleDeleteClick(admin: AdminRow) {
    if (admin.id === currentId) {
      toast.error('Não podes eliminar a tua própria conta.')
      return
    }
    setDeleteTarget(admin)
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    start(async () => {
      const fd = new FormData()
      fd.append('id', deleteTarget.id)
      const res = await eliminarAdmin(fd)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Administrador eliminado')
        setDeleteTarget(null)
        router.refresh()
      }
    })
  }

  async function handleResetPassword() {
    if (!resetTarget) return
    start(async () => {
      const fd = new FormData()
      fd.append('id', resetTarget.id)
      const res = await reporPassword(fd)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`Email de reposição enviado para ${resetTarget.email}`)
        setResetTarget(null)
        router.refresh()
      }
    })
  }

  function startEditNome(admin: AdminRow) {
    setEditingNomeId(admin.id)
    setNomeInput(admin.nome || '')
  }

  async function handleSaveNome(adminId: string) {
    start(async () => {
      const fd = new FormData()
      fd.append('id', adminId)
      fd.append('nome', nomeInput)
      const res = await atualizarNomeAdmin(fd)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Nome atualizado')
        setEditingNomeId(null)
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
                  {/* Email + "Tu" badge */}
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

                  {/* Nome (editável inline) */}
                  {editingNomeId === a.id ? (
                    <div className="flex items-center gap-2 mt-1.5">
                      <input
                        autoFocus
                        type="text"
                        value={nomeInput}
                        onChange={e => setNomeInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSaveNome(a.id)
                          if (e.key === 'Escape') setEditingNomeId(null)
                        }}
                        placeholder="Nome de apresentação"
                        className="flex-1 px-2.5 py-1 bg-[#1A1A1A] text-white text-sm border border-[#E8B55B]/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E8B55B] placeholder:text-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveNome(a.id)}
                        disabled={pending}
                        className="w-7 h-7 rounded-lg bg-[#E8B55B]/15 border border-[#E8B55B]/30 text-[#E8B55B] flex items-center justify-center hover:bg-[#E8B55B]/25 disabled:opacity-50"
                        title="Guardar"
                      >
                        {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingNomeId(null)}
                        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white/50 flex items-center justify-center hover:bg-white/10"
                        title="Cancelar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-0.5 group/nome">
                      <span className={`text-sm font-medium ${a.nome ? 'text-white/80' : 'text-white/25 italic'}`}>
                        {a.nome || '(sem nome)'}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEditNome(a)}
                        className="w-5 h-5 rounded text-white/30 hover:text-[#E8B55B] flex items-center justify-center opacity-0 group-hover/nome:opacity-100 transition-opacity"
                        title="Editar nome"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Meta: último login, data de criação */}
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
                    onClick={() => handleDeleteClick(a)}
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

      {/* ConfirmDeleteDialog para eliminar admin */}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={open => { if (!open) setDeleteTarget(null) }}
        title={`Eliminar "${deleteTarget?.nome || deleteTarget?.email}"?`}
        description="A conta perderá acesso imediato à dashboard. O histórico de atividade é preservado."
        onConfirm={handleDeleteConfirm}
      />

      {/* Dialog: criar admin */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => !pending && setShowCreate(false)}>
          <div className="bg-[#121212] border border-[#E8B55B]/20 rounded-2xl shadow-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-headline font-bold text-[#E8B55B] tracking-wider">Convidar Administrador</h3>
                <p className="text-white/50 text-xs mt-1">Vai receber um email para definir a password e ativar a conta.</p>
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
                <p className="text-[10px] text-white/30 mt-1">A conta fica ativa quando a pessoa definir a password pelo link no email.</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} disabled={pending} className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5">
                  Cancelar
                </button>
                <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#E8B55B] hover:bg-[#C99C4A] disabled:opacity-50">
                  {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Enviar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog: enviar email de reposição de password */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => !pending && setResetTarget(null)}>
          <div className="bg-[#121212] border border-sky-500/20 rounded-2xl shadow-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-300 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-headline font-bold text-sky-300 tracking-wider">Reposição de Password</h3>
                  <p className="text-white/50 text-xs mt-1 truncate">Para <span className="text-white/80 font-medium">{resetTarget.email}</span></p>
                </div>
              </div>
              <button type="button" onClick={() => !pending && setResetTarget(null)} aria-label="Fechar" className="w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/5 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-2">
              Vai ser enviado um email com um link seguro para o administrador definir uma nova password.
            </p>
            <p className="text-white/40 text-xs leading-relaxed mb-5">
              O link expira automaticamente. Tu não vês a nova password — só o próprio administrador a define.
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setResetTarget(null)} disabled={pending} className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5">
                Cancelar
              </button>
              <button type="button" onClick={handleResetPassword} disabled={pending} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-50">
                {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                Enviar Email
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
