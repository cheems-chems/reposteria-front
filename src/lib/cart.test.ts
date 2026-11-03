import { describe, expect, it } from "vitest";
import { buildCartMessage, cartTotals, itemDescription } from "@/lib/cart";
import type { CartItem } from "@/lib/cart";
import { formatCOP } from "@/lib/format";

describe("unidad de venta en el carrito", () => {
  const cupcakes: CartItem = {
    id: "single:cupcakes",
    quantity: 3,
    line: {
      kind: "single",
      productSlug: "cupcakes",
      name: "Cupcakes",
      quantity: 1,
      unitPrice: 38000,
      unitLabel: "docena",
      unitCount: 12,
    },
  };

  it("muestra docenas en el cajón y en el mensaje de WhatsApp", () => {
    expect(itemDescription(cupcakes)).toBe("3 docenas · 12 unidades");
    expect(buildCartMessage([cupcakes])).toContain("Cupcakes · 3 docenas");
    expect(buildCartMessage([cupcakes])).toContain(formatCOP(114000));
    expect(cartTotals([cupcakes])).toEqual({ units: 36, total: 114000 });
  });
});
