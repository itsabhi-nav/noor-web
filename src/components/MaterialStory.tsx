import { motion, useReducedMotion } from 'motion/react';

const MATERIALS = [
  {
    title: 'Woven to breathe',
    body: 'Open-weave backs and ventilated shells move air through Delhi summers — comfort you feel by 2pm.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop',
    alt: 'Woven chair detail in warm interior light',
  },
  {
    title: 'Foams that forgive',
    body: 'High-resilience seat foams rated for daily 8-hour use, wrapped in wipe-clean fabrics.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop',
    alt: 'Soft upholstered seating texture in neutral tones',
  },
  {
    title: 'Frames that outlast',
    body: 'Steel cores, glass-filled nylon and balanced bases — specified for dust, movement and years.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop',
    alt: 'Solid workstation frames in an architectural office',
  },
];

export default function MaterialStory() {
  const reduce = useReducedMotion();
  return (
    <section className="border-y border-line bg-parchment/50 py-16 md:py-28" aria-label="Materials and craft">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-mega text-oxblood">
              Material honesty
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-light leading-[1.0] md:text-6xl">
              Specified for Indian rooms, not showroom lighting.
            </h2>
          </div>
          <p className="max-w-xs text-[15px] leading-relaxed text-smoke">
            Representative material directions across the catalogue — final finishes confirmed
            per chair on WhatsApp.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {MATERIALS.map((m, i) => (
            <motion.figure
              key={m.title}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-2xl ${i === 1 ? 'md:-translate-y-6' : ''}`}
            >
              <img
                src={m.image}
                alt={m.alt}
                loading="lazy"
                className="img-warm h-[380px] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06] md:h-[460px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-mega text-ivory/70">
                  0{i + 1}
                </p>
                <p className="mt-1 font-display text-2xl font-light text-ivory md:text-[1.7rem]">{m.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ivory/70">{m.body}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
