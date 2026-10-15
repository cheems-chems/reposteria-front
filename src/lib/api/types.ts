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

/** Sección de tienda (Dulces/Salados/Congelados). */
export interface Section {
  slug: string;
  name: string;
  orden: number;
}

/** Categoría de producto (tortas, bizcochos, postres, combos, bandejas…). */
export interface Category {
  slug: string;
  name: string;
  /** Una línea de descripción, opcional. */
  description?: string | null;
  sectionSlug?: string | null;
  /**
   * Mínimo total de unidades del armador "Arma el tuyo desde cero" de esta
   * categoría. Solo aplica a categorías con ítems de armador (`saleMode`
   * "builder"). `null`/ausente si la categoría no tiene armador.
   */
  builderMinTotalUnits?: number | null;
}

/**
 * Cómo se vende un producto. Discrimina la unión de productos:
 *   - "single"  -> precio fijo y cantidad de unidades (tortas, postres…).
 *   - "combo"   -> combo predefinido, editable o no.
 *   - "builder" -> ítem de armador ("arma el tuyo"): no se vende solo, se
 *                  elige por unidades dentro del armador. No se lista en la
 *                  tienda (se filtra por `saleMode === "builder"`).
 *   - "pack"    -> bandeja: se vende por bandeja de N unidades.
 */
export type SaleMode = "single" | "combo" | "builder" | "pack";

/** Componente de un combo: pasaboca (por slug) y unidades. */
export interface CompositionItem {
  /** Slug de un producto con `saleMode` "builder" (ítem de armador). */
  productSlug: string;
  quantity: number;
}

/**
 * Opción de preparación de un producto (crudo/frito…). `priceDelta` es el
 * ajuste por unidad en COP; 0 si el precio no cambia. Soporte conservado; hoy
 * ningún producto lo usa (las bandejas son congeladas).
 */
export interface PreparationOption {
  id: string;
  label: string;
  priceDelta: number;
  description?: string | null;
}

/** Campos comunes a todos los productos, sin importar cómo se venden. */
export interface ProductBase {
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  available: boolean;
  featured?: boolean;
  /** URL de la foto real; null si el negocio aún no la sube. */
  imageUrl?: string | null;
  /** Precio anterior tachado, si el backend envía descuento. */
  compareAt?: number | null;
  /** Descripción corta para la ficha. */
  shortDescription?: string | null;
  /** Preparaciones disponibles (crudo/frito…). Vacío si no aplica. */
  preparations?: PreparationOption[] | null;
}

/** Precio fijo y unidades del producto (tortas, bizcochos, postres). */
export interface SingleProduct extends ProductBase {
  saleMode: "single";
  /** Entero en COP. */
  price: number;
}

/**
 * Combo predefinido. `price` es el total fijo del combo y `totalUnits` sus
 * unidades. Si `editable` es true, el cliente redistribuye cantidades entre
 * `allowedItems` (por defecto, los de su composición) manteniendo el mismo
 * total de unidades; mientras el total coincida, el precio no cambia.
 */
export interface ComboProduct extends ProductBase {
  saleMode: "combo";
  /** Precio total fijo del combo, entero en COP. */
  price: number;
  totalUnits: number;
  composition: CompositionItem[];
  editable: boolean;
  /**
   * Slugs de ítems de armador que se pueden redistribuir. Si falta o está
   * vacío, se usan los de `composition`.
   */
  allowedItems?: string[];
  /** Incremento por ítem en el editor (por defecto 5). */
  stepQty: number;
}

/**
 * Ítem de armador. No es un producto de venta directa: el cliente elige
 * cantidades dentro del armador de su categoría. `unitPrice` es un estimado
 * por unidad.
 */
export interface BuilderItemProduct extends ProductBase {
  saleMode: "builder";
  /** Marca de ítem de armador (explícita en los datos). */
  comboItem: true;
  /** Precio estimado por unidad, entero en COP. */
  unitPrice: number;
  /** Incremento permitido en el selector (por defecto 5). */
  stepQty: number;
}

/** Bandeja: se vende por caja de `unitsPerPack` unidades (congelada). */
export interface PackProduct extends ProductBase {
  saleMode: "pack";
  /** Precio por bandeja, entero en COP. */
  price: number;
  /** Unidades incluidas por bandeja (p. ej. 10). */
  unitsPerPack: number;
  minPacks: number;
  stepPacks: number;
}

/**
 * Producto para listados (rejilla de tienda y flujo de encargo). Unión
 * discriminada por `saleMode`: cada variante lleva SOLO sus campos.
 */
export type ProductListItem =
  | SingleProduct
  | ComboProduct
  | BuilderItemProduct
  | PackProduct;

/** Producto completo para la ficha (/producto/[slug]). */
export type Product = ProductListItem & {
  description?: string | null;
  /** Ingredientes declarados por el negocio. Vacío si no los declara. */
  ingredients: string[];
  /** Alérgenos declarados. null = no declarados (no significa "sin"). */
  allergens?: string[] | null;
  /** Días de anticipación para el encargo. null si no aplica. */
  prepDays?: number | null;
};

/** Contenido final de un combo ya resuelto a nombres, para mostrar. */
export interface CompositionDisplay {
  name: string;
  quantity: number;
}

/**
 * Línea de un encargo (unión discriminada por `kind`). El frontend la usa
 * para el resumen y el mensaje de WhatsApp; el backend recalcula siempre los
 * precios (no confiar en el total del cliente). Todos los valores son
 * estimados.
 */
export interface SingleOrderLine {
  kind: "single";
  productSlug: string;
  name: string;
  /** Unidades (normalmente 1). */
  quantity: number;
  /** Precio estimado por unidad. */
  unitPrice: number;
}

export interface ComboOrderLine {
  kind: "combo";
  productSlug: string;
  name: string;
  totalUnits: number;
  /** Precio total estimado del combo (fijo). */
  total: number;
  /** Contenido final del combo (aunque se haya editado). */
  composition: CompositionDisplay[];
}

export interface BuilderOrderLine {
  kind: "builder";
  productSlug: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface PackOrderLine {
  kind: "pack";
  productSlug: string;
  name: string;
  /** Número de bandejas. */
  packCount: number;
  unitsPerPack: number;
  /** Precio estimado por bandeja. */
  unitPrice: number;
}

export type OrderLine =
  | SingleOrderLine
  | ComboOrderLine
  | BuilderOrderLine
  | PackOrderLine;

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
