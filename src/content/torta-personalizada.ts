// Todos los precios son mínimos: se muestran como 'Desde'. El precio final se define por WhatsApp. DATOS DE ELVI.
export const moldes = [
  { id: "octavo-libra", label: "1/8 de libra", price: 35000, pesoRelativo: 1 / 8, diametroRelativo: Math.sqrt(1 / 8), orden: 1 },
  { id: "media-libra", label: "1/2 libra", price: 75000, pesoRelativo: 1 / 2, diametroRelativo: Math.sqrt(1 / 2), orden: 2 },
  { id: "una-libra", label: "1 libra", price: 95000, pesoRelativo: 1, diametroRelativo: Math.sqrt(1), orden: 3 },
] as const;

// CONFIRMAR con Elvi: diámetros reales en cm. Esta escala supone la misma altura en todos los moldes (el peso depende del área de la base).
// CONFIRMAR con Elvi: si dos pisos del mismo tamaño se pueden apilar.
export const maxPisos = 3;
// PENDIENTE: confirmar con Elvi las alturas y cuánto suben el precio.
export const alturas = { enabled: false, options: [] as { id: string; label: string; height: number }[] };
