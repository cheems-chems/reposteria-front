/** Textos editables del footer. Los datos marcados como EJEMPLO hay que confirmarlos o reemplazarlos. */

export const footerContent = {
  tagline:
    "El sabor que une, lo hacemos con amor. Hechos en casa, pensados para compartir.",

  /** Iconos de redes. Si el href está vacío, el icono no se renderiza. */
  social: {
    // Vacío = no se muestra el icono. Pon la URL real (https://instagram.com/tu-usuario).
    instagram: "",
    // null = usa el WhatsApp de la tienda (src/lib/brand.ts).
    whatsapp: null as string | null,
  },

  /** Enlaces de la columna Tienda: mismas secciones reales del catálogo. */
  store: [
    { href: "/tienda", label: "Todo el catálogo" },
    { href: "/tienda?seccion=dulces", label: "Tortas y postres" },
    { href: "/tienda?seccion=salados", label: "Pasabocas" },
    { href: "/tienda?seccion=congelados", label: "Congelados" },
  ],

  contact: {
    whatsappLabel: "Escríbenos por WhatsApp",
    // Vacío = formatea el número de la tienda (+57 …).
    whatsappDisplay: "",
    // EJEMPLO: ciudad y horarios a confirmar.
    city: "Santa Marta, Magdalena",
    hours: [
      "Lun a sáb · 8:00 a. m.–7:00 p. m.",
    ],
  },

  legal: [
    { href: "/terminos", label: "Términos y condiciones" },
    { href: "/privacidad", label: "Política de privacidad" },
    { href: "/devoluciones", label: "Envíos y devoluciones" },
  ],

  copyright: {
    name: "Elvi's",
    suffix: "Hecho con amor",
  },
} as const;
