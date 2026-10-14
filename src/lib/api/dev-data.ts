/*
  ============================================================================
  DATOS DE DESARROLLO — NO SON DATOS DEL NEGOCIO.
  ----------------------------------------------------------------------------
  Solo se usan cuando NEXT_PUBLIC_USE_PROVISIONAL_DATA no es "false" (ver
  ./config.ts). Existen para construir y validar la tienda antes de que el
  backend exista, y se ELIMINAN cuando llegue el contrato real.

  Nunca tratar estos nombres, precios ni ingredientes como reales. La interfaz
  los muestra marcados como "datos de desarrollo" (ver ProvisionalNotice).
  ============================================================================
*/

import { brand } from "@/lib/brand";
import type { Category, Product, StoreInfo } from "./types";

export const DEV_CATEGORIES: Category[] = [
  {
    slug: "tortas",
    name: "Tortas",
    description: "Tortas por encargo para celebraciones.",
  },
  {
    slug: "bizcochos",
    name: "Bizcochos",
    description: "Bizcochos y panadería dulce.",
  },
  {
    slug: "postres",
    name: "Postres",
    description: "Postres individuales y para compartir.",
  },
  {
    slug: "pasabocas",
    name: "Pasabocas",
    description: "Bocaditos por unidad o por bandeja, crudos o fritos.",
  },
];

/**
 * PROVISIONAL — preparaciones de ejemplo para pasabocas. `priceDelta` es el
 * ajuste por unidad en COP; se deja en 0 hasta que la dueña confirme si
 * crudo y frito cuestan distinto.
 */
const DEV_PASABOCA_PREPARATIONS = [
  { id: "crudo", label: "Crudos (para freír en casa)", priceDelta: 0 },
  { id: "frito", label: "Fritos", priceDelta: 0 },
];

export const DEV_PRODUCTS: Product[] = [
  {
    slug: "milhojas-de-guayaba",
    name: "Milhojas de guayaba",
    categorySlug: "tortas",
    categoryName: "Tortas",
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
    price: 28000,
    available: false,
    imageUrl: null,
    shortDescription: "Bocaditos de coco rallado, horneados por fuera y suaves por dentro.",
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
    price: 38000,
    available: true,
    imageUrl: null,
    shortDescription: "Chocolate intenso, miga densa y cobertura de ganache.",
    description:
      "Chocolate intenso, miga densa y cobertura de ganache.",
    ingredients: ["Harina", "Chocolate", "Huevo", "Mantequilla", "Crema de leche"],
    allergens: ["Gluten", "Huevo", "Lácteos"],
    prepDays: 2,
  },
  {
    slug: "tres-leches",
    name: "Tres leches",
    categorySlug: "postres",
    categoryName: "Postres",
    price: 49000,
    available: true,
    imageUrl: null,
    shortDescription: "Bizcocho esponjoso bañado en tres leches.",
    description: "Bizcocho esponjoso bañado en tres leches.",
    ingredients: ["Harina", "Leche condensada", "Leche evaporada", "Crema de leche", "Huevo"],
    allergens: ["Gluten", "Huevo", "Lácteos"],
    prepDays: 2,
  },
  /*
    --------------------------------------------------------------------------
    PASABOCAS — PROVISIONAL. Precios FICTICIOS (por unidad) solo para construir
    y validar el armador de bandeja. NO son precios reales: la dueña los
    confirmará por WhatsApp. `ingredients: []` y `allergens: null` a propósito
    (no inventar datos). Tampoco son reales `minQty` ni `stepQty`.
    --------------------------------------------------------------------------
  */
  {
    slug: "deditos-de-queso",
    name: "Deditos de queso",
    categorySlug: "pasabocas",
    categoryName: "Pasabocas",
    price: 1000, // FICTICIO: precio por unidad
    available: true,
    imageUrl: null,
    shortDescription: "Deditos de masa con queso. Se venden por unidad.",
    description:
      "Se venden por unidad. Pueden ir crudos (para freír en casa) o fritos.",
    ingredients: [],
    allergens: null,
    prepDays: null,
    pricing: { mode: "perUnit", unitLabel: "unidad", minQty: 5, stepQty: 5 },
    preparations: DEV_PASABOCA_PREPARATIONS,
  },
  {
    slug: "deditos-de-bocadillo",
    name: "Deditos de bocadillo",
    categorySlug: "pasabocas",
    categoryName: "Pasabocas",
    price: 1000, // FICTICIO: precio por unidad
    available: true,
    imageUrl: null,
    shortDescription: "Deditos de masa con bocadillo. Se venden por unidad.",
    description:
      "Se venden por unidad. Pueden ir crudos (para freír en casa) o fritos.",
    ingredients: [],
    allergens: null,
    prepDays: null,
    pricing: { mode: "perUnit", unitLabel: "unidad", minQty: 5, stepQty: 5 },
    preparations: DEV_PASABOCA_PREPARATIONS,
  },
  {
    slug: "deditos-de-queso-y-bocadillo",
    name: "Deditos de queso y bocadillo",
    categorySlug: "pasabocas",
    categoryName: "Pasabocas",
    price: 1200, // FICTICIO: precio por unidad
    available: true,
    imageUrl: null,
    shortDescription:
      "Deditos de masa con queso y bocadillo. Se venden por unidad.",
    description:
      "Se venden por unidad. Pueden ir crudos (para freír en casa) o fritos.",
    ingredients: [],
    allergens: null,
    prepDays: null,
    pricing: { mode: "perUnit", unitLabel: "unidad", minQty: 5, stepQty: 5 },
    preparations: DEV_PASABOCA_PREPARATIONS,
  },
  {
    slug: "ojitos",
    name: "Ojitos",
    categorySlug: "pasabocas",
    categoryName: "Pasabocas",
    price: 800, // FICTICIO: precio por unidad
    available: true,
    imageUrl: null,
    shortDescription: "Bocaditos pequeños de masa. Se venden por unidad.",
    description:
      "Se venden por unidad. Confirmar con la repostería si hay crudos y fritos.",
    ingredients: [],
    allergens: null,
    prepDays: null,
    pricing: { mode: "perUnit", unitLabel: "unidad", minQty: 5, stepQty: 5 },
    preparations: DEV_PASABOCA_PREPARATIONS,
  },
  {
    slug: "empanaditas-pequenas",
    name: "Empanaditas pequeñas",
    categorySlug: "pasabocas",
    categoryName: "Pasabocas",
    price: 700, // FICTICIO: precio por unidad
    available: true,
    imageUrl: null,
    shortDescription: "Empanaditas pequeñas. Se venden por unidad.",
    description:
      "Se venden por unidad. Pueden ir crudas (para freír en casa) o fritas.",
    ingredients: [],
    allergens: null,
    prepDays: null,
    pricing: { mode: "perUnit", unitLabel: "unidad", minQty: 10, stepQty: 10 },
    preparations: DEV_PASABOCA_PREPARATIONS,
  },
];

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
