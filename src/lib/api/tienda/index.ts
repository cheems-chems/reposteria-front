/*
  Punto de unión del catálogo provisional. Valida slugs únicos y referencias
  categoría/sección al cargar. Para editar productos, ver ./LEEME.md.
*/

import type { Category, Product, Section } from "../types";
import { validateCatalog } from "../validate";
import { DULCES_CATEGORIES, DULCES_PRODUCTS, DULCES_SECTIONS } from "./dulces";
import {
  CONGELADOS_CATEGORIES,
  CONGELADOS_PRODUCTS,
  CONGELADOS_SECTIONS,
} from "./congelados";
import {
  SALADOS_CATEGORIES,
  SALADOS_COMBO_ITEMS,
  SALADOS_PRODUCTS,
  SALADOS_SECTIONS,
} from "./salados";

export const SECTIONS: Section[] = [
  ...DULCES_SECTIONS,
  ...SALADOS_SECTIONS,
  ...CONGELADOS_SECTIONS,
];

export const CATEGORIES: Category[] = [
  ...DULCES_CATEGORIES,
  ...SALADOS_CATEGORIES,
  ...CONGELADOS_CATEGORIES,
];

// Ítems de armador: no se listan en la tienda (se filtra por saleMode).
export const COMBO_ITEMS: Product[] = [...SALADOS_COMBO_ITEMS];

export const PRODUCTS: Product[] = [
  ...DULCES_PRODUCTS,
  ...SALADOS_PRODUCTS,
  ...SALADOS_COMBO_ITEMS,
  ...CONGELADOS_PRODUCTS,
];

function fail(message: string): never {
  throw new Error(`Catálogo incoherente: ${message}`);
}

function validateTienda(
  sections: Section[],
  categories: Category[],
  products: Product[],
): void {
  const sectionSlugs = new Set<string>();
  for (const section of sections) {
    if (sectionSlugs.has(section.slug)) {
      fail(`sección duplicada: "${section.slug}".`);
    }
    sectionSlugs.add(section.slug);
  }

  const categorySlugs = new Set<string>();
  for (const category of categories) {
    if (categorySlugs.has(category.slug)) {
      fail(`categoría duplicada: "${category.slug}".`);
    }
    categorySlugs.add(category.slug);
    if (category.sectionSlug && !sectionSlugs.has(category.sectionSlug)) {
      fail(
        `categoría "${category.slug}" apunta a la sección inexistente ` +
          `"${category.sectionSlug}".`,
      );
    }
  }

  for (const product of products) {
    if (!categorySlugs.has(product.categorySlug)) {
      fail(
        `producto "${product.slug}" apunta a la categoría inexistente ` +
          `"${product.categorySlug}".`,
      );
    }
  }
}

validateTienda(SECTIONS, CATEGORIES, PRODUCTS);
validateCatalog(PRODUCTS, CATEGORIES);
