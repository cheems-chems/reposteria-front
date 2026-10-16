/*
  Sección Congelados: bandejas congeladas (crudas, 10 unidades).
  Precio por bandeja FICTICIO. Ver ./LEEME.md.
*/

import type { Category, Product, Section } from "../types";

export const CONGELADOS_SECTIONS: Section[] = [
  {
    slug: "congelados",
    name: "Congelados",
    orden: 3,
    imageUrl: null as string | null,
  },
];

export const CONGELADOS_CATEGORIES: Category[] = [
  {
    slug: "bandejas",
    name: "Bandejas",
    description:
      "Bandejas congeladas (crudas, para freír en casa) de 10 unidades.",
    sectionSlug: "congelados",
    imageUrl: null as string | null,
  },
];

export const CONGELADOS_PRODUCTS: Product[] = [
  {
    slug: "bandeja-deditos-de-queso",
    name: "Bandeja de deditos de queso",
    categorySlug: "bandejas",
    categoryName: "Bandejas",
    saleMode: "pack",
    price: 25000, // FICTICIO
    unitsPerPack: 10,
    minPacks: 1,
    stepPacks: 1,
    available: true,
    featured: true,
    imageUrl: null,
    shortDescription: "10 unidades congeladas, crudas para freír en casa.",
    description:
      "Bandeja congelada de deditos de queso, crudos para freír en casa.",
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
  {
    slug: "bandeja-deditos-de-bocadillo",
    name: "Bandeja de deditos de bocadillo",
    categorySlug: "bandejas",
    categoryName: "Bandejas",
    saleMode: "pack",
    price: 24000, // FICTICIO
    unitsPerPack: 10,
    minPacks: 1,
    stepPacks: 1,
    available: true,
    imageUrl: null,
    shortDescription: "10 unidades congeladas, crudas para freír en casa.",
    description:
      "Bandeja congelada de deditos de bocadillo, crudos para freír en casa.",
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
  {
    slug: "bandeja-ojitos",
    name: "Bandeja de ojitos",
    categorySlug: "bandejas",
    categoryName: "Bandejas",
    saleMode: "pack",
    price: 23000, // FICTICIO
    unitsPerPack: 10,
    minPacks: 1,
    stepPacks: 1,
    available: true,
    imageUrl: null,
    shortDescription: "10 unidades congeladas, crudas para freír en casa.",
    description:
      "Bandeja congelada de ojitos, crudos para freír en casa.",
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
  {
    slug: "bandeja-empanaditas-pequenas",
    name: "Bandeja de empanaditas pequeñas",
    categorySlug: "bandejas",
    categoryName: "Bandejas",
    saleMode: "pack",
    price: 22000, // FICTICIO
    unitsPerPack: 10,
    minPacks: 1,
    stepPacks: 1,
    available: true,
    imageUrl: null,
    shortDescription: "10 unidades congeladas, crudas para freír en casa.",
    description:
      "Bandeja congelada de empanaditas pequeñas, crudas para freír en casa.",
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
];
