'use client'

import { useFormStatus } from 'react-dom'
import { useState } from 'react'
import { Loader2, IdCard, Phone, HeartPulse, Target, AlertCircle } from 'lucide-react'
import { salvarFicha } from './ficha-actions'
import { validateCC, validateNIF, validatePhonePT } from '@/lib/validators'

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

const inputCls = "w-full px-4 py-2.5 bg-[#1A1A1A] text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm [color-scheme:dark]"
const labelCls = "text-xs font-medium text-white/50 uppercase tracking-wider"

// Campos com validação PT — ID do campo → função de validação.
const VALIDATORS: Record<string, (v: string) => string | null> = {
  cc_numero:        validateCC,
  emergencia_cc:    validateCC,
  nif:              validateNIF,
  emergencia_nif:   validateNIF,
  emergencia_telefone: validatePhonePT,
}

function ValidatedField({
  name,
  label,
  defaultValue,
  type = 'text',
  placeholder,
  errors,
  setErrors,
}: {
  name: string
  label: string
  defaultValue?: string | null
  type?: string
  placeholder?: string
  errors: Record<string, string | null>
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string | null>>>
}) {
  const validator = VALIDATORS[name]
  const err = errors[name]

  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (!validator) return
    const result = validator(e.target.value)
    setErrors(prev => ({ ...prev, [name]: result }))
  }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Limpa o erro à medida que o utilizador escreve.
    if (err && validator) {
      const result = validator(e.target.value)
      if (!result) setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className={labelCls}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue || ''}
        placeholder={placeholder}
        onBlur={validator !== undefined ? onBlur : undefined}
        onChange={validator !== undefined ? onChange : undefined}
        aria-invalid={!!err}
        aria-describedby={err ? `${name}-err` : undefined}
        className={`${inputCls} ${err ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-[#333333]'}`}
      />
      {err && (
        <p id={`${name}-err`} className="text-red-400 text-[11px] flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" /> {err}
        </p>
      )}
    </div>
  )
}

function TextareaField({ name, label, defaultValue, placeholder, rows = 2 }: { name: string; label: string; defaultValue?: string | null; placeholder?: string; rows?: number }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className={labelCls}>{label}</label>
      <textarea id={name} name={name} defaultValue={defaultValue || ''} placeholder={placeholder} rows={rows} className={`${inputCls} border-[#333333] resize-none`} />
    </div>
  )
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || disabled}
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
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const hasErrors = Object.values(errors).some(Boolean)

  return (
    <form
      action={salvarFicha}
      onSubmit={e => {
        // Valida tudo antes de submeter — bloqueia se houver erros.
        const all: Record<string, string | null> = {}
        for (const [field, fn] of Object.entries(VALIDATORS)) {
          const input = (e.currentTarget.elements.namedItem(field) as HTMLInputElement | null)
          if (input) all[field] = fn(input.value)
        }
        setErrors(all)
        if (Object.values(all).some(Boolean)) e.preventDefault()
      }}
      className="space-y-8"
    >
      <input type="hidden" name="membro_id" value={membroId} />

      <section>
        <SectionHeader icon={IdCard} title="Dados Pessoais" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedField name="cc_numero" label="Cartão de Cidadão" defaultValue={f.cc_numero} errors={errors} setErrors={setErrors} />
          <ValidatedField name="nif" label="NIF" defaultValue={f.nif} errors={errors} setErrors={setErrors} />
          <ValidatedField name="nacionalidade" label="Nacionalidade" defaultValue={f.nacionalidade ?? 'Portuguesa'} errors={errors} setErrors={setErrors} />
          <ValidatedField name="morada" label="Morada" defaultValue={f.morada} placeholder="Rua, nº, CP, localidade" errors={errors} setErrors={setErrors} />
        </div>
      </section>

      <section>
        <SectionHeader icon={Phone} title="Contacto de Emergência" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedField name="emergencia_nome" label="Nome Completo" defaultValue={f.emergencia_nome} errors={errors} setErrors={setErrors} />
          <ValidatedField name="emergencia_parentesco" label="Grau de Parentesco" defaultValue={f.emergencia_parentesco} placeholder="Mãe, Pai, Irmão…" errors={errors} setErrors={setErrors} />
          <ValidatedField name="emergencia_data_nascimento" label="Data de Nascimento" defaultValue={f.emergencia_data_nascimento} type="date" errors={errors} setErrors={setErrors} />
          <ValidatedField name="emergencia_telefone" label="Contacto Telefónico" defaultValue={f.emergencia_telefone} type="tel" errors={errors} setErrors={setErrors} />
          <ValidatedField name="emergencia_cc" label="Cartão de Cidadão" defaultValue={f.emergencia_cc} errors={errors} setErrors={setErrors} />
          <ValidatedField name="emergencia_nif" label="NIF" defaultValue={f.emergencia_nif} errors={errors} setErrors={setErrors} />
          <ValidatedField name="emergencia_nacionalidade" label="Nacionalidade" defaultValue={f.emergencia_nacionalidade} errors={errors} setErrors={setErrors} />
          <ValidatedField name="emergencia_morada" label="Morada" defaultValue={f.emergencia_morada} errors={errors} setErrors={setErrors} />
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

      <SubmitButton disabled={hasErrors} />
    </form>
  )
}
