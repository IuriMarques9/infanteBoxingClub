'use client'

import { useFormStatus } from 'react-dom'
import { Loader2, IdCard, Phone, HeartPulse, Target } from 'lucide-react'
import { salvarFicha } from './ficha-actions'

interface Ficha {
  cc_numero?: string | null
  nif?: string | null
  nacionalidade?: string | null
  morada?: string | null
  emergencia_nome?: string | null
  emergencia_parentesco?: string | null
  emergencia_data_nascimento?: string | null
  emergencia_cc?: string | null
  emergencia_nif?: string | null
  emergencia_nacionalidade?: string | null
  emergencia_morada?: string | null
  emergencia_telefone?: string | null
  doencas?: string | null
  medicacao?: string | null
  saude_observacoes?: string | null
  objetivo?: string | null
}

const inputCls = "w-full px-4 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm [color-scheme:dark]"
const labelCls = "text-xs font-medium text-white/50 uppercase tracking-wider"

function Field({ name, label, defaultValue, type = 'text', placeholder }: { name: string; label: string; defaultValue?: string | null; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className={labelCls}>{label}</label>
      <input id={name} name={name} type={type} defaultValue={defaultValue || ''} placeholder={placeholder} className={inputCls} />
    </div>
  )
}

function TextareaField({ name, label, defaultValue, placeholder, rows = 2 }: { name: string; label: string; defaultValue?: string | null; placeholder?: string; rows?: number }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className={labelCls}>{label}</label>
      <textarea id={name} name={name} defaultValue={defaultValue || ''} placeholder={placeholder} rows={rows} className={`${inputCls} resize-none`} />
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-xl bg-[#E8B55B] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#C99C4A] shadow-[0_0_15px_rgba(232,181,91,0.3)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (<><Loader2 className="w-4 h-4 animate-spin" /> A guardar…</>) : 'Guardar Ficha'}
    </button>
  )
}

function SectionHeader({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8B55B] border-b border-white/5 pb-2 mb-4">
      <Icon className="w-3.5 h-3.5" />
      {title}
    </div>
  )
}

export default function FichaClienteForm({ membroId, ficha }: { membroId: string; ficha: Ficha | null }) {
  const f = ficha || {}
  return (
    <form action={salvarFicha} className="space-y-8">
      <input type="hidden" name="membro_id" value={membroId} />

      <section>
        <SectionHeader icon={IdCard} title="Dados Pessoais" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field name="cc_numero" label="Cartão de Cidadão" defaultValue={f.cc_numero} />
          <Field name="nif" label="NIF" defaultValue={f.nif} />
          <Field name="nacionalidade" label="Nacionalidade" defaultValue={f.nacionalidade ?? 'Portuguesa'} />
          <Field name="morada" label="Morada" defaultValue={f.morada} placeholder="Rua, nº, CP, localidade" />
        </div>
      </section>

      <section>
        <SectionHeader icon={Phone} title="Contacto de Emergência" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field name="emergencia_nome" label="Nome Completo" defaultValue={f.emergencia_nome} />
          <Field name="emergencia_parentesco" label="Grau de Parentesco" defaultValue={f.emergencia_parentesco} placeholder="Mãe, Pai, Irmão…" />
          <Field name="emergencia_data_nascimento" label="Data de Nascimento" defaultValue={f.emergencia_data_nascimento} type="date" />
          <Field name="emergencia_telefone" label="Contacto Telefónico" defaultValue={f.emergencia_telefone} type="tel" />
          <Field name="emergencia_cc" label="Cartão de Cidadão" defaultValue={f.emergencia_cc} />
          <Field name="emergencia_nif" label="NIF" defaultValue={f.emergencia_nif} />
          <Field name="emergencia_nacionalidade" label="Nacionalidade" defaultValue={f.emergencia_nacionalidade} />
          <Field name="emergencia_morada" label="Morada" defaultValue={f.emergencia_morada} />
        </div>
      </section>

      <section>
        <SectionHeader icon={HeartPulse} title="Situação de Saúde" />
        <div className="space-y-4">
          <TextareaField name="doencas" label="Doenças / Problemas de Saúde" defaultValue={f.doencas} placeholder="Asma, diabetes, alergias…" />
          <TextareaField name="medicacao" label="Medicação (deixar vazio se não toma)" defaultValue={f.medicacao} placeholder="Se toma, indica qual" />
          <TextareaField name="saude_observacoes" label="Observações" defaultValue={f.saude_observacoes} />
        </div>
      </section>

      <section>
        <SectionHeader icon={Target} title="Objetivo" />
        <TextareaField name="objetivo" label="Qual o objetivo de frequentar a aula?" defaultValue={f.objetivo} rows={3} />
      </section>

      <SubmitButton />
    </form>
  )
}
