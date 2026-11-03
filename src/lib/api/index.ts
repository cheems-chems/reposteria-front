// Único punto de acceso a datos: la app nunca importa ./dev-data ni hace fetch directo.

import { useProvisionalData } from "./config";
import { fetchJson } from "./client";
import {
  DEV_CATEGORIES,
  DEV_PRODUCTS,
  DEV_REVIEWS,
  DEV_SECTIONS,
  DEV_STORE_INFO,
} from "./dev-data";
import type {
  BuilderItemProduct,
  Category,
  Product,
  ProductBase,
  ProductListItem,
  Review,
  Section,
  StoreInfo,
} from "./types";

export * from "./types";
export { useProvisionalData, apiBaseUrl } from "./config";

export function primaryProductImage(
  product: Pick<ProductBase, "imageUrl" | "images">,
): string | null {
  return product.images?.find((image) => image.length > 0) ?? product.imageUrl ?? null;
}

export function productGalleryImages(
  product: Pick<ProductBase, "images">,
  fallbackImages: string[],
): string[] {
  const images = product.images?.filter((image) => image.length > 0) ?? [];
  return images.length > 0 ? images : fallbackImages;
}

function withPrimaryImage<T extends ProductBase>(product: T): T {
  return { ...product, imageUrl: primaryProductImage(product) };
}

export async function getSections(): Promise<Section[]> {
  if (useProvisionalData) return DEV_SECTIONS;
  return fetchJson<Section[]>("/sections");
}

function toListItem(product: Product): ProductListItem {
  const base = {
    slug: product.slug,
    name: product.name,
    purchaseMode: product.purchaseMode,
    categorySlug: product.categorySlug,
    categoryName: product.categoryName,
    available: product.available,
    featured: product.featured,
    imageUrl: primaryProductImage(product),
    images: product.images,
    compareAt: product.compareAt,
    shortDescription: product.shortDescription,
    unitLabel: product.unitLabel,
    unitCount: product.unitCount,
    preparations: product.preparations,
  };

  switch (product.saleMode) {
    case "single":
      return { ...base, saleMode: "single", price: product.price };
    case "combo":
      return {
        ...base,
        saleMode: "combo",
        price: product.price,
        totalUnits: product.totalUnits,
        composition: product.composition,
        editable: product.editable,
        allowedItems: product.allowedItems,
        stepQty: product.stepQty,
      };
    case "builder":
      return {
        ...base,
        saleMode: "builder",
        comboItem: true,
        unitPrice: product.unitPrice,
        stepQty: product.stepQty,
      };
    case "pack":
      return {
        ...base,
        saleMode: "pack",
        price: product.price,
        unitsPerPack: product.unitsPerPack,
        minPacks: product.minPacks,
        stepPacks: product.stepPacks,
      };
  }
}

export async function getCategories(): Promise<Category[]> {
  if (useProvisionalData) return DEV_CATEGORIES;
  return fetchJson<Category[]>("/categories");
}

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

// Excluye los ítems de armador (no se listan en la tienda).
export async function getProducts(
  categorySlug?: string,
): Promise<ProductListItem[]> {
  if (useProvisionalData) {
    return DEV_PRODUCTS.filter(
      (p) =>
        p.saleMode !== "builder" &&
        (!categorySlug || p.categorySlug === categorySlug),
    ).map(toListItem);
  }
  const query = categorySlug
    ? `?category=${encodeURIComponent(categorySlug)}`
    : "";
  return (await fetchJson<ProductListItem[]>(`/products${query}`)).map(withPrimaryImage);
}

// Ítems de armador: no se muestran en la tienda; se usan en el encargo.
export async function getComboItems(
  categorySlug?: string,
): Promise<BuilderItemProduct[]> {
  if (useProvisionalData) {
    return DEV_PRODUCTS.filter(
      (p) =>
        p.saleMode === "builder" &&
        (!categorySlug || p.categorySlug === categorySlug),
    ).map(withPrimaryImage) as BuilderItemProduct[];
  }
  const query = categorySlug
    ? `?category=${encodeURIComponent(categorySlug)}&saleMode=builder`
    : "?saleMode=builder";
  return (await fetchJson<BuilderItemProduct[]>(`/products${query}`)).map(withPrimaryImage);
}

export async function getFeaturedProducts(): Promise<ProductListItem[]> {
  if (useProvisionalData) {
    return DEV_PRODUCTS.filter(
      (p) => p.featured && p.saleMode !== "builder",
    ).map(toListItem);
  }
  return (await fetchJson<ProductListItem[]>("/products?featured=true")).map(withPrimaryImage);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (useProvisionalData) {
    const product = DEV_PRODUCTS.find((p) => p.slug === slug);
    return product ? withPrimaryImage(product) : null;
  }
  const product = await fetchJson<Product | null>(`/products/${encodeURIComponent(slug)}`);
  return product ? withPrimaryImage(product) : null;
}

export async function getStoreInfo(): Promise<StoreInfo> {
  if (useProvisionalData) return DEV_STORE_INFO;
  return fetchJson<StoreInfo>("/store");
}

// Reseñas: sin backend aún; en producción devuelve [] si el endpoint no existe.
export async function getReviews(): Promise<Review[]> {
  if (useProvisionalData) return DEV_REVIEWS;
  try {
    return await fetchJson<Review[]>("/reviews");
  } catch {
    return [];
  }
}
