import { motion, useReducedMotion } from 'motion/react';

const SPAN = [
  'md:col-span-4 md:row-span-2 min-h-[420px] md:min-h-[640px]',
  'md:col-span-2 min-h-[300px] md:min-h-[310px]',
  'md:col-span-2 min-h-[300px] md:min-h-[310px]',
  'md:col-span-3 min-h-[340px] md:min-h-[380px]',
  'md:col-span-3 min-h-[340px] md:min-h-[380px]',
];

const SPACES = [
  {
    title: 'The contemporary office',
    caption: 'Mesh task seating that breathes through May afternoons.',
    href: '/category/office',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400&auto=format&fit=crop',
    alt: 'Contemporary open office with rows of desks',
    tall: true,
  },
  {
    title: 'The conference room',
    caption: 'Pushback chairs that keep long meetings humane.',
    href: '/category/visitor',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1400&auto=format&fit=crop',
    alt: 'Bright meeting room with long table',
    tall: false,
  },
  {
    title: 'The home workspace',
    caption: 'Compact ergo chairs that vanish under the desk at dinner.',
    href: '/category/office',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400&auto=format&fit=crop',
    alt: 'Home workspace with wooden desk and chair',
    tall: false,
  },
  {
    title: 'The study corner',
    caption: 'Posture-first study chairs for tuition evenings.',
    href: '/category/school',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1400&auto=format&fit=crop',
    alt: 'Classroom with desks arranged for study',
    tall: true,
  },
  {
    title: 'The classroom',
    caption: 'Stackable shells that survive the school year.',
    href: '/category/school',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1400&auto=format&fit=crop',
    alt: 'Empty modern classroom in daylight',
    tall: false,
  },
];

export default function Spaces() {
  const reduce = useReducedMotion();
  return (
    <section id="spaces" className="scroll-mt-10 bg-ink py-16 md:py-32 text-ivory" aria-label="Chairs in real environments">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-oxblood">
          05 — In real rooms
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-2xl font-display text-4xl md:text-6xl font-light leading-[1.0]">
            One city, a hundred ways to sit.
          </h2>
          <p className="max-w-xs text-[15px] leading-relaxed text-ivory/60">
            Follow seating through the rooms of a working day — dawn desk to evening classroom.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
          {SPACES.map((s, i) => (
            <motion.a
              key={s.title}
              href={s.href}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl ${SPAN[i % SPAN.length]}`}
            >
              <img
                src={s.image}
                alt={s.alt}
                loading="lazy"
                className="img-warm absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-display text-2xl md:text-3xl font-light">{s.title}</p>
                <p className="mt-1 max-w-sm text-sm text-ivory/70">{s.caption}</p>
                <span className="mt-3 inline-block border-b border-oxblood pb-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory">
                  Shop the look →
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
