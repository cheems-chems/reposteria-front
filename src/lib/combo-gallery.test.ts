import { describe, expect, it } from "vitest";
import type { BuilderItemProduct, ComboProduct } from "@/lib/api";
import { primaryProductImage, productGalleryImages } from "@/lib/api";
import { comboGalleryImages } from "@/lib/combo-gallery";

function makeCombo(overrides: Partial<ComboProduct> = {}): ComboProduct {
  return {
    saleMode: "combo",
    purchaseMode: "direct",
    slug: "combo-prueba",
    name: "Combo de prueba",
    categorySlug: "combos",
    categoryName: "Combos",
    available: true,
    price: 43000,
    totalUnits: 4,
    composition: [],
    editable: true,
    stepQty: 1,
    ...overrides,
  };
}

function makeIngredient(
  slug: string,
  overrides: Partial<BuilderItemProduct> = {},
): BuilderItemProduct {
  return {
    saleMode: "builder",
    purchaseMode: "direct",
    slug,
    name: `Ingrediente ${slug}`,
    categorySlug: "combos",
    categoryName: "Combos",
    available: true,
    comboItem: true,
    unitPrice: 100,
    stepQty: 1,
    ...overrides,
  };
}

describe("galería de combos", () => {
  it("usa todas las fotos propias en orden, sin agregar ingredientes", () => {
    const combo = makeCombo({
      imageUrl: "/test/combo-principal-antigua.webp",
      images: ["/test/combo-1.webp", "/test/combo-2.webp", "/test/combo-3.webp"],
      composition: [
        { productSlug: "deditos", quantity: 1 },
        { productSlug: "empanadas", quantity: 1 },
      ],
    });
    const ingredients = [
      makeIngredient("deditos", { imageUrl: "/test/deditos.webp" }),
      makeIngredient("empanadas", { imageUrl: "/test/empanadita.webp" }),
    ];

    expect(comboGalleryImages(combo, ingredients)).toEqual([
      "/test/combo-1.webp",
      "/test/combo-2.webp",
      "/test/combo-3.webp",
    ]);
  });

  it("sin fotos propias conserva imageUrl y la primera foto de cada ingrediente", () => {
    const combo = makeCombo({
      imageUrl: "/test/combo.webp",
      images: ["", "  "],
      composition: [
        { productSlug: "deditos", quantity: 1 },
        { productSlug: "empanadas", quantity: 1 },
        { productSlug: "bolitas-de-carne", quantity: 1 },
      ],
    });
    const ingredients = [
      makeIngredient("deditos", {
        imageUrl: "/test/deditos-antigua.webp",
        images: ["/test/deditos-1.webp", "/test/deditos-2.webp"],
      }),
      makeIngredient("empanadas"),
      makeIngredient("bolitas-de-carne", { imageUrl: "/test/bolita.webp" }),
    ];

    expect(comboGalleryImages(combo, ingredients)).toEqual([
      "/test/combo.webp",
      "/test/deditos-1.webp",
      "/test/bolita.webp",
    ]);
  });

  it("omite ingredientes sin foto, vacíos y rutas duplicadas", () => {
    const combo = makeCombo({
      images: [
        "/test/igual.webp",
        "",
        "  ",
        "/test/otra.webp",
        "/test/igual.webp ",
      ],
      composition: [
        { productSlug: "deditos", quantity: 1 },
        { productSlug: "empanadas", quantity: 1 },
      ],
    });

    expect(
      comboGalleryImages(combo, [
        makeIngredient("deditos", { imageUrl: "/test/ingrediente.webp" }),
        makeIngredient("empanadas"),
      ]),
    ).toEqual(["/test/igual.webp", "/test/otra.webp"]);
  });

  it("usa images[0] como foto principal de tarjeta y muestra todas en la ficha", () => {
    const product = {
      imageUrl: "/test/foto-principal-antigua.webp",
      images: ["/test/foto-1.webp", "/test/foto-2.webp"],
    };

    expect(primaryProductImage(product)).toBe("/test/foto-1.webp");
    expect(productGalleryImages(product, ["/test/foto-de-carpeta.webp"])).toEqual([
      "/test/foto-1.webp",
      "/test/foto-2.webp",
    ]);
  });

  it("usa solo la primera foto de Deditos en los combos que lo contienen", () => {
    const deditos = makeIngredient("deditos", {
      imageUrl: "/test/deditos-antigua.webp",
      images: ["/test/deditos-1.webp", "/test/deditos-2.webp"],
    });
    const ingredients = [deditos];
    const comboConDeditos = makeCombo({
      composition: [{ productSlug: "deditos", quantity: 1 }],
    });
    const comboSinDeditos = makeCombo({
      imageUrl: "/test/combo-sin-deditos.webp",
      composition: [{ productSlug: "empanadas", quantity: 1 }],
    });
    const gallery = comboGalleryImages(comboConDeditos, ingredients);

    expect(gallery).toContain("/test/deditos-1.webp");
    expect(gallery).not.toContain("/test/deditos-2.webp");
    expect(gallery).not.toContain("/test/deditos-antigua.webp");
    expect(comboGalleryImages(comboSinDeditos, ingredients)).toEqual([
      "/test/combo-sin-deditos.webp",
    ]);
  });

  it("sin foto propia ni ingredientes con foto devuelve una galería vacía", () => {
    const combo = makeCombo({
      composition: [{ productSlug: "empanadas", quantity: 1 }],
    });

    expect(comboGalleryImages(combo, [makeIngredient("empanadas")])).toEqual([]);
  });
});
