// Almacén del carrito para useSyncExternalStore: persiste en localStorage y notifica a los suscriptores.

import type { OrderLine } from "@/lib/api";
import {
  CART_MAX_QUANTITY,
  CART_STORAGE_KEY,
  lineId,
  parseCart,
  serializeCart,
  type CartItem,
} from "@/lib/cart";

const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();

let cache: CartItem[] = EMPTY;
let initialized = false;

function readStorage(): CartItem[] {
  try {
    return parseCart(window.localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    return EMPTY;
  }
}

/** Snapshot estable para el cliente (se lee una sola vez). */
export function getSnapshot(): CartItem[] {
  if (!initialized) {
    initialized = true;
    cache = readStorage();
  }
  return cache;
}

/** Snapshot del servidor: siempre vacío (sin localStorage en SSR). */
export function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== CART_STORAGE_KEY) return;
    cache = readStorage();
    initialized = true;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function commit(next: CartItem[]): void {
  cache = next;
  initialized = true;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(next));
  } catch {
    /* modo privado o cuota llena: se ignora */
  }
  for (const listener of listeners) listener();
}

export function addItem(line: OrderLine): void {
  if (line.customizable === true) return;

  const current = getSnapshot();
  const id = lineId(line);
  const index = current.findIndex((item) => item.id === id);
  if (index >= 0) {
    const next = [...current];
    next[index] = {
      ...next[index],
      quantity: Math.min(CART_MAX_QUANTITY, next[index].quantity + 1),
    };
    commit(next);
    return;
  }
  commit([...current, { id, line, quantity: 1 }]);
}

export function removeItem(id: string): void {
  commit(getSnapshot().filter((item) => item.id !== id));
}

export function setItemQuantity(id: string, quantity: number): void {
  const current = getSnapshot();
  if (quantity <= 0) {
    commit(current.filter((item) => item.id !== id));
    return;
  }
  commit(
    current.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.min(CART_MAX_QUANTITY, Math.floor(quantity)) }
        : item,
    ),
  );
}

export function clearItems(): void {
  commit(EMPTY);
}
