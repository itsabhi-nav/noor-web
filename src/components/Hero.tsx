import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const rise = useTransform(scrollYProgress, [0, 1], ['0px', reduce ? '0px' : '-60px']);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink text-ivory"
      aria-label="Noor Chair introduction"
    >
      {/* backdrop with parallax */}
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
        <motion.img
          src="/images/hero.jpg"
          alt="Sculptural office chair in warm architectural daylight"
          fetchPriority="high"
          initial={reduce ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: EASE }}
          className="img-warm h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />

      {/* vertical side label */}
      <div
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 xl:block"
        aria-hidden="true"
      >
        <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.5em] text-ivory/50">
          Seating studio — New Delhi
        </span>
      </div>

      {/* content */}
      <motion.div
        style={{ opacity: fade, y: rise }}
        className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-8 pt-28 md:px-10 md:pb-0 md:pt-32"
      >
        <div className="flex flex-1 flex-col justify-center py-6 md:py-0">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
          className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-mega text-ivory/80"
        >
          <span className="inline-block h-px w-10 bg-oxblood" />
          New Delhi · Seating Gallery
        </motion.p>
        <h1 className="mt-4 font-display font-light leading-[0.93] text-balance md:mt-5">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: EASE }}
            className="block text-[15vw] sm:text-[13vw] lg:text-[9rem] xl:text-[10.5rem]"
          >
            Sit differently.
          </motion.span>
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 1, ease: EASE }}
            className="mt-3 block max-w-3xl text-[6.6vw] italic leading-[1.05] text-ivory/90 sm:text-4xl lg:text-[2.9rem]"
          >
            Designed around the way you live.
          </motion.span>
        </h1>
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.8 }}
          className="mt-4 max-w-md text-[15px] leading-relaxed text-ivory/75 md:mt-5 md:text-base"
        >
          Thoughtful seating for the spaces where life and work happen — offices, classrooms,
          studios and homes across Delhi.
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7, ease: EASE }}
          className="mt-6 flex flex-col gap-2.5 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center min-[480px]:gap-3 md:mt-8"
        >
          <a
            href="/shop"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink transition-all hover:bg-oxblood hover:text-white hover:shadow-[0_8px_30px_rgba(134,40,28,0.45)]"
          >
            Shop the collection
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="/story"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ivory/40 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory backdrop-blur transition hover:border-ivory hover:bg-ivory/10"
          >
            Discover Noor Chair
          </a>
        </motion.div>
        </div>

        {/* bottom strip */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.25, duration: 0.8 }}
          className="flex items-end justify-between gap-4 border-t border-ivory/20 pt-4 md:mt-14 md:pt-5"
        >
          <div className="flex gap-6 md:gap-10">
            {[
              ['100+', 'Seating concepts'],
              ['06', 'Collections'],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-xl font-light md:text-4xl">{n}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-ivory/60 md:text-[11px]">{l}</p>
              </div>
            ))}
            <div className="hidden min-[420px]:block">
              <p className="font-display text-xl font-light md:text-4xl">₹ fixed</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-ivory/60 md:text-[11px]">Honest prices</p>
            </div>
          </div>
          <a
            href="#reveal"
            className="flex shrink-0 items-center gap-2 self-center rounded-full border border-ivory/25 px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] text-ivory/75 transition hover:border-ivory hover:text-ivory"
            aria-label="Scroll to design philosophy"
          >
            <span className="hidden min-[380px]:inline">Scroll</span>
            <motion.span
              animate={reduce ? {} : { y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <ArrowDown size={14} />
            </motion.span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
