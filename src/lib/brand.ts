// Para sustituir la marca edita solo este archivo; contacto y horarios van vacíos a propósito (llegarán del backend).

export const brand = {
  name: "Elvi's",
  wordmark: "Elvi's",
  tagline: "Hecho en casa",
  description:
    "El sabor que une, lo hacemos con amor. Hechos en casa, pensados para compartir.",

  logo: "/brand/logo-elvis.webp",
  logoMaster: "/brand/logo-elvis.png",

  // null = "foto pendiente".
  hero: {
    image: null as string | null,
    alt: "Producto de Elvi's hecho en casa",
  },

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
