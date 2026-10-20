// Carrito solo en navegador (localStorage), sin cuenta ni pago: se envía por WhatsApp.

import type { OrderLine } from "@/lib/api";
import { lineTotal, lineUnits } from "@/lib/encargo";
import { formatCOP } from "@/lib/format";

export const CART_STORAGE_KEY = "elvis-encargo-v1";

/** Cantidad máxima por línea, para evitar entradas absurdas. */
export const CART_MAX_QUANTITY = 99;

export interface CartItem {
  id: string;
  line: OrderLine;
  quantity: number;
}

export function lineId(line: OrderLine): string {
  return `${line.kind}:${line.productSlug}`;
}

export function itemTotal(item: CartItem): number {
  return lineTotal(item.line) * item.quantity;
}

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

export function cartCount(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}

export function itemDescription(item: CartItem): string | null {
  switch (item.line.kind) {
    case "combo":
      return item.line.customized
        ? `Combo personalizado · ${item.line.totalUnits} unidades`
        : `${item.line.totalUnits} unidades`;
    case "pack":
      return `${item.line.unitsPerPack} u. por bandeja`;
    default:
      return null;
  }
}

export function itemQuantityLabel(item: CartItem): string {
  const n = item.quantity;
  if (item.line.kind === "combo") return `${n} ${n === 1 ? "combo" : "combos"}`;
  if (item.line.kind === "pack") return `${n} ${n === 1 ? "bandeja" : "bandejas"}`;
  return `×${n}`;
}

// Mismo tono que el flujo de /encargo.
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
        if (line.customized) lines.push("  Combo personalizado");
        if (line.extraUnits && line.extraUnits > 0) {
          lines.push(
            `  Incluye ${line.extraUnits} ${
              line.extraUnits === 1 ? "unidad extra" : "unidades extra"
            }${
              line.extras && line.extras.length > 0
                ? `: ${line.extras
                    .map(
                      (extra) =>
                        `${extra.quantity} × ${extra.name} (${formatCOP(
                          extra.subtotal,
                        )})`,
                    )
                    .join(", ")}`
                : ""
            }`,
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

// Nunca lanza.
export function serializeCart(items: CartItem[]): string {
  return JSON.stringify(items);
}

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
