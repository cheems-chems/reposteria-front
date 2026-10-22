import { alturas, maxPisos, moldes } from "@/content/torta-personalizada";

export type Piso = { molde: string };
const moldesPorId = new Map<string, (typeof moldes)[number]>(moldes.map((molde) => [molde.id, molde]));

export function normalizarPisos(pisos: Piso[]): Piso[] {
  const result: Piso[] = [];
  for (const piso of pisos.slice(0, maxPisos)) {
    const molde = moldesPorId.get(piso.molde);
    if (!molde) continue;
    const ordenInferior = result.length ? moldesPorId.get(result[result.length - 1].molde)!.orden : Infinity;
    const permitido = molde.orden <= ordenInferior ? molde : moldes.find((item) => item.orden === ordenInferior)!;
    result.push({ molde: permitido.id });
  }
  return result;
}

export function precioMinimoTorta(): number { return moldes[0].price; }
export function moldesPermitidos(moldeDeAbajo?: string) {
  if (!moldeDeAbajo) return [...moldes];
  const base = moldesPorId.get(moldeDeAbajo);
  return base ? moldes.filter((molde) => molde.orden <= base.orden) : [];
}
// CONFIRMAR con Elvi: si los pisos llevan recargo, cambiar aquí.
export function calcularEstimado(pisos: Piso[]): number {
  return normalizarPisos(pisos).reduce((total, piso) => total + (moldesPorId.get(piso.molde)?.price ?? 0), 0);
}
export function esTortaValida(pisos: Piso[]): boolean {
  const normalizados = normalizarPisos(pisos);
  return pisos.length > 0 && normalizados.length === pisos.length && normalizados.every((piso, i) => piso.molde === pisos[i].molde);
}
export function armarMensajeWhatsApp(pisos: Piso[], estimado: number): string {
  const normalizados = normalizarPisos(pisos);
  const lista = normalizados.map((piso, i) => `Piso ${i + 1}${i === 0 ? " (abajo)" : i === normalizados.length - 1 ? " (arriba)" : ""}: ${moldesPorId.get(piso.molde)?.label}`).join("\n");
  const formato = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(estimado);
  return `Hola Elvi, quiero cotizar una torta personalizada:\n${lista}\nEstimado: desde $${formato} COP.\n¿Me ayudas a definir el diseño, los colores y la decoración?`;
}
export function geometriaPisos(pisos: Piso[], anchoMax: number, alto: number) {
  return normalizarPisos(pisos).map((piso) => {
    const molde = moldesPorId.get(piso.molde)!;
    return {
      molde: molde.id,
      label: molde.label,
      ancho: anchoMax * molde.diametroRelativo,
      alto,
    };
  });
}

export { alturas, moldes, maxPisos };
