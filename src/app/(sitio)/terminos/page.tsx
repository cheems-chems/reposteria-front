import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/store/legal-page";
import { legalConfig } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Borrador de términos y condiciones de compra y encargos.",
};

export default function TerminosPage() {
  const {
    businessName,
    legalName,
    nit,
    address,
    city,
    email,
    whatsapp,
    taxesNote,
    jurisdiction,
  } = legalConfig;
  const titular = legalName ?? businessName;

  return (
    <LegalPage
      title="Términos y condiciones"
      description="Condiciones generales de los encargos realizados en esta tienda."
    >
      <LegalSection title="1. Quién presta el servicio">
        <p>
          El presente sitio es operado por {titular}
          {nit ? `, identificado con NIT ${nit}` : ""}
          {address ? `, con domicilio en ${address}` : ""}, {city}. Puedes
          contactarnos{email ? ` en ${email}` : ""}
          {email ? " o" : " en"} {whatsapp}.
        </p>
      </LegalSection>

      <LegalSection title="2. Encargos y confirmación">
        <p>
          Los productos se elaboran por encargo. Un pedido queda confirmado
          únicamente cuando {businessName} responde aceptando la fecha y el
          detalle. La disponibilidad mostrada en el sitio es informativa y puede
          cambiar.
        </p>
        <p>
          Cada producto indica los días de anticipación necesarios. Los pedidos
          por fuera de ese plazo pueden no ser aceptados.
        </p>
        <p>
          Trabajamos con imagen de referencia: puedes enviarnos una foto y
          haremos tu torta lo más parecida posible, pero no queda idéntica. El
          sabor (por ejemplo chocolate, vainilla, zanahoria o envinada) se
          acuerda al hacer el pedido.
        </p>
      </LegalSection>

      <LegalSection title="3. Precios y pago">
        <p>
          Los precios están expresados en pesos colombianos (COP)
          {taxesNote ? ` ${taxesNote}` : ""}. Nos reservamos el derecho de
          corregir errores evidentes de precio.
        </p>
        <p>
          Para agendar una torta se paga el 50% de adelanto o el 100% del precio
          acordado. El precio acordado no incluye el domicilio, que se cobra
          aparte.
        </p>
      </LegalSection>

      <LegalSection title="4. Cancelaciones">
        <p>
          Una vez agendado el pedido no se hacen devoluciones de dinero.
          Consulta también Envíos y devoluciones.
        </p>
      </LegalSection>

      <LegalSection title="5. Alérgenos">
        <p>
          Los productos pueden contener o tener contacto con alérgenos declarados
          en cada ficha. Si tienes una alergia o intolerancia, indícalo antes de
          confirmar el pedido.
        </p>
        <p>
          Nuestras tortas se elaboran con ingredientes como leche, huevo,
          mantequilla, queso, harina, chocolate, cocoa y esencias.
        </p>
      </LegalSection>

      <LegalSection title="6. Propiedad intelectual y ley aplicable">
        <p>
          La marca, los textos y las imágenes son propiedad de {titular}. Estos
          términos se rigen por las leyes de la República de Colombia
          {jurisdiction ? ` y cualquier controversia se someterá a ${jurisdiction}` : ""}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
