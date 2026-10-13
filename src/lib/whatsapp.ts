/**
 * Utilidades de WhatsApp. El número se toma de la configuración de la tienda
 * (StoreInfo.whatsapp) y puede estar vacío mientras el negocio no lo confirme.
 */

/** Deja solo dígitos y devuelve null si no parece un número usable. */
export function normalizeWhatsApp(raw?: string | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

/** URL de wa.me con el mensaje ya codificado. */
export function whatsappUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
