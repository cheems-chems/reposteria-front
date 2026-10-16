"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { QuantityStepper } from "@/components/store/quantity-stepper";
import { buildCartMessage, itemDescription, itemTotal } from "@/lib/cart";
import { formatCOP } from "@/lib/format";
import { normalizeWhatsApp, whatsappUrl } from "@/lib/whatsapp";
import { useCart } from "./cart-provider";

export function CartDrawer() {
  const { items, totals, whatsapp, isOpen, close, remove, setQuantity, clear } =
    useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const number = normalizeWhatsApp(whatsapp);
  const isEmpty = items.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar mi encargo"
        onClick={close}
        className="animate-aparecer absolute inset-0 cursor-default bg-vino/40 backdrop-blur-sm"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mi encargo"
        className="animate-entrar-derecha relative flex h-full w-full max-w-md flex-col border-l border-borde bg-lienzo shadow-2xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-borde px-5 py-4">
          <div>
            <h2 className="font-serif text-2xl text-vino">Mi encargo</h2>
            <p className="font-sans text-xs text-texto-suave">
              Sin pago en línea: lo confirmamos por WhatsApp.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="inline-flex size-11 items-center justify-center rounded-soft border border-borde text-vino transition-colors hover:bg-rosa-claro/40"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span
              aria-hidden="true"
              className="flex size-20 items-center justify-center rounded-full bg-rosa-claro/50 text-3xl"
            >
              🧺
            </span>
            <p className="font-serif text-xl text-vino">Tu encargo está vacío</p>
            <p className="max-w-xs text-sm text-texto-suave">
              Agrega productos desde la tienda o arma tu combo, y envíanos el
              encargo por WhatsApp.
            </p>
            <Link href="/tienda" onClick={close} className={buttonClasses({})}>
              Ver la tienda
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 py-4">
              {items.map((item) => {
                const description = itemDescription(item);
                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-3 border-b border-borde py-4 last:border-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="font-serif text-lg text-vino">
                          {item.line.name}
                        </span>
                        {description ? (
                          <span className="font-sans text-xs text-texto-suave">
                            {description}
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="shrink-0 font-sans text-xs text-fucsia-hover underline decoration-rosa-medio underline-offset-4 transition-colors hover:text-vino"
                      >
                        Quitar
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <QuantityStepper
                        value={item.quantity}
                        min={1}
                        step={1}
                        label={item.line.name}
                        onChange={(value) => setQuantity(item.id, value)}
                      />
                      <span className="tabular font-serif text-xl text-fucsia">
                        {formatCOP(itemTotal(item))}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="flex flex-col gap-3 border-t border-borde px-5 py-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-texto-suave">Unidades totales</span>
                <span className="tabular font-medium text-vino">
                  {totals.units}
                </span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <span className="text-texto-suave">Precio estimado</span>
                <span className="tabular text-right font-serif text-2xl font-bold text-fucsia">
                  {formatCOP(totals.total)}
                </span>
              </div>
              <p className="font-sans text-xs text-texto-suave">
                Es una estimación: confirmamos el valor final por WhatsApp.
              </p>

              {number ? (
                <a
                  href={whatsappUrl(number, buildCartMessage(items))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses({ size: "lg", fullWidth: true })}
                >
                  Enviar por WhatsApp
                </a>
              ) : (
                <p className="rounded-soft border border-borde bg-tarjeta px-3 py-2 text-xs text-texto-suave">
                  El WhatsApp de la tienda aún no está configurado.
                </p>
              )}

              <Button type="button" variant="ghost" onClick={clear}>
                Vaciar encargo
              </Button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
