/*
  ============================================================================
  MIGAJA — IDENTIDAD DE MARCA (PROVISIONAL)
  ----------------------------------------------------------------------------
  PROVISIONAL: nombre, eslogan y datos de contacto son marcadores de posición.
  Para sustituir la marca real, edita SOLO este archivo (y el logo en
  src/components/brand/logo.tsx). Los datos de contacto/horarios de la tienda
  llegarán desde el backend (Configuración); aquí van vacíos a propósito.
  ============================================================================
*/

export const brand = {
  /** PROVISIONAL — reemplazar por el nombre real de la repostería. */
  name: "Migaja",
  /** PROVISIONAL */
  wordmark: "Migaja",
  /** PROVISIONAL */
  tagline: "obrador de repostería por encargo",
  /** PROVISIONAL — una línea de presentación, voz cálida y concreta. */
  description:
    "Horneamos por encargo, en tandas pequeñas, para que llegue fresco el día que lo necesitas.",

  /**
   * Datos del negocio: NO inventar. Se editan desde el panel (Configuración)
   * y el frontend los lee del backend. Vacíos = placeholders honestos.
   */
  contact: {
    city: "Santa Marta", // p. ej. "Barranquilla" — pendiente de confirmar
    address: "", // pendiente de confirmar
    // PLACEHOLDER editable: número de ejemplo para probar el flujo de WhatsApp.
    // Reemplazar por el WhatsApp real del negocio (formato internacional, sin +).
    whatsapp: "573161865235", // pendiente de confirmar — EJEMPLO
    phone: "",
    email: "",
    instagram: "",
    tiktok: "",
    hours: [] as string[], // pendiente de confirmar
  },

  /** Marca de datos aún no confirmados por el negocio. */
  provisionalData: true,
} as const;

export type Brand = typeof brand;
