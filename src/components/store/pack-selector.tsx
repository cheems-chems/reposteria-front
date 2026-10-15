"use client";

import { QuantityStepper } from "@/components/store/quantity-stepper";
import { formatCOP } from "@/lib/format";
import type { PackProduct } from "@/lib/api";
import {
  buildPackLines,
  orderTotals,
  type PackSelection,
} from "@/lib/encargo";

interface PackSelectorProps {
  packs: PackProduct[];
  selection: PackSelection;
  onChangePacks: (slug: string, count: number) => void;
}

/**
 * Selector de bandejas: una fila por bandeja con su número de bandejas,
 * unidades y subtotal. El total se estima en vivo.
 */
export function PackSelector({
  packs,
  selection,
  onChangePacks,
}: PackSelectorProps) {
  const totals = orderTotals(buildPackLines(packs, selection));

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col divide-y divide-linea border-y border-linea">
        {packs.map((pack) => {
          const count = selection[pack.slug] ?? 0;
          const units = count * pack.unitsPerPack;
          const subtotal = pack.price * count;

          return (
            <li key={pack.slug} className="flex flex-col gap-2 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <p className="font-serif text-lg text-brown-text">
                    {pack.name}
                  </p>
                  <p className="tabular text-sm text-brown-soft">
                    {formatCOP(pack.price)} por bandeja ·{" "}
                    {pack.unitsPerPack} unidades
                  </p>
                </div>
                <QuantityStepper
                  value={count}
                  step={pack.stepPacks}
                  label={pack.name}
                  onChange={(next) => onChangePacks(pack.slug, next)}
                />
              </div>
              {count > 0 ? (
                <p className="tabular text-sm text-brown-soft">
                  {count} {count === 1 ? "bandeja" : "bandejas"} = {units}{" "}
                  {units === 1 ? "unidad" : "unidades"} · Subtotal:{" "}
                  {formatCOP(subtotal)}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-0 z-10 mt-1 flex items-center justify-between gap-4 border-t border-brown-text bg-papel/95 px-1 py-3 backdrop-blur">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-brown-soft">
            Unidades
          </p>
          <p aria-live="polite" className="tabular font-serif text-lg text-brown-text">
            {totals.units} {totals.units === 1 ? "unidad" : "unidades"}
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
