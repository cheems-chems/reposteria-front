/*
  Datos de desarrollo (no son datos del negocio). Se usan solo cuando
  NEXT_PUBLIC_USE_PROVISIONAL_DATA no es "false" y se eliminan cuando llegue
  el backend. El catálogo de la tienda vive en ./tienda/ (ver ./tienda/LEEME.md).
*/

import { brand } from "@/lib/brand";
import type { Review, StoreInfo } from "./types";

export {
  SECTIONS as DEV_SECTIONS,
  CATEGORIES as DEV_CATEGORIES,
  PRODUCTS as DEV_PRODUCTS,
} from "./tienda";

// Ejemplos visibles con la etiqueta EJEMPLO; no son reseñas del negocio.
export const DEV_REVIEWS: Review[] = [
  {
    author: "Laura M.",
    rating: 5,
    text: "Pedido precioso y a tiempo. Los pasabocas desaparecieron en minutos.",
    example: true,
  },
  {
    author: "Andrés P.",
    rating: 5,
    text: "Armar el combo por WhatsApp fue facilísimo. Todo confirmado rápido.",
    example: true,
  },
  {
    author: "Carolina R.",
    rating: 4,
    text: "La torta de guayaba llegó perfecta. Muy buen sabor de casa.",
    example: true,
  },
];

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
