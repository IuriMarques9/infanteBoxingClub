// ─── HELPERS DE ESTADO DO MEMBRO ──────────────────────────────
// Regras centralizadas (ano civil Jan-Dez):
//   - Seguro: válido se `seguro_ano_pago === anoAtual()` (reset a 1 de Jan).
//   - Inspeção Médica: derivada do upload de document_metadata com
//     categoria 'inspecao_medica' — ver callsite do perfil.
//   - Membro Inativo: não é isento E não pagou o mês atual nem o anterior.

export function anoAtual(): number {
  return new Date().getFullYear()
}

export function mesRefAtual(): string {
  return new Date().toISOString().slice(0, 7)
}

export function mesRefAnterior(): string {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth() - 1, 1).toISOString().slice(0, 7)
}

export function seguroAtivo(m: { seguro_ano_pago?: number | null }): boolean {
  return m.seguro_ano_pago === anoAtual()
}

export function membroInativo(
  m: { is_isento?: boolean | null },
  mesesPagos: string[],
): boolean {
  if (m.is_isento) return false
  const atual = mesRefAtual()
  const anterior = mesRefAnterior()
  return !mesesPagos.includes(atual) && !mesesPagos.includes(anterior)
}

// Calcula a idade em anos a partir da data de nascimento (formato ISO ou Date).
// Devolve null se a data for inválida ou inexistente.
export function calcularIdade(dataNascimento?: string | null): number | null {
  if (!dataNascimento) return null
  const nasc = new Date(dataNascimento)
  if (isNaN(nasc.getTime())) return null
  const hoje = new Date()
  let idade = hoje.getFullYear() - nasc.getFullYear()
  const m = hoje.getMonth() - nasc.getMonth()
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--
  return idade
}
