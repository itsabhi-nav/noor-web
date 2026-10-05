import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import ProductCard from './ProductCard';
import { getAllCategories, getFeaturedProducts, getProductsByCategory } from '../lib/repository';
import type { CategorySlug } from '../lib/repository';

export default function FeaturedProducts() {
  const [tab, setTab] = useState<CategorySlug | 'featured'>('featured');
  const cats = useMemo(getAllCategories, []);
  const products = useMemo(
    () => (tab === 'featured' ? getFeaturedProducts(3) : getProductsByCategory(tab).slice(0, 3)),
    [tab],
  );

  return (
    <section className="bg-parchment/60 py-16 md:py-28" aria-label="Featured products">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-oxblood">
              03 — Featured
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl md:text-6xl font-light leading-[1.0] text-balance">
              Loved seats, honest prices.
            </h2>
          </div>
          <a
            href="/shop"
            className="rounded-full border border-ink px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] transition hover:bg-ink hover:text-ivory"
          >
            View all 100 →
          </a>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Filter featured by collection">
          {[{ slug: 'featured' as const, short: 'Spotlight' }, ...cats.map((c) => ({ slug: c.slug, short: c.short }))].map(
            (c) => (
              <button
                key={c.slug}
                role="tab"
                aria-selected={tab === c.slug}
                onClick={() => setTab(c.slug)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-[13px] font-medium transition ${
                  tab === c.slug ? 'bg-ink text-ivory' : 'border border-ink/20 bg-ivory/60 hover:border-ink'
                }`}
              >
                {c.short}
              </button>
            ),
          )}
        </div>

        <motion.div layout className="mt-8 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {products.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
