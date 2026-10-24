"use client";

import { QuantityRow } from "@/components/store/quantity-row";
import { cn } from "@/lib/cn";
import { formatCOP } from "@/lib/format";
import type { BuilderItemProduct } from "@/lib/api";
import {
  builderProblems,
  builderUnitCount,
  buildBuilderLines,
  decreaseBuilderQuantity,
  increaseBuilderQuantity,
  lineTotal,
  lineUnits,
  normalizeBuilderQuantity,
  orderTotals,
  resolvePreparation,
  unitPriceFor,
  type BuilderSelection,
} from "@/lib/encargo";

interface PasabocaBuilderProps {
  items: BuilderItemProduct[];
  selection: BuilderSelection;
  minUnitsPerType: number;
  onChangeQuantity: (slug: string, quantity: number) => void;
  onChangePreparation: (slug: string, preparationId: string) => void;
}

/** Empieza todo en 0, el total se estima en vivo; no decide precios finales. */
export function PasabocaBuilder({
  items,
  selection,
  minUnitsPerType,
  onChangeQuantity,
  onChangePreparation,
}: PasabocaBuilderProps) {
  const lines = buildBuilderLines(items, selection);
  const totals = orderTotals(lines);
  const units = builderUnitCount(selection);
  const problems = builderProblems(selection, minUnitsPerType);

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col divide-y divide-borde border-y border-borde pb-14 sm:pb-0">
        {items.map((item) => {
          const quantity = selection[item.slug]?.quantity ?? 0;
          const preparations = item.preparations ?? [];
          const preparation = resolvePreparation(
            item,
            selection[item.slug]?.preparationId,
          );
          const unitPrice = unitPriceFor(item.unitPrice, preparation);
          const subtotal = unitPrice * quantity;
          const warning =
            quantity > 0 &&
            (quantity < minUnitsPerType || quantity % item.stepQty !== 0)
              ? `Mínimo ${minUnitsPerType}, de a ${item.stepQty}.`
              : undefined;
          return (
            <li key={item.slug}>
              <QuantityRow
                name={item.name}
                priceLine={`${formatCOP(unitPrice)} por unidad`}
                value={quantity}
                min={minUnitsPerType}
                step={item.stepQty}
                normalizeInput={(next) =>
                  normalizeBuilderQuantity(next, minUnitsPerType, item.stepQty)
                }
                nextIncrease={(current) =>
                  increaseBuilderQuantity(current, minUnitsPerType, item.stepQty)
                }
                nextDecrease={(current) =>
                  decreaseBuilderQuantity(current, minUnitsPerType, item.stepQty)
                }
                onChange={(next) => onChangeQuantity(item.slug, next)}
                warning={warning}
                extra={
                  preparations.length > 0 ? (
                    <fieldset className="flex flex-col gap-1.5">
                      <legend className="font-sans text-xs uppercase tracking-[0.14em] text-texto-suave">
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
                                  ? "border-vino bg-rosa-claro/40 text-vino"
                                  : "border-borde text-vino/80 hover:bg-rosa-claro/40",
                              )}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  ) : undefined
                }
                subtotal={
                  quantity > 0 ? `Subtotal: ${formatCOP(subtotal)}` : undefined
                }
              />
            </li>
          );
        })}
      </ul>

      {problems.length > 0 ? (
        <p className="pt-2 text-xs font-medium text-fucsia-hover">
          {problems[0]}
        </p>
      ) : null}

      <div className="sticky bottom-0 z-10 mt-1 border-t border-vino bg-tarjeta/95 px-1 py-2">
        <div className="flex flex-col gap-1 sm:hidden">
          <p
            aria-live="polite"
            className="tabular font-serif text-base text-vino"
          >
            {units} {units === 1 ? "unidad" : "unidades"} ·{" "}
            {formatCOP(totals.total)}
          </p>
          <details>
            <summary className="cursor-pointer font-sans text-xs text-fucsia-hover">
              Ver detalle
            </summary>
            <div className="mt-1 flex flex-col gap-1 border-t border-borde pt-1 text-xs">
              {lines.length === 0 ? (
                <p className="text-texto-suave">Sin pasabocas elegidos.</p>
              ) : (
                lines.map((line) => (
                  <p
                    key={line.productSlug}
                    className="flex justify-between gap-4 text-texto-suave"
                  >
                    <span>
                      {lineUnits(line)} × {line.name}
                    </span>
                    <span className="tabular text-vino">
                      {formatCOP(lineTotal(line))}
                    </span>
                  </p>
                ))
              )}
            </div>
          </details>
        </div>

        <div className="hidden items-center justify-between gap-4 sm:flex">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-texto-suave">
              Tu armado
            </p>
            <p
              aria-live="polite"
              className="tabular font-serif text-lg text-vino"
            >
              {units} {units === 1 ? "unidad" : "unidades"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-texto-suave">
              Total estimado
            </p>
            <p className="tabular font-serif text-xl font-semibold text-fucsia-hover">
              {formatCOP(totals.total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
