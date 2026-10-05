import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useCartToastHost } from '../lib/cart';

export default function Toasts() {
  const { toasts, dismiss } = useCartToastHost();
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0 }}
            onClick={() => dismiss(t.id)}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-ivory shadow-xl"
          >
            <CheckCircle2 size={16} className="text-emerald-300" />
            {t.message}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
