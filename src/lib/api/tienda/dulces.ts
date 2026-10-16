/*
  Sección Dulces: tortas, bizcochos y postres. Precios FICTICIOS.
  Para agregar o cambiar productos, ver ./LEEME.md.
*/

import type { Category, Product, Section } from "../types";

export const DULCES_SECTIONS: Section[] = [
  { slug: "dulces", name: "Dulces", orden: 1, imageUrl: null as string | null },
];

export const DULCES_CATEGORIES: Category[] = [
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
];

export const DULCES_PRODUCTS: Product[] = [
  {
    slug: "milhojas-de-guayaba",
    name: "Milhojas de guayaba",
    categorySlug: "tortas",
    categoryName: "Tortas",
    saleMode: "single",
    price: 45000, // FICTICIO
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
    slug: "tarta-de-limon",
    name: "Tarta de limón",
    categorySlug: "tortas",
    categoryName: "Tortas",
    saleMode: "single",
    price: 52000, // FICTICIO
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
    slug: "panela-y-nuez",
    name: "Panela y nuez",
    categorySlug: "bizcochos",
    categoryName: "Bizcochos",
    saleMode: "single",
    price: 32000, // FICTICIO
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
    slug: "bizcocho-de-chocolate",
    name: "Bizcocho de chocolate",
    categorySlug: "bizcochos",
    categoryName: "Bizcochos",
    saleMode: "single",
    price: 38000, // FICTICIO
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
    price: 49000, // FICTICIO
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
  {
    slug: "cuadritos-de-coco",
    name: "Cuadritos de coco",
    categorySlug: "postres",
    categoryName: "Postres",
    saleMode: "single",
    price: 28000, // FICTICIO
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
];
