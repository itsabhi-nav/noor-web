import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const STEPS = [
  {
    kicker: '01 — Posture',
    title: 'Form follows feeling.',
    body: 'A great chair disappears beneath you. Contoured backs, breathable mesh and tuned recline hold you through long Delhi workdays — without shouting about it.',
    link: { label: 'Shop office chairs', href: '/category/office' },
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1400&auto=format&fit=crop',
    alt: 'Ergonomic mesh office chair in warm daylight',
  },
  {
    kicker: '02 — Material',
    title: 'Touch it before you trust it.',
    body: 'Woven fabrics, cold-cure foams, cane textures and powder-coated steel. Every concept in the catalogue is specified for heat, dust and daily use.',
    link: { label: 'Explore materials', href: '/shop' },
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1400&auto=format&fit=crop',
    alt: 'Close detail of chair upholstery in a styled interior',
  },
  {
    kicker: '03 — Place',
    title: 'Chairs that finish rooms.',
    body: 'From boardrooms to classrooms, the right seat changes how a space feels — and how people behave in it. See seating at work in real environments.',
    link: { label: 'Chairs in spaces', href: '/#spaces' },
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400&auto=format&fit=crop',
    alt: 'Premium neutral interior with designer seating',
  },
];

export default function ScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const img0 = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [1, 0, 0, 0]);
  const img1 = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 1, 1, 0]);
  const img2 = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 0, 0, 1]);
  const opacities = [img0, img1, img2];
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.12]);

  return (
    <section id="reveal" ref={ref} className="relative scroll-mt-16 bg-ivory" aria-label="Design philosophy">
      <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-mega text-oxblood">01 — Philosophy</p>
          <h2 className="mt-4 font-display text-4xl font-light leading-[1.0] text-balance md:text-6xl">
            Designed to disappear beneath you.
          </h2>
        </div>

        {/* ---- mobile / tablet: stacked story cards (always visible, no scroll tricks) ---- */}
        <div className="mt-10 space-y-12 md:mt-12 lg:hidden">
          {STEPS.map((s, i) => (
            <article key={s.kicker} className="border-t border-line/70 pt-8 first:border-t-0 first:pt-0">
              <div className="overflow-hidden rounded-2xl bg-parchment">
                <img
                  src={s.image}
                  alt={s.alt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="img-warm aspect-[4/3] w-full object-cover"
                />
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-mega text-oxblood">
                {s.kicker}
              </p>
              <h3 className="mt-2 font-display text-3xl font-light leading-[1.02]">{s.title}</h3>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-smoke">{s.body}</p>
              <a
                href={s.link.href}
                className="mt-4 inline-flex items-center gap-2 border-b-2 border-ink pb-1 text-[12px] font-semibold uppercase tracking-[0.18em] transition hover:border-oxblood hover:text-oxblood"
              >
                {s.link.label} <ArrowUpRight size={14} />
              </a>
            </article>
          ))}
        </div>

        {/* ---- desktop: sticky scroll-driven reveal ---- */}
        <div className="hidden grid-cols-2 gap-10 lg:grid">
          {/* sticky visual */}
          <div className="relative h-[300vh]">
            <div className="sticky top-[88px] h-[calc(100vh-104px)] overflow-hidden rounded-2xl">
              <motion.div style={{ scale }} className="h-full w-full">
                {STEPS.map((s, i) => (
                  <motion.img
                    key={s.image}
                    src={s.image}
                    alt={s.alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    style={reduce ? { opacity: 1, display: i === 0 ? 'block' : 'none' } : { opacity: opacities[i] }}
                    className="img-warm absolute inset-0 h-full w-full object-cover"
                  />
                ))}
              </motion.div>
              <div className="absolute bottom-4 left-4 flex gap-2">
                {STEPS.map((s, i) => (
                  <ProgressDot key={s.kicker} progress={scrollYProgress} index={i} />
                ))}
              </div>
            </div>
          </div>

          {/* scrolling copy */}
          <div className="py-[12vh]">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.kicker}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-h-[100vh] flex-col justify-center border-t border-line/70 py-14 first:border-t-0"
              >
                <p className="text-[11px] font-semibold uppercase tracking-mega text-oxblood">
                  {s.kicker}
                </p>
                <h3 className="mt-4 font-display text-4xl font-light leading-[1.02] md:text-6xl">
                  {s.title}
                </h3>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-smoke md:text-base">
                  {s.body}
                </p>
                <a
                  href={s.link.href}
                  className="mt-7 inline-flex w-fit items-center gap-2 border-b-2 border-ink pb-1 text-[12px] font-semibold uppercase tracking-[0.18em] transition hover:border-oxblood hover:text-oxblood"
                >
                  {s.link.label} <ArrowUpRight size={14} />
                </a>
                <span className="mt-8 font-display text-7xl font-light text-ink/10" aria-hidden="true">
                  0{i + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressDot({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const start = index / 3;
  const end = (index + 1) / 3;
  const width = useTransform(progress, [start, (start + end) / 2, end], ['12%', '100%', '100%']);
  const opacity = useTransform(progress, [start, (start + end) / 2, end], [0.4, 1, 0.4]);
  return (
    <div className="h-1 w-16 overflow-hidden rounded-full bg-ivory/30">
      <motion.div style={{ width, opacity }} className="h-full bg-ivory" />
    </div>
  );
}
