/*
  Datos de desarrollo (no son datos del negocio). Se usan solo cuando
  NEXT_PUBLIC_USE_PROVISIONAL_DATA no es "false" y se eliminan cuando llegue
  el backend. El catálogo de la tienda vive en ./tienda/ (ver ./tienda/LEEME.md).
*/

import { brand } from "@/lib/brand";
import type { StoreInfo } from "./types";

export {
  SECTIONS as DEV_SECTIONS,
  CATEGORIES as DEV_CATEGORIES,
  PRODUCTS as DEV_PRODUCTS,
} from "./tienda";

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
