// Contrato DTO provisional: no inventar campos sin anotarlos en docs/ENDPOINTS-NECESARIOS.md; precios enteros en COP.

export interface Section {
  slug: string;
  name: string;
  orden: number;
  imageUrl?: string | null;
}

export interface Category {
  slug: string;
  name: string;
  description?: string | null;
  sectionSlug?: string | null;
  imageUrl?: string | null;
  // Mínimo de unidades del armador de esta categoría; null/ausente = sin armador.
  builderMinTotalUnits?: number | null;
}

// single = precio fijo · combo = predefinido · builder = ítem de armador (no se lista en la tienda) · pack = bandeja.
export type SaleMode = "single" | "combo" | "builder" | "pack";

export interface CompositionItem {
  /** Slug de un producto con `saleMode` "builder" (ítem de armador). */
  productSlug: string;
  quantity: number;
}

// priceDelta = ajuste por unidad en COP; hoy ningún producto usa preparaciones.
export interface PreparationOption {
  id: string;
  label: string;
  priceDelta: number;
  description?: string | null;
}

export interface ProductBase {
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  available: boolean;
  featured?: boolean;
  // null si el negocio aún no la sube.
  imageUrl?: string | null;
  /** Precio anterior tachado, si el backend envía descuento. */
  compareAt?: number | null;
  shortDescription?: string | null;
  preparations?: PreparationOption[] | null;
}

export interface SingleProduct extends ProductBase {
  saleMode: "single";
  price: number;
}

// Precio fijo: redistribuir cantidades no cambia el precio mientras totalUnits coincida.
export interface ComboProduct extends ProductBase {
  saleMode: "combo";
  price: number;
  totalUnits: number;
  composition: CompositionItem[];
  editable: boolean;
  // Si falta o está vacío, se usan los de `composition`.
  allowedItems?: string[];
  stepQty: number;
}

// No se vende solo: se elige por unidades dentro del armador; unitPrice es un estimado por unidad.
export interface BuilderItemProduct extends ProductBase {
  saleMode: "builder";
  comboItem: true;
  unitPrice: number;
  stepQty: number;
}

export interface PackProduct extends ProductBase {
  saleMode: "pack";
  price: number;
  unitsPerPack: number;
  minPacks: number;
  stepPacks: number;
}

export type ProductListItem =
  | SingleProduct
  | ComboProduct
  | BuilderItemProduct
  | PackProduct;

export type Product = ProductListItem & {
  description?: string | null;
  // Declarados por el negocio; vacío = no declarados.
  ingredients: string[];
  // null = no declarados (no significa "sin alérgenos").
  allergens?: string[] | null;
  // Días de anticipación para el encargo; null si no aplica.
  prepDays?: number | null;
};

/** Contenido final de un combo ya resuelto a nombres, para mostrar. */
export interface CompositionDisplay {
  name: string;
  quantity: number;
}

// El backend recalcula siempre los precios: no confiar en el total del cliente (todos los valores son estimados).
export interface SingleOrderLine {
  kind: "single";
  productSlug: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

/** Unidades por encima del combo, con su precio unitario. */
export interface ComboExtra {
  productSlug: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ComboOrderLine {
  kind: "combo";
  productSlug: string;
  name: string;
  totalUnits: number;
  total: number;
  /** Contenido final del combo (aunque se haya editado). */
  composition: CompositionDisplay[];
  /** Precio base del combo sin extras. */
  basePrice?: number;
  /** Unidades por encima del total base del combo. */
  extraUnits?: number;
  extras?: ComboExtra[];
  /** La distribución o el total difieren del combo original. */
  customized?: boolean;
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
  packCount: number;
  unitsPerPack: number;
  unitPrice: number;
}

export type OrderLine =
  | SingleOrderLine
  | ComboOrderLine
  | BuilderOrderLine
  | PackOrderLine;

// Hoy son marcadores de posición.
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

// true = ejemplo de desarrollo (se muestra con etiqueta EJEMPLO; en producción se oculta).
export interface Review {
  author: string;
  rating: number;
  text: string;
  example?: boolean;
}

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
