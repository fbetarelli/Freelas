export function formatDate(data: string): string {
  const [year, month, day] = data.split("-");
  return `${day}/${month}/${year}`;
}

export function formatValueToString(val: number): string {
  //formata numero para separar casas.
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export function formatValueToFloat(val: string): number {
  //retira os pontos EX: 12,99 para 12.99
  const temp = val.replace(/\./g, "");
  const final = temp.replace(/,/g, ".");
  return parseFloat(final);
}
