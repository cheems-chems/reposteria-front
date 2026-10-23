import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/store/legal-page";
import { legalConfig } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Borrador de política de tratamiento de datos personales.",
};

export default function PrivacidadPage() {
  const {
    businessName,
    legalName,
    nit,
    email,
    privacyEmail,
    whatsapp,
    dataRetention,
    hostingProvider,
  } = legalConfig;
  const titular = legalName ?? businessName;
  const contactoPrivacidad = privacyEmail ?? email ?? whatsapp;

  return (
    <LegalPage
      title="Política de privacidad"
      description="Tratamiento de datos personales conforme a la Ley 1581 de 2012 (Colombia)."
    >
      <LegalSection title="1. Responsable del tratamiento">
        <p>
          El responsable del tratamiento es {titular}
          {nit ? `, con NIT ${nit}` : ""}
          {email ? ` y contacto en ${email}` : ""}. Para asuntos de datos
          personales puedes escribir a {contactoPrivacidad}.
        </p>
      </LegalSection>

      <LegalSection title="2. Datos que tratamos">
        <p>
          Tratamos los datos que nos entregas al llenar el formulario de encargo
          y por WhatsApp: nombre, correo o número de WhatsApp, y el detalle de tu
          solicitud. No solicitamos datos sensibles.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalidad">
        <p>
          Usamos estos datos para responder tu solicitud, gestionar encargos y
          comunicarnos contigo sobre tu pedido. No los usamos para fines
          distintos sin tu autorización previa.
        </p>
      </LegalSection>

      <LegalSection title="4. Conservación y terceros">
        <p>
          {dataRetention ? `Conservamos los datos durante ${dataRetention}. ` : ""}
          Podemos compartirlos con proveedores que nos prestan servicios técnicos
          {hostingProvider ? ` (por ejemplo, ${hostingProvider})` : ""}, siempre
          bajo obligaciones de confidencialidad.
        </p>
      </LegalSection>

      <LegalSection title="5. Tus derechos">
        <p>
          Puedes conocer, actualizar, rectificar y solicitar la supresión de tus
          datos, así como revocar la autorización, escribiendo a{" "}
          {contactoPrivacidad}. Atenderemos tu solicitud en los términos de ley.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
