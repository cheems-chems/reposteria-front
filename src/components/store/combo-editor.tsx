"use client";

import { QuantityRow } from "@/components/store/quantity-row";
import { formatCOP } from "@/lib/format";
import type { BuilderItemProduct, ComboProduct } from "@/lib/api";
import {
  calcularPrecioCombo,
  comboAllowedSlugs,
  type PackSelection,
} from "@/lib/encargo";

interface ComboEditorProps {
  combo: ComboProduct;
  /** Todos los ítems de armador (para resolver nombres y precios). */
  items: BuilderItemProduct[];
  selection: PackSelection;
  onChangeQuantity: (slug: string, quantity: number) => void;
}

/** Distribución editable; el precio base se mantiene y cada unidad extra se cobra aparte. */
export function ComboEditor({
  combo,
  items,
  selection,
  onChangeQuantity,
}: ComboEditorProps) {
  const allowedSlugs = comboAllowedSlugs(combo);
  const allowedItems = allowedSlugs
    .map((slug) => items.find((item) => item.slug === slug))
    .filter((item): item is BuilderItemProduct => Boolean(item));
  const pricing = calcularPrecioCombo(combo, selection, items);

  function changeQuantity(slug: string, quantity: number) {
    const current = selection[slug] ?? 0;
    const nextUnits = pricing.units - current + quantity;
    if (nextUnits < combo.totalUnits) return;
    onChangeQuantity(slug, quantity);
  }

  function normalizeQuantity(quantity: number, current: number): number {
    const minimum = Math.max(
      0,
      combo.totalUnits - (pricing.units - current),
    );
    if (!Number.isFinite(quantity) || quantity <= 0) return minimum;
    const rounded = Math.max(
      0,
      Math.round(quantity / combo.stepQty) * combo.stepQty,
    );
    return Math.max(rounded, minimum);
  }

  const summaryDetail = (
    <>
      {pricing.customized ? (
        <span className="inline-flex self-start rounded-full bg-rosa-claro/60 px-2 py-0.5 font-sans text-xs font-medium text-vino">
          Combo personalizado
        </span>
      ) : null}
      {pricing.extraUnits > 0 ? (
        <p className="text-xs font-medium text-fucsia-hover">
          Incluye {pricing.extraUnits}{" "}
          {pricing.extraUnits === 1 ? "unidad extra" : "unidades extra"}
        </p>
      ) : null}
      <dl className="flex flex-col gap-1 border-t border-borde pt-2 text-xs">
        <div className="flex justify-between gap-4 text-texto-suave">
          <dt>Precio base del combo</dt>
          <dd className="tabular text-vino">
            {formatCOP(pricing.basePrice)}
          </dd>
        </div>
        {pricing.extras.map((extra) => (
          <div
            key={extra.productSlug}
            className="flex justify-between gap-4 text-texto-suave"
          >
            <dt>
              Extras: {extra.quantity} × {extra.name}
            </dt>
            <dd className="tabular text-vino">
              {formatCOP(extra.subtotal)}
            </dd>
          </div>
        ))}
        {pricing.extrasTotal > 0 ? (
          <div className="flex justify-between gap-4 font-medium text-vino">
            <dt>Extras agregados</dt>
            <dd className="tabular">{formatCOP(pricing.extrasTotal)}</dd>
          </div>
        ) : null}
      </dl>
    </>
  );

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col divide-y divide-borde border-y border-borde pb-14 sm:pb-0">
        {allowedItems.map((item) => {
          const quantity = selection[item.slug] ?? 0;
          const invalidQuantity =
            quantity > 0 && quantity % combo.stepQty !== 0;
          const disableDecrease =
            quantity <= 0 ||
            pricing.units - combo.stepQty < combo.totalUnits;
          return (
            <li key={item.slug}>
              <QuantityRow
                name={item.name}
                priceLine={`${formatCOP(item.unitPrice)} por unidad extra`}
                value={quantity}
                min={0}
                step={combo.stepQty}
                disableDecrease={disableDecrease}
                normalizeInput={(next) =>
                  normalizeQuantity(next, quantity)
                }
                onChange={(next) => changeQuantity(item.slug, next)}
                warning={invalidQuantity ? `De a ${combo.stepQty}.` : undefined}
              />
            </li>
          );
        })}
      </ul>

      <p className="pt-2 text-xs text-texto-suave">
        Mínimo del combo: {combo.totalUnits} unidades. Para bajar un pasaboca,
        primero aumenta otro.
      </p>

      <div className="sticky bottom-0 z-10 mt-1 border-t border-vino bg-tarjeta/95 px-1 py-2">
        <div className="flex flex-col gap-1 sm:hidden">
          <p
            aria-live="polite"
            className="tabular font-serif text-base text-vino"
          >
            {pricing.units}{" "}
            {pricing.units === 1 ? "unidad" : "unidades"} ·{" "}
            {formatCOP(pricing.total)}
          </p>
          <details>
            <summary className="cursor-pointer font-sans text-xs text-fucsia-hover">
              Ver detalle
            </summary>
            <div className="mt-1 flex flex-col gap-1">
              {summaryDetail}
            </div>
          </details>
        </div>

        <div className="hidden flex-col gap-2 sm:flex">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-texto-suave">
                Tu armado
              </p>
              <p
                aria-live="polite"
                className="tabular font-serif text-lg text-vino"
              >
                {pricing.units}{" "}
                {pricing.units === 1 ? "unidad" : "unidades"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-texto-suave">
                Total estimado
              </p>
              <p
                aria-live="polite"
                className="tabular font-serif text-xl font-semibold text-fucsia-hover"
              >
                {formatCOP(pricing.total)}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {summaryDetail}
          </div>
        </div>
      </div>
    </div>
  );
}
