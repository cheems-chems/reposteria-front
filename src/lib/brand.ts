/*
  ============================================================================
  ELVI'S — IDENTIDAD DE MARCA
  ----------------------------------------------------------------------------
  Para sustituir la marca real, edita SOLO este archivo (y el logo en
  src/components/brand/logo.tsx). El logo vive en public/brand/logo-elvis.png
  (maestro 800x800) y public/brand/logo-elvis.webp (optimizado 512). Los datos
  de contacto/horarios de la tienda llegarán desde el backend (Configuración);
  aquí van vacíos a propósito.

  Foto del héroe: coloca tu archivo en public/brand/hero.jpg y pon la ruta en
  `hero.image` (p. ej. "/brand/hero.jpg"). Mientras sea null, la portada
  muestra un marcador rosa de "foto pendiente". Ver docs/CONTENIDO.md.
  ============================================================================
*/

export const brand = {
  name: "Elvi's",
  wordmark: "Elvi's",
  tagline: "Hecho en casa",
  description:
    "El sabor que une, lo hacemos con amor. Hechos en casa, pensados para compartir.",

  // Logo: master 800x800 PNG con alfa + versión optimizada 512 para header/footer.
  logo: "/brand/logo-elvis.webp",
  logoMaster: "/brand/logo-elvis.png",

  // Foto principal de la portada (ranura configurable). null = "foto pendiente".
  hero: {
    image: null as string | null,
    alt: "Producto de Elvi's hecho en casa",
  },

  // Imagen del banner de combos (se usará en la portada).
  banner: {
    combos: null as string | null,
  },

  contact: {
    city: "", // pendiente de confirmar
    address: "", // pendiente de confirmar
    whatsapp: "573161865235", // provisional
    phone: "",
    email: "",
    instagram: "",
    tiktok: "",
    hours: [] as string[], // pendiente de confirmar
  },

  provisionalData: true,
} as const;

export type Brand = typeof brand;
