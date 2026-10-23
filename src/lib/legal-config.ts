export const legalConfig = {
  esBorrador: true,
  businessName: "Elvi's",
  legalName: null as string | null, // razón social / nombre del titular
  nit: null as string | null,
  address: null as string | null,
  city: "Santa Marta, Magdalena",
  email: null as string | null,
  privacyEmail: null as string | null,
  whatsapp: "+57 316 186 5235",
  taxesNote: null as string | null, // frase completa: "e incluyen impuestos" o "y no incluyen impuestos"
  paymentMethod: null as string | null,
  cancellationDays: null as number | null,
  lateCancellationPercent: null as string | null,
  claimHours: null as number | null,
  compensationType: null as string | null,
  deliveryMethod: null as string | null,
  deliveryZones: null as string | null,
  deliveryCost: null as string | null,
  dataRetention: null as string | null,
  hostingProvider: null as string | null,
  jurisdiction: null as string | null,
} as const;

export type LegalConfig = typeof legalConfig;
