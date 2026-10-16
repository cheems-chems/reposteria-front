"use client";

import {
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  createContext,
  type ReactNode,
} from "react";
import type { OrderLine } from "@/lib/api";
import { cartCount, cartTotals, type CartItem } from "@/lib/cart";
import {
  addItem,
  clearItems,
  getServerSnapshot,
  getSnapshot,
  removeItem,
  setItemQuantity,
  subscribe,
} from "@/lib/cart-store";

interface CartContextValue {
  items: CartItem[];
  count: number;
  totals: { units: number; total: number };
  /** Número WhatsApp configurado (null si aún no hay). */
  whatsapp: string | null;
  isOpen: boolean;
  lastAddedId: string | null;
  add: (line: OrderLine) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  whatsapp,
  children,
}: {
  whatsapp: string | null;
  children: ReactNode;
}) {
  const items = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const add = useCallback((line: OrderLine) => {
    addItem(line);
    setLastAddedId(`${line.kind}:${line.productSlug}`);
    setIsOpen(true);
  }, []);

  const remove = useCallback((id: string) => removeItem(id), []);
  const setQuantity = useCallback(
    (id: string, quantity: number) => setItemQuantity(id, quantity),
    [],
  );
  const clear = useCallback(() => clearItems(), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: cartCount(items),
      totals: cartTotals(items),
      whatsapp,
      isOpen,
      lastAddedId,
      add,
      remove,
      setQuantity,
      clear,
      open,
      close,
    }),
    [
      items,
      whatsapp,
      isOpen,
      lastAddedId,
      add,
      remove,
      setQuantity,
      clear,
      open,
      close,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Acceso al carrito. Debe usarse dentro de <CartProvider>. */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de <CartProvider>.");
  }
  return ctx;
}
