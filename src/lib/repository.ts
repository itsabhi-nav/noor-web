/**
 * Product repository — single seam between UI and data.
 * Today: reads the local typed mock catalogue.
 * Tomorrow (Cloudflare): swap bodies for fetch('/api/...') calls.
 * UI components must import from here, never from data/products directly.
 */
import { CATEGORIES, CATEGORY_MAP, PRODUCT_MAP, PRODUCTS } from '../data/products';
import type { Category, CategorySlug, Product } from '../data/products';

export type { Category, CategorySlug, Product };

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCT_MAP[slug];
}

export function getProductsByCategory(slug: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.category === slug);
}

export function getFeaturedProducts(count = 8): Product[] {
  const flagged = PRODUCTS.filter((p) => p.featured);
  return [...flagged, ...PRODUCTS.filter((p) => !p.featured)].slice(0, count);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  const same = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug);
  const rest = PRODUCTS.filter((p) => p.category !== product.category);
  return [...same, ...rest].slice(0, count);
}

export interface SearchOptions {
  query?: string;
  category?: CategorySlug | 'all';
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  maxPrice?: number;
  inStockOnly?: boolean;
}

export function searchProducts(opts: SearchOptions = {}): Product[] {
  const q = (opts.query ?? '').trim().toLowerCase();
  let list = [...PRODUCTS];
  if (opts.category && opts.category !== 'all') {
    list = list.filter((p) => p.category === opts.category);
  }
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }
  if (opts.inStockOnly) {
    list = list.filter((p) => p.availability === 'in-stock' || p.availability === 'low-stock');
  }
  if (typeof opts.maxPrice === 'number') {
    list = list.filter((p) => p.price <= (opts.maxPrice as number));
  }
  switch (opts.sort ?? 'featured') {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      list.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
  }
  return list;
}

export function getAllCategories(): Category[] {
  return CATEGORIES;
}

export function getCategory(slug: CategorySlug): Category {
  return CATEGORY_MAP[slug];
}

export function getPriceBounds(): { min: number; max: number } {
  const prices = PRODUCTS.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
