"use client";

import { useState } from "react";
import { Input } from "@/components/ui/field";
import { cn } from "@/lib/cn";

const stepButton =
  "inline-flex size-11 min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-soft border border-borde font-sans text-xl leading-none text-vino transition-colors duration-200 hover:bg-rosa-claro/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fucsia disabled:cursor-not-allowed disabled:opacity-45";

interface QuantityStepperProps {
  value: number;
  min?: number;
  step?: number;
  /** Nombre del ítem, para las etiquetas accesibles. */
  label: string;
  invalid?: boolean;
  /** Bloquea el "−" aunque la cantidad sea mayor que 0 (p. ej. mínimo global). */
  disableDecrease?: boolean;
  /** Normaliza la cantidad manual al salir del campo. */
  normalizeInput?: (value: number) => number;
  nextIncrease?: (value: number) => number;
  nextDecrease?: (value: number) => number;
  className?: string;
  onChange: (value: number) => void;
}

/** El campo acepta cualquier entero; los botones respetan el paso y el mínimo. */
export function QuantityStepper({
  value,
  min = 0,
  step = 1,
  label,
  invalid,
  disableDecrease,
  normalizeInput,
  nextIncrease,
  nextDecrease,
  className,
  onChange,
}: QuantityStepperProps) {
  const [draft, setDraft] = useState(() =>
    value > 0 ? String(value) : "",
  );
  const [focused, setFocused] = useState(false);
  const [adjusted, setAdjusted] = useState<number | null>(null);

  function decrease() {
    setAdjusted(null);
    if (value <= min) {
      onChange(0);
      return;
    }
    if (nextDecrease) {
      onChange(nextDecrease(value));
      return;
    }
    const next = value - step;
    onChange(next < min ? min : next);
  }

  function increase() {
    setAdjusted(null);
    if (nextIncrease) {
      onChange(nextIncrease(value));
      return;
    }
    if (value <= 0) {
      onChange(Math.max(min, step));
      return;
    }
    onChange(value + step);
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex w-full items-center justify-between gap-1.5 sm:justify-start">
        <button
          type="button"
          className={cn(stepButton, "min-h-[40px] min-w-[40px]")}
          aria-label={`Quitar cantidad de ${label}`}
          onClick={decrease}
          disabled={value <= min || disableDecrease}
        >
          −
        </button>
        <Input
          type="number"
          inputMode="numeric"
          min={min}
          step={step}
          value={focused ? draft : value > 0 ? String(value) : "0"}
          aria-label={`Cantidad de ${label}`}
          aria-invalid={invalid || undefined}
          onFocus={() => {
            setFocused(true);
            setAdjusted(null);
            setDraft(value > 0 ? String(value) : "");
          }}
          onChange={(event) => {
            const raw = event.target.value;
            setDraft(raw);
            if (raw === "") {
              onChange(0);
              return;
            }
            const parsed = Math.floor(Number(raw));
            if (Number.isNaN(parsed)) return;
            onChange(Math.max(0, parsed));
          }}
          onBlur={() => {
            setFocused(false);
            const parsed = draft === "" ? 0 : Math.floor(Number(draft));
            const base = Number.isFinite(parsed) ? Math.max(0, parsed) : value;
            const normalized = normalizeInput ? normalizeInput(base) : base;
            if (normalized !== value) onChange(normalized);
            setDraft(normalized > 0 ? String(normalized) : "0");
            setAdjusted(normalized !== base ? normalized : null);
          }}
          className="w-[4.25rem] px-1 text-center"
        />
        <button
          type="button"
          className={cn(stepButton, "min-h-[40px] min-w-[40px]")}
          aria-label={`Agregar cantidad de ${label}`}
          onClick={increase}
        >
          +
        </button>
      </div>
      {adjusted !== null ? (
        <p role="status" className="text-xs text-fucsia-hover">
          Ajustamos la cantidad a {adjusted}.
        </p>
      ) : null}
    </div>
  );
}
