"use client";

import { QuantityStepper } from "@/components/store/quantity-stepper";
import { cn } from "@/lib/cn";
import { formatCOP } from "@/lib/format";
import type { BuilderItemProduct } from "@/lib/api";
import {
  builderProblems,
  builderUnitCount,
  buildBuilderLines,
  orderTotals,
  resolvePreparation,
  unitPriceFor,
  type BuilderSelection,
} from "@/lib/encargo";

interface PasabocaBuilderProps {
  items: BuilderItemProduct[];
  selection: BuilderSelection;
  minTotalUnits: number;
  onChangeQuantity: (slug: string, quantity: number) => void;
  onChangePreparation: (slug: string, preparationId: string) => void;
}

/**
 * Armador "arma el tuyo desde cero": una fila por pasaboca con selector de
 * cantidad (y preparación, si la hubiera). Empieza todo en 0; el total se
 * estima en vivo. No decide precios finales.
 */
export function PasabocaBuilder({
  items,
  selection,
  minTotalUnits,
  onChangeQuantity,
  onChangePreparation,
}: PasabocaBuilderProps) {
  const lines = buildBuilderLines(items, selection);
  const totals = orderTotals(lines);
  const units = builderUnitCount(selection);
  const problems = builderProblems(selection, minTotalUnits);

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col divide-y divide-linea border-y border-linea">
        {items.map((item) => {
          const quantity = selection[item.slug]?.quantity ?? 0;
          const preparations = item.preparations ?? [];
          const preparation = resolvePreparation(
            item,
            selection[item.slug]?.preparationId,
          );
          const unitPrice = unitPriceFor(item.unitPrice, preparation);
          const subtotal = unitPrice * quantity;

          return (
            <li key={item.slug} className="flex flex-col gap-3 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <p className="font-serif text-lg text-brown-text">
                    {item.name}
                  </p>
                  <p className="tabular text-sm text-brown-soft">
                    {formatCOP(unitPrice)} por unidad
                  </p>
                  <p className="text-xs text-brown-soft">
                    De a {item.stepQty}.
                  </p>
                </div>

                <QuantityStepper
                  value={quantity}
                  step={item.stepQty}
                  label={item.name}
                  onChange={(next) => onChangeQuantity(item.slug, next)}
                />
              </div>

              {preparations.length > 0 ? (
                <fieldset className="flex flex-col gap-1.5">
                  <legend className="font-sans text-xs uppercase tracking-[0.14em] text-brown-soft">
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
                            onChangePreparation(item.slug, option.id)
                          }
                          className={cn(
                            "rounded-soft border px-3 py-1.5 font-sans text-sm transition-colors duration-200",
                            active
                              ? "border-brown-text bg-soft-pink/40 text-brown-text"
                              : "border-linea text-brown-text/80 hover:bg-soft-pink/40/60",
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
                <p className="tabular text-sm text-brown-soft">
                  Subtotal: {formatCOP(subtotal)}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      {problems.length > 0 ? (
        <p className="pt-2 text-xs font-medium text-fuchsia-ink">
          {problems[0]}
        </p>
      ) : null}

      <div className="sticky bottom-0 z-10 mt-1 flex items-center justify-between gap-4 border-t border-brown-text bg-papel/95 px-1 py-3 backdrop-blur">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-brown-soft">
            Tu armado
          </p>
          <p
            aria-live="polite"
            className="tabular font-serif text-lg text-brown-text"
          >
            {units} {units === 1 ? "unidad" : "unidades"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-brown-soft">
            Total estimado
          </p>
          <p className="tabular font-serif text-xl font-semibold text-fuchsia-ink">
            {formatCOP(totals.total)}
          </p>
        </div>
      </div>
    </div>
  );
}
