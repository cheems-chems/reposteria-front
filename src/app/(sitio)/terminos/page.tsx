import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/store/legal-page";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Borrador de términos y condiciones de compra y encargos.",
};

export default function TerminosPage() {
  return (
    <LegalPage
      title="Términos y condiciones"
      description="Condiciones generales de los encargos realizados en esta tienda."
    >
      <LegalSection title="1. Quién presta el servicio">
        <p>
          El presente sitio es operado por [razón social / nombre del negocio],
          identificado con [NIT], con domicilio en [dirección], [ciudad].
          Puedes contactarnos en [correo] o [WhatsApp].
        </p>
      </LegalSection>

      <LegalSection title="2. Encargos y confirmación">
        <p>
          Los productos se elaboran por encargo. Un pedido queda confirmado
          únicamente cuando [el negocio] responde aceptando la fecha y el
          detalle. La disponibilidad mostrada en el sitio es informativa y puede
          cambiar.
        </p>
        <p>
          Cada producto indica los días de anticipación necesarios. Los pedidos
          por fuera de ese plazo pueden no ser aceptados.
        </p>
      </LegalSection>

      <LegalSection title="3. Precios y pago">
        <p>
          Los precios están expresados en pesos colombianos (COP) e incluyen
          [impuestos / no incluyen impuestos]. El medio de pago es [medio de
          pago]. Nos reservamos el derecho de corregir errores evidentes de
          precio.
        </p>
      </LegalSection>

      <LegalSection title="4. Cancelaciones">
        <p>
          Al ser productos elaborados a medida y perecederos, las cancelaciones
          deben solicitarse con al menos [X] días de anticipación. Consulta la
          política de envíos y devoluciones para más detalle.
        </p>
      </LegalSection>

      <LegalSection title="5. Alérgenos">
        <p>
          Los productos pueden contener o tener contacto con alérgenos declarados
          en cada ficha. Si tienes una alergia o intolerancia, indícalo antes de
          confirmar el pedido.
        </p>
      </LegalSection>

      <LegalSection title="6. Propiedad intelectual y ley aplicable">
        <p>
          La marca, los textos y las imágenes son propiedad de [razón social].
          Estos términos se rigen por las leyes de la República de Colombia y
          cualquier controversia se someterá a [jurisdicción].
        </p>
      </LegalSection>
    </LegalPage>
  );
}
