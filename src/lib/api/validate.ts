// Valida la coherencia del catálogo y falla con Error; nunca corrige datos en silencio.

import type { Category, Product } from "./types";

function fail(message: string): never {
  throw new Error(`Catálogo incoherente: ${message}`);
}

function validateProduct(
  product: Product,
  builderSlugs: ReadonlySet<string>,
): void {
  const { slug } = product;

  switch (product.saleMode) {
    case "single": {
      if (!Number.isInteger(product.price) || product.price < 0) {
        fail(`${slug}: "single" necesita un precio entero >= 0.`);
      }
      break;
    }
    case "combo": {
      if (!Number.isInteger(product.price) || product.price < 0) {
        fail(`${slug}: el precio del combo debe ser un entero >= 0.`);
      }
      if (!Number.isInteger(product.totalUnits) || product.totalUnits <= 0) {
        fail(`${slug}: "totalUnits" debe ser un entero > 0.`);
      }
      if (!Number.isInteger(product.stepQty) || product.stepQty < 1) {
        fail(`${slug}: "stepQty" debe ser un entero >= 1.`);
      }
      if (product.composition.length === 0) {
        fail(`${slug}: el combo necesita una composición.`);
      }
      const sum = product.composition.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      if (sum !== product.totalUnits) {
        fail(
          `${slug}: la suma de la composición (${sum}) no coincide con ` +
            `totalUnits (${product.totalUnits}).`,
        );
      }
      for (const item of product.composition) {
        if (!builderSlugs.has(item.productSlug)) {
          fail(
            `${slug}: la composición referencia "${item.productSlug}", que no ` +
              `es un ítem de armador (saleMode "builder").`,
          );
        }
      }
      for (const allowed of product.allowedItems ?? []) {
        if (!builderSlugs.has(allowed)) {
          fail(
            `${slug}: "allowedItems" referencia "${allowed}", que no es un ` +
              `ítem de armador.`,
          );
        }
      }
      break;
    }
    case "builder": {
      if (product.comboItem !== true) {
        fail(`${slug}: un ítem de armador debe declarar "comboItem: true".`);
      }
      if (!Number.isInteger(product.unitPrice) || product.unitPrice < 0) {
        fail(`${slug}: "unitPrice" debe ser un entero >= 0.`);
      }
      if (!Number.isInteger(product.stepQty) || product.stepQty < 1) {
        fail(`${slug}: "stepQty" debe ser un entero >= 1.`);
      }
      break;
    }
    case "pack": {
      if (!Number.isInteger(product.price) || product.price < 0) {
        fail(`${slug}: el precio por bandeja debe ser un entero >= 0.`);
      }
      if (!Number.isInteger(product.unitsPerPack) || product.unitsPerPack < 1) {
        fail(`${slug}: "unitsPerPack" debe ser un entero >= 1.`);
      }
      if (!Number.isInteger(product.minPacks) || product.minPacks < 1) {
        fail(`${slug}: "minPacks" debe ser un entero >= 1.`);
      }
      if (!Number.isInteger(product.stepPacks) || product.stepPacks < 1) {
        fail(`${slug}: "stepPacks" debe ser un entero >= 1.`);
      }
      break;
    }
  }
}

export function validateCatalog(
  products: Product[],
  categories: Category[] = [],
): void {
  const builderSlugs = new Set(
    products
      .filter((product) => product.saleMode === "builder")
      .map((product) => product.slug),
  );

  const seen = new Set<string>();
  for (const product of products) {
    if (seen.has(product.slug)) fail(`producto duplicado: ${product.slug}.`);
    seen.add(product.slug);
    validateProduct(product, builderSlugs);
  }

  for (const category of categories) {
    const min = category.builderMinTotalUnits;
    if (min != null && (!Number.isInteger(min) || min < 0)) {
      fail(
        `categoría "${category.slug}": "builderMinTotalUnits" debe ser un ` +
          `entero >= 0 o null.`,
      );
    }
  }
}
