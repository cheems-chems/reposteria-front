/*
  ============================================================================
  CÁLCULO DEL ENCARGO (FUNCIÓN PURA, COMPARTIBLE CON EL BACKEND FUTURO)
  ----------------------------------------------------------------------------
  El frontend usa estas funciones para mostrar un precio ESTIMADO en vivo.
  El backend recalculará lo mismo al crear el encargo: el total del cliente
  nunca es la autoridad. Los precios son enteros en COP, sin decimales.
  ============================================================================
*/

import type {
  OrderLine,
  PreparationOption,
  ProductListItem,
} from "@/lib/api";

/** Selección del armador de bandeja: cantidad y preparación por producto. */
export interface BuilderSelection {
  [slug: string]: { quantity: number; preparationId: string | null };
}

/** Precio por unidad = precio base + ajuste de la preparación elegida. */
export function unitPriceFor(
  basePrice: number,
  preparation?: PreparationOption | null,
): number {
  return basePrice + (preparation?.priceDelta ?? 0);
}

/** Resuelve la preparación efectiva (la elegida o la primera disponible). */
export function resolvePreparation(
  product: ProductListItem,
  preparationId?: string | null,
): PreparationOption | null {
  const options = product.preparations ?? [];
  if (options.length === 0) return null;
  return (
    options.find((option) => option.id === preparationId) ?? options[0] ?? null
  );
}

/** Convierte la selección del armador en líneas de encargo (ignora qty 0). */
export function buildLines(
  products: ProductListItem[],
  selection: BuilderSelection,
): OrderLine[] {
  const lines: OrderLine[] = [];
  for (const product of products) {
    const quantity = selection[product.slug]?.quantity ?? 0;
    if (quantity <= 0) continue;
    const preparation = resolvePreparation(
      product,
      selection[product.slug]?.preparationId,
    );
    lines.push({
      productSlug: product.slug,
      name: product.name,
      quantity,
      unitPrice: unitPriceFor(product.price, preparation),
      preparationId: preparation?.id ?? null,
      preparationLabel: preparation?.label ?? null,
    });
  }
  return lines;
}

/** Total (COP) de una línea. */
export function lineTotal(line: OrderLine): number {
  return line.unitPrice * line.quantity;
}

/** Unidades y total estimado de un conjunto de líneas. */
export function orderTotals(lines: OrderLine[]): {
  units: number;
  total: number;
} {
  return lines.reduce(
    (acc, line) => ({
      units: acc.units + line.quantity,
      total: acc.total + lineTotal(line),
    }),
    { units: 0, total: 0 },
  );
}

/**
 * Problemas de la selección del armador (vacío = todo válido). Cada producto
 * con cantidad > 0 debe respetar su mínimo y su paso.
 */
export function selectionProblems(
  products: ProductListItem[],
  selection: BuilderSelection,
): string[] {
  const problems: string[] = [];
  let anySelected = false;
  for (const product of products) {
    const quantity = selection[product.slug]?.quantity ?? 0;
    if (quantity <= 0) continue;
    anySelected = true;
    const min = product.pricing?.minQty ?? 1;
    const step = product.pricing?.stepQty ?? 1;
    if (quantity < min) {
      problems.push(`${product.name}: mínimo ${min} ${unitWord(product)}.`);
    } else if (step > 1 && quantity % step !== 0) {
      problems.push(
        `${product.name}: cantidades en múltiplos de ${step} ${unitWord(product)}.`,
      );
    }
  }
  if (!anySelected) problems.push("Elige al menos un pasaboca.");
  return problems;
}

function unitWord(product: ProductListItem): string {
  return product.pricing?.unitLabel ?? "unidades";
}
