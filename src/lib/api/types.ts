/*
  ============================================================================
  CAPA DE DATOS — DTOs TIPADOS (CONTRATO PROVISIONAL)
  ----------------------------------------------------------------------------
  Estos tipos describen lo que el frontend necesita. El backend debe
  implementarlos (ver docs/ENDPOINTS-NECESARIOS.md). Mientras no exista,
  se usan los datos de desarrollo de ./dev-data.ts.

  Regla: NO inventar campos que no estén aquí sin anotarlos en el documento
  de endpoints. Los precios son enteros en pesos colombianos (COP).
  ============================================================================
*/

/** Categoría de producto (tortas, bizcochos, postres…). */
export interface Category {
  slug: string;
  name: string;
  /** Una línea de descripción, opcional. */
  description?: string | null;
}

/** Producto para listados (rejilla de tienda). */
export interface ProductListItem {
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  /** Entero en COP. */
  price: number;
  /** Precio anterior tachado, si el backend envía descuento. */
  compareAt?: number | null;
  available: boolean;
  featured?: boolean;
  /** URL de la foto real; null si el negocio aún no la sube. */
  imageUrl?: string | null;
  /** Descripción corta para la ficha. */
  shortDescription?: string | null;
}

/** Producto completo para la ficha (/producto/[slug]). */
export interface Product extends ProductListItem {
  description?: string | null;
  /** Ingredientes declarados por el negocio. Vacío si no los declara. */
  ingredients: string[];
  /** Alérgenos declarados. null = no declarados (no significa "sin"). */
  allergens?: string[] | null;
  /** Días de anticipación para el encargo. null si no aplica. */
  prepDays?: number | null;
}

/** Datos del negocio (Configuración). Hoy son marcadores de posición. */
export interface StoreInfo {
  name: string;
  tagline: string;
  description?: string | null;
  city?: string | null;
  address?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
  email?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  /** Horarios como líneas legibles; vacío si no se han confirmado. */
  hours: string[];
}

/** Error uniforme de la capa de datos. */
export class ApiError extends Error {
  readonly status: number;
  readonly path: string;

  constructor(message: string, status: number, path: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
  }
}
