"use client";

import { QuantityStepper } from "@/components/store/quantity-stepper";
import { cn } from "@/lib/cn";

interface QuantityRowProps {
  name: string;
  priceLine?: React.ReactNode;
  value: number;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
  disableDecrease?: boolean;
  normalizeInput?: (value: number) => number;
  nextIncrease?: (value: number) => number;
  nextDecrease?: (value: number) => number;
  subtotal?: React.ReactNode;
  warning?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  itemLabel?: string;
}

export function QuantityRow({
  name,
  priceLine,
  value,
  min = 0,
  step = 1,
  onChange,
  disableDecrease,
  normalizeInput,
  nextIncrease,
  nextDecrease,
  subtotal,
  warning,
  extra,
  className,
  itemLabel,
}: QuantityRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 py-4 px-2 sm:px-3",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="break-words font-serif text-lg text-vino">
            {name}
          </p>
          {priceLine ? (
            <p className="tabular text-sm text-texto-suave">{priceLine}</p>
          ) : null}
          {warning ? (
            <p className="text-xs text-fucsia-hover">{warning}</p>
          ) : null}
        </div>

        <div className="flex w-full justify-start sm:w-auto sm:justify-end">
          <QuantityStepper
            value={value}
            min={min}
            step={step}
            label={itemLabel ?? name}
            className="w-full flex-col items-stretch gap-1 sm:w-auto"
            disableDecrease={disableDecrease}
            normalizeInput={normalizeInput}
            nextIncrease={nextIncrease}
            nextDecrease={nextDecrease}
            onChange={onChange}
          />
        </div>
      </div>
      {extra}
      {subtotal ? (
        <p className="tabular text-sm text-texto-suave">{subtotal}</p>
      ) : null}
    </div>
  );
}
