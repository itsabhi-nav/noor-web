/**
 * Frontend-only cart store.
 * - Persisted to localStorage (key below), survives refresh.
 * - Only stores { slug, qty, color }. Prices are ALWAYS derived live from
 *   the catalogue via repository — never trusted from storage.
 * - Emits `noor:cart` CustomEvent + `storage` sync so header count,
 *   drawer and cart page stay consistent.
 */
import { useSyncExternalStore, useState, useEffect, useCallback } from 'react';
import { getProductBySlug } from './repository';

export interface CartLine {
  slug: string;
  qty: number;
  color?: string;
}

export interface ResolvedLine extends CartLine {
  name: string;
  sku: string;
  price: number;
  image: string;
  available: boolean;
  lineTotal: number;
}

const STORAGE_KEY = 'noor-cart-v1';
const EVENT = 'noor:cart';

function readStorage(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l) => typeof l?.slug === 'string' && Number.isFinite(l?.qty))
      .map((l) => ({
        slug: l.slug,
        qty: Math.min(99, Math.max(1, Math.floor(l.qty))),
        color: typeof l.color === 'string' ? l.color : undefined,
      }))
      .filter((l) => getProductBySlug(l.slug));
  } catch {
    return [];
  }
}

let memory: CartLine[] | null = null;

function getSnapshot(): CartLine[] {
  if (memory) return memory;
  memory = readStorage();
  return memory;
}

function persist(lines: CartLine[]) {
  memory = lines;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* storage full / private mode — cart still works in memory */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function getCartLines(): CartLine[] {
  return [...getSnapshot()];
}

export function getCartCount(): number {
  return getSnapshot().reduce((s, l) => s + l.qty, 0);
}

export function resolveCart(): { lines: ResolvedLine[]; subtotal: number; count: number } {
  const lines: ResolvedLine[] = [];
  for (const l of getSnapshot()) {
    const p = getProductBySlug(l.slug);
    if (!p) continue;
    // Out-of-stock lines are kept but flagged; totals exclude them.
    const available = p.availability !== 'out-of-stock';
    lines.push({
      ...l,
      name: p.name,
      sku: p.sku,
      price: p.price,
      image: p.images[0]?.src ?? '',
      available,
      lineTotal: available ? p.price * l.qty : 0,
    });
  }
  return { lines, subtotal: lines.reduce((s, l) => s + l.lineTotal, 0), count: lines.reduce((s, l) => s + l.qty, 0) };
}

export function addToCart(slug: string, qty = 1, color?: string): void {
  const product = getProductBySlug(slug);
  if (!product || product.availability === 'out-of-stock') return;
  const safeQty = Math.min(99, Math.max(1, Math.floor(qty)));
  const current = getSnapshot();
  const idx = current.findIndex((l) => l.slug === slug && (l.color ?? '') === (color ?? ''));
  if (idx >= 0) {
    const next = [...current];
    next[idx] = { ...next[idx], qty: Math.min(99, next[idx].qty + safeQty) };
    persist(next);
  } else {
    persist([...current, { slug, qty: safeQty, color }]);
  }
}

export function setQty(slug: string, qty: number, color?: string): void {
  const current = getSnapshot();
  const idx = current.findIndex((l) => l.slug === slug && (l.color ?? '') === (color ?? ''));
  if (idx < 0) return;
  const next = [...current];
  if (qty <= 0) {
    next.splice(idx, 1);
  } else {
    next[idx] = { ...next[idx], qty: Math.min(99, Math.max(1, Math.floor(qty))) };
  }
  persist(next);
}

export function removeLine(slug: string, color?: string): void {
  persist(getSnapshot().filter((l) => !(l.slug === slug && (l.color ?? '') === (color ?? ''))));
}

export function clearCart(): void {
  persist([]);
}

function subscribe(fn: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    memory = readStorage();
    fn();
  };
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

/** Live cart count for the header bag. */
export function useCartCount(): number {
  return useSyncExternalStore(
    subscribe,
    () => getSnapshot().reduce((s, l) => s + l.qty, 0),
    () => 0,
  );
}

export interface CartToastAction {
  label: string;
  /** CustomEvent name to dispatch on tap, e.g. 'noor:cart-open' */
  event: string;
}

export interface CartToast {
  id: number;
  message: string;
  action?: CartToastAction;
}

let toastListeners: Array<(t: CartToast) => void> = [];
export function onCartToast(fn: (t: CartToast) => void): () => void {
  toastListeners.push(fn);
  return () => {
    toastListeners = toastListeners.filter((f) => f !== fn);
  };
}
export function emitCartToast(message: string, action?: CartToastAction): void {
  const t = { id: Date.now() + Math.random(), message, action };
  toastListeners.forEach((f) => f(t));
}

export function addToCartWithToast(slug: string, qty = 1, color?: string, viewBagAction = true): boolean {
  const p = getProductBySlug(slug);
  if (!p) return false;
  if (p.availability === 'out-of-stock') {
    emitCartToast(`${p.name} is currently out of stock`);
    return false;
  }
  addToCart(slug, qty, color);
  emitCartToast(
    `Added — ${p.name}`,
    viewBagAction ? { label: 'View bag', event: 'noor:cart-open' } : undefined,
  );
  return true;
}

/** Full reactive cart state for cart page / drawer. */
export function useCartState() {
  const [version, setVersion] = useState(0);
  useEffect(() => subscribe(() => setVersion((v) => v + 1)), []);
  void version;
  return resolveCart();
}

export function useCartToastHost() {
  const [toasts, setToasts] = useState<CartToast[]>([]);
  useEffect(
    () =>
      onCartToast((t) => {
        setToasts((prev) => [...prev.slice(-2), t]);
        setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 4200);
      }),
    [],
  );
  const dismiss = useCallback((id: number) => setToasts((prev) => prev.filter((x) => x.id !== id)), []);
  return { toasts, dismiss };
}
