import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCartToastHost } from '../lib/cart';

export default function Toasts() {
  const { toasts, dismiss } = useCartToastHost();
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[90] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0 }}
            className="pointer-events-auto flex w-full items-center gap-2.5 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-ivory shadow-2xl"
            role="status"
          >
            <CheckCircle2 size={17} className="shrink-0 text-emerald-300" />
            <span className="min-w-0 flex-1 truncate">{t.message}</span>
            {t.action ? (
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent(t.action!.event));
                  dismiss(t.id);
                }}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ivory px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-ink transition hover:bg-oxblood hover:text-white"
              >
                {t.action.label} <ArrowRight size={13} />
              </button>
            ) : (
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded-full px-2 py-1 text-[12px] text-ivory/60 hover:text-ivory"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
