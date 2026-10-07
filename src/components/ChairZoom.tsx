import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import type { MotionValue } from 'motion/react';

/**
 * "Anatomy of comfort" — a calm, cinematic detail film.
 * One full-bleed chair photograph with a slow Ken Burns drift while three
 * hotspot dots illuminate in sync with short captions (back → seat → base).
 * No fake 3D, no flying cards — just patient product cinematography.
 * Beat 1 is fully visible at rest, so no-JS / reduced-motion still read fine.
 */
const BEATS = [
  {
    n: '01',
    title: 'The back',
    body: 'A backrest that meets your spine halfway. Open mesh breathes through hot afternoons while the curve quietly holds you upright.',
    x: '62%',
    y: '27%',
  },
  {
    n: '02',
    title: 'The seat',
    body: 'A deep, waterfall-edged seat pan. Thighs rest easy, weight spreads out, long sittings stop feeling long.',
    x: '38%',
    y: '53%',
  },
  {
    n: '03',
    title: 'The base',
    body: 'A balanced five-star footing on quiet castors. Glide across the room — never drag, never wobble.',
    x: '58%',
    y: '77%',
  },
];

/** Triangular opacity window per beat; first starts visible, last stays visible. */
function useBeatOpacity(p: MotionValue<number>, index: number, last: boolean): MotionValue<number> {
  const s = index / 3;
  const e = (index + 1) / 3;
  if (index === 0) return useTransform(p, [0, s + 0.1, e - 0.06, e + 0.08], [1, 1, 1, 0.15]);
  if (last) return useTransform(p, [s - 0.04, s + 0.1, 0.94, 1], [0.15, 1, 1, 1]);
  return useTransform(p, [s - 0.04, s + 0.1, e - 0.06, e + 0.08], [0.15, 1, 1, 0.15]);
}

export default function ChairZoom() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const imgScale = useTransform(p, [0, 1], [1.04, reduce ? 1.04 : 1.16]);
  const imgY = useTransform(p, [0, 1], ['0%', reduce ? '0%' : '-4%']);

  return (
    <section ref={ref} className="relative h-[280vh] bg-ink" aria-label="Anatomy of comfort">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* photograph with slow drift */}
        <motion.div style={{ scale: imgScale, y: imgY }} className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="Sculptural chair photographed in warm daylight"
            loading="lazy"
            className="img-warm h-full w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/40" />

        {/* hotspots */}
        {BEATS.map((b, i) => (
          <Hotspot
            key={b.n}
            p={p}
            index={i}
            last={i === BEATS.length - 1}
            x={b.x}
            y={b.y}
            n={b.n}
            reduce={!!reduce}
          />
        ))}

        {/* eyebrow */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-24 md:px-10 md:pt-28">
          <p className="text-[11px] font-semibold uppercase tracking-mega text-ivory/80">
            Anatomy of comfort
          </p>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ivory/60">
            Scroll slowly
          </p>
        </div>

        {/* captions */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-10 md:px-10 md:pb-14">
          <div className="relative min-h-[200px] max-w-md sm:min-h-[180px]">
            {BEATS.map((b, i) => (
              <Caption
                key={b.n}
                p={p}
                index={i}
                last={i === BEATS.length - 1}
                beat={b}
                reduce={!!reduce}
              />
            ))}
          </div>
          <BeatBar p={p} />
        </div>
      </div>
    </section>
  );
}

function Hotspot({
  p,
  index,
  last,
  x,
  y,
  n,
  reduce,
}: {
  p: MotionValue<number>;
  index: number;
  last: boolean;
  x: string;
  y: string;
  n: string;
  reduce: boolean;
}) {
  const o = useBeatOpacity(p, index, last);
  const s = useTransform(p, [index / 3, index / 3 + 0.12], [0.7, 1]);
  return (
    <motion.div
      style={
        reduce
          ? { opacity: 0.9, left: x, top: y, x: '-50%', y: '-50%' }
          : { opacity: o, scale: s, left: x, top: y, x: '-50%', y: '-50%' }
      }
      className="absolute z-10"
      aria-hidden="true"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-ivory/70 bg-ink/55 font-display text-[13px] italic text-ivory backdrop-blur">
        {n}
        {!reduce && (
          <span className="absolute inset-0 animate-ping rounded-full border border-ivory/60 [animation-duration:2.2s]" />
        )}
      </span>
    </motion.div>
  );
}

function Caption({
  p,
  index,
  last,
  beat,
  reduce,
}: {
  p: MotionValue<number>;
  index: number;
  last: boolean;
  beat: (typeof BEATS)[number];
  reduce: boolean;
}) {
  const o = useBeatOpacity(p, index, last);
  if (reduce && index !== 0) return null;
  return (
    <motion.div style={reduce ? undefined : { opacity: o }} className={index === 0 ? 'relative' : 'absolute inset-0'}>
      <div className="rounded-2xl bg-ink/55 p-5 backdrop-blur-md md:p-6">
        <p className="font-display text-lg italic text-ivory/60">{beat.n}</p>
        <h3 className="mt-1 font-display text-3xl font-light text-ivory md:text-4xl">{beat.title}</h3>
        <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ivory/75 md:text-[15px]">{beat.body}</p>
      </div>
    </motion.div>
  );
}

function BeatBar({ p }: { p: MotionValue<number> }) {
  return (
    <div className="mt-4 flex max-w-md gap-2" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <Segment key={i} p={p} index={i} />
      ))}
    </div>
  );
}

function Segment({ p, index }: { p: MotionValue<number>; index: number }) {
  const s = index / 3;
  const fill = useTransform(p, [s, s + 1 / 3], [0, 1]);
  return (
    <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-ivory/25">
      <motion.div style={{ scaleX: fill }} className="h-full origin-left bg-ivory" />
    </div>
  );
}
