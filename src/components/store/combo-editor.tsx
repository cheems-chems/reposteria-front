"use client";

import { QuantityStepper } from "@/components/store/quantity-stepper";
import { formatCOP } from "@/lib/format";
import type { BuilderItemProduct, ComboProduct } from "@/lib/api";
import { comboAllowedSlugs, comboFill, type PackSelection } from "@/lib/encargo";

interface ComboEditorProps {
  combo: ComboProduct;
  /** Todos los ítems de armador (para resolver nombres). */
  items: BuilderItemProduct[];
  /** Cantidades por slug de ítem de armador. */
  selection: PackSelection;
  onChangeQuantity: (slug: string, quantity: number) => void;
}

/**
 * Editor de un combo editable: redistribuye unidades entre los ítems
 * permitidos manteniendo el total. Mientras el total coincida, el precio no
 * cambia. Si no coincide, indica cuántas unidades faltan o sobran.
 */
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
  const fill = comboFill(combo, selection);

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col divide-y divide-linea border-y border-linea">
        {allowedItems.map((item) => {
          const quantity = selection[item.slug] ?? 0;
          return (
            <li
              key={item.slug}
              className="flex items-start justify-between gap-3 py-4"
            >
              <div className="flex flex-col gap-0.5">
                <p className="font-serif text-lg text-brown-text">
                  {item.name}
                </p>
                <p className="text-xs text-brown-soft">
                  De a {combo.stepQty}.
                </p>
              </div>
              <QuantityStepper
                value={quantity}
                step={combo.stepQty}
                label={item.name}
                onChange={(next) => onChangeQuantity(item.slug, next)}
              />
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
            {fill.units} de {fill.totalUnits}
          </p>
          {!fill.matches ? (
            <p className="text-xs font-medium text-fuchsia-ink">
              {fill.missing > 0
                ? `Faltan ${fill.missing} ${
                    fill.missing === 1 ? "unidad" : "unidades"
                  }`
                : `Sobran ${fill.excess} ${
                    fill.excess === 1 ? "unidad" : "unidades"
                  }`}
            </p>
          ) : (
            <p className="text-xs text-brown-soft">Total exacto</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-brown-soft">
            Precio del combo
          </p>
          <p className="tabular font-serif text-xl font-semibold text-fuchsia-ink">
            {formatCOP(combo.price)}
          </p>
        </div>
      </div>
    </div>
  );
}
