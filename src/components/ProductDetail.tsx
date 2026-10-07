import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check, ChevronLeft, ChevronRight, Expand, Link2, Minus, Plus,
  MessageCircle, Share2, ShoppingBag, X,
} from 'lucide-react';
import type { Product } from '../lib/repository';
import { inr, productWhatsAppUrl } from '../lib/format';
import { AVAILABILITY_LABEL } from '../data/products';
import { addToCartWithToast } from '../lib/cart';
import { WHATSAPP_NUMBER } from '../config/brand';
import ProductCard from './ProductCard';
import { recordView } from './RecentlyViewed';

export function openCartDrawer() {
  window.dispatchEvent(new CustomEvent('noor:cart-open'));
}

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const [qty, setQty] = useState(1);
  const [lightbox, setLightbox] = useState(false);
  const [copied, setCopied] = useState(false);
  const out = product.availability === 'out-of-stock';
  const wa = productWhatsAppUrl(WHATSAPP_NUMBER, product.name, product.sku, product.price);
  const n = product.images.length;
  const touchX = useRef<number | null>(null);
  const swipedAt = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40) return;
    swipedAt.current = Date.now();
    setImgIdx((i) => (i + (dx < 0 ? 1 : n - 1)) % n);
  };
  const onGalleryClick = () => {
    if (Date.now() - swipedAt.current < 350) return; // was a swipe, not a tap
    setLightbox(true);
  };

  useEffect(() => {
    recordView(product.slug);
  }, [product.slug]);

  useEffect(() => {
    if (!lightbox) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') setImgIdx((i) => (i + 1) % n);
      if (e.key === 'ArrowLeft') setImgIdx((i) => (i - 1 + n) % n);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, n]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: `${product.name} (${product.sku})`, url });
        return;
      } catch {
        /* dismissed — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const add = () => {
    // drawer opens directly here, so no 'View bag' toast action needed
    if (addToCartWithToast(product.slug, qty, color, false)) openCartDrawer();
  };

  return (
    <div className="pb-24 lg:pb-0">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div
            className="group relative cursor-zoom-in touch-pan-y overflow-hidden rounded-2xl bg-parchment aspect-[4/5] md:aspect-square"
            onClick={onGalleryClick}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIdx}
                src={product.images[imgIdx]?.src}
                alt={product.images[imgIdx]?.alt ?? product.name}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="img-warm absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-ink/70 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory opacity-0 backdrop-blur transition group-hover:opacity-100">
              <Expand size={13} /> {imgIdx + 1} / {n} — tap to expand
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="absolute left-4 top-4 rounded-full bg-oxblood px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                Save {inr(product.mrp - product.price)}
              </span>
            )}
            {n > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImgIdx((i) => (i - 1 + n) % n);
                  }}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 opacity-0 backdrop-blur transition hover:bg-ivory group-hover:opacity-100"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImgIdx((i) => (i + 1) % n);
                  }}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 opacity-0 backdrop-blur transition hover:bg-ivory group-hover:opacity-100"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {product.images.map((im, i) => (
              <button
                key={im.src + i}
                onClick={() => setImgIdx(i)}
                aria-label={`View image ${i + 1}`}
                aria-pressed={imgIdx === i}
                className={`overflow-hidden rounded-xl aspect-square transition active:scale-95 ${
                  imgIdx === i ? 'ring-2 ring-oxblood ring-offset-2 ring-offset-ivory' : 'opacity-65 hover:opacity-100'
                }`}
              >
                <img src={im.src} alt="" className="img-warm h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <nav className="text-[12px] uppercase tracking-[0.16em] text-smoke" aria-label="Breadcrumb">
              <a href="/" className="hover:text-ink">Home</a> /{' '}
              <a href="/shop" className="hover:text-ink">Shop</a> /{' '}
              <a href={`/shop?cat=${product.category}`} className="hover:text-ink">
                {product.category}
              </a>{' '}
              / <span className="text-ink">{product.sku}</span>
            </nav>
            <button
              onClick={share}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-[12px] font-medium text-smoke transition hover:border-ink hover:text-ink"
              aria-label="Share this chair"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>

          <h1 className="mt-4 font-display text-4xl font-light leading-[1.0] text-balance md:text-[3.4rem]">
            {product.name}
          </h1>
          <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-smoke">
            Model {product.sku} · {product.category}
          </p>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-medium">{inr(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-lg text-smoke line-through">{inr(product.mrp)}</span>
            )}
            <span className="text-[13px] text-smoke">Fixed price · incl. of honest pricing</span>
          </div>
          <span
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${
              out ? 'bg-ink text-ivory' : 'bg-olive/15 text-olive'
            }`}
          >
            {!out && <Check size={13} />} {AVAILABILITY_LABEL[product.availability]}
          </span>

          <p className="mt-6 text-[15px] leading-relaxed text-smoke md:text-base">{product.description}</p>

          {product.colors && (
            <div className="mt-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em]">
                Colour — <span className="text-smoke">{color}</span>
              </p>
              <div className="mt-2.5 flex gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    title={c.name}
                    aria-label={`Select colour ${c.name}`}
                    aria-pressed={color === c.name}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border transition active:scale-90 ${
                      color === c.name ? 'border-ink ring-2 ring-oxblood ring-offset-2 ring-offset-ivory' : 'border-ink/20 hover:border-ink'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {color === c.name && <Check size={15} className="text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 hidden items-center gap-3 lg:flex">
            <div className="flex items-center rounded-full border border-line" aria-label="Quantity">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex w-12 items-center justify-center py-4 hover:text-oxblood" aria-label="Decrease quantity">
                <Minus size={16} />
              </button>
              <span className="w-8 text-center text-[16px] font-semibold" role="status">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="flex w-12 items-center justify-center py-4 hover:text-oxblood" aria-label="Increase quantity">
                <Plus size={16} />
              </button>
            </div>
            <button
              disabled={out}
              onClick={add}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory transition hover:bg-oxblood hover:shadow-[0_8px_30px_rgba(134,40,28,0.4)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingBag size={15} /> {out ? 'Out of stock' : `Add to bag — ${inr(product.price * qty)}`}
            </button>
          </div>
          {/* mobile qty + whatsapp */}
          <div className="mt-4 flex items-center gap-3 lg:hidden">
            <div className="flex items-center rounded-full border border-line" aria-label="Quantity">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-12 w-11 items-center justify-center hover:text-oxblood" aria-label="Decrease quantity">
                <Minus size={16} />
              </button>
              <span className="w-8 text-center text-[16px] font-semibold" role="status">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="flex h-12 w-11 items-center justify-center hover:text-oxblood" aria-label="Increase quantity">
                <Plus size={16} />
              </button>
            </div>
            <a
              href={wa}
              target="_blank"
              rel="noopener"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition hover:bg-ink hover:text-ivory"
            >
              <MessageCircle size={15} /> Order on WhatsApp
            </a>
          </div>
          <a
            href={wa}
            target="_blank"
            rel="noopener"
            className="mt-3 hidden w-full items-center justify-center gap-2 rounded-full border border-ink px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] transition hover:bg-ink hover:text-ivory lg:inline-flex"
          >
            <MessageCircle size={15} /> Order on WhatsApp
          </a>

          {/* accordions */}
          <div className="mt-8 divide-y divide-line/70 rounded-2xl border border-line">
            <details className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden" open>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-semibold uppercase tracking-[0.14em]">
                Specifications
                <span className="text-lg font-light transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <dl className="mt-3 divide-y divide-line/60">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-2 text-[14px] sm:grid-cols-[140px_1fr]">
                    <dt className="text-smoke">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </details>
            <details className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-semibold uppercase tracking-[0.14em]">
                Stock, delivery & payment
                <span className="text-lg font-light transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <div className="mt-3 space-y-2 text-[14px] leading-relaxed text-smoke">
                <p>Availability shown is indicative. Share this chair on WhatsApp and we'll confirm live stock before you commit.</p>
                <p>Delivery charges depend on your address and order size — confirmed in chat, never added silently.</p>
                <p>No online payment on this demo site. You pay only after stock and delivery are agreed.</p>
              </div>
            </details>
            <details className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-semibold uppercase tracking-[0.14em]">
                An honest note
                <span className="text-lg font-light transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-smoke">
                Photography here is illustrative — it represents this seating concept, not a verified
                photo of physical stock. Specs are representative of the type. Ask us anything on
                WhatsApp; we'd rather lose a sale than oversell a chair.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* related */}
      <div className="mt-20 md:mt-28">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-light md:text-5xl">Pairs well with.</h2>
          <a href={`/shop?cat=${product.category}`} className="hidden shrink-0 border-b-2 border-ink pb-0.5 text-[12px] font-semibold uppercase tracking-[0.16em] hover:border-oxblood hover:text-oxblood md:inline">
            More {product.category} →
          </a>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </div>

      {/* sticky mobile buy bar */}
      {!out && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <img src={product.images[0]?.src} alt="" className="h-11 w-11 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold">{product.name}</p>
              <p className="text-[14px] font-bold">{inr(product.price * qty)}</p>
            </div>
            <button
              onClick={add}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-ivory active:scale-95"
            >
              <ShoppingBag size={14} /> Add × {qty}
            </button>
          </div>
        </div>
      )}

      {/* lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur"
            onClick={() => setLightbox(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} image viewer`}
          >
            <div className="flex items-center justify-between px-5 py-4 text-ivory">
              <span className="text-[13px] uppercase tracking-[0.18em] text-ivory/70">
                {imgIdx + 1} / {n} · {product.sku}
              </span>
              <button
                onClick={() => setLightbox(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory/10 hover:bg-ivory/20"
                aria-label="Close viewer"
              >
                <X size={19} />
              </button>
            </div>
            <div
              className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIdx}
                  src={product.images[imgIdx]?.src}
                  alt={product.images[imgIdx]?.alt ?? product.name}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-full max-w-full rounded-xl object-contain"
                />
              </AnimatePresence>
              {n > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((i) => (i - 1 + n) % n)}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory hover:bg-ivory/25"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setImgIdx((i) => (i + 1) % n)}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory hover:bg-ivory/25"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            <p className="flex items-center justify-center gap-1.5 pb-6 text-[12px] text-ivory/50">
              <Link2 size={12} /> Illustrative concept imagery
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
