import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/store/legal-page";
import { legalConfig } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Envíos y devoluciones",
  description: "Borrador de política de entrega, cancelaciones y devoluciones.",
};

export default function DevolucionesPage() {
  const {
    city,
    deliveryMethod,
    deliveryZones,
    deliveryCost,
    cancellationDays,
    lateCancellationPercent,
    claimHours,
    compensationType,
  } = legalConfig;

  return (
    <LegalPage
      title="Envíos y devoluciones"
      description="Cómo entregamos los encargos y qué pasa con cancelaciones y cambios."
    >
      <LegalSection title="1. Entrega">
        <p>
          {deliveryMethod ? `Ofrecemos ${deliveryMethod}` : "Atendemos"} en{" "}
          {deliveryZones ?? city}.{" "}
          {deliveryCost
            ? `Las entregas a domicilio tienen un costo de ${deliveryCost} y se coordinan al confirmar el pedido.`
            : "Las entregas se coordinan al confirmar el pedido."}
        </p>
        <p>
          La fecha y la franja horaria se acuerdan antes de confirmar. Los
          pedidos se elaboran por encargo según los días de anticipación de cada
          producto.
        </p>
      </LegalSection>

      <LegalSection title="2. Cancelaciones">
        <p>
          {cancellationDays
            ? `Puedes cancelar sin costo si avisas con al menos ${cancellationDays} días de anticipación.`
            : ""}
          {lateCancellationPercent
            ? ` Con menos antelación, puede descontarse ${lateCancellationPercent} por insumos ya preparados.`
            : ""}
          {!cancellationDays && !lateCancellationPercent
            ? "Escríbenos por WhatsApp para gestionar una cancelación."
            : ""}
        </p>
      </LegalSection>

      <LegalSection title="3. Devoluciones">
        <p>
          Al ser productos alimenticios elaborados a medida, no aplican
          devoluciones una vez entregados, salvo defectos de calidad o errores
          imputables a nosotros.
        </p>
      </LegalSection>

      <LegalSection title="4. Si algo no salió bien">
        <p>
          Escríbenos
          {claimHours
            ? ` dentro de las ${claimHours} horas siguientes a la entrega`
            : ""}{" "}
          con una foto y el detalle. Revisaremos el caso y{" "}
          {compensationType
            ? `propondremos ${compensationType} según corresponda.`
            : "te propondremos una solución según corresponda."}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
