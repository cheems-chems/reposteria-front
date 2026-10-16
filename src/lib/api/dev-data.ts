/*
  ============================================================================
  DATOS DE DESARROLLO — NO SON DATOS DEL NEGOCIO.
  ----------------------------------------------------------------------------
  Solo se usan cuando NEXT_PUBLIC_USE_PROVISIONAL_DATA no es "false" (ver
  ./config.ts). Existen para construir y validar la tienda antes de que el
  backend exista, y se ELIMINAN cuando llegue el contrato real.

  Nunca tratar estos nombres, precios ni ingredientes como reales. La interfaz
  los muestra marcados como "datos de desarrollo" (ver ProvisionalNotice).

  Los precios de combos y los dulces son ficticios; los precios por unidad del
  armador y de las bandejas son INVENTADOS (el catálogo real no los trae) y se
  marcan como provisionales. Pendiente confirmar "Bolitas de carne".
  ============================================================================
*/

import { brand } from "@/lib/brand";
import type { Category, Product, Section, StoreInfo } from "./types";
import { validateCatalog } from "./validate";

export const DEV_SECTIONS: Section[] = [
  // `imageUrl`: ranura de foto del círculo de la sección. null = marcador rosa.
  { slug: "dulces", name: "Dulces", orden: 1, imageUrl: null as string | null },
  { slug: "salados", name: "Salados", orden: 2, imageUrl: null as string | null },
  {
    slug: "congelados",
    name: "Congelados",
    orden: 3,
    imageUrl: null as string | null,
  },
];

export const DEV_CATEGORIES: Category[] = [
  {
    slug: "tortas",
    name: "Tortas",
    description: "Tortas por encargo para celebraciones.",
    sectionSlug: "dulces",
    imageUrl: null as string | null,
  },
  {
    slug: "bizcochos",
    name: "Bizcochos",
    description: "Bizcochos y panadería dulce.",
    sectionSlug: "dulces",
    imageUrl: null as string | null,
  },
  {
    slug: "postres",
    name: "Postres",
    description: "Postres individuales y para compartir.",
    sectionSlug: "dulces",
    imageUrl: null as string | null,
  },
  {
    slug: "combos",
    name: "Combos",
    description: "Combos de pasabocas o arma el tuyo desde cero.",
    sectionSlug: "salados",
    // PROVISIONAL: mínimo de ejemplo del armador "desde cero".
    builderMinTotalUnits: 50,
    imageUrl: null as string | null,
  },
  {
    slug: "bandejas",
    name: "Bandejas",
    description:
      "Bandejas congeladas (crudas, para freír en casa) de 10 unidades.",
    sectionSlug: "congelados",
    imageUrl: null as string | null,
  },
];

/**
 * Ítems de armador (pasabocos con `saleMode: "builder"`). No se listan en la
 * tienda: solo se eligen por unidades dentro de un combo editable o del
 * armador "desde cero". Precios por unidad PROVISIONALES E INVENTADOS.
 */
const DEV_COMBO_ITEMS: Product[] = [
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

/** Combos reales (precios reales), editables. */
const DEV_COMBOS: Product[] = [
  {
    slug: "combo-1",
    name: "Combo 1",
    categorySlug: "combos",
    categoryName: "Combos",
    saleMode: "combo",
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
    price: 73000,
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
    price: 117000,
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
    price: 110000,
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

/**
 * Bandejas de ejemplo, congeladas (crudas, para freír en casa). Precio por
 * bandeja FICTICIO. Sin ingredientes ni alérgenos inventados.
 */
const DEV_PACKS: Product[] = [
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

/**
 * Productos dulces: se quedan como ejemplo provisional, con precios ficticios.
 */
const DEV_SWEETS: Product[] = [
  {
    slug: "milhojas-de-guayaba",
    name: "Milhojas de guayaba",
    categorySlug: "tortas",
    categoryName: "Tortas",
    saleMode: "single",
    price: 45000,
    available: true,
    featured: true,
    imageUrl: null,
    shortDescription: "Hojaldre fino, guayaba de la región y crema pastelera.",
    description:
      "Tres capas de hojaldre fino con guayaba de la región y un toque de panela. Se hornea el mismo día de la entrega.",
    ingredients: [
      "Hojaldre de mantequilla",
      "Guayaba (membrillo) de la región",
      "Crema pastelera",
      "Tapa de panela",
    ],
    allergens: ["Gluten", "Huevo", "Lácteos"],
    prepDays: 3,
  },
  {
    slug: "panela-y-nuez",
    name: "Panela y nuez",
    categorySlug: "bizcochos",
    categoryName: "Bizcochos",
    saleMode: "single",
    price: 32000,
    available: true,
    imageUrl: null,
    shortDescription: "Bizcocho húmedo con panela y nuez tostada.",
    description:
      "Bizcocho húmedo con panela y nuez tostada. Ideal para la tarde.",
    ingredients: ["Harina", "Panela", "Nuez", "Mantequilla", "Huevo"],
    allergens: ["Gluten", "Huevo", "Lácteos", "Frutos secos"],
    prepDays: 2,
  },
  {
    slug: "cuadritos-de-coco",
    name: "Cuadritos de coco",
    categorySlug: "postres",
    categoryName: "Postres",
    saleMode: "single",
    price: 28000,
    available: false,
    imageUrl: null,
    shortDescription:
      "Bocaditos de coco rallado, horneados por fuera y suaves por dentro.",
    description:
      "Bocaditos de coco rallado, horneados por fuera y suaves por dentro.",
    ingredients: ["Coco rallado", "Leche condensada", "Huevo"],
    allergens: ["Huevo", "Lácteos"],
    prepDays: 1,
  },
  {
    slug: "tarta-de-limon",
    name: "Tarta de limón",
    categorySlug: "tortas",
    categoryName: "Tortas",
    saleMode: "single",
    price: 52000,
    compareAt: 58000,
    available: true,
    imageUrl: null,
    shortDescription: "Base crocante, crema de limón y merengue ligero.",
    description:
      "Base crocante, crema de limón y merengue ligero. Se sirve fría.",
    ingredients: ["Harina", "Limón", "Huevo", "Mantequilla", "Azúcar"],
    allergens: ["Gluten", "Huevo", "Lácteos"],
    prepDays: 2,
  },
  {
    slug: "bizcocho-de-chocolate",
    name: "Bizcocho de chocolate",
    categorySlug: "bizcochos",
    categoryName: "Bizcochos",
    saleMode: "single",
    price: 38000,
    available: true,
    imageUrl: null,
    shortDescription: "Chocolate intenso, miga densa y cobertura de ganache.",
    description: "Chocolate intenso, miga densa y cobertura de ganache.",
    ingredients: [
      "Harina",
      "Chocolate",
      "Huevo",
      "Mantequilla",
      "Crema de leche",
    ],
    allergens: ["Gluten", "Huevo", "Lácteos"],
    prepDays: 2,
  },
  {
    slug: "tres-leches",
    name: "Tres leches",
    categorySlug: "postres",
    categoryName: "Postres",
    saleMode: "single",
    price: 49000,
    available: true,
    imageUrl: null,
    shortDescription: "Bizcocho esponjoso bañado en tres leches.",
    description: "Bizcocho esponjoso bañado en tres leches.",
    ingredients: [
      "Harina",
      "Leche condensada",
      "Leche evaporada",
      "Crema de leche",
      "Huevo",
    ],
    allergens: ["Gluten", "Huevo", "Lácteos"],
    prepDays: 2,
  },
];

export const DEV_PRODUCTS: Product[] = [
  ...DEV_SWEETS,
  ...DEV_COMBOS,
  ...DEV_COMBO_ITEMS,
  ...DEV_PACKS,
];

// Falla temprano si los datos de desarrollo dejan de ser coherentes.
validateCatalog(DEV_PRODUCTS, DEV_CATEGORIES);

/**
 * Datos del negocio de desarrollo. Solo se toman los campos que la marca ya
 * tiene como marcador; el resto va vacío a propósito (honestidad de datos).
 */
export const DEV_STORE_INFO: StoreInfo = {
  name: brand.name,
  tagline: brand.tagline,
  description: brand.description,
  city: brand.contact.city,
  address: brand.contact.address || null,
  whatsapp: brand.contact.whatsapp || null,
  phone: brand.contact.phone || null,
  email: brand.contact.email || null,
  instagram: brand.contact.instagram || null,
  tiktok: brand.contact.tiktok || null,
  hours: [...brand.contact.hours],
};
