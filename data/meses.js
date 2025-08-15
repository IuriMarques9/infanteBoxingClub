export const meses = [
  { mes: "Janeiro", evento: true, },
  { mes: "Fevereiro", evento: true,},
  { mes: "Março", evento: false, },
  { mes: "Abril", evento: true, },
  { mes: "Maio", evento: true, },
  { mes: "Junho", evento: true, },
  { mes: "Julho", evento: true,  },
  { mes: "Agosto", evento: true, },
  { mes: "Setembro", evento: true, },
  { mes: "Outubro", evento: true,  },
  { mes: "Novembro", evento: true, },
  { mes: "Dezembro", evento: true,  },
];
const dataAtual = new Date();
export const mesAtual = meses[dataAtual.getMonth()];