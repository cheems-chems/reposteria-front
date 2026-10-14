"use client";

import { Input } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { formatCOP } from "@/lib/format";
import type { ProductListItem } from "@/lib/api";
import {
  buildLines,
  orderTotals,
  resolvePreparation,
  unitPriceFor,
  type BuilderSelection,
} from "@/lib/encargo";

interface PasabocaBuilderProps {
  products: ProductListItem[];
  selection: BuilderSelection;
  onChangeQuantity: (slug: string, quantity: number) => void;
  onChangePreparation: (slug: string, preparationId: string) => void;
}

/** Mínimo y paso efectivos de un producto (enteros >= 1). */
function bounds(product: ProductListItem): { min: number; step: number } {
  return {
    min: Math.max(1, product.pricing?.minQty ?? 1),
    step: Math.max(1, product.pricing?.stepQty ?? 1),
  };
}

/** Sube al siguiente múltiplo válido (>= mínimo) desde un valor cualquiera. */
function snapUp(value: number, min: number, step: number): number {
  if (value <= min) return min;
  return min + Math.ceil((value - min) / step) * step;
}

const stepButton =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-(--radius-soft) border border-linea font-sans text-xl leading-none text-cacao transition-colors duration-200 hover:bg-crema-hondo disabled:cursor-not-allowed disabled:opacity-45";

/**
 * Armador de bandeja: una fila por pasaboca con selector de cantidad y
 * preparación. El resumen de abajo se actualiza en vivo. No decide precios
 * finales: muestra un estimado.
 */
export function PasabocaBuilder({
  products,
  selection,
  onChangeQuantity,
  onChangePreparation,
}: PasabocaBuilderProps) {
  const lines = buildLines(products, selection);
  const totals = orderTotals(lines);

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col divide-y divide-linea border-y border-linea">
        {products.map((product) => {
          const { min, step } = bounds(product);
          const quantity = selection[product.slug]?.quantity ?? 0;
          const preparations = product.preparations ?? [];
          const preparation = resolvePreparation(
            product,
            selection[product.slug]?.preparationId,
          );
          const unitPrice = unitPriceFor(product.price, preparation);
          const unitLabel = product.pricing?.unitLabel ?? "unidad";
          const subtotal = unitPrice * quantity;
          const invalidStep =
            quantity > 0 && step > 1 && quantity % step !== 0;

          return (
            <li key={product.slug} className="flex flex-col gap-3 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <p className="font-serif text-lg text-cacao">
                    {product.name}
                  </p>
                  <p className="tabular text-sm text-tinta-suave">
                    {formatCOP(unitPrice)} por {unitLabel}
                  </p>
                  <p className="text-xs text-tinta-suave">
                    {step > 1
                      ? `Mínimo ${min}, de a ${step}.`
                      : `Mínimo ${min}.`}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    className={stepButton}
                    aria-label={`Quitar cantidad de ${product.name}`}
                    onClick={() =>
                      onChangeQuantity(
                        product.slug,
                        quantity <= 0 ? 0 : quantity - step < min ? 0 : quantity - step,
                      )
                    }
                    disabled={quantity <= 0}
                  >
                    −
                  </button>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={step}
                    value={quantity > 0 ? String(quantity) : ""}
                    aria-label={`Cantidad de ${product.name}`}
                    aria-invalid={invalidStep || undefined}
                    onChange={(event) => {
                      const raw = event.target.value;
                      if (raw === "") {
                        onChangeQuantity(product.slug, 0);
                        return;
                      }
                      const parsed = Math.floor(Number(raw));
                      if (Number.isNaN(parsed)) return;
                      onChangeQuantity(product.slug, Math.max(0, parsed));
                    }}
                    className="w-14 px-1 text-center"
                  />
                  <button
                    type="button"
                    className={stepButton}
                    aria-label={`Agregar cantidad de ${product.name}`}
                    onClick={() =>
                      onChangeQuantity(
                        product.slug,
                        quantity <= 0 ? min : snapUp(quantity + step, min, step),
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              {preparations.length > 0 ? (
                <fieldset className="flex flex-col gap-1.5">
                  <legend className="font-sans text-xs uppercase tracking-[0.14em] text-tinta-suave">
                    Preparación
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {preparations.map((option) => {
                      const active = preparation?.id === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            onChangePreparation(product.slug, option.id)
                          }
                          className={cn(
                            "rounded-(--radius-soft) border px-3 py-1.5 font-sans text-sm transition-colors duration-200",
                            active
                              ? "border-cacao bg-crema-hondo text-cacao"
                              : "border-linea text-cacao/80 hover:bg-crema-hondo/60",
                          )}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              {quantity > 0 ? (
                <p className="tabular text-sm text-tinta-suave">
                  Subtotal: {formatCOP(subtotal)}
                </p>
              ) : null}

              {invalidStep ? (
                <p className="text-xs font-medium text-guayaba-tinta">
                  Cantidades en múltiplos de {step}.
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-0 z-10 mt-1 flex items-center justify-between gap-4 border-t border-cacao bg-papel/95 px-1 py-3 backdrop-blur">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-tinta-suave">
            Tu bandeja
          </p>
          <p
            aria-live="polite"
            className="tabular font-serif text-lg text-cacao"
          >
            {totals.units} {totals.units === 1 ? "unidad" : "unidades"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-tinta-suave">
            Total estimado
          </p>
          <p className="tabular font-serif text-xl font-semibold text-guayaba-tinta">
            {formatCOP(totals.total)}
          </p>
        </div>
      </div>
    </div>
  );
}
