import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, MessageCircle } from 'lucide-react';
import { getFeaturedProducts } from '../lib/repository';
import { inr, productWhatsAppUrl } from '../lib/format';
import { WHATSAPP_NUMBER } from '../config/brand';
import { addToCartWithToast } from '../lib/cart';
import { openCart } from './Header';

export default function Spotlight() {
  const reduce = useReducedMotion();
  const product = getFeaturedProducts(8).find((p) => p.availability !== 'out-of-stock') ?? getFeaturedProducts(1)[0];
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const wa = productWhatsAppUrl(WHATSAPP_NUMBER, product.name, product.sku, product.price);

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-32" aria-label="Spotlight product">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="group relative overflow-hidden rounded-3xl"
        >
          <a href={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
            <img
              src={product.images[0]?.src}
              alt={product.images[0]?.alt ?? product.name}
              loading="lazy"
              className="img-warm aspect-[4/5] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05] md:aspect-[5/5]"
            />
          </a>
          <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory backdrop-blur">
            Spotlight · {product.sku}
          </span>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-mega text-oxblood">
            The chair we'd save in a fire
          </p>
          <h2 className="mt-4 font-display text-4xl font-light leading-[1.0] md:text-6xl">
            {product.name}
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-smoke md:text-base">
            {product.description}
          </p>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-4xl font-medium">{inr(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-lg text-smoke line-through">{inr(product.mrp)}</span>
            )}
          </div>

          {product.colors && (
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-smoke">
                {color}
              </span>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    title={c.name}
                    aria-label={`Select colour ${c.name}`}
                    aria-pressed={color === c.name}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                      color === c.name ? 'border-ink ring-2 ring-oxblood ring-offset-2 ring-offset-ivory' : 'border-ink/20 hover:border-ink'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {color === c.name && <Check size={14} className="text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => {
                // drawer opens directly here, so no 'View bag' toast action needed
                if (addToCartWithToast(product.slug, 1, color, false)) openCart();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory transition hover:bg-oxblood"
            >
              Add to bag — {inr(product.price)}
            </button>
            <a
              href={`/product/${product.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-ink px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] transition hover:bg-ink hover:text-ivory"
            >
              Full details <ArrowUpRight size={14} />
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener"
              aria-label={`Ask about ${product.name} on WhatsApp`}
              className="inline-flex items-center justify-center rounded-full border border-line px-5 py-3.5 transition hover:border-ink"
            >
              <MessageCircle size={16} />
            </a>
          </div>
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-5">
            {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] uppercase tracking-[0.14em] text-smoke">{k}</dt>
                <dd className="mt-1 text-[13px] font-medium leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
