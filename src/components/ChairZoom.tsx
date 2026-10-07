import { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

/**
 * Signature scroll moment — a "living portrait" of a chair.
 * Pinned stage + scroll-linked scale/rotate/parallax layers make the chair
 * fly toward the viewer as you scroll (Apple/NASA-style scrollytelling),
 * with pointer parallax on desktop. Pure transforms — no WebGL, no faked 3D.
 * Everything is visible at rest so no-JS / reduced-motion still get the poster.
 */
const CHIPS = ['Sculpted back', 'Deep seat', 'Quiet glide'];

export default function ChairZoom() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  /* ---------- scroll-driven layers ---------- */
  const ghostScale = useTransform(p, [0, 1], [1, reduce ? 1 : 1.4]);
  const ghostY = useTransform(p, [0, 1], ['0%', reduce ? '0%' : '-14%']);
  const ghostO = useTransform(p, [0, 1], [0.6, 0.06]);
  const glowO = useTransform(p, [0, 0.5, 1], [0.55, 0.95, 0.35]);
  const glowS = useTransform(p, [0, 1], [0.85, reduce ? 0.85 : 1.35]);
  const chairScale = useTransform(p, [0, 1], [0.74, reduce ? 0.74 : 1.72]);
  const chairRot = useTransform(p, [0, 1], [-5, reduce ? -5 : 4]);
  const chairY = useTransform(p, [0, 1], [70, reduce ? 70 : -80]);
  const headY = useTransform(p, [0, 0.35], [46, reduce ? 46 : 0]);
  const headO = useTransform(p, [0.62, 1], [1, 0]);
  const chipO = useTransform(p, [0.78, 0.94], [1, 0]);

  const detailO = useTransform(p, [0.3, 0.44, 0.8, 0.94], [0, 1, 1, 0]);
  const detailX = useTransform(p, [0.3, 0.55], [reduce ? 0 : 130, 0]);
  const detailR = useTransform(p, [0.3, 0.6], [reduce ? 0 : 9, -3]);
  const detailY = useTransform(p, [0.8, 1], [0, reduce ? 0 : -70]);

  /* ---------- pointer parallax (fine pointers only) ---------- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    const move = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    const leave = () => {
      mx.set(0);
      my.set(0);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', leave);
    };
  }, [reduce, mx, my]);

  const mChairX = useTransform(sx, (v) => (reduce ? 0 : v * 18));
  const mChairY = useTransform(sy, (v) => (reduce ? 0 : v * 12));
  const mGhostX = useTransform(sx, (v) => (reduce ? 0 : v * -26));
  const mGlowX = useTransform(sx, (v) => (reduce ? 0 : v * 40));

  return (
    <section ref={ref} className="relative h-[300vh] bg-ink" aria-label="A living portrait of a chair">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* ghost word */}
        <motion.div
          style={{ scale: ghostScale, y: ghostY, opacity: ghostO, x: mGhostX }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-outline font-display text-[36vw] font-semibold leading-none tracking-tight md:text-[24vw]">
            SIT
          </span>
        </motion.div>

        {/* wine glow */}
        <motion.div
          style={{ opacity: glowO, scale: glowS, x: mGlowX }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-oxblood/45 blur-[110px]"
          aria-hidden="true"
        />

        {/* the chair — flies at you */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div style={{ x: mChairX, y: mChairY }}>
            <motion.div
              style={{ scale: chairScale, rotate: chairRot, y: chairY }}
              className="w-[76vw] max-w-[440px] overflow-hidden rounded-[1.75rem] shadow-[0_50px_120px_rgba(0,0,0,0.55)] md:w-[34vw] md:max-w-[520px]"
            >
              <img
                src="/images/hero.jpg"
                alt="Sculptural Noor chair rushing toward the viewer"
                loading="lazy"
                className="img-warm aspect-[4/5] w-full object-cover"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* floating detail card */}
        <motion.figure
          style={{ opacity: detailO, x: detailX, rotate: detailR, y: detailY }}
          className="absolute right-4 top-[24%] z-20 w-32 rotate-3 overflow-hidden rounded-2xl bg-ivory p-1.5 shadow-2xl sm:right-[7%] sm:w-48 md:top-[30%]"
          aria-hidden="true"
        >
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop&crop=entropy"
            alt=""
            loading="lazy"
            className="img-warm aspect-square w-full rounded-xl object-cover"
          />
          <figcaption className="px-1.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink sm:text-[11px]">
            Woven detail
          </figcaption>
        </motion.figure>

        {/* headline block */}
        <motion.div
          style={{ y: headY, opacity: headO }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-5 pb-10 pt-24 text-center text-ivory md:pb-12"
        >
          <p className="text-[11px] font-semibold uppercase tracking-mega text-ivory/60">
            A living portrait — keep scrolling
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-light leading-[1.0] text-balance sm:text-5xl md:text-7xl">
            It moves the way <span className="italic">you</span> move.
          </h2>
          <motion.div style={{ opacity: chipO }} className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {CHIPS.map((c) => (
              <span
                key={c}
                className="rounded-full border border-ivory/25 bg-ivory/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur"
              >
                {c}
              </span>
            ))}
          </motion.div>
          <a
            href="/shop"
            className="pointer-events-auto mt-6 inline-flex items-center gap-2 border-b-2 border-oxblood pb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory transition hover:border-ivory"
          >
            Shop the collection <ArrowUpRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
