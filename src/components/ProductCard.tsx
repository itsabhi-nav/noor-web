import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import type { Product } from '../lib/repository';
import { inr } from '../lib/format';
import { AVAILABILITY_LABEL } from '../data/products';
import { addToCartWithToast } from '../lib/cart';

const DOT: Record<Product['availability'], string> = {
  'in-stock': 'bg-emerald-500',
  'low-stock': 'bg-amber-500',
  'made-to-order': 'bg-sky-600',
  'out-of-stock': 'bg-ivory/60',
};

export default function ProductCard({
  product,
  index = 0,
  quickAdd = true,
}: {
  product: Product;
  index?: number;
  /**
   * When false (e.g. catalogue grids), no buy button is shown — the card
   * routes to the product detail page instead, where photos, price and
   * add-to-bag live together.
   */
  quickAdd?: boolean;
}) {
  const out = product.availability === 'out-of-stock';
  const doQuickAdd = () => addToCartWithToast(product.slug);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: Math.min(index % 4, 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-parchment aspect-[4/5]">
        <a href={`/product/${product.slug}`} aria-label={`${product.name}, ${inr(product.price)}`} className="absolute inset-0">
          <img
            src={product.images[0]?.src}
            alt={product.images[0]?.alt ?? product.name}
            loading="lazy"
            className="img-warm h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.06]"
          />
          {product.images[1] && (
            <img
              src={product.images[1].src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="img-warm absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
        </a>
        <div className="pointer-events-none absolute left-3 top-3 flex gap-2">
          {product.featured && (
            <span className="rounded-full bg-ivory/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur">
              Featured
            </span>
          )}
          {product.mrp && product.mrp > product.price && (
            <span className="rounded-full bg-oxblood px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              Save {inr(product.mrp - product.price)}
            </span>
          )}
        </div>
        <span
          className={`absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur transition-all duration-300 ${
            out ? 'bg-ink/85 text-ivory' : 'bg-ivory/90 text-ink'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${DOT[product.availability]}`} aria-hidden="true" />
          {AVAILABILITY_LABEL[product.availability]}
        </span>
        {/* desktop hover quick-add (only where quickAdd is enabled) */}
        {!out && quickAdd && (
          <div className="absolute inset-x-3 bottom-3 hidden translate-y-[130%] transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0 md:block">
            <button
              onClick={doQuickAdd}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ivory/95 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink opacity-0 backdrop-blur transition-opacity duration-300 hover:bg-oxblood hover:text-white group-hover:opacity-100 group-focus-within:opacity-100"
              aria-label={`Quick add ${product.name} to bag`}
            >
              <Plus size={14} /> Add to bag
            </button>
          </div>
        )}
        {/* touch-friendly action pinned to the photo — no precision needed */}
        {quickAdd ? (
          !out && (
            <button
              onClick={doQuickAdd}
              className="absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/95 text-ink shadow-lg backdrop-blur transition hover:bg-oxblood hover:text-white active:scale-90 md:hidden"
              aria-label={`Quick add ${product.name} to bag`}
            >
              <Plus size={18} />
            </button>
          )
        ) : (
          <a
            href={`/product/${product.slug}`}
            className="absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-ink/85 text-ivory shadow-lg backdrop-blur transition hover:bg-oxblood active:scale-90"
            aria-label={`View ${product.name} — photos, price and details`}
          >
            <ArrowRight size={17} />
          </a>
        )}
      </div>

      <div className="mt-3 px-0.5 sm:mt-4 sm:px-1">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-smoke sm:text-[11px] sm:tracking-[0.18em]">
            {product.category} · {product.sku}
          </p>
          <a href={`/product/${product.slug}`} className="mt-0.5 block sm:mt-1">
            <h3 className="font-display text-[15px] font-medium leading-snug transition-colors hover:text-oxblood sm:text-[19px]">
              <span className="line-clamp-1">{product.name}</span>
            </h3>
          </a>
          <div className="mt-0.5 flex items-baseline gap-1.5 sm:mt-1 sm:gap-2">
            <span className="text-[15px] font-bold sm:text-[16px] sm:font-semibold">{inr(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="hidden text-[13px] text-smoke line-through min-[400px]:inline">{inr(product.mrp)}</span>
            )}
          </div>
          {product.colors && (
            <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2" aria-label="Available colours">
              {product.colors.slice(0, 5).map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="h-3.5 w-3.5 rounded-full border border-ink/20"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <a
                href={`/product/${product.slug}`}
                className="ml-1 hidden items-center gap-0.5 text-[12px] font-medium text-smoke hover:text-oxblood sm:flex"
              >
                Details <ArrowUpRight size={12} />
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
