// ─── CSV UTILITY ────────────────────────────────────────────────
// Converte um array de objetos num CSV compatível com Excel/Sheets.
// Faz escaping correto de valores com vírgulas, aspas ou newlines.
export function toCSV<T extends Record<string, any>>(
  rows: T[],
  headers: { key: keyof T; label: string }[]
): string {
  const escape = (value: any): string => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const headerLine = headers.map(h => escape(h.label)).join(',');
  const bodyLines = rows.map(row => headers.map(h => escape(row[h.key])).join(','));
  return [headerLine, ...bodyLines].join('\r\n');
}
