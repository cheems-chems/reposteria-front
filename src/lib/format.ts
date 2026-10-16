const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// El backend siempre envía enteros en COP.
export function formatCOP(amount: number): string {
  return cop.format(amount);
}
