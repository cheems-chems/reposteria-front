"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { PasabocaBuilder } from "@/components/store/pasaboca-builder";
import { cn } from "@/lib/cn";
import { formatCOP } from "@/lib/format";
import { normalizeWhatsApp, whatsappUrl } from "@/lib/whatsapp";
import {
  buildLines,
  lineTotal,
  orderTotals,
  selectionProblems,
  type BuilderSelection,
} from "@/lib/encargo";
import type { OrderLine, ProductListItem } from "@/lib/api";

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

/** Valor del selector del paso 0: "" | slug | "bandeja" | "otro". */
const BANDEJA = "bandeja";
const OTRO = "otro";

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
  const unitProducts = products.filter((p) => p.pricing?.mode === "perUnit");
  const simpleProducts = products.filter((p) => p.pricing?.mode !== "perUnit");
  const initialProduct = products.find((p) => p.slug === initialProductSlug);
  const initialIsUnit = initialProduct?.pricing?.mode === "perUnit";

  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<string>(() => {
    if (initialProduct) return initialIsUnit ? BANDEJA : initialProduct.slug;
    return hasProducts ? "" : OTRO;
  });
  const [tray, setTray] = useState<BuilderSelection>(() => {
    if (!initialProduct || !initialIsUnit) return {};
    const min = Math.max(1, initialProduct.pricing?.minQty ?? 1);
    return {
      [initialProduct.slug]: {
        quantity: min,
        preparationId: initialProduct.preparations?.[0]?.id ?? null,
      },
    };
  });
  const [customProduct, setCustomProduct] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [details, setDetails] = useState("");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("recogida");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  const isBandeja = choice === BANDEJA;
  const selectedProduct = simpleProducts.find((p) => p.slug === choice);
  const isCustom = choice === OTRO || (!isBandeja && !selectedProduct);
  const waNumber = normalizeWhatsApp(whatsapp);

  const productLabel = isBandeja
    ? "Bandeja de pasabocas"
    : isCustom
      ? customProduct.trim() || "Pedido especial"
      : (selectedProduct?.name ?? "Pedido especial");

  /**
   * Líneas del encargo. Un producto fijo es una línea de 1 unidad; una bandeja
   * son varias líneas con cantidad y preparación. El precio es un estimado.
   */
  const orderLines: OrderLine[] = isBandeja
    ? buildLines(unitProducts, tray)
    : selectedProduct
      ? [
          {
            productSlug: selectedProduct.slug,
            name: selectedProduct.name,
            quantity: 1,
            unitPrice: selectedProduct.price,
            preparationId: null,
            preparationLabel: null,
          },
        ]
      : [];
  const totals = orderTotals(orderLines);

  function setQuantity(slug: string, quantity: number) {
    setTray((prev) => ({
      ...prev,
      [slug]: {
        quantity,
        preparationId:
          prev[slug]?.preparationId ??
          unitProducts.find((p) => p.slug === slug)?.preparations?.[0]?.id ??
          null,
      },
    }));
  }

  function setPreparation(slug: string, preparationId: string) {
    setTray((prev) => ({
      ...prev,
      [slug]: { quantity: prev[slug]?.quantity ?? 0, preparationId },
    }));
  }

  function validate(current: number): string | null {
    if (current === 0) {
      if (!choice) return "Elige un producto para continuar.";
      if (isBandeja) {
        const problems = selectionProblems(unitProducts, tray);
        if (problems.length > 0) return problems[0];
      } else if (isCustom && !customProduct.trim()) {
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
    if (isBandeja) {
      lines.push("", "Pasabocas (bandeja):");
      for (const line of orderLines) {
        const prep = line.preparationLabel ? ` (${line.preparationLabel})` : "";
        lines.push(`- ${line.name}${prep} ×${line.quantity}`);
      }
      lines.push("", `Unidades totales: ${totals.units}`);
    } else {
      lines.push("", `Producto: ${productLabel}`);
    }
    if (date) lines.push(`Para: ${formatDate(date)}`);
    if (people) lines.push(`Personas: ${people}`);
    if (details.trim()) lines.push(`Personalización: ${details.trim()}`);
    if (totals.total > 0) {
      lines.push(
        `Precio estimado: ${formatCOP(totals.total)} (la repostería confirma el valor final)`,
      );
    }
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
                    {simpleProducts.map((product) => (
                      <li key={product.slug}>
                        <button
                          type="button"
                          onClick={() => setChoice(product.slug)}
                          aria-pressed={choice === product.slug}
                          className={cn(
                            "w-full border px-4 py-3 text-left transition-colors",
                            choice === product.slug
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
                    {unitProducts.length > 0 ? (
                      <li>
                        <button
                          type="button"
                          onClick={() => setChoice(BANDEJA)}
                          aria-pressed={isBandeja}
                          className={cn(
                            "w-full border px-4 py-3 text-left transition-colors",
                            isBandeja
                              ? "border-cacao bg-crema-hondo"
                              : "border-linea hover:bg-crema-hondo/60",
                          )}
                        >
                          <span className="block font-serif text-lg text-cacao">
                            Arma tu bandeja
                          </span>
                          <span className="block text-sm text-tinta-suave">
                            Elige pasabocas y cantidades
                          </span>
                        </button>
                      </li>
                    ) : null}
                    <li>
                      <button
                        type="button"
                        onClick={() => setChoice(OTRO)}
                        aria-pressed={isCustom}
                        className={cn(
                          "w-full border px-4 py-3 text-left transition-colors",
                          isCustom
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

                {isBandeja ? (
                  <PasabocaBuilder
                    products={unitProducts}
                    selection={tray}
                    onChangeQuantity={setQuantity}
                    onChangePreparation={setPreparation}
                  />
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
                {isBandeja ? (
                  <div className="flex flex-col gap-2 py-2">
                    <dt className="text-tinta-suave">Pasabocas</dt>
                    <dd className="flex flex-col gap-1.5">
                      {orderLines.map((line) => (
                        <span
                          key={line.productSlug}
                          className="flex justify-between gap-4 text-cacao"
                        >
                          <span>
                            {line.name}
                            {line.preparationLabel
                              ? ` · ${line.preparationLabel}`
                              : ""}
                          </span>
                          <span className="tabular whitespace-nowrap">
                            ×{line.quantity} · {formatCOP(lineTotal(line))}
                          </span>
                        </span>
                      ))}
                      <span className="mt-1 flex justify-between gap-4 border-t border-dashed border-cacao/30 pt-1.5 text-tinta-suave">
                        <span>Unidades totales</span>
                        <span className="tabular text-cacao">
                          {totals.units}
                        </span>
                      </span>
                    </dd>
                  </div>
                ) : (
                  <div className="flex justify-between gap-4 py-2">
                    <dt className="text-tinta-suave">Producto</dt>
                    <dd className="text-right font-medium text-cacao">
                      {productLabel}
                    </dd>
                  </div>
                )}
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
                  <dt className="text-tinta-suave">Precio estimado</dt>
                  <dd className="tabular text-right font-medium text-guayaba-tinta">
                    {totals.total > 0 ? formatCOP(totals.total) : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-tinta-suave">Nombre</dt>
                  <dd className="text-right text-cacao">{name.trim()}</dd>
                </div>
              </dl>
            </div>

            <p className="font-sans text-xs text-tinta-suave">
              El precio mostrado es una estimación: la repostería confirma el
              valor final por WhatsApp.
            </p>

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
