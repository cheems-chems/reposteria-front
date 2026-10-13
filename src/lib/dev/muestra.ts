import type { ProductTicketData } from "@/components/product/product-ticket";

/* ============================================================================
   DATOS DE DESARROLLO PARA /muestra — NO SON DATOS DEL NEGOCIO.
   ----------------------------------------------------------------------------
   Solo existen para validar la dirección visual (etapa 2) y se ELIMINAN en la
   etapa 3, cuando llegue el contrato del backend. Ninguno se muestra en la
   tienda pública real. Nunca usar estos nombres/precios como si fueran reales.
   ============================================================================
*/

export const MOCK_MUESTRA: { productos: ProductTicketData[] } = {
  productos: [
    {
      slug: "demo-torta-mil-hojas",
      name: "Milhojas de guayaba",
      price: 45000,
      category: "Tortas",
      available: true,
      featured: true,
    },
    {
      slug: "demo-panela-nuez",
      name: "Panela y nuez",
      price: 32000,
      category: "Bizcochos",
      available: true,
    },
    {
      slug: "demo-cuadritos-coco",
      name: "Cuadritos de coco",
      price: 28000,
      category: "Postres",
      available: false,
    },
    {
      slug: "demo-cheesecake-limon",
      name: "Tarta de limón",
      price: 52000,
      category: "Tortas",
      available: true,
      compareAt: 58000,
    },
    {
      slug: "demo-bizcocho-chocolate",
      name: "Bizcocho de chocolate",
      price: 38000,
      category: "Bizcochos",
      available: true,
    },
    {
      slug: "demo-dulce-tres-leches",
      name: "Tres leches",
      price: 49000,
      category: "Postres",
      available: true,
    },
  ],
};