import { clearRecent, getRecent, useRecent } from '../lib/recent';
import { getProductBySlug } from '../lib/repository';
import { inr } from '../lib/format';

export function recordView(slug: string) {
  // dynamic import keeps PDP bundle lean; fire-and-forget
  import('../lib/recent').then((m) => m.pushRecent(slug));
}

export default function RecentlyViewed() {
  const recent = useRecent();
  const products = recent
    .map((s) => getProductBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 8);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto mt-16 max-w-[1440px] px-5 md:mt-24 md:px-10" aria-label="Recently viewed">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-light md:text-4xl">Pick up where you left off.</h2>
        <button
          onClick={() => {
            clearRecent();
            window.location.reload();
          }}
          className="shrink-0 text-[13px] text-smoke underline underline-offset-4 hover:text-oxblood"
        >
          Clear history
        </button>
      </div>
      <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin]">
        {products.map((p) => (
          <a
            key={p.slug}
            href={`/product/${p.slug}`}
            className="group w-44 shrink-0 snap-start md:w-52"
          >
            <div className="overflow-hidden rounded-xl bg-parchment aspect-square">
              <img
                src={p.images[0]?.src}
                alt={p.images[0]?.alt ?? p.name}
                loading="lazy"
                className="img-warm h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <p className="mt-2 truncate text-[14px] font-medium group-hover:text-oxblood">{p.name}</p>
            <p className="text-[13px] text-smoke">
              {p.sku} · <span className="font-semibold text-ink">{inr(p.price)}</span>
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}

export { getRecent };
