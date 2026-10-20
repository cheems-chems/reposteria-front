import { describe, expect, it } from "vitest";

import {
  buildBuilderLines,
  buildPackLines,
  builderProblems,
  builderUnitCount,
  categorySaleKind,
  comboAllowedSlugs,
  comboFill,
  comboOrderLine,
  comboQuantitiesOf,
  calcularPrecioCombo,
  lineTotal,
  orderTotals,
  productPrice,
  productTypeLabel,
  resolvePreparation,
  singleLine,
  unitPriceFor,
  type BuilderSelection,
  type PackSelection,
} from "@/lib/encargo";
import type {
  BuilderItemProduct,
  ComboProduct,
  PackProduct,
  ProductListItem,
  SingleProduct,
} from "@/lib/api";

const TORTA: SingleProduct = {
  saleMode: "single",
  slug: "milhojas-de-guayaba",
  name: "Milhojas de guayaba",
  categorySlug: "tortas",
  categoryName: "Tortas",
  available: true,
  price: 45000,
};

const DEDITOS: BuilderItemProduct = {
  saleMode: "builder",
  comboItem: true,
  slug: "deditos",
  name: "Deditos",
  categorySlug: "combos",
  categoryName: "Combos",
  available: true,
  unitPrice: 1000,
  stepQty: 5,
};

const EMPANADAS: BuilderItemProduct = {
  ...DEDITOS,
  slug: "empanadas",
  name: "Empanadas",
  unitPrice: 1200,
};

const OJITOS: BuilderItemProduct = {
  ...DEDITOS,
  slug: "ojitos",
  name: "Ojitos",
  unitPrice: 900,
};

const BOLITAS: BuilderItemProduct = {
  ...DEDITOS,
  slug: "bolitas-de-carne",
  name: "Bolitas de carne",
  unitPrice: 1100,
};

const COMBO_ITEMS = [DEDITOS, EMPANADAS, OJITOS, BOLITAS];

const COMBO: ComboProduct = {
  saleMode: "combo",
  slug: "combo-1",
  name: "Combo 1",
  categorySlug: "combos",
  categoryName: "Combos",
  available: true,
  price: 43000,
  totalUnits: 60,
  editable: true,
  stepQty: 5,
  composition: [
    { productSlug: "deditos", quantity: 15 },
    { productSlug: "empanadas", quantity: 15 },
    { productSlug: "ojitos", quantity: 15 },
    { productSlug: "bolitas-de-carne", quantity: 15 },
  ],
};

const BANDEJA_QUESO: PackProduct = {
  saleMode: "pack",
  slug: "bandeja-deditos-de-queso",
  name: "Bandeja de deditos de queso",
  categorySlug: "bandejas",
  categoryName: "Bandejas",
  available: true,
  price: 25000,
  unitsPerPack: 10,
  minPacks: 1,
  stepPacks: 1,
};

const BANDEJA_BOCADILLO: PackProduct = {
  ...BANDEJA_QUESO,
  slug: "bandeja-deditos-de-bocadillo",
  name: "Bandeja de deditos de bocadillo",
  price: 24000,
};

const BANDEJAS = [BANDEJA_QUESO, BANDEJA_BOCADILLO];

describe("saleMode single", () => {
  it("hace una línea de precio fijo con cantidad por defecto 1", () => {
    const line = singleLine(TORTA);
    expect(line).toEqual({
      kind: "single",
      productSlug: "milhojas-de-guayaba",
      name: "Milhojas de guayaba",
      quantity: 1,
      unitPrice: 45000,
    });
    expect(lineTotal(line)).toBe(45000);
  });

  it("multiplica el precio por la cantidad", () => {
    const line = singleLine(TORTA, 3);
    expect(lineTotal(line)).toBe(135000);
    expect(orderTotals([line])).toEqual({ units: 3, total: 135000 });
  });
});

describe("saleMode combo", () => {
  it("toma la composición inicial como selección", () => {
    expect(comboQuantitiesOf(COMBO)).toEqual({
      deditos: 15,
      empanadas: 15,
      ojitos: 15,
      "bolitas-de-carne": 15,
    });
  });

  it("usa allowedItems si existe, si no la composición", () => {
    expect(comboAllowedSlugs(COMBO)).toEqual([
      "deditos",
      "empanadas",
      "ojitos",
      "bolitas-de-carne",
    ]);

    const conAllowed: ComboProduct = { ...COMBO, allowedItems: ["deditos"] };
    expect(comboAllowedSlugs(conAllowed)).toEqual(["deditos"]);
  });

  it("valida que el total coincida con totalUnits", () => {
    const completo = comboFill(COMBO, comboQuantitiesOf(COMBO));
    expect(completo).toEqual({
      units: 60,
      totalUnits: 60,
      missing: 0,
      excess: 0,
      matches: true,
    });

    const faltan = comboFill(COMBO, { deditos: 20, empanadas: 20 });
    expect(faltan.units).toBe(40);
    expect(faltan.missing).toBe(20);
    expect(faltan.excess).toBe(0);
    expect(faltan.matches).toBe(false);

    const sobran = comboFill(COMBO, { deditos: 80 });
    expect(sobran.units).toBe(80);
    expect(sobran.missing).toBe(0);
    expect(sobran.excess).toBe(20);
    expect(sobran.matches).toBe(false);
  });

  it("ignora en el total a los ítems que no están en allowedItems", () => {
    const conAllowed: ComboProduct = { ...COMBO, allowedItems: ["deditos"] };
    const fill = comboFill(conAllowed, { deditos: 60, empanadas: 999 });
    expect(fill.units).toBe(60);
    expect(fill.matches).toBe(true);
  });

  it("mantiene el precio fijo aunque se redistribuyan unidades", () => {
    const redistribuido: PackSelection = {
      deditos: 30,
      empanadas: 15,
      ojitos: 10,
      "bolitas-de-carne": 5,
    };
    const line = comboOrderLine(COMBO, redistribuido, COMBO_ITEMS);

    expect(line.kind).toBe("combo");
    expect(lineTotal(line)).toBe(43000);

    if (line.kind !== "combo") throw new Error("debería ser combo");
    expect(line.totalUnits).toBe(60);
    expect(line.composition).toEqual([
      { name: "Deditos", quantity: 30 },
      { name: "Empanadas", quantity: 15 },
      { name: "Ojitos", quantity: 10 },
      { name: "Bolitas de carne", quantity: 5 },
    ]);
  });

  it("solo lista con cantidad > 0 y resuelve nombres", () => {
    const line = comboOrderLine(COMBO, { deditos: 60 }, COMBO_ITEMS);
    if (line.kind !== "combo") throw new Error("debería ser combo");
    expect(line.composition).toEqual([{ name: "Deditos", quantity: 60 }]);
  });

  it("cuenta las unidades del combo aunque esté vacío", () => {
    const line = comboOrderLine(COMBO, {}, COMBO_ITEMS);
    expect(orderTotals([line])).toEqual({ units: 0, total: 43000 });
  });
});

describe("calcularPrecioCombo", () => {
  it("cobra el precio base sin cambios", () => {
    const pricing = calcularPrecioCombo(
      COMBO,
      comboQuantitiesOf(COMBO),
      COMBO_ITEMS,
    );
    expect(pricing.units).toBe(60);
    expect(pricing.extraUnits).toBe(0);
    expect(pricing.extras).toEqual([]);
    expect(pricing.total).toBe(43000);
    expect(pricing.customized).toBe(false);
    expect(pricing.belowMinimum).toBe(false);
  });

  it("mantiene el precio base al redistribuir con el mismo total", () => {
    const pricing = calcularPrecioCombo(
      COMBO,
      { deditos: 30, empanadas: 15, ojitos: 10, "bolitas-de-carne": 5 },
      COMBO_ITEMS,
    );
    expect(pricing.units).toBe(60);
    expect(pricing.extraUnits).toBe(0);
    expect(pricing.extras).toEqual([]);
    expect(pricing.total).toBe(43000);
    expect(pricing.customized).toBe(true);
  });

  it("suma cada unidad extra al precio unitario del pasaboca", () => {
    const pricing = calcularPrecioCombo(
      COMBO,
      { deditos: 20, empanadas: 15, ojitos: 15, "bolitas-de-carne": 15 },
      COMBO_ITEMS,
    );
    expect(pricing.units).toBe(65);
    expect(pricing.extraUnits).toBe(5);
    expect(pricing.extras).toEqual([
      {
        productSlug: "deditos",
        name: "Deditos",
        quantity: 5,
        unitPrice: 1000,
        subtotal: 5000,
      },
    ]);
    expect(pricing.extrasTotal).toBe(5000);
    expect(pricing.total).toBe(48000);
  });

  it("compensa las unidades extra con las que se quitan de otro pasaboca", () => {
    const pricing = calcularPrecioCombo(
      COMBO,
      { deditos: 25, empanadas: 10, ojitos: 15, "bolitas-de-carne": 15 },
      COMBO_ITEMS,
    );
    expect(pricing.units).toBe(65);
    expect(pricing.extraUnits).toBe(5);
    expect(pricing.extras).toHaveLength(1);
    expect(pricing.extras[0]?.quantity).toBe(5);
    expect(pricing.total).toBe(48000);
  });

  it("marca la selección cuando intenta bajar del mínimo sin cobrar extras", () => {
    const pricing = calcularPrecioCombo(
      COMBO,
      { deditos: 10, empanadas: 10, ojitos: 10, "bolitas-de-carne": 10 },
      COMBO_ITEMS,
    );
    expect(pricing.units).toBe(40);
    expect(pricing.belowMinimum).toBe(true);
    expect(pricing.extraUnits).toBe(0);
    expect(pricing.extras).toEqual([]);
    expect(pricing.total).toBe(43000);
  });
});

describe("saleMode builder", () => {
  const seleccion: BuilderSelection = {
    deditos: { quantity: 25, preparationId: null },
    empanadas: { quantity: 25, preparationId: null },
    ojitos: { quantity: 0, preparationId: null },
  };

  it("cuenta solo las cantidades de los ítems elegidos", () => {
    expect(builderUnitCount(seleccion)).toBe(50);
  });

  it("exige el mínimo total de unidades", () => {
    expect(builderProblems({}, 50)).toEqual([
      "Elige al menos un pasaboca.",
    ]);
    expect(builderProblems(seleccion, 50)).toEqual([]);
    expect(builderProblems(seleccion, 80)).toEqual([
      "Te faltan 30 unidades para el mínimo de 80.",
    ]);
  });

  it("genera una línea por ítem con cantidad > 0", () => {
    const lines = buildBuilderLines(COMBO_ITEMS, seleccion);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatchObject({
      kind: "builder",
      productSlug: "deditos",
      quantity: 25,
      unitPrice: 1000,
    });
    expect(orderTotals(lines)).toEqual({ units: 50, total: 55000 });
  });

  it("aplica el ajuste de la preparación al precio unitario", () => {
    const conPrep: BuilderItemProduct = {
      ...DEDITOS,
      preparations: [{ id: "frito", label: "Frito", priceDelta: 200 }],
    };
    const lines = buildBuilderLines([conPrep], {
      deditos: { quantity: 10, preparationId: "frito" },
    });
    expect(lines[0]).toMatchObject({ quantity: 10, unitPrice: 1200 });
    expect(lineTotal(lines[0])).toBe(12000);
  });
});

describe("saleMode pack", () => {
  it("calcula unidades y total por bandeja", () => {
    const selection: PackSelection = {
      "bandeja-deditos-de-queso": 2,
      "bandeja-deditos-de-bocadillo": 1,
    };
    const lines = buildPackLines(BANDEJAS, selection);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatchObject({
      kind: "pack",
      packCount: 2,
      unitsPerPack: 10,
      unitPrice: 25000,
    });

    expect(lineTotal(lines[0])).toBe(50000);
    expect(orderTotals(lines)).toEqual({ units: 30, total: 74000 });
  });

  it("ignora las bandejas con 0 y el mínimo es 1", () => {
    expect(buildPackLines(BANDEJAS, { "bandeja-deditos-de-queso": 0 })).toEqual(
      [],
    );
    const una = buildPackLines(BANDEJAS, { "bandeja-deditos-de-queso": 1 });
    expect(una).toHaveLength(1);
  });
});

describe("totales combinados", () => {
  it("suma unidades y total de los cuatro modos", () => {
    const lines = [
      singleLine(TORTA, 2),
      comboOrderLine(COMBO, comboQuantitiesOf(COMBO), COMBO_ITEMS),
      ...buildBuilderLines(COMBO_ITEMS, {
        deditos: { quantity: 25, preparationId: null },
      }),
      ...buildPackLines(BANDEJAS, { "bandeja-deditos-de-queso": 2 }),
    ];
    expect(orderTotals(lines)).toEqual({ units: 107, total: 208000 });
  });
});

describe("derivados por saleMode", () => {
  it("detecta el tipo de venta de una categoría", () => {
    expect(categorySaleKind([TORTA])).toBe("single");
    expect(categorySaleKind([COMBO])).toBe("combo");
    expect(categorySaleKind(BANDEJAS)).toBe("pack");
    expect(categorySaleKind([])).toBe("empty");
    expect(categorySaleKind([DEDITOS, EMPANADAS])).toBe("empty");
    expect(categorySaleKind([TORTA, COMBO])).toBe("single");
  });

  it("usa unitPrice en ítems de armador y price en el resto", () => {
    expect(productPrice(DEDITOS)).toBe(1000);
    expect(productPrice(TORTA)).toBe(45000);
    expect(productPrice(COMBO)).toBe(43000);
    expect(productPrice(BANDEJA_QUESO)).toBe(25000);
  });

  it("describe el tipo de venta en la tarjeta", () => {
    expect(productTypeLabel(COMBO)).toBe("Combo · 60 unidades");
    expect(productTypeLabel(BANDEJA_QUESO)).toBe("Bandeja · 10 unidades");
    expect(productTypeLabel(TORTA)).toBeNull();
  });

  it("resuelve la preparación elegida o la primera", () => {
    const conPrep: ProductListItem = {
      ...TORTA,
      preparations: [
        { id: "crudo", label: "Crudo", priceDelta: 0 },
        { id: "frito", label: "Frito", priceDelta: 500 },
      ],
    };
    expect(resolvePreparation(conPrep, "frito")?.id).toBe("frito");
    expect(resolvePreparation(conPrep, "no-existe")?.id).toBe("crudo");
    expect(resolvePreparation(TORTA, null)).toBeNull();
    expect(unitPriceFor(1000, { id: "x", label: "x", priceDelta: 300 })).toBe(
      1300,
    );
    expect(unitPriceFor(1000, null)).toBe(1000);
  });
});
