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

/**
 * Cómo se vende un producto.
 *   - "fixed"   -> precio único por pieza/porción (comportamiento actual).
 *   - "perUnit" -> se arma por unidades, con mínimo y paso configurables.
 */
export type SaleMode = "fixed" | "perUnit";

/** Regla de venta por unidad. Solo aplica cuando `mode` es "perUnit". */
export interface PriceRule {
  mode: SaleMode;
  /** Texto de la unidad para la interfaz: "unidad", "docena"… */
  unitLabel?: string | null;
  /** Mínimo de unidades al vender por unidad. null si no aplica. */
  minQty?: number | null;
  /** Incremento permitido en el selector (p. ej. 5 = de 5 en 5). */
  stepQty?: number | null;
}

/**
 * Opción de preparación de un producto (crudo/frito…). `priceDelta` es el
 * ajuste por unidad en COP; 0 si el precio no cambia.
 */
export interface PreparationOption {
  id: string;
  label: string;
  priceDelta: number;
  description?: string | null;
}

/** Producto para listados (rejilla de tienda). */
export interface ProductListItem {
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  /** Entero en COP. Para "perUnit" es el precio por unidad (estimado). */
  price: number;
  /** Precio anterior tachado, si el backend envía descuento. */
  compareAt?: number | null;
  available: boolean;
  featured?: boolean;
  /** URL de la foto real; null si el negocio aún no la sube. */
  imageUrl?: string | null;
  /** Descripción corta para la ficha. */
  shortDescription?: string | null;
  /** Regla de venta. Ausente o "fixed" = precio único (actual). */
  pricing?: PriceRule | null;
  /** Preparaciones disponibles (crudo/frito…). Vacío si no aplica. */
  preparations?: PreparationOption[] | null;
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

/**
 * Línea de un encargo. El frontend la usa para el resumen y el mensaje de
 * WhatsApp; el backend recalcula siempre los precios (no confiar en el total
 * del cliente). `unitPrice` es el precio estimado por unidad (base + ajuste
 * de preparación).
 */
export interface OrderLine {
  productSlug: string;
  name: string;
  quantity: number;
  unitPrice: number;
  preparationId?: string | null;
  preparationLabel?: string | null;
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
