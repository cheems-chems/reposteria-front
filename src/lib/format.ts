const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formatea un entero de pesos colombianos: 45000 -> "$ 45.000".
 * El backend siempre envía enteros en COP.
 */
export function formatCOP(amount: number): string {
  return cop.format(amount);
}
