import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { searchProducts } from '../lib/repository';
import { inr } from '../lib/format';

export default function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const opener = () => {
      setOpen(true);
      setQuery('');
      setActive(0);
    };
    window.addEventListener('noor:search-open', opener);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        opener();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('noor:search-open', opener);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      document.body.style.overflow = '';
    }
  }, [open ]);

  const results = useMemo(
    () => (query.trim() ? searchProducts({ query }).slice(0, 8) : searchProducts({}).slice(0, 4)),
    [query],
  );

  useEffect(() => setActive(0), [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    }
    if (e.key === 'Enter' && results[active]) {
      window.location.href = `/product/${results[active].slug}`;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] bg-ink/45 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="mx-auto mt-[8vh] w-[92%] max-w-2xl overflow-hidden rounded-2xl bg-ivory shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search chairs"
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <Search size={19} className="shrink-0 text-smoke" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search chairs, models — try “mesh” or “NC-OF-101”…"
                className="w-full bg-transparent text-[17px] outline-none placeholder:text-smoke/70"
                aria-label="Search products"
              />
              <button
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-ink/5"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {!query.trim() && (
                <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-mega text-smoke">
                  Popular right now
                </p>
              )}
              {results.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="font-display text-2xl font-light">Nothing found for “{query}”</p>
                  <p className="mt-2 text-sm text-smoke">
                    Try a model number like NC-OF-101, or browse the full collection.
                  </p>
                  <a
                    href="/shop"
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ivory"
                  >
                    Browse all <ArrowUpRight size={14} />
                  </a>
                </div>
              ) : (
                results.map((p, i) => (
                  <a
                    key={p.slug}
                    href={`/product/${p.slug}`}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-center gap-4 rounded-xl px-3 py-3 transition ${
                      i === active ? 'bg-ink/[0.045]' : ''
                    }`}
                  >
                    <img
                      src={p.images[0]?.src}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium">{p.name}</p>
                      <p className="text-[12px] uppercase tracking-[0.14em] text-smoke">
                        {p.sku} · {p.category}
                      </p>
                    </div>
                    <span className="shrink-0 text-[15px] font-semibold">{inr(p.price)}</span>
                  </a>
                ))
              )}
            </div>
            <div className="flex items-center justify-between border-t border-line bg-parchment/60 px-5 py-3 text-[12px] text-smoke">
              <span>↑↓ to move · Enter to open · Esc to close</span>
              <a href={`/shop${query ? `?q=${encodeURIComponent(query)}` : ''}`} className="font-semibold text-ink hover:text-oxblood">
                See all results
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
