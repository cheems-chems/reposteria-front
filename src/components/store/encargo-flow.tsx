"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { formatCOP } from "@/lib/format";
import { normalizeWhatsApp, whatsappUrl } from "@/lib/whatsapp";
import type { ProductListItem } from "@/lib/api";

type Fulfillment = "recogida" | "domicilio";

interface EncargoFlowProps {
  products: ProductListItem[];
  whatsapp: string | null;
  initialProductSlug?: string;
}

const STEP_TITLES = [
  "¿Qué quieres encargar?",
  "¿Para cuándo lo necesitas?",
  "¿Algo especial que debamos saber?",
  "¿Lo recoges o lo llevamos?",
];

/** Formatea 'YYYY-MM-DD' a 'DD/MM/YYYY' sin depender de la zona horaria. */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

export function EncargoFlow({
  products,
  whatsapp,
  initialProductSlug,
}: EncargoFlowProps) {
  const hasProducts = products.length > 0;
  const [step, setStep] = useState(0);
  const [productSlug, setProductSlug] = useState(
    initialProductSlug && products.some((p) => p.slug === initialProductSlug)
      ? initialProductSlug
      : hasProducts
        ? ""
        : "otro",
  );
  const [customProduct, setCustomProduct] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [details, setDetails] = useState("");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("recogida");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  const selectedProduct = products.find((p) => p.slug === productSlug);
  const waNumber = normalizeWhatsApp(whatsapp);
  const isCustom = productSlug === "otro" || !selectedProduct;

  const productLabel = isCustom
    ? customProduct.trim() || "Pedido especial"
    : (selectedProduct?.name ?? "Pedido especial");

  function validate(current: number): string | null {
    if (current === 0) {
      if (!productSlug) return "Elige un producto para continuar.";
      if (isCustom && !customProduct.trim()) {
        return "Cuéntanos qué quieres encargar.";
      }
    }
    if (current === 1) {
      if (!date) return "Indica la fecha en que lo necesitas.";
      const today = new Date();
      const [y, m, d] = date.split("-").map(Number);
      const chosen = new Date(y, (m ?? 1) - 1, d);
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      if (chosen < todayStart) return "La fecha no puede ser en el pasado.";
    }
    if (current === 3) {
      if (fulfillment === "domicilio" && !address.trim()) {
        return "Escribe la dirección para la entrega a domicilio.";
      }
      if (!name.trim()) return "Escribe tu nombre para el mensaje.";
    }
    return null;
  }

  function next() {
    const problem = validate(step);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEP_TITLES.length));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function buildMessage(): string {
    const lines = ["¡Hola! Quiero hacer un encargo:"];
    lines.push("", `Producto: ${productLabel}`);
    if (date) lines.push(`Para: ${formatDate(date)}`);
    if (people) lines.push(`Personas: ${people}`);
    if (details.trim()) lines.push(`Personalización: ${details.trim()}`);
    lines.push(
      `Entrega: ${
        fulfillment === "domicilio"
          ? `a domicilio — ${address.trim()}`
          : "recoger en el obrador"
      }`,
    );
    lines.push(`Nombre: ${name.trim()}`);
    return lines.join("\n");
  }

  function sendWhatsApp() {
    const problem = validate(3);
    if (problem) {
      setError(problem);
      return;
    }
    if (!waNumber) {
      setError(
        "El WhatsApp de la tienda aún no está configurado. Revisa brand.ts.",
      );
      return;
    }
    setError(null);
    window.open(whatsappUrl(waNumber, buildMessage()), "_blank", "noopener,noreferrer");
    setOpened(true);
  }

  const isSummary = step >= STEP_TITLES.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Progreso */}
      <div className="flex items-center justify-between gap-4">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-tinta-suave">
          {isSummary ? "Resumen" : `Paso ${step + 1} de ${STEP_TITLES.length}`}
        </p>
        <div className="flex flex-1 items-center gap-1.5">
          {STEP_TITLES.map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                index <= step ? "bg-guayaba" : "bg-crema-hondo",
              )}
            />
          ))}
        </div>
      </div>

      <div className="rounded-(--radius-soft) border border-linea bg-papel p-5 sm:p-6">
        {!isSummary ? (
          <div className="flex flex-col gap-5">
            <h2 className="font-serif text-2xl text-cacao">
              {STEP_TITLES[step]}
            </h2>

            {step === 0 ? (
              <div className="flex flex-col gap-4">
                {hasProducts ? (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {products.map((product) => (
                      <li key={product.slug}>
                        <button
                          type="button"
                          onClick={() => setProductSlug(product.slug)}
                          aria-pressed={productSlug === product.slug}
                          className={cn(
                            "w-full border px-4 py-3 text-left transition-colors",
                            productSlug === product.slug
                              ? "border-cacao bg-crema-hondo"
                              : "border-linea hover:bg-crema-hondo/60",
                          )}
                        >
                          <span className="block font-serif text-lg text-cacao">
                            {product.name}
                          </span>
                          <span className="block text-sm text-tinta-suave tabular">
                            {formatCOP(product.price)} · {product.categoryName}
                          </span>
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        type="button"
                        onClick={() => setProductSlug("otro")}
                        aria-pressed={productSlug === "otro"}
                        className={cn(
                          "w-full border px-4 py-3 text-left transition-colors",
                          productSlug === "otro"
                            ? "border-cacao bg-crema-hondo"
                            : "border-linea hover:bg-crema-hondo/60",
                        )}
                      >
                        <span className="block font-serif text-lg text-cacao">
                          Otra idea
                        </span>
                        <span className="block text-sm text-tinta-suave">
                          Cuéntanos qué tienes en mente
                        </span>
                      </button>
                    </li>
                  </ul>
                ) : null}

                {isCustom ? (
                  <Field
                    label="¿Qué quieres?"
                    htmlFor="encargo-custom"
                    required
                  >
                    <Input
                      id="encargo-custom"
                      value={customProduct}
                      onChange={(e) => setCustomProduct(e.target.value)}
                      placeholder="p. ej. torta de zanahoria para 12"
                    />
                  </Field>
                ) : null}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Fecha" htmlFor="encargo-fecha" required>
                  <Input
                    id="encargo-fecha"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Field>
                <Field
                  label="Para cuántas personas"
                  htmlFor="encargo-personas"
                  hint="Opcional"
                >
                  <Input
                    id="encargo-personas"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    placeholder="p. ej. 10"
                  />
                </Field>
              </div>
            ) : null}

            {step === 2 ? (
              <Field
                label="Personalización"
                htmlFor="encargo-detalles"
                hint="Sabor, decoración, mensaje en la torta, alérgenos a evitar…"
              >
                <Textarea
                  id="encargo-detalles"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Opcional. Cuéntanos cualquier detalle."
                />
              </Field>
            ) : null}

            {step === 3 ? (
              <div className="flex flex-col gap-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      ["recogida", "Recojo en el obrador"],
                      ["domicilio", "Entrega a domicilio"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFulfillment(value)}
                      aria-pressed={fulfillment === value}
                      className={cn(
                        "border px-4 py-3 text-left font-sans text-sm transition-colors",
                        fulfillment === value
                          ? "border-cacao bg-crema-hondo text-cacao"
                          : "border-linea text-cacao/80 hover:bg-crema-hondo/60",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {fulfillment === "domicilio" ? (
                  <Field label="Dirección de entrega" htmlFor="encargo-dir" required>
                    <Input
                      id="encargo-dir"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Calle, número, barrio, referencias"
                    />
                  </Field>
                ) : null}

                <Field label="Tu nombre" htmlFor="encargo-nombre" required>
                  <Input
                    id="encargo-nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Cómo te llamas"
                  />
                </Field>
              </div>
            ) : null}

            {error ? (
              <Alert tone="error" title="Revisa esto">
                {error}
              </Alert>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={back}
                disabled={step === 0}
              >
                Atrás
              </Button>
              <Button type="button" onClick={next}>
                Continuar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-2xl text-cacao">
              Revisa tu encargo
            </h2>

            {/* Ticket de resumen */}
            <div className="texture-paper border border-cacao bg-crema">
              <div className="flex items-center justify-between border-b border-dashed border-cacao/40 px-4 py-2">
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-tinta-suave">
                  Mi encargo
                </span>
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-tinta-suave">
                  Borrador
                </span>
              </div>
              <dl className="flex flex-col divide-y divide-dashed divide-cacao/30 px-4 py-3 text-sm">
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-tinta-suave">Producto</dt>
                  <dd className="text-right font-medium text-cacao">
                    {productLabel}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-tinta-suave">Para</dt>
                  <dd className="tabular text-right text-cacao">
                    {date ? formatDate(date) : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-tinta-suave">Personas</dt>
                  <dd className="tabular text-right text-cacao">
                    {people || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-tinta-suave">Entrega</dt>
                  <dd className="text-right text-cacao">
                    {fulfillment === "domicilio" ? "A domicilio" : "Recogida"}
                  </dd>
                </div>
                {fulfillment === "domicilio" && address.trim() ? (
                  <div className="flex justify-between gap-4 py-2">
                    <dt className="text-tinta-suave">Dirección</dt>
                    <dd className="text-right text-cacao">{address.trim()}</dd>
                  </div>
                ) : null}
                {details.trim() ? (
                  <div className="flex flex-col gap-1 py-2">
                    <dt className="text-tinta-suave">Personalización</dt>
                    <dd className="text-cacao">{details.trim()}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-tinta-suave">Nombre</dt>
                  <dd className="text-right text-cacao">{name.trim()}</dd>
                </div>
              </dl>
            </div>

            {waNumber ? (
              <Alert tone="info" title="Se abrirá WhatsApp">
                El mensaje va listo para enviar. La confirmación final del
                encargo la hace la repostería.
              </Alert>
            ) : (
              <Alert tone="warning" title="WhatsApp no configurado">
                Aún no hay número de WhatsApp en la configuración de la tienda.
                Edítalo en <code>src/lib/brand.ts</code> para activar el envío.
              </Alert>
            )}

            {opened ? (
              <Alert tone="success" title="Casi listo">
                Abrimos WhatsApp con tu encargo. Envíalo para que lo confirmemos.
              </Alert>
            ) : null}

            {error ? (
              <Alert tone="error" title="Revisa esto">
                {error}
              </Alert>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button type="button" variant="ghost" onClick={back}>
                Editar
              </Button>
              <Button type="button" onClick={sendWhatsApp} disabled={!waNumber}>
                Enviar por WhatsApp
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
