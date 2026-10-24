"use client";

import { QuantityRow } from "@/components/store/quantity-row";
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

/** Selector de bandejas; el total se estima en vivo. */
export function PackSelector({
  packs,
  selection,
  onChangePacks,
}: PackSelectorProps) {
  const totals = orderTotals(buildPackLines(packs, selection));

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col divide-y divide-borde border-y border-borde pb-14 sm:pb-0">
        {packs.map((pack) => {
          const count = selection[pack.slug] ?? 0;
          const units = count * pack.unitsPerPack;
          const subtotal = pack.price * count;

          return (
            <li key={pack.slug}>
              <QuantityRow
                name={pack.name}
                priceLine={`${formatCOP(pack.price)} por bandeja · ${pack.unitsPerPack} unidades`}
                value={count}
                min={0}
                step={pack.stepPacks}
                onChange={(next) => onChangePacks(pack.slug, next)}
                extra={
                  count > 0 ? (
                    <p className="tabular text-sm text-texto-suave">
                      {count} {count === 1 ? "bandeja" : "bandejas"} = {units}{" "}
                      {units === 1 ? "unidad" : "unidades"}
                    </p>
                  ) : undefined
                }
                subtotal={
                  count > 0 ? `Subtotal: ${formatCOP(subtotal)}` : undefined
                }
              />
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-0 z-10 mt-1 border-t border-vino bg-tarjeta/95 px-1 py-2">
        <div className="flex flex-col gap-1 sm:hidden">
          <p
            aria-live="polite"
            className="tabular font-serif text-base text-vino"
          >
            {totals.units} {totals.units === 1 ? "unidad" : "unidades"} ·{" "}
            {formatCOP(totals.total)}
          </p>
          <details>
            <summary className="cursor-pointer font-sans text-xs text-fucsia-hover">
              Ver detalle
            </summary>
            <div className="mt-1 flex flex-col gap-1 border-t border-borde pt-1 text-xs">
              {totals.units === 0 ? (
                <p className="text-texto-suave">Sin bandejas elegidas.</p>
              ) : (
                buildPackLines(packs, selection).map((line) => (
                  <p
                    key={line.productSlug}
                    className="flex justify-between gap-4 text-texto-suave"
                  >
                    <span>
                      {line.packCount} × {line.name}
                    </span>
                    <span className="tabular text-vino">
                      {formatCOP(line.unitPrice * line.packCount)}
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
              Unidades
            </p>
            <p aria-live="polite" className="tabular font-serif text-lg text-vino">
              {totals.units} {totals.units === 1 ? "unidad" : "unidades"}
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
