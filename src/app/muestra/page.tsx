"use client";

import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Tag } from "@/components/ui/tag";
import { PriceSeal } from "@/components/ui/price-seal";
import { StatusBadge } from "@/components/ui/status-badge";
import { Alert } from "@/components/ui/alert";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { ProductTicket } from "@/components/product/product-ticket";
import { RecipeDetail } from "@/components/product/recipe-detail";
import { Skeleton, ProductTicketSkeleton } from "@/components/states/skeleton";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { MOCK_MUESTRA } from "@/lib/dev/muestra";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Piezas internas de la muestra (solo visuales, no reutilizables)     */
/* ------------------------------------------------------------------ */

function Section({
  id,
  tag,
  title,
  note,
  children,
}: {
  id: string;
  tag: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-linea py-12">
      <div className="mb-8 flex flex-col gap-1">
        <span className="font-sans text-xs uppercase tracking-[0.2em] text-fuchsia-ink">
          {tag}
        </span>
        <h2 className="font-serif text-4xl text-brown-text">{title}</h2>
        {note ? <p className="mt-2 max-w-xl text-sm text-brown-soft">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

function TokenSwatch({
  name,
  hex,
  text,
  bg,
  note,
  ring = false,
}: {
  name: string;
  hex: string;
  text: string;
  bg: string;
  note: string;
  ring?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "borde-ticket flex h-24 items-end p-3",
          bg,
          ring && "ring-1 ring-brown-text/20",
        )}
      >
        <span className={cn("font-sans text-xs font-medium", text)}>{hex}</span>
      </div>
      <div>
        <p className="font-sans text-sm font-semibold text-brown-text">{name}</p>
        <p className="font-sans text-xs text-brown-soft">{note}</p>
      </div>
    </div>
  );
}

const orderStatuses: Array<{ label: string; tone: "kraft" | "pistacho" | "cacao" | "guayaba" | "apagado" | "neutro" }> = [
  { label: "Pendiente", tone: "kraft" },
  { label: "Confirmado", tone: "pistacho" },
  { label: "En preparación", tone: "cacao" },
  { label: "Listo para recoger", tone: "guayaba" },
  { label: "Entregado", tone: "pistacho" },
  { label: "Cancelado", tone: "apagado" },
];

function DemoForm() {
  const [values, setValues] = useState({ nombre: "", email: "", tipo: "torta" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!values.nombre.trim()) next.nombre = "Escribí tu nombre, por favor.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Revisá el correo: no parece válido.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSent(true);
      setValues({ nombre: "", email: "", tipo: "torta" });
    }
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex w-full max-w-lg flex-col gap-4 rounded-soft border border-linea bg-papel p-5"
    >
      <h3 className="font-serif text-2xl text-brown-text">Formulario demo</h3>
      <Field label="Nombre" htmlFor="demo-nombre" required error={errors.nombre}>
        <Input
          id="demo-nombre"
          name="nombre"
          value={values.nombre}
          onChange={(e) => setValues((v) => ({ ...v, nombre: e.target.value }))}
          placeholder="Tu nombre"
          aria-invalid={Boolean(errors.nombre)}
          aria-describedby={errors.nombre ? "demo-nombre-error" : undefined}
        />
      </Field>
      <Field label="Correo" htmlFor="demo-email" required error={errors.email}>
        <Input
          id="demo-email"
          name="email"
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          placeholder="tucorreo@ejemplo.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "demo-email-error" : undefined}
        />
      </Field>
      <Field label="Prefieres" htmlFor="demo-tipo" hint="Solo validamos el estado visual del formulario.">
        <Select
          id="demo-tipo"
          name="tipo"
          value={values.tipo}
          onChange={(e) => setValues((v) => ({ ...v, tipo: e.target.value }))}
        >
          <option value="torta">Torta</option>
          <option value="bizcocho">Bizcocho</option>
          <option value="postre">Postre</option>
        </Select>
      </Field>
      <Field label="Mensaje" htmlFor="demo-msg">
        <Textarea
          id="demo-msg"
          name="mensaje"
          placeholder="Contanos para cuándo lo necesitás…"
        />
      </Field>
      <Button type="submit" fullWidth>
        Enviar
      </Button>
      {sent ? (
        <Alert tone="success" title="Listo">
          Recibimos tu mensaje (demo local, sin enviar). Esto será una mutación
          real cuando exista el backend.
        </Alert>
      ) : null}
    </form>
  );
}

function DemoRetry() {
  const [failed, setFailed] = useState(true);
  return (
    <div className="w-full max-w-lg">
      {failed ? (
        <ErrorState onRetry={() => setFailed(false)} />
      ) : (
        <Alert tone="success" title="Conectado">
          El reintento funcionó. Así se verá cuando recarguemos los datos desde
          la API.
        </Alert>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export default function MuestraPage() {
  const featured = MOCK_MUESTRA.productos.find((p) => p.featured);
  const rest = MOCK_MUESTRA.productos.filter((p) => !p.featured);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
      {/* Encabezado */}
      <header className="flex flex-col gap-6 border-b-2 border-brown-text pb-10 pt-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-sans text-xs uppercase tracking-[0.24em] text-fuchsia-ink">
            Elvi&apos;s — Sistema de diseño
          </p>
          <Logo size="lg" withTagline />
        </div>
        <Alert tone="warning" className="max-w-sm" title="Marca provisional">
          Nombre, tagline y datos son{" "}
          <strong>marcadores de posición</strong>. Todo se reemplaza desde{" "}
          <code className="rounded bg-soft-pink/40 px-1 py-0.5 text-xs">src/lib/brand.ts</code>{" "}
          y{" "}
          <code className="rounded bg-soft-pink/40 px-1 py-0.5 text-xs">src/app/globals.css</code>.
        </Alert>
      </header>

      {/* Índice */}
      <nav aria-label="Secciones de la muestra" className="border-b border-linea py-4">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm text-brown-soft">
          {[
            ["marca", "Marca"],
            ["color", "Color"],
            ["tipografia", "Tipografía"],
            ["botones", "Botones"],
            ["formularios", "Formularios"],
            ["producto", "Producto"],
            ["receta", "Ficha de receta"],
            ["estados", "Estados"],
            ["etiquetas", "Etiquetas y avisos"],
          ].map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="underline decoration-kraft underline-offset-4 hover:text-brown-text">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Marca */}
      <Section id="marca" tag="01" title="Marca">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-12">
            <div className="flex flex-col gap-4">
              <Logo size="lg" withTagline />
              <Logo size="md" />
              <Logo size="sm" />
            </div>
            <div className="max-w-md text-sm text-brown-soft">
              <p>
                Wordmark tipográfico en <em>Playfair Display</em> con la tagline
                en cursiva y el logo real. Se reemplaza por completo desde{" "}
                <code className="rounded bg-soft-pink/40 px-1.5 py-0.5 text-xs">src/components/brand/logo.tsx</code>.
              </p>
              <p className="mt-3">
                Si el negocio ya tiene un logo, entra aquí y se refleja en toda
                la web.
              </p>
            </div>
          </div>

          <div className="border-2 border-dashed border-kraft bg-papel/60 p-5">
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-brown-soft">
              Datos del negocio (pendientes)
            </p>
            <p className="mt-2 max-w-2xl text-sm text-brown-text/80">
              Ciudad, WhatsApp, horarios, dirección y redes se editan en el panel
              (Configuración) y viajan desde el backend. Aquí no hay constantes
              repetidas: mientras no existan, no se muestran.
            </p>
          </div>
        </div>
      </Section>

      {/* Color */}
      <Section
        id="color"
        tag="02"
        title="Color"
        note="Paleta rosa/fucsia: fondo suave, texto café, una acción (fucsia) y acentos rosados. Contrastes AA verificados para texto."
      >
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          <TokenSwatch name="bg" hex="#FFF7F6" text="text-brown-text" bg="bg-bg" note="Fondo principal" />
          <TokenSwatch name="papel" hex="#FFFBFB" text="text-brown-text" bg="bg-papel" note="Fichas y paneles" ring />
          <TokenSwatch name="soft-pink" hex="#F6C6DA" text="text-brown-text" bg="bg-soft-pink" note="Acento suave, esqueletos" />
          <TokenSwatch name="brown-text" hex="#5B3A2E" text="text-bg" bg="bg-brown-text" note="Texto principal · AA" />
          <TokenSwatch name="brown-soft" hex="#7C5A4D" text="text-bg" bg="bg-brown-soft" note="Texto secundario · AA" />
          <TokenSwatch name="fuchsia" hex="#DC2A67" text="text-white" bg="bg-fuchsia" note="Acción (texto blanco) · AA" />
          <TokenSwatch name="fuchsia-ink" hex="#B71F53" text="text-bg" bg="bg-fuchsia-ink" note="Fucsia para texto · AA" />
          <TokenSwatch name="label-pink" hex="#D45B7E" text="text-bg" bg="bg-label-pink" note="Etiquetas y detalles" />
          <TokenSwatch name="kraft" hex="#E7B9C7" text="text-brown-text" bg="bg-kraft" note="Detalles decorativos" />
          <TokenSwatch name="linea" hex="#F0C9D2" text="text-brown-text" bg="bg-linea" note="Bordes finos" />
        </div>
      </Section>

      {/* Tipografía */}
      <Section
        id="tipografia"
        tag="03"
        title="Tipografía"
        note="Playfair Display (serif de alto contraste) para títulos y precios; Nunito Sans para texto y datos; Dancing Script solo para taglines cortas. Autohospedadas con next/font."
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            {[
              ["text-6xl", "Hecho en casa, pensado para compartir."],
              ["text-4xl", "El sabor que une, lo hacemos con amor"],
              ["text-2xl", "Hecho en casa, en tandas pequeñas"],
            ].map(([cls, txt]) => (
              <p key={cls} className={cn("font-serif italic text-brown-text", cls)}>
                {txt}
              </p>
            ))}
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-3 text-base leading-relaxed text-brown-text/90">
              <h3 className="font-serif text-2xl text-brown-text">Cuerpo (DM Sans)</h3>
              <p>
                Texto, formularios, menús y datos van en DM Sans. Voz concreta y
                cálida, sin palabras de relleno.
              </p>
              <p className="tabular">
                Cifras tabulares para precios y montos:{" "}
                <strong>$ 45.000</strong> y <strong>$ 126.500</strong> alinean
                su columna.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-soft border border-linea bg-papel p-5">
              <span className="font-sans text-xs uppercase tracking-[0.18em] text-brown-soft">
                Escala de ejemplo
              </span>
              <PriceSeal amount={45000} size="lg" compareAt={58000} />
              <p className="font-sans text-sm text-brown-soft mt-2">
                Peso cargado: solo los que usamos (Playfair Display normal +
                itálica, Nunito Sans regular).{" "}
                <span className="text-fuchsia-ink">Sin bold variante de más.</span>
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Botones */}
      <Section
        id="botones"
        tag="04"
        title="Botones"
        note="Objetivos táctiles de mínimo 44 px. Estados: normal, hover, loading, disabled."
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 flex-wrap">
            <Button>Hacer un encargo</Button>
            <Button variant="secondary">Ver todos</Button>
            <Button variant="ghost">Más detalles</Button>
            <Button variant="danger">Eliminar</Button>
            <Button loading>Guardando…</Button>
            <Button disabled>Agotado</Button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 flex-wrap">
            {(["sm", "md", "lg"] as const).map((s) => (
              <Button key={s} size={s}>
                Tamaño {s}
              </Button>
            ))}
          </div>
        </div>
      </Section>

      {/* Formularios */}
      <Section
        id="formularios"
        tag="05"
        title="Formularios"
        note="Errores por campo, tal como los devuelve la API (validación del backend es la que manda)."
      >
        <DemoForm />
      </Section>

      {/* Producto */}
      <Section
        id="producto"
        tag="06"
        title="Ficha de producto"
        note={
          "Ritmo variable en la rejilla (una ficha destacada más grande) y estados de disponibilidad. Los nombres son DATOS DE DESARROLLO para validar la dirección visual: se eliminan con el backend."
        }
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {/* Destacada ocupa 2x2 en escritorio */}
          <div className="col-span-2">
            {featured ? <ProductTicket featured product={featured} className="h-full" /> : null}
          </div>
          {rest.map((p) => (
            <ProductTicket key={p.slug} product={p} />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
          <div className="w-full max-w-xs">
            <PhotoPlaceholder name="Foto pendiente" ratio="1/1" seed={3} />
          </div>
          <p className="max-w-sm text-sm text-brown-soft">
            Estado vacío de diseño intencional: mientras el negocio no suba
            fotos reales desde el panel, no mostramos bloques grises ni stock.
          </p>
        </div>
      </Section>

      {/* Receta */}
      <Section
        id="receta"
        tag="07"
        title="Ficha de receta"
        note="Ingredientes con tipografía de recetario, alérgenos en recuadro visible y el tiempo de encargo como protagonista. Datos de desarrollo."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <RecipeDetail
            recipe={{
              description:
                "Tres capas de hojaldre fino con guayaba de la región y toque de panela. Se hornea el mismo día de la entrega.",
              ingredients: [
                "Hojaldre de mantequilla",
                "Guayaba (membrillo) de la región",
                "Crema pastelera",
                "Tapa de panela",
              ],
              allergens: ["Gluten", "Huevo", "Lácteos", "Frutos secos"],
              prepDays: 3,
            }}
          />
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-2xl text-brown-text">Cómo se lee</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-brown-soft">
              <li>El tiempo de anticipación viene del backend, no es fijo.</li>
              <li>Si el backend no trae un campo, la sección se omite.</li>
              <li>
                Los alérgenos solo se muestran si el negocio los declara
                (nunca se inventan).
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Estados */}
      <Section
        id="estados"
        tag="08"
        title="Estados de carga y error"
        note="Esqueletos con la forma real del contenido, error con reintento y lista vacía con mensaje útil."
      >
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <h3 className="mb-3 font-serif text-xl text-brown-text">Esqueleto de ficha</h3>
            <ProductTicketSkeleton />
          </div>
          <div>
            <h3 className="mb-3 font-serif text-xl text-brown-text">Error + reintento</h3>
            <DemoRetry />
          </div>
          <div>
            <h3 className="mb-3 font-serif text-xl text-brown-text">Lista vacía</h3>
            <EmptyState
              title="Aún no hay encargos"
              description="Cuando alguien haga un pedido, su encargo aparecerá acá en la agenda."
            />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          <div>
            <h3 className="mb-3 font-serif text-xl text-brown-text">Filas de tabla (admin)</h3>
            <div className="border border-linea bg-papel px-4">
              <Skeleton className="mt-4 h-4 w-32" />
              <div className="py-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-linea py-3 last:border-0">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Etiquetas y avisos */}
      <Section
        id="etiquetas"
        tag="09"
        title="Etiquetas, sellos y avisos"
        note="Estados de pedido siempre con texto además de color. Los tonos son provisionales hasta el contrato del backend."
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Tag>Tortas</Tag>
              <Tag accent="pistacho">Postres</Tag>
              <Tag accent="guayaba">Encargo</Tag>
            </div>
            <div className="flex flex-wrap gap-2">
              {orderStatuses.map((s) => (
                <StatusBadge key={s.label} label={s.label} tone={s.tone} />
              ))}
            </div>
          </div>
          <div className="flex max-w-xl flex-col gap-4">
            <Alert tone="info" title="Recuerda">
              Los encargos se confirman por WhatsApp. El pago en línea está
              pendiente de integrar.
            </Alert>
            <Alert tone="warning" title="Datos provisionales">
              Esta muestra usa marcadores de desarrollo: se reemplazan por los
              datos reales del backend.
            </Alert>
            <Alert tone="error" title="Algo salió mal">
              No pudimos guardar el encargo. Revisá la conexión e intentá de
              nuevo.
            </Alert>
          </div>
        </div>
      </Section>

      <footer className="border-t-2 border-brown-text py-8 text-center">
        <p className="font-sans text-sm text-brown-soft">
          Muestra lista para tu revisión en móvil (360–430 px) y escritorio.
          Desaprobala o pedí cambios y ajustamos antes de la etapa 3.
        </p>
      </footer>
    </main>
  );
}