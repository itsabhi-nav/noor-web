import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Minus, Plus, Trash2, X, ShoppingBag } from 'lucide-react';
import { useCartState, setQty, removeLine } from '../lib/cart';
import { inr } from '../lib/format';

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { lines, subtotal } = useCartState();

  useEffect(() => {
    const opener = () => setOpen(true);
    window.addEventListener('noor:cart-open', opener);
    return () => window.removeEventListener('noor:cart-open', opener);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open ]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-ink/45 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="absolute right-0 top-0 flex h-full w-[92%] max-w-md flex-col bg-ivory"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <p className="font-display text-2xl font-light">
                Your bag{' '}
                <span className="text-base text-smoke">
                  ({lines.reduce((s, l) => s + l.qty, 0)})
                </span>
              </p>
              <button
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5"
                aria-label="Close bag"
              >
                <X size={19} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag size={36} strokeWidth={1.25} className="text-smoke" />
                  <p className="mt-4 font-display text-2xl font-light">Your bag is empty</p>
                  <p className="mt-2 max-w-[26ch] text-sm text-smoke">
                    Beautiful seating is waiting. Start with our best-loved chairs.
                  </p>
                  <a
                    href="/shop"
                    onClick={() => setOpen(false)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory hover:bg-oxblood"
                  >
                    Explore chairs <ArrowRight size={14} />
                  </a>
                </div>
              ) : (
                <ul className="divide-y divide-line/70">
                  {lines.map((l) => (
                    <li key={l.slug + (l.color ?? '')} className="flex gap-4 py-4">
                      <img
                        src={l.image}
                        alt=""
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-medium">{l.name}</p>
                        <p className="text-[12px] uppercase tracking-[0.12em] text-smoke">
                          {l.sku}
                          {l.color ? ` · ${l.color}` : ''}
                        </p>
                        {!l.available && (
                          <p className="mt-1 text-[13px] font-medium text-oxblooddeep">
                            Out of stock — excluded from total
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-line">
                            <button
                              onClick={() => setQty(l.slug, l.qty - 1, l.color)}
                              className="flex h-8 w-8 items-center justify-center hover:text-oxblood"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold">{l.qty}</span>
                            <button
                              onClick={() => setQty(l.slug, Math.min(99, l.qty + 1), l.color)}
                              className="flex h-8 w-8 items-center justify-center hover:text-oxblood"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="text-[15px] font-semibold">{inr(l.lineTotal)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeLine(l.slug, l.color)}
                        className="self-start rounded-full p-1.5 text-smoke hover:text-oxblood"
                        aria-label={`Remove ${l.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line bg-parchment/50 px-6 py-5">
                <div className="flex items-center justify-between text-[15px]">
                  <span className="text-smoke">Subtotal (available items)</span>
                  <motion.span
                    key={subtotal}
                    initial={{ scale: 1.06 }}
                    animate={{ scale: 1 }}
                    className="font-display text-2xl font-medium"
                  >
                    {inr(subtotal)}
                  </motion.span>
                </div>
                <p className="mt-1 text-[12px] text-smoke">
                  Delivery charges confirmed on WhatsApp before you pay anything.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a
                    href="/cart"
                    className="rounded-full border border-ink px-4 py-3 text-center text-[12px] font-semibold uppercase tracking-[0.14em] hover:bg-ink hover:text-ivory transition"
                    onClick={() => setOpen(false)}
                  >
                    Review bag
                  </a>
                  <a
                    href="/cart#enquiry"
                    className="rounded-full bg-oxblood px-4 py-3 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-oxblooddeep transition"
                    onClick={() => setOpen(false)}
                  >
                    Enquire →
                  </a>
                </div>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
