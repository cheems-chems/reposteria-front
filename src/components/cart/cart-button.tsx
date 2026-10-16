"use client";

import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/cn";

function BagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function CartButton({ className }: { className?: string }) {
  const { count, open } = useCart();
  const showCount = count > 0;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={
        showCount ? `Mi encargo, ${count} ${count === 1 ? "ítem" : "ítems"}` : "Mi encargo"
      }
      className={cn(
        "relative inline-flex size-11 shrink-0 items-center justify-center rounded-soft border border-borde text-vino transition-colors duration-150 ease-suave hover:bg-rosa-claro/40",
        className,
      )}
    >
      <BagIcon className="size-5" />
      {showCount ? (
        <span className="tabular absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-fucsia px-1 text-[11px] font-semibold leading-5 text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
