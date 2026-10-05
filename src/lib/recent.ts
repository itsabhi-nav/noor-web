/**
 * Recently-viewed tracker (localStorage, slugs only).
 * Read on the shop page to render a personal "pick up where you left off" rail.
 */
import { useEffect, useState } from 'react';

const KEY = 'noor-recent-v1';
const MAX = 10;

export function pushRecent(slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = (raw ? (JSON.parse(raw) as string[]) : []).filter((s) => s !== slug);
    list.unshift(slug);
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* ignore */
  }
}

export function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(list) ? list.filter((s) => typeof s === 'string').slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function clearRecent(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function useRecent(): string[] {
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => {
    setRecent(getRecent());
    const onStorage = () => setRecent(getRecent());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return recent;
}
