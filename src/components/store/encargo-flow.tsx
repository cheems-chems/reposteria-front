"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { ComboEditor } from "@/components/store/combo-editor";
import { PackSelector } from "@/components/store/pack-selector";
import { PasabocaBuilder } from "@/components/store/pasaboca-builder";
import { cn } from "@/lib/cn";
import { formatCOP } from "@/lib/format";
import { normalizeWhatsApp, whatsappUrl } from "@/lib/whatsapp";
import {
  buildBuilderLines,
  buildPackLines,
  builderProblems,
  categorySaleKind,
  comboFill,
  comboOrderLine,
  comboQuantitiesOf,
  orderTotals,
  singleLine,
  type BuilderSelection,
  type PackSelection,
} from "@/lib/encargo";
import type {
  BuilderItemProduct,
  Category,
  ComboProduct,
  OrderLine,
  PackProduct,
  ProductListItem,
  SingleProduct,
} from "@/lib/api";

type Fulfillment = "recogida" | "domicilio";

interface EncargoFlowProps {
  products: ProductListItem[];
  comboItems: BuilderItemProduct[];
  categories: Category[];
  whatsapp: string | null;
  initialProductSlug?: string;
  initialCategorySlug?: string;
  /** "armar" abre directo el armador de pasabocas de la categoría. */
  initialMode?: string;
}

const STEP_TITLES = [
  "¿Qué quieres encargar?",
  "¿Para cuándo lo necesitas?",
  "¿Algo especial que debamos saber?",
  "¿Lo recoges o lo llevamos?",
];

/** Valor del selector del paso 0: "" | slug de producto | "builder" | "otro". */
const BUILDER = "builder";
const OTRO = "otro";

/** Formatea 'YYYY-MM-DD' a 'DD/MM/YYYY' sin depender de la zona horaria. */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

interface InitialState {
  categorySlug: string | null;
  choice: string;
  comboSelection: PackSelection;
  builderSelection: BuilderSelection;
  packSelection: PackSelection;
}

function builderSelectionAtMinimum(
  items: BuilderItemProduct[],
  minimum: number,
  preferredSlug?: string,
): BuilderSelection {
  const selection: BuilderSelection = {};
  const orderedItems = preferredSlug
    ? [...items].sort(
        (left, right) =>
          Number(right.slug === preferredSlug) -
          Number(left.slug === preferredSlug),
      )
    : items;
  let remaining = minimum;

  for (const item of orderedItems) {
    if (remaining <= 0) break;
    const quantity = Math.min(item.stepQty, remaining);
    selection[item.slug] = {
      quantity,
      preparationId: item.preparations?.[0]?.id ?? null,
    };
    remaining -= quantity;
  }

  return selection;
}

/** Deriva el estado inicial a partir de la URL (?categoria= / ?producto=). */
function computeInitial(props: EncargoFlowProps): InitialState {
  const { products, comboItems, categories } = props;
  const product = products.find((p) => p.slug === props.initialProductSlug);
  const comboItem = comboItems.find(
    (p) => p.slug === props.initialProductSlug,
  );

  let categorySlug: string | null = null;
  if (product) categorySlug = product.categorySlug;
  else if (comboItem) categorySlug = comboItem.categorySlug;
  else if (
    props.initialCategorySlug &&
    categories.some((c) => c.slug === props.initialCategorySlug)
  ) {
    categorySlug = props.initialCategorySlug;
  }

  const state: InitialState = {
    categorySlug,
    choice: "",
    comboSelection: {},
    builderSelection: {},
    packSelection: {},
  };

  if (!categorySlug) return state;

  const category = categories.find((item) => item.slug === categorySlug);
  const categoryItems = comboItems.filter(
    (item) => item.categorySlug === categorySlug,
  );
  const minimum = category?.builderMinTotalUnits ?? 0;

  if (product?.saleMode === "single") {
    state.choice = product.slug;
  } else if (product?.saleMode === "combo") {
    state.choice = product.slug;
    state.comboSelection = comboQuantitiesOf(product);
  } else if (product?.saleMode === "pack") {
    state.packSelection = { [product.slug]: Math.max(1, product.minPacks) };
  } else if (comboItem) {
    state.choice = BUILDER;
    state.builderSelection = builderSelectionAtMinimum(
      categoryItems,
      minimum,
      comboItem.slug,
    );
  }

  if (props.initialMode === "armar" && !product && !comboItem) {
    state.choice = BUILDER;
    state.builderSelection = builderSelectionAtMinimum(categoryItems, minimum);
  }

  return state;
}

export function EncargoFlow(props: EncargoFlowProps) {
  const {
    products,
    comboItems,
    categories,
    whatsapp,
  } = props;
  const router = useRouter();
  const initial = computeInitial(props);

  const [step, setStep] = useState(0);
  const [categorySlug, setCategorySlug] = useState<string | null>(
    initial.categorySlug,
  );
  const [choice, setChoice] = useState<string>(initial.choice);
  const [comboSelection, setComboSelection] = useState<PackSelection>(
    initial.comboSelection,
  );
  const [builderSelection, setBuilderSelection] = useState<BuilderSelection>(
    initial.builderSelection,
  );
  const [packSelection, setPackSelection] = useState<PackSelection>(
    initial.packSelection,
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
  const builderRef = useRef<HTMLDivElement | null>(null);
  const autoScrolled = useRef(false);

  const category =
    categorySlug !== null
      ? (categories.find((c) => c.slug === categorySlug) ?? null)
      : null;
  const categoryProducts =
    categorySlug !== null
      ? products.filter((p) => p.categorySlug === categorySlug)
      : [];
  const categoryItems =
    categorySlug !== null
      ? comboItems.filter((p) => p.categorySlug === categorySlug)
      : [];
  const kind = categorySlug !== null ? categorySaleKind(categoryProducts) : null;
  const minTotalUnits = category?.builderMinTotalUnits ?? 0;

  const singleProducts = categoryProducts.filter(
    (p): p is SingleProduct => p.saleMode === "single",
  );
  const comboProducts = categoryProducts.filter(
    (p): p is ComboProduct => p.saleMode === "combo",
  );
  const packProducts = categoryProducts.filter(
    (p): p is PackProduct => p.saleMode === "pack",
  );

  const selectedSingle =
    singleProducts.find((p) => p.slug === choice) ?? null;
  const selectedCombo = comboProducts.find((p) => p.slug === choice) ?? null;
  const isBuilderChoice = choice === BUILDER;
  const isCustom = choice === OTRO;
  const waNumber = normalizeWhatsApp(whatsapp);

  useEffect(() => {
    if (props.initialMode !== "armar" || !isBuilderChoice) return;
    if (autoScrolled.current) return;
    const id = window.setTimeout(() => {
      autoScrolled.current = true;
      builderRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
    return () => window.clearTimeout(id);
  }, [props.initialMode, isBuilderChoice]);

  const orderLines: OrderLine[] = (() => {
    if (categorySlug === null) return [];
    if (kind === "single") {
      return selectedSingle ? [singleLine(selectedSingle)] : [];
    }
    if (kind === "combo") {
      if (isBuilderChoice) {
        return buildBuilderLines(categoryItems, builderSelection);
      }
      if (selectedCombo) {
        return [comboOrderLine(selectedCombo, comboSelection, categoryItems)];
      }
      return [];
    }
    if (kind === "pack") {
      return buildPackLines(packProducts, packSelection);
    }
    return [];
  })();
  const totals = orderTotals(orderLines);

  function setBuilderQuantity(slug: string, quantity: number) {
    setBuilderSelection((prev) => ({
      ...prev,
      [slug]: {
        quantity,
        preparationId: prev[slug]?.preparationId ?? null,
      },
    }));
  }

  function setBuilderPreparation(slug: string, preparationId: string) {
    setBuilderSelection((prev) => ({
      ...prev,
      [slug]: { quantity: prev[slug]?.quantity ?? 0, preparationId },
    }));
  }

  function setComboQuantity(slug: string, quantity: number) {
    setComboSelection((prev) => ({ ...prev, [slug]: quantity }));
  }

  function setPackCount(slug: string, count: number) {
    setPackSelection((prev) => ({ ...prev, [slug]: count }));
  }

  function openCategory(slug: string) {
    setError(null);
    setCategorySlug(slug);
    setChoice("");
    setComboSelection({});
    setBuilderSelection({});
    setPackSelection({});
  }

  function selectCombo(combo: ComboProduct) {
    setError(null);
    setChoice(combo.slug);
    setComboSelection(comboQuantitiesOf(combo));
  }

  function selectBuilder() {
    setError(null);
    setChoice(BUILDER);
    setBuilderSelection(
      builderSelectionAtMinimum(categoryItems, minTotalUnits),
    );
  }

  /** Vuelve a la selección de tipo sin salir de /encargo. */
  function backToTypes() {
    setError(null);
    setCategorySlug(null);
    setChoice("");
    setComboSelection({});
    setBuilderSelection({});
    setPackSelection({});
  }

  function leaveEncargo() {
    setError(null);
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/tienda");
    }
  }

  function validate(current: number): string | null {
    if (current === 0) {
      if (categorySlug === null) {
        if (choice !== OTRO) return "Elige qué quieres encargar.";
        if (!customProduct.trim()) return "Cuéntanos qué quieres encargar.";
        return null;
      }
      if (kind === "single") {
        if (!selectedSingle) return "Elige un producto para continuar.";
      } else if (kind === "combo") {
        if (isBuilderChoice) {
          const problems = builderProblems(builderSelection, minTotalUnits);
          if (problems.length > 0) return problems[0];
        } else if (selectedCombo) {
          if (selectedCombo.editable) {
            const fill = comboFill(selectedCombo, comboSelection);
            if (fill.missing > 0) {
              return `Te faltan ${fill.missing} ${
                fill.missing === 1 ? "unidad" : "unidades"
              } del combo.`;
            }
          }
        } else {
          return "Elige un combo para continuar.";
        }
      } else if (kind === "pack") {
        const packs = Object.values(packSelection).reduce((a, b) => a + b, 0);
        if (packs <= 0) return "Elige al menos una bandeja.";
      } else {
        return "Esta categoría aún no tiene productos.";
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
    if (step === 0) {
      if (categorySlug !== null) {
        backToTypes();
      } else {
        leaveEncargo();
      }
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
  }

  function buildMessage(): string {
    const lines = ["¡Hola! Quiero hacer un encargo:", ""];
    if (isCustom) {
      lines.push(`Pedido especial: ${customProduct.trim()}`);
    } else {
      if (isBuilderChoice) {
        lines.push("Armado desde cero (mínimo 15 unidades):");
      }
      for (const line of orderLines) {
        switch (line.kind) {
          case "single":
            lines.push(`Producto: ${line.name}`);
            break;
          case "combo": {
            lines.push(`Combo: ${line.name} (${line.totalUnits} unidades)`);
            if (line.customized) lines.push("Combo personalizado");
            if (line.composition.length > 0) {
              lines.push(
                `Composición: ${line.composition
                  .map((item) => `${item.name} ${item.quantity}`)
                  .join(", ")}`,
              );
            }
            if (line.extraUnits && line.extraUnits > 0) {
              lines.push(
                `Incluye ${line.extraUnits} ${
                  line.extraUnits === 1 ? "unidad extra" : "unidades extra"
                }${
                  line.extras && line.extras.length > 0
                    ? `: ${line.extras
                        .map(
                          (extra) =>
                            `${extra.quantity} × ${extra.name} (${formatCOP(
                              extra.subtotal,
                            )})`,
                        )
                        .join(", ")}`
                    : ""
                }`,
              );
            }
            if (line.basePrice != null) {
              lines.push(`Precio base: ${formatCOP(line.basePrice)}`);
            }
            lines.push(`Total del combo: ${formatCOP(line.total)}`);
            break;
          }
          case "builder":
            lines.push(`- ${line.name} ×${line.quantity}`);
            break;
          case "pack":
            lines.push(
              `- ${line.name}: ${line.packCount} ${
                line.packCount === 1 ? "bandeja" : "bandejas"
              } (${line.packCount * line.unitsPerPack} unidades)`,
            );
            break;
        }
      }
      if (totals.units > 0) {
        lines.push("", `Unidades totales: ${totals.units}`);
      }
    }
    if (date) lines.push(`Para: ${formatDate(date)}`);
    if (people) lines.push(`Personas: ${people}`);
    if (details.trim()) lines.push(`Personalización: ${details.trim()}`);
    if (totals.total > 0) {
      lines.push(
        `Precio estimado: ${formatCOP(totals.total)} (confirmamos el valor final)`,
      );
    }
    lines.push(
      `Entrega: ${
        fulfillment === "domicilio"
          ? `a domicilio — ${address.trim()}`
          : "recoger en casa"
      }`,
    );
    lines.push(`Nombre: ${name.trim()}`);
    return lines.join("\n");
  }

  function sendWhatsApp() {
    if (isBuilderChoice) {
      const builderProblem = builderProblems(
        builderSelection,
        minTotalUnits,
      )[0];
      if (builderProblem) {
        setError(builderProblem);
        setStep(0);
        window.setTimeout(() => {
          builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
        return;
      }
    }

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
    window.open(
      whatsappUrl(waNumber, buildMessage()),
      "_blank",
      "noopener,noreferrer",
    );
    setOpened(true);
  }

  const isSummary = step >= STEP_TITLES.length;
  const stepHeading = (() => {
    if (step !== 0 || categorySlug === null) return STEP_TITLES[step];
    if (kind === "single") return category?.name ?? STEP_TITLES[0];
    if (kind === "combo") {
      if (isBuilderChoice) return "Arma el tuyo desde cero";
      if (isCustom) return "Otra idea";
      return selectedCombo ? "Ajusta tu combo" : (category?.name ?? "Combos");
    }
    if (kind === "pack") return "Elige tus bandejas";
    return category?.name ?? STEP_TITLES[0];
  })();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-texto-suave">
          {isSummary ? "Resumen" : `Paso ${step + 1} de ${STEP_TITLES.length}`}
        </p>
        <div className="flex flex-1 items-center gap-1.5">
          {STEP_TITLES.map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                index <= step ? "bg-fucsia" : "bg-rosa-claro/40",
              )}
            />
          ))}
        </div>
      </div>

      <div className="rounded-soft border border-borde bg-tarjeta p-5 sm:p-6">
        {!isSummary ? (
          <div className="flex flex-col gap-5">
            <h2 className="font-serif text-2xl text-vino">
              {stepHeading}
            </h2>

            {step === 0 && categorySlug !== null && kind === "pack" ? (
              <p className="text-sm text-texto-suave">
                Elige cuántas bandejas quieres de cada tipo; el total se estima
                en vivo. Son congeladas (crudas, para freír en casa).
              </p>
            ) : null}

            {step === 0 && categorySlug !== null && kind === "combo" ? (
              <p className="text-sm text-texto-suave">
                {isBuilderChoice
                  ? "Elige tus pasabocas, desde un mínimo de 15 unidades en total."
                  : "Elige un combo o arma el tuyo desde cero. Cambia los pasabocas a tu gusto. Si agregas unidades extra, se suman al total."}
              </p>
            ) : null}

            {step === 0 && categorySlug === null ? (
              <div className="flex flex-col gap-4">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {categories.map((item) => (
                    <li key={item.slug}>
                      <button
                        type="button"
                        onClick={() => openCategory(item.slug)}
                        className="w-full border border-borde px-4 py-3 text-left transition-colors hover:bg-rosa-claro/40"
                      >
                        <span className="block font-serif text-lg text-vino">
                          {item.name}
                        </span>
                        <span className="block text-sm text-texto-suave">
                          {item.description ?? "Ver productos"}
                        </span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={() => setChoice(OTRO)}
                      aria-pressed={isCustom}
                      className={cn(
                        "w-full border px-4 py-3 text-left transition-colors",
                        isCustom
                          ? "border-vino bg-rosa-claro/40"
                          : "border-borde hover:bg-rosa-claro/40",
                      )}
                    >
                      <span className="block font-serif text-lg text-vino">
                        Otra idea
                      </span>
                      <span className="block text-sm text-texto-suave">
                        Cuéntanos qué tienes en mente
                      </span>
                    </button>
                  </li>
                </ul>

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

            {step === 0 && categorySlug !== null && kind === "single" ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {singleProducts.map((product) => (
                  <li key={product.slug}>
                    <button
                      type="button"
                      onClick={() => setChoice(product.slug)}
                      aria-pressed={choice === product.slug}
                      className={cn(
                        "w-full border px-4 py-3 text-left transition-colors",
                        choice === product.slug
                          ? "border-vino bg-rosa-claro/40"
                          : "border-borde hover:bg-rosa-claro/40",
                      )}
                    >
                      <span className="block font-serif text-lg text-vino">
                        {product.name}
                      </span>
                      <span className="block text-sm text-texto-suave tabular">
                        {formatCOP(product.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {step === 0 && categorySlug !== null && kind === "combo" ? (
              <div className="flex flex-col gap-4">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {comboProducts.map((combo) => (
                    <li key={combo.slug}>
                      <button
                        type="button"
                        onClick={() => selectCombo(combo)}
                        aria-pressed={choice === combo.slug}
                        className={cn(
                          "w-full border px-4 py-3 text-left transition-colors",
                          choice === combo.slug
                            ? "border-vino bg-rosa-claro/40"
                            : "border-borde hover:bg-rosa-claro/40",
                        )}
                      >
                        <span className="block font-serif text-lg text-vino">
                          {combo.name}
                        </span>
                        <span className="block text-sm text-texto-suave tabular">
                          {formatCOP(combo.price)} · {combo.totalUnits} unidades
                        </span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={selectBuilder}
                      aria-pressed={isBuilderChoice}
                      className={cn(
                        "w-full border px-4 py-3 text-left transition-colors",
                        isBuilderChoice
                          ? "border-vino bg-rosa-claro/40"
                          : "border-borde hover:bg-rosa-claro/40",
                      )}
                    >
                      <span className="block font-serif text-lg text-vino">
                        Arma el tuyo desde cero
                      </span>
                      <span className="block text-sm text-texto-suave">
                        Elige pasabocas y cantidades
                      </span>
                    </button>
                  </li>
                </ul>

                {selectedCombo && selectedCombo.editable ? (
                  <ComboEditor
                    combo={selectedCombo}
                    items={comboItems}
                    selection={comboSelection}
                    onChangeQuantity={setComboQuantity}
                  />
                ) : null}

                {isBuilderChoice ? (
                  <div
                    ref={builderRef}
                    className="scroll-mt-24 sm:scroll-mt-28"
                  >
                    <PasabocaBuilder
                      items={categoryItems}
                      selection={builderSelection}
                      minTotalUnits={minTotalUnits}
                      onChangeQuantity={setBuilderQuantity}
                      onChangePreparation={setBuilderPreparation}
                    />
                  </div>
                ) : null}

                <Link
                  href="/encargo"
                  className="self-start font-sans text-sm text-fucsia-hover underline decoration-rosa-medio underline-offset-4 transition-colors hover:text-vino"
                >
                  ¿Quieres encargar otra cosa?
                </Link>
              </div>
            ) : null}

            {step === 0 && categorySlug !== null && kind === "pack" ? (
              <div className="flex flex-col gap-4">
                <PackSelector
                  packs={packProducts}
                  selection={packSelection}
                  onChangePacks={setPackCount}
                />
                <Link
                  href="/encargo"
                  className="self-start font-sans text-sm text-fucsia-hover underline decoration-rosa-medio underline-offset-4 transition-colors hover:text-vino"
                >
                  ¿Quieres encargar otra cosa?
                </Link>
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
                      ["recogida", "Recojo en casa"],
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
                          ? "border-vino bg-rosa-claro/40 text-vino"
                          : "border-borde text-vino/80 hover:bg-rosa-claro/40",
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
              <Button type="button" variant="ghost" onClick={back}>
                Atrás
              </Button>
              <Button type="button" onClick={next}>
                Continuar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-2xl text-vino">
              Revisa tu encargo
            </h2>

            <div className="texture-paper border border-vino bg-lienzo">
              <div className="flex items-center justify-between border-b border-dashed border-vino/40 px-4 py-2">
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-texto-suave">
                  Mi encargo
                </span>
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-texto-suave">
                  Borrador
                </span>
              </div>
              <dl className="flex flex-col divide-y divide-dashed divide-vino/30 px-4 py-3 text-sm">
                <div className="flex flex-col gap-2 py-2">
                  <dt className="text-texto-suave">
                    {isCustom ? "Pedido especial" : (category?.name ?? "Encargo")}
                  </dt>
                  <dd className="flex flex-col gap-1.5">
                    {isCustom ? (
                      <span className="text-vino">
                        {customProduct.trim() || "—"}
                      </span>
                    ) : (
                      orderLines.map((line) => (
                        <span
                          key={`${line.kind}-${line.productSlug}`}
                          className="flex justify-between gap-4 text-vino"
                        >
                          <span>
                            {line.kind === "combo"
                              ? `${line.name} · ${line.totalUnits} unidades`
                              : line.kind === "pack"
                                ? `${line.name} · ${line.packCount} ${
                                    line.packCount === 1 ? "bandeja" : "bandejas"
                                  } (${line.packCount * line.unitsPerPack} u.)`
                                : line.name}
                          </span>
                          <span className="tabular whitespace-nowrap">
                            ×
                            {line.kind === "combo"
                              ? line.totalUnits
                              : line.kind === "pack"
                                ? line.packCount * line.unitsPerPack
                                : line.quantity}{" "}
                            ·{" "}
                            {line.kind === "single"
                              ? formatCOP(line.unitPrice * line.quantity)
                              : line.kind === "builder"
                                ? formatCOP(line.unitPrice * line.quantity)
                                : line.kind === "combo"
                                  ? formatCOP(line.total)
                                  : formatCOP(line.unitPrice * line.packCount)}
                          </span>
                        </span>
                      ))
                    )}
                    {!isCustom && orderLines.length === 0 ? (
                      <span className="text-vino">—</span>
                    ) : null}
                  </dd>
                  {!isCustom && totals.units > 0 ? (
                    <span className="mt-1 flex justify-between gap-4 border-t border-dashed border-vino/30 pt-1.5 text-texto-suave">
                      <span>Unidades totales</span>
                      <span className="tabular text-vino">
                        {totals.units}
                      </span>
                    </span>
                  ) : null}
                </div>
                {orderLines.map((line) =>
                  line.kind === "combo" && line.composition.length > 0 ? (
                    <div
                      key={`comp-${line.productSlug}`}
                      className="flex flex-col gap-1 py-2"
                    >
                      <dt className="text-texto-suave">Contenido del combo</dt>
                      <dd className="flex flex-col gap-0.5 text-vino/90">
                        {line.composition.map((item) => (
                          <span key={item.name} className="tabular">
                            {item.name} ×{item.quantity}
                          </span>
                        ))}
                        {line.customized ? (
                          <span className="mt-1 font-sans text-xs font-medium text-fucsia-hover">
                            Combo personalizado
                          </span>
                        ) : null}
                        {line.extraUnits && line.extraUnits > 0 ? (
                          <span className="text-xs text-texto-suave">
                            Incluye {line.extraUnits}{" "}
                            {line.extraUnits === 1
                              ? "unidad extra"
                              : "unidades extra"}
                          </span>
                        ) : null}
                        {(line.extras ?? []).map((extra) => (
                          <span
                            key={extra.productSlug}
                            className="tabular text-xs text-texto-suave"
                          >
                            Extras: {extra.quantity} × {extra.name} ·{" "}
                            {formatCOP(extra.subtotal)}
                          </span>
                        ))}
                        {line.basePrice != null ? (
                          <span className="tabular text-xs text-texto-suave">
                            Precio base: {formatCOP(line.basePrice)}
                          </span>
                        ) : null}
                      </dd>
                    </div>
                  ) : null,
                )}
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-texto-suave">Para</dt>
                  <dd className="tabular text-right text-vino">
                    {date ? formatDate(date) : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-texto-suave">Personas</dt>
                  <dd className="tabular text-right text-vino">
                    {people || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-texto-suave">Entrega</dt>
                  <dd className="text-right text-vino">
                    {fulfillment === "domicilio" ? "A domicilio" : "Recogida"}
                  </dd>
                </div>
                {fulfillment === "domicilio" && address.trim() ? (
                  <div className="flex justify-between gap-4 py-2">
                    <dt className="text-texto-suave">Dirección</dt>
                    <dd className="text-right text-vino">
                      {address.trim()}
                    </dd>
                  </div>
                ) : null}
                {details.trim() ? (
                  <div className="flex flex-col gap-1 py-2">
                    <dt className="text-texto-suave">Personalización</dt>
                    <dd className="text-vino">{details.trim()}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-texto-suave">Precio estimado</dt>
                  <dd className="tabular text-right font-medium text-fucsia-hover">
                    {totals.total > 0 ? formatCOP(totals.total) : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-texto-suave">Nombre</dt>
                  <dd className="text-right text-vino">{name.trim()}</dd>
                </div>
              </dl>
            </div>

            <p className="font-sans text-xs text-texto-suave">
              El precio mostrado es una estimación: confirmamos el valor final
              por WhatsApp.
            </p>

            {waNumber ? (
              <Alert tone="info" title="Se abrirá WhatsApp">
                El mensaje va listo para enviar. La confirmación final del
                encargo la hacemos por WhatsApp.
              </Alert>
            ) : (
              <Alert tone="warning" title="WhatsApp no configurado">
                Aún no hay número de WhatsApp en la configuración de la tienda.
                Edítalo en <code>src/lib/brand.ts</code> para activar el envío.
              </Alert>
            )}

            {opened ? (
              <Alert tone="success" title="Casi listo">
                Abrimos WhatsApp con tu encargo. Envíalo para que lo
                confirmemos.
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
