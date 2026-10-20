import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { brand } from "@/lib/brand";
import { normalizeWhatsApp, whatsappUrl } from "@/lib/whatsapp";

interface WhatsAppFloatProps {
  /** Número del negocio (StoreInfo.whatsapp). Si falta, no se muestra. */
  phone?: string | null;
}

/**
 * Botón flotante fijo en la esquina inferior derecha, presente en todas las
 * páginas. El número y el mensaje salen de src/lib/brand.ts.
 */
export function WhatsAppFloat({ phone }: WhatsAppFloatProps) {
  const number = normalizeWhatsApp(phone);
  if (!number) return null;

  return (
    <a
      href={whatsappUrl(number, brand.contact.whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-4 z-50 flex size-14 items-center justify-center rounded-full border-2 border-white bg-whatsapp text-white shadow-[0_10px_30px_rgba(90,18,51,0.28)] transition-transform duration-150 ease-suave hover:scale-105 hover:bg-whatsapp-hover focus-visible:scale-105 motion-reduce:hover:scale-100 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
