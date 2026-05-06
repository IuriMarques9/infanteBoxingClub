'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  PT, ES, FR, GB, DE, IT, NL, BE, CH, LU, IE, US, BR, AO, MZ, CV,
} from 'country-flag-icons/react/3x2'

// ─── INPUT DE TELEMÓVEL COM PREFIXO INTERNACIONAL ──────────────
// Combo box custom (botão + popover) com bandeiras SVG do
// `country-flag-icons`. Submete um único hidden input `name` com
// o valor combinado "+351 912345678" — server actions não mudam.

type FlagComponent = (props: { className?: string; title?: string }) => JSX.Element

const COUNTRY_CODES: { code: string; name: string; Flag: FlagComponent }[] = [
  { code: '+351', name: 'Portugal',         Flag: PT },
  { code: '+34',  name: 'Espanha',          Flag: ES },
  { code: '+33',  name: 'França',           Flag: FR },
  { code: '+44',  name: 'Reino Unido',      Flag: GB },
  { code: '+49',  name: 'Alemanha',         Flag: DE },
  { code: '+39',  name: 'Itália',           Flag: IT },
  { code: '+31',  name: 'Países Baixos',    Flag: NL },
  { code: '+32',  name: 'Bélgica',          Flag: BE },
  { code: '+41',  name: 'Suíça',            Flag: CH },
  { code: '+352', name: 'Luxemburgo',       Flag: LU },
  { code: '+353', name: 'Irlanda',          Flag: IE },
  { code: '+1',   name: 'EUA / Canadá',     Flag: US },
  { code: '+55',  name: 'Brasil',           Flag: BR },
  { code: '+244', name: 'Angola',           Flag: AO },
  { code: '+258', name: 'Moçambique',       Flag: MZ },
  { code: '+238', name: 'Cabo Verde',       Flag: CV },
]

const DEFAULT_PREFIX = '+351'

function parsePhone(value: string | null | undefined): { prefix: string; number: string } {
  if (!value) return { prefix: DEFAULT_PREFIX, number: '' }
  const trimmed = value.trim()
  // Casa pelo prefixo mais longo primeiro (ex: +351 antes de +35)
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length)
  for (const c of sorted) {
    if (trimmed.startsWith(c.code)) {
      return { prefix: c.code, number: trimmed.slice(c.code.length).trim() }
    }
  }
  return { prefix: DEFAULT_PREFIX, number: trimmed.replace(/^\+\d+\s*/, '').trim() }
}

export default function PhoneInput({
  name,
  defaultValue,
  placeholder = '912 345 678',
  required,
  disabled,
}: {
  name: string
  defaultValue?: string | null
  placeholder?: string
  required?: boolean
  disabled?: boolean
}) {
  const initial = parsePhone(defaultValue)
  const [prefix, setPrefix] = useState(initial.prefix)
  const [number, setNumber] = useState(initial.number)
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const selected = COUNTRY_CODES.find(c => c.code === prefix) ?? COUNTRY_CODES[0]
  const SelectedFlag = selected.Flag
  const combined = number.trim() ? `${prefix} ${number.trim()}` : ''

  return (
    <div className="flex gap-2">
      <div ref={wrapperRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setOpen(o => !o)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Indicativo: ${selected.name} ${selected.code}`}
          className="h-full flex items-center gap-2 px-3 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-w-[110px]"
        >
          <SelectedFlag className="w-5 h-auto rounded-sm shrink-0" title={selected.name} />
          <span className="font-medium">{selected.code}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-50 left-0 top-[calc(100%+4px)] min-w-[220px] max-h-72 overflow-auto bg-[#1A1A1A] border border-[#333333] rounded-xl shadow-2xl py-1"
          >
            {COUNTRY_CODES.map(c => {
              const isSelected = c.code === prefix
              const Flag = c.Flag
              return (
                <li key={c.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setPrefix(c.code)
                      setOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-white/5 ${isSelected ? 'bg-[#E8B55B]/10 text-[#E8B55B]' : 'text-white/80'}`}
                  >
                    <Flag className="w-5 h-auto rounded-sm shrink-0" title={c.name} />
                    <span className="flex-1 text-left truncate">{c.name}</span>
                    <span className="text-white/40 text-xs">{c.code}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <input
        type="tel"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="flex-1 min-w-0 px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm"
      />
      <input type="hidden" name={name} value={combined} />
    </div>
  )
}
