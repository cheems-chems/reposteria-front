/*
  Sección Salados: combos (precios REALES) y ingredientes del armador
  (precios por unidad INVENTADOS). Pendiente confirmar "Bolitas de carne".
  Para agregar o cambiar productos, ver ./LEEME.md.
*/

import type { Category, Product, Section } from "../types";

export const SALADOS_SECTIONS: Section[] = [
  { slug: "salados", name: "Salados", orden: 2, imageUrl: null as string | null },
];

export const SALADOS_CATEGORIES: Category[] = [
  {
    slug: "combos",
    name: "Combos",
    description: "Combos de pasabocas o arma el tuyo desde cero.",
    sectionSlug: "salados",
    // Mínimo provisional de ejemplo del armador "desde cero".
    builderMinTotalUnits: 50,
    imageUrl: null as string | null,
  },
];

// Ítems de armador (saleMode "builder"): no se listan en la tienda, solo se
// eligen por unidades dentro de combos editables o del armador "desde cero".
export const SALADOS_COMBO_ITEMS: Product[] = [
  {
    slug: "deditos",
    name: "Deditos",
    categorySlug: "combos",
    categoryName: "Combos",
    saleMode: "builder",
    comboItem: true,
    unitPrice: 1000, // FICTICIO
    stepQty: 5,
    available: true,
    featured: false,
    imageUrl: null,
    shortDescription: null,
    description: null,
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
  {
    slug: "empanadas",
    name: "Empanadas",
    categorySlug: "combos",
    categoryName: "Combos",
    saleMode: "builder",
    comboItem: true,
    unitPrice: 1200, // FICTICIO
    stepQty: 5,
    available: true,
    featured: false,
    imageUrl: null,
    shortDescription: null,
    description: null,
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
  {
    slug: "ojitos",
    name: "Ojitos",
    categorySlug: "combos",
    categoryName: "Combos",
    saleMode: "builder",
    comboItem: true,
    unitPrice: 900, // FICTICIO
    stepQty: 5,
    available: true,
    featured: false,
    imageUrl: null,
    shortDescription: null,
    description: null,
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
  {
    slug: "bolitas-de-carne",
    name: "Bolitas de carne",
    categorySlug: "combos",
    categoryName: "Combos",
    saleMode: "builder",
    comboItem: true,
    unitPrice: 1100, // FICTICIO
    stepQty: 5,
    available: true,
    featured: false,
    imageUrl: null,
    shortDescription: null,
    description: null,
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
  {
    slug: "pinchitos",
    name: "Pinchitos",
    categorySlug: "combos",
    categoryName: "Combos",
    saleMode: "builder",
    comboItem: true,
    unitPrice: 1300, // FICTICIO
    stepQty: 5,
    available: true,
    featured: false,
    imageUrl: null,
    shortDescription: null,
    description: null,
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
  {
    slug: "papitas-rellenas",
    name: "Papitas rellenas",
    categorySlug: "combos",
    categoryName: "Combos",
    saleMode: "builder",
    comboItem: true,
    unitPrice: 1500, // FICTICIO
    stepQty: 5,
    available: true,
    featured: false,
    imageUrl: null,
    shortDescription: null,
    description: null,
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
];

export const SALADOS_PRODUCTS: Product[] = [
  {
    slug: "combo-1",
    name: "Combo 1",
    categorySlug: "combos",
    categoryName: "Combos",
    saleMode: "combo",
    price: 43000, // REAL
    totalUnits: 60,
    editable: true,
    stepQty: 5,
    composition: [
      { productSlug: "deditos", quantity: 15 },
      { productSlug: "empanadas", quantity: 15 },
      { productSlug: "ojitos", quantity: 15 },
      { productSlug: "bolitas-de-carne", quantity: 15 },
    ],
    available: true,
    featured: true,
    imageUrl: null,
    shortDescription:
      "60 unidades — Deditos 15, Empanadas 15, Ojitos 15, Bolitas de carne 15.",
    description: "Combo 1 (60 unidades), editable en el encargo.",
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
  {
    slug: "combo-2",
    name: "Combo 2",
    categorySlug: "combos",
    categoryName: "Combos",
    saleMode: "combo",
    price: 73000, // REAL
    totalUnits: 100,
    editable: true,
    stepQty: 5,
    composition: [
      { productSlug: "deditos", quantity: 25 },
      { productSlug: "empanadas", quantity: 25 },
      { productSlug: "ojitos", quantity: 25 },
      { productSlug: "bolitas-de-carne", quantity: 25 },
    ],
    available: true,
    imageUrl: null,
    shortDescription:
      "100 unidades — Deditos 25, Empanadas 25, Ojitos 25, Bolitas de carne 25.",
    description: "Combo 2 (100 unidades), editable en el encargo.",
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
  {
    slug: "combo-3",
    name: "Combo 3",
    categorySlug: "combos",
    categoryName: "Combos",
    saleMode: "combo",
    price: 117000, // REAL
    totalUnits: 160,
    editable: true,
    stepQty: 5,
    composition: [
      { productSlug: "deditos", quantity: 40 },
      { productSlug: "empanadas", quantity: 40 },
      { productSlug: "ojitos", quantity: 40 },
      { productSlug: "bolitas-de-carne", quantity: 40 },
    ],
    available: true,
    imageUrl: null,
    shortDescription:
      "160 unidades — Deditos 40, Empanadas 40, Ojitos 40, Bolitas de carne 40.",
    description: "Combo 3 (160 unidades), editable en el encargo.",
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
  {
    slug: "combo-4",
    name: "Combo 4",
    categorySlug: "combos",
    categoryName: "Combos",
    saleMode: "combo",
    price: 110000, // REAL
    totalUnits: 120,
    editable: true,
    stepQty: 5,
    composition: [
      { productSlug: "deditos", quantity: 20 },
      { productSlug: "empanadas", quantity: 20 },
      { productSlug: "ojitos", quantity: 20 },
      { productSlug: "bolitas-de-carne", quantity: 20 },
      { productSlug: "pinchitos", quantity: 20 },
      { productSlug: "papitas-rellenas", quantity: 20 },
    ],
    available: true,
    imageUrl: null,
    shortDescription:
      "120 unidades — Deditos 20, Empanadas 20, Ojitos 20, Bolitas de carne 20, Pinchitos 20, Papitas rellenas 20.",
    description: "Combo 4 (120 unidades), editable en el encargo.",
    ingredients: [],
    allergens: null,
    prepDays: null,
  },
];
