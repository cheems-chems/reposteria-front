/**
 * Utilidad mínima para combinar clases. Sin dependencias externas.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
