/*
  ============================================================================
  CÁLCULO DEL ENCARGO (FUNCIÓN PURA, COMPARTIBLE CON EL BACKEND FUTURO)
  ----------------------------------------------------------------------------
  El frontend usa estas funciones para mostrar un precio ESTIMADO en vivo.
  El backend recalculará lo mismo al crear el encargo: el total del cliente
  nunca es la autoridad. Los precios son enteros en COP, sin decimales.

  Cubre los cuatro modos de venta: single, combo (editable), builder y pack.
  ============================================================================
*/

import type {
  BuilderItemProduct,
  ComboProduct,
  CompositionDisplay,
  OrderLine,
  PackProduct,
  PreparationOption,
  ProductListItem,
  SingleProduct,
} from "@/lib/api";

/** Selección por ítem: cantidad y preparación (esta última opcional). */
export interface BuilderSelection {
  [slug: string]: { quantity: number; preparationId: string | null };
}

/** Cantidad de bandejas por producto: `{ [packSlug]: númeroDeBandejas }`. */
export type PackSelection = Record<string, number>;

/* --- Preparación (soporte conservado; hoy ningún producto lo usa) ---------- */

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

/* --- Tipo de venta de una categoría ---------------------------------------- */

/**
 * Cómo se vende una categoría, derivado de sus productos vendibles (los ítems
 * de armador, `saleMode` "builder", nunca se listan). Las categorías del
 * catálogo son homogéneas; si llega una mezcla se trata como "single".
 */
export type CategorySaleKind = "single" | "combo" | "pack" | "empty";

export function categorySaleKind(
  products: ProductListItem[],
): CategorySaleKind {
  const sellable = products.filter((product) => product.saleMode !== "builder");
  if (sellable.length === 0) return "empty";
  const uniform = sellable.every(
    (product) => product.saleMode === sellable[0].saleMode,
  );
  if (!uniform) return "single";
  const mode = sellable[0].saleMode;
  return mode === "single" || mode === "combo" || mode === "pack"
    ? mode
    : "empty";
}

/** Precio a mostrar de un producto: unitario en ítems de armador, fijo si no. */
export function productPrice(product: ProductListItem): number {
  return product.saleMode === "builder" ? product.unitPrice : product.price;
}

/** Rótulo legible del tipo de venta para tarjetas: "Combo · 60 unidades". */
export function productTypeLabel(product: ProductListItem): string | null {
  switch (product.saleMode) {
    case "combo":
      return `Combo · ${product.totalUnits} ${
        product.totalUnits === 1 ? "unidad" : "unidades"
      }`;
    case "pack":
      return `Bandeja · ${product.unitsPerPack} ${
        product.unitsPerPack === 1 ? "unidad" : "unidades"
      }`;
    default:
      return null;
  }
}

/* --- Modo "single" --------------------------------------------------------- */

/** Línea de un producto de precio fijo (una sola pieza por defecto). */
export function singleLine(
  product: SingleProduct,
  quantity = 1,
): OrderLine {
  return {
    kind: "single",
    productSlug: product.slug,
    name: product.name,
    quantity,
    unitPrice: product.price,
  };
}

/* --- Modo "combo" (predefinido y editable) --------------------------------- */

/** Selección inicial de un combo: su composición. */
export function comboQuantitiesOf(
  combo: ComboProduct,
): PackSelection {
  const quantities: PackSelection = {};
  for (const item of combo.composition) {
    quantities[item.productSlug] = item.quantity;
  }
  return quantities;
}

/** Ítems que se pueden redistribuir (allowedItems o, por defecto, composición). */
export function comboAllowedSlugs(combo: ComboProduct): string[] {
  if (combo.allowedItems && combo.allowedItems.length > 0) {
    return combo.allowedItems;
  }
  return combo.composition.map((item) => item.productSlug);
}

export interface ComboFill {
  /** Unidades elegidas. */
  units: number;
  /** Unidades del combo. */
  totalUnits: number;
  /** Cuántas faltan (0 si no falta ninguna). */
  missing: number;
  /** Cuántas sobran (0 si no sobran). */
  excess: number;
  /** true si units === totalUnits. */
  matches: boolean;
}

/** Estado del editor de un combo: total elegido vs. total del combo. */
export function comboFill(
  combo: ComboProduct,
  selection: PackSelection,
): ComboFill {
  const units = comboAllowedSlugs(combo).reduce(
    (acc, slug) => acc + (selection[slug] ?? 0),
    0,
  );
  const diff = combo.totalUnits - units;
  return {
    units,
    totalUnits: combo.totalUnits,
    missing: diff > 0 ? diff : 0,
    excess: diff < 0 ? -diff : 0,
    matches: diff === 0,
  };
}

function nameOf(
  items: BuilderItemProduct[],
  slug: string,
): string {
  return items.find((item) => item.slug === slug)?.name ?? slug;
}

/** Contenido final del combo, resuelto a nombres (solo cantidades > 0). */
export function comboCompositionDisplay(
  combo: ComboProduct,
  selection: PackSelection,
  items: BuilderItemProduct[],
): CompositionDisplay[] {
  return comboAllowedSlugs(combo)
    .map((slug) => ({ name: nameOf(items, slug), quantity: selection[slug] ?? 0 }))
    .filter((item) => item.quantity > 0);
}

/** Línea de un combo con su contenido final y el precio fijo. */
export function comboOrderLine(
  combo: ComboProduct,
  selection: PackSelection,
  items: BuilderItemProduct[],
): OrderLine {
  return {
    kind: "combo",
    productSlug: combo.slug,
    name: combo.name,
    totalUnits: combo.totalUnits,
    total: combo.price,
    composition: comboCompositionDisplay(combo, selection, items),
  };
}

/* --- Modo "builder" (arma el tuyo desde cero) ------------------------------ */

/** Líneas de los ítems elegidos (cantidad > 0). */
export function buildBuilderLines(
  items: BuilderItemProduct[],
  selection: BuilderSelection,
): OrderLine[] {
  const lines: OrderLine[] = [];
  for (const item of items) {
    const quantity = selection[item.slug]?.quantity ?? 0;
    if (quantity <= 0) continue;
    const preparation = resolvePreparation(
      item,
      selection[item.slug]?.preparationId,
    );
    lines.push({
      kind: "builder",
      productSlug: item.slug,
      name: item.name,
      quantity,
      unitPrice: unitPriceFor(item.unitPrice, preparation),
    });
  }
  return lines;
}

/** Total de unidades elegidas en el armador. */
export function builderUnitCount(selection: BuilderSelection): number {
  return Object.values(selection).reduce(
    (acc, entry) => acc + Math.max(0, entry.quantity),
    0,
  );
}

/** Problemas del armador (vacío = válido): debe alcanzar el mínimo. */
export function builderProblems(
  selection: BuilderSelection,
  minTotalUnits: number,
): string[] {
  const units = builderUnitCount(selection);
  if (units <= 0) return ["Elige al menos un pasaboca."];
  if (units < minTotalUnits) {
    const missing = minTotalUnits - units;
    return [
      `Te faltan ${missing} ${missing === 1 ? "unidad" : "unidades"} para el ` +
        `mínimo de ${minTotalUnits}.`,
    ];
  }
  return [];
}

/* --- Modo "pack" (bandejas) ------------------------------------------------ */

/** Líneas de las bandejas elegidas (número de bandejas > 0). */
export function buildPackLines(
  packs: PackProduct[],
  selection: PackSelection,
): OrderLine[] {
  const lines: OrderLine[] = [];
  for (const pack of packs) {
    const packCount = selection[pack.slug] ?? 0;
    if (packCount <= 0) continue;
    lines.push({
      kind: "pack",
      productSlug: pack.slug,
      name: pack.name,
      packCount,
      unitsPerPack: pack.unitsPerPack,
      unitPrice: pack.price,
    });
  }
  return lines;
}

/* --- Totales --------------------------------------------------------------- */

/** Total (COP) de una línea. */
export function lineTotal(line: OrderLine): number {
  switch (line.kind) {
    case "single":
      return line.unitPrice * line.quantity;
    case "combo":
      return line.total;
    case "builder":
      return line.unitPrice * line.quantity;
    case "pack":
      return line.unitPrice * line.packCount;
  }
}

/** Unidades que representa una línea (para el total del encargo). */
export function lineUnits(line: OrderLine): number {
  switch (line.kind) {
    case "single":
    case "builder":
      return line.quantity;
    case "combo":
      return line.totalUnits;
    case "pack":
      return line.packCount * line.unitsPerPack;
  }
}

/** Unidades y total estimado de un conjunto de líneas. */
export function orderTotals(lines: OrderLine[]): {
  units: number;
  total: number;
} {
  let units = 0;
  let total = 0;
  for (const line of lines) {
    total += lineTotal(line);
    units += lineUnits(line);
  }
  return { units, total };
}

/* --- Línea de encargo desde un producto del catálogo ----------------------- */

/**
 * Convierte un producto vendible en UNA línea de encargo (para "Agregar al
 * encargo" desde tarjetas y fichas). Los ítems de armador (`saleMode`
 * "builder") no se venden solos: devuelve `null` y se resuelven en el flujo de
 * /encargo.
 *
 * - `single`: una pieza.
 * - `combo`: combo con su composición de fábrica (nombres resueltos si se
 *   pasan los ítems de armador).
 * - `pack`: una bandeja (respetando `minPacks`).
 */
export function orderLineForProduct(
  product: ProductListItem,
  comboItems: BuilderItemProduct[] = [],
): OrderLine | null {
  switch (product.saleMode) {
    case "single":
      return singleLine(product, 1);
    case "combo":
      return comboOrderLine(product, comboQuantitiesOf(product), comboItems);
    case "pack":
      return (
        buildPackLines([product], {
          [product.slug]: Math.max(1, product.minPacks),
        })[0] ?? null
      );
    case "builder":
      return null;
  }
}
