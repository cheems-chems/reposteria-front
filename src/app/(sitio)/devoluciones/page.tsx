import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/store/legal-page";

export const metadata: Metadata = {
  title: "Envíos y devoluciones",
  description: "Borrador de política de entrega, cancelaciones y devoluciones.",
};

export default function DevolucionesPage() {
  return (
    <LegalPage
      title="Envíos y devoluciones"
      description="Cómo entregamos los encargos y qué pasa con cancelaciones y cambios."
    >
      <LegalSection title="1. Entrega">
        <p>
          Ofrecemos [recogida en el obrador / entrega a domicilio] en [ciudad y
          zonas]. Las entregas a domicilio tienen un costo de [valor] y se
          coordinan al confirmar el pedido.
        </p>
        <p>
          La fecha y la franja horaria se acuerdan antes de confirmar. Los
          pedidos se elaboran por encargo según los días de anticipación de cada
          producto.
        </p>
      </LegalSection>

      <LegalSection title="2. Cancelaciones">
        <p>
          Puedes cancelar sin costo si avisas con al menos [X] días de
          anticipación. Con menos antelación, puede descontarse [porcentaje] por
          insumos ya preparados.
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
          Escríbenos dentro de las [X] horas siguientes a la entrega con una foto
          y el detalle. Revisaremos el caso y propondremos [reposición /
          compensación / devolución] según corresponda.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
