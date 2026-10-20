// Textos de la portada (solo contenido; el diseño vive en src/app/(sitio)/page.tsx).

export interface TrustItem {
  text: string;
  path: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PasoItem {
  title: string;
  text: string;
}

export const trust: TrustItem[] = [
  {
    text: "Hecho en casa en Santa Marta, Magdalena",
    path: "M3 10.5 12 3l9 7.5M5.5 9.5V21h13V9.5M10 21v-6h4v6",
  },
  {
    text: "Encargos con 48 horas de anticipación (ejemplo)",
    path: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-13v5l3 2",
  },
  {
    text: "Confirmas por WhatsApp",
    path: "M4 5h16v11H9l-5 4V5Z",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "¿Cómo hago un pedido?",
    answer:
      "Eliges lo que quieras en la tienda, agregas al encargo o escribes por WhatsApp y te confirmamos la fecha y el valor.",
  },
  {
    question: "¿Con cuánta anticipación debo pedir?",
    answer:
      "Los pedidos son por encargo. Cuando armas tu combo te indicamos la anticipación según el producto antes de confirmar.",
  },
  {
    question: "¿Puedo personalizar mi combo?",
    answer:
      "Sí. En “Arma tu combo” eliges los pasabocas y ajustas la mezcla a tu gusto, desde un mínimo de 15 unidades.",
  },
  {
    question: "¿Hacen domicilios?",
    answer:
      "Coordinamos entrega o recogida por WhatsApp según la zona. Escríbenos y lo confirmamos contigo.",
  },
];

export const comoFuncionaSteps: PasoItem[] = [
  {
    title: "Elige lo que quieras",
    text: "Explora la tienda o arma tu combo a tu gusto.",
  },
  {
    title: "Cuéntanos los detalles",
    text: "Dinos fecha, ocasión y cualquier personalización.",
  },
  {
    title: "Envía por WhatsApp",
    text: "Te dejamos el mensaje listo y confirmamos el valor.",
  },
];

export const bannerCombo = {
  title: "Arma tu combo",
  text: "Arma tu combo con un mínimo de 15 unidades. Dinos qué pasabocas quieres y te lo preparamos.",
  cta: "Arma tu combo",
};

// Línea corta neutra bajo cada sección (por slug).
const sectionBlurbs: Record<string, string> = {
  dulces: "Tortas, bizcochos y postres por encargo.",
  salados: "Combos de pasabocas para compartir.",
  congelados: "Bandejas congeladas para freír en casa.",
};

export function sectionBlurb(slug: string): string {
  return sectionBlurbs[slug] ?? "Hecho por encargo, en casa.";
}

/**
 * EJEMPLO: reemplaza estos textos por los datos reales del negocio.
 * Se muestran en la franja "Información para tu pedido" de la portada.
 */
export interface PracticalItem {
  title: string;
  text: string;
  icon: "entrega" | "tiempo" | "horario";
}

export const practicalInfo: PracticalItem[] = [
  {
    icon: "entrega",
    title: "Zona de entrega",
    text: "Santa Marta y municipios cercanos. Coordinamos por WhatsApp.",
  },
  {
    icon: "tiempo",
    title: "Anticipación mínima",
    text: "48 horas para encargos. Personalizados, consultar.",
  },
  {
    icon: "horario",
    title: "Horario de atención",
    text: "Lunes a sábado, 8:00 a.m. a 6:00 p.m.",
  },
];
