/*
  ============================================================================
  "MI ENCARGO" — CARRITO SIN PAGO (FUNCIÓN PURA + PERSISTENCIA EN NAVEGADOR)
  ----------------------------------------------------------------------------
  El encargo se guarda SOLO en el navegador (localStorage) y se envía por
  WhatsApp. No hay cuenta, ni pago, ni pasarela. Reutiliza el cálculo de
  ./encargo.ts y el mensaje sigue el mismo tono que el flujo de /encargo.

  Una línea del catálogo se agrega como UNA línea del encargo:
    - single  -> una pieza (cantidad editable en el panel).
    - combo   -> un combo de precio fijo.
    - pack    -> una bandeja (respeta el mínimo de bandejas).
  Los ítems de armador (saleMode "builder") no se agregan solos: se arman en
  /encargo.
  ============================================================================
*/

import type { OrderLine } from "@/lib/api";
import { lineTotal, lineUnits } from "@/lib/encargo";
import { formatCOP } from "@/lib/format";

export const CART_STORAGE_KEY = "elvis-encargo-v1";

/** Cantidad máxima por línea, para evitar entradas absurdas. */
export const CART_MAX_QUANTITY = 99;

/** Una línea del carrito: la línea de encargo + cuántas veces se repite. */
export interface CartItem {
  /** Identidad estable: `kind:productSlug`. */
  id: string;
  line: OrderLine;
  quantity: number;
}

/** Identidad de una línea de encargo (una por producto y tipo de venta). */
export function lineId(line: OrderLine): string {
  return `${line.kind}:${line.productSlug}`;
}

/** Total estimado (COP) de un ítem del carrito. */
export function itemTotal(item: CartItem): number {
  return lineTotal(item.line) * item.quantity;
}

/** Unidades y total estimado de todo el carrito. */
export function cartTotals(items: CartItem[]): {
  units: number;
  total: number;
} {
  let units = 0;
  let total = 0;
  for (const item of items) {
    total += itemTotal(item);
    units += lineUnits(item.line) * item.quantity;
  }
  return { units, total };
}

/** Número total de ítems (para el contador de la bolsa). */
export function cartCount(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}

/** Detalle corto de la línea, sin la cantidad: "60 unidades", "10 u. c/u". */
export function itemDescription(item: CartItem): string | null {
  switch (item.line.kind) {
    case "combo":
      return `${item.line.totalUnits} unidades`;
    case "pack":
      return `${item.line.unitsPerPack} u. por bandeja`;
    default:
      return null;
  }
}

/** Etiqueta de cantidad del ítem: "2 combos", "3 bandejas", "×2". */
export function itemQuantityLabel(item: CartItem): string {
  const n = item.quantity;
  if (item.line.kind === "combo") return `${n} ${n === 1 ? "combo" : "combos"}`;
  if (item.line.kind === "pack") return `${n} ${n === 1 ? "bandeja" : "bandejas"}`;
  return `×${n}`;
}

/** Mensaje de WhatsApp con el encargo listo (mismo tono que /encargo). */
export function buildCartMessage(items: CartItem[]): string {
  const lines = ["¡Hola! Quiero hacer un encargo:", ""];
  for (const item of items) {
    const line = item.line;
    switch (line.kind) {
      case "combo": {
        lines.push(
          `- ${line.name} · ${line.totalUnits} unidades ×${item.quantity} — ${formatCOP(itemTotal(item))}`,
        );
        if (line.composition.length > 0) {
          lines.push(
            `  Composición: ${line.composition
              .map((part) => `${part.name} ${part.quantity}`)
              .join(", ")}`,
          );
        }
        break;
      }
      case "pack":
        lines.push(
          `- ${line.name} (${line.packCount * line.unitsPerPack} u.) ×${item.quantity} — ${formatCOP(itemTotal(item))}`,
        );
        break;
      case "builder":
        lines.push(
          `- ${line.name} ×${line.quantity} — ${formatCOP(itemTotal(item))}`,
        );
        break;
      case "single":
        lines.push(`- ${line.name} ×${item.quantity} — ${formatCOP(itemTotal(item))}`);
        break;
    }
  }
  const totals = cartTotals(items);
  if (totals.units > 0) lines.push("", `Unidades totales: ${totals.units}`);
  lines.push(
    `Precio estimado: ${formatCOP(totals.total)} (confirmamos el valor final)`,
  );
  return lines.join("\n");
}

/* --- Persistencia (tolerante a fallos) ------------------------------------- */

/** Parsea el JSON guardado y descarta entradas que no tengan forma válida. */
export function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const items: CartItem[] = [];
    for (const entry of data) {
      if (!entry || typeof entry !== "object") continue;
      const { id, line, quantity } = entry as Partial<CartItem>;
      if (
        typeof id !== "string" ||
        typeof quantity !== "number" ||
        !Number.isFinite(quantity) ||
        quantity <= 0 ||
        !isOrderLine(line)
      ) {
        continue;
      }
      items.push({
        id,
        line,
        quantity: Math.min(CART_MAX_QUANTITY, Math.max(1, Math.floor(quantity))),
      });
    }
    return items;
  } catch {
    return [];
  }
}

/** Serializa el carrito para guardarlo (nunca lanza). */
export function serializeCart(items: CartItem[]): string {
  return JSON.stringify(items);
}

/** Validación mínima de que un valor es una línea de encargo. */
function isOrderLine(value: unknown): value is OrderLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Partial<OrderLine> & { kind?: unknown };
  return (
    typeof line.productSlug === "string" &&
    typeof line.name === "string" &&
    (line.kind === "single" ||
      line.kind === "combo" ||
      line.kind === "builder" ||
      line.kind === "pack")
  );
}
