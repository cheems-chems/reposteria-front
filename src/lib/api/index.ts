/*
  ============================================================================
  API DE DATOS — ÚNICO PUNTO DE ACCESO PARA LA APP
  ----------------------------------------------------------------------------
  Las páginas y componentes NUNCA importan ./dev-data ni hacen fetch directo:
  siempre pasan por estas funciones. Así, cuando exista el backend, el cambio
  queda contenido aquí.

  Comportamiento:
    - Datos de desarrollo ON  -> devuelve los datos de ./dev-data.ts.
    - Datos de desarrollo OFF -> consulta la API real vía ./client.ts.
  ============================================================================
*/

import { useProvisionalData } from "./config";
import { fetchJson } from "./client";
import {
  DEV_CATEGORIES,
  DEV_PRODUCTS,
  DEV_STORE_INFO,
} from "./dev-data";
import type { Category, Product, ProductListItem, StoreInfo } from "./types";

export * from "./types";
export { useProvisionalData, apiBaseUrl } from "./config";

/** Reduce un producto completo a su forma de listado (sin detalle de receta). */
function toListItem(product: Product): ProductListItem {
  return {
    slug: product.slug,
    name: product.name,
    categorySlug: product.categorySlug,
    categoryName: product.categoryName,
    price: product.price,
    compareAt: product.compareAt,
    available: product.available,
    featured: product.featured,
    imageUrl: product.imageUrl,
    shortDescription: product.shortDescription,
  };
}

/** Todas las categorías, en orden de exhibición. */
export async function getCategories(): Promise<Category[]> {
  if (useProvisionalData) return DEV_CATEGORIES;
  return fetchJson<Category[]>("/categories");
}

/** Una categoría por slug, o null si no existe. */
export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  if (useProvisionalData) {
    return DEV_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }
  return fetchJson<Category | null>(
    `/categories/${encodeURIComponent(slug)}`,
  );
}

/** Productos para la tienda. Filtra por categoría si se pasa el slug. */
export async function getProducts(
  categorySlug?: string,
): Promise<ProductListItem[]> {
  if (useProvisionalData) {
    const all = DEV_PRODUCTS;
    const filtered = categorySlug
      ? all.filter((p) => p.categorySlug === categorySlug)
      : all;
    return filtered.map(toListItem);
  }
  const query = categorySlug
    ? `?category=${encodeURIComponent(categorySlug)}`
    : "";
  return fetchJson<ProductListItem[]>(`/products${query}`);
}

/** Productos destacados para la portada. */
export async function getFeaturedProducts(): Promise<ProductListItem[]> {
  if (useProvisionalData) {
    return DEV_PRODUCTS.filter((p) => p.featured).map(toListItem);
  }
  return fetchJson<ProductListItem[]>("/products?featured=true");
}

/** Un producto completo por slug, o null si no existe. */
export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  if (useProvisionalData) {
    return DEV_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  return fetchJson<Product | null>(`/products/${encodeURIComponent(slug)}`);
}

/** Datos del negocio (Configuración). */
export async function getStoreInfo(): Promise<StoreInfo> {
  if (useProvisionalData) return DEV_STORE_INFO;
  return fetchJson<StoreInfo>("/store");
}
