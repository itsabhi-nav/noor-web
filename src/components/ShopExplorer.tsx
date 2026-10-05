import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeftRight, BadgePercent, Check, ChevronDown, LayoutGrid, List, SearchX, ShoppingBag, X,
} from 'lucide-react';
import ProductCard from './ProductCard';
import {
  getAllCategories, getAllProducts, getProductsByCategory, searchProducts,
} from '../lib/repository';
import type { CategorySlug, Product } from '../lib/repository';
import { AVAILABILITY_LABEL } from '../data/products';
import type { Availability } from '../data/products';
import { inr } from '../lib/format';
import { addToCartWithToast, emitCartToast } from '../lib/cart';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'discount-desc';
type View = 'grid' | 'list';
const PAGE_SIZE = 24;
const ALL_AVAIL: Availability[] = ['in-stock', 'low-stock', 'made-to-order', 'out-of-stock'];

const PRICE_BANDS = [
  { id: 'all', label: 'All prices' },
  { id: 'under-2k', label: 'Under ₹2,000' },
  { id: '2k-10k', label: '₹2,000 – ₹10,000' },
  { id: '10k-20k', label: '₹10,000 – ₹20,000' },
  { id: '20k-plus', label: '₹20,000 & above' },
] as const;

type PriceBand = (typeof PRICE_BANDS)[number]['id'];

function inBand(price: number, band: PriceBand): boolean {
  switch (band) {
    case 'under-2k':
      return price < 2000;
    case '2k-10k':
      return price >= 2000 && price <= 10000;
    case '10k-20k':
      return price > 10000 && price <= 20000;
    case '20k-plus':
      return price > 20000;
    default:
      return true;
  }
}

const SORTS: { id: Sort; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'discount-desc', label: 'Biggest Saving' },
  { id: 'name-asc', label: 'Name: A to Z' },
  { id: 'name-desc', label: 'Name: Z to A' },
];

const discountOf = (p: Product) => (p.mrp && p.mrp > p.price ? p.mrp - p.price : 0);

export default function ShopExplorer({
  initialCategory = 'all',
  initialQuery = '',
}: {
  initialCategory?: CategorySlug | 'all';
  initialQuery?: string;
}) {
  const cats = useMemo(getAllCategories, []);
  const totalCount = useMemo(() => getAllProducts().length, []);
  const catCounts = useMemo(() => {
    const m = new Map<string, number>();
    cats.forEach((c) => m.set(c.slug, getProductsByCategory(c.slug).length));
    return m;
  }, [cats]);

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategorySlug | 'all'>(initialCategory);
  const [sort, setSort] = useState<Sort>('featured');
  const [priceBand, setPriceBand] = useState<PriceBand>('all');
  const [avail, setAvail] = useState<Availability[]>([...ALL_AVAIL]);
  const [offerOnly, setOfferOnly] = useState(false);
  const [view, setView] = useState<View>('grid');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  /* ---- adopt URL params once after mount (avoids SSR hydration mismatch) ---- */
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get('q');
    const cat = sp.get('cat');
    const s = sp.get('sort');
    const price = sp.get('price');
    const av = sp.get('avail');
    if (q) setQuery(q);
    if (cat && (cat === 'all' || cats.some((c) => c.slug === cat))) {
      setCategory(cat as CategorySlug | 'all');
    }
    if (s && SORTS.some((x) => x.id === s)) setSort(s as Sort);
    if (price && PRICE_BANDS.some((b) => b.id === price)) setPriceBand(price as PriceBand);
    if (av) {
      const valid = av.split(',').filter((a): a is Availability => (ALL_AVAIL as string[]).includes(a));
      if (valid.length) setAvail(valid);
    }
    if (sp.get('offer') === '1') setOfferOnly(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- write state back to URL (shareable filtered links) ---- */
  useEffect(() => {
    const sp = new URLSearchParams();
    if (query.trim()) sp.set('q', query.trim());
    if (category !== 'all') sp.set('cat', category);
    if (sort !== 'featured') sp.set('sort', sort);
    if (priceBand !== 'all') sp.set('price', priceBand);
    if (avail.length !== ALL_AVAIL.length) sp.set('avail', avail.join(','));
    if (offerOnly) sp.set('offer', '1');
    const next = sp.toString();
    const url = next ? `${window.location.pathname}?${next}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [query, category, sort, priceBand, avail, offerOnly]);

  /* ---- drawer / modal scroll lock ---- */
  useEffect(() => {
    document.body.style.overflow = drawerOpen || compareOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen, compareOpen ]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setCompareOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    let list = searchProducts({ query, category, sort: sort === 'discount-desc' ? 'featured' : sort });
    if (sort === 'discount-desc') list = [...list].sort((a, b) => discountOf(b) - discountOf(a));
    return list.filter((p) => {
      if (!inBand(p.price, priceBand)) return false;
      if (!avail.includes(p.availability)) return false;
      if (offerOnly && discountOf(p) <= 0) return false;
      return true;
    });
  }, [query, category, sort, priceBand, avail, offerOnly]);

  const { bandCounts, bandCountsTotal } = useMemo(() => {
    const base = searchProducts({ query, category, sort: 'featured' });
    const m = new Map<PriceBand, number>();
    PRICE_BANDS.forEach((b) => {
      if (b.id !== 'all') m.set(b.id, base.filter((p) => inBand(p.price, b.id)).length);
    });
    return { bandCounts: m, bandCountsTotal: base.length };
  }, [query, category]);

  const shown = results.slice(0, visible);
  const touch = () => setVisible(PAGE_SIZE);

  const toggleAvail = (a: Availability) => {
    setAvail((prev) => {
      if (prev.includes(a)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((x) => x !== a);
      }
      return [...prev, a];
    });
    touch();
  };
  const toggleCompare = (slug: string) => {
    setCompare((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) {
        emitCartToast('Compare up to 3 chairs at a time');
        return prev;
      }
      return [...prev, slug];
    });
  };

  const clearAll = () => {
    setQuery('');
    setCategory(initialCategory);
    setSort('featured');
    setPriceBand('all');
    setAvail([...ALL_AVAIL]);
    setOfferOnly(false);
    touch();
  };

  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (query.trim()) chips.push({ key: 'q', label: `“${query.trim()}”`, clear: () => setQuery('') });
  if (category !== 'all')
    chips.push({
      key: 'cat',
      label: cats.find((c) => c.slug === category)?.short ?? category,
      clear: () => {
        setCategory('all');
        touch();
      },
    });
  if (avail.length !== ALL_AVAIL.length)
    chips.push({
      key: 'avail',
      label: `Availability (${avail.length})`,
      clear: () => {
        setAvail([...ALL_AVAIL]);
        touch();
      },
    });
  if (priceBand !== 'all')
    chips.push({
      key: 'price',
      label: PRICE_BANDS.find((b) => b.id === priceBand)?.label ?? priceBand,
      clear: () => {
        setPriceBand('all');
        touch();
      },
    });
  if (offerOnly) chips.push({ key: 'offer', label: 'On offer', clear: () => setOfferOnly(false) });

  const activeCount = chips.length;
  const compareProducts = compare
    .map((s) => results.find((p) => p.slug === s) ?? getAllProducts().find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p));

  const panel = (
    <div className="space-y-7">
      {/* category */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-smoke">Collection</legend>
        <div className="mt-3 space-y-1">
          <FilterRadio
            active={category === 'all'}
            label="All chairs"
            count={totalCount}
            onClick={() => {
              setCategory('all');
              touch();
            }}
          />
          {cats.map((c) => (
            <FilterRadio
              key={c.slug}
              active={category === c.slug}
              label={c.name}
              count={catCounts.get(c.slug) ?? 0}
              onClick={() => {
                setCategory(c.slug);
                touch();
              }}
            />
          ))}
        </div>
      </fieldset>

      {/* price */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-smoke">Price</legend>
        <div className="mt-3 space-y-1">
          {PRICE_BANDS.map((b) => (
            <FilterRadio
              key={b.id}
              active={priceBand === b.id}
              label={b.label}
              count={b.id === 'all' ? bandCountsTotal : (bandCounts.get(b.id) ?? 0)}
              onClick={() => {
                setPriceBand(b.id);
                touch();
              }}
            />
          ))}
        </div>
        <button
          onClick={() => {
            setOfferOnly((v) => !v);
            touch();
          }}
          aria-pressed={offerOnly}
          className={`mt-3 flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-3 text-[14px] font-medium transition active:scale-[0.98] ${
            offerOnly ? 'border-oxblood bg-oxblood/10' : 'border-line hover:border-ink'
          }`}
        >
          <BadgePercent size={17} className={offerOnly ? 'text-oxblood' : 'text-smoke'} />
          On offer only
          <span className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full ${offerOnly ? 'bg-oxblood text-white' : 'bg-ink/10 text-transparent'}`}>
            <Check size={13} />
          </span>
        </button>
      </fieldset>

      {/* availability */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-smoke">Availability</legend>
        <div className="mt-3 space-y-2">
          {ALL_AVAIL.map((a) => {
            const on = avail.includes(a);
            return (
              <button
                key={a}
                onClick={() => toggleAvail(a)}
                aria-pressed={on}
                className="flex w-full items-center gap-2.5 text-[14px] transition hover:text-oxblood"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                    on ? 'border-ink bg-ink text-ivory' : 'border-line bg-white/60'
                  }`}
                >
                  {on && <Check size={13} />}
                </span>
                <span className={on ? 'font-medium' : 'text-smoke'}>{AVAILABILITY_LABEL[a]}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="w-full rounded-full border border-ink py-3 text-[12px] font-semibold uppercase tracking-[0.16em] transition hover:bg-ink hover:text-ivory"
        >
          Clear all ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-10">
      {/* desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl border border-line bg-ivory p-5">
          {panel}
        </div>
      </aside>

      <div className="min-w-0">
        {/* sticky toolbar */}
        <div className="sticky top-[66px] z-30 -mx-5 bg-ivory/90 px-5 py-3 backdrop-blur-md md:top-[74px] md:-mx-10 md:px-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[13px] font-semibold text-ivory lg:hidden"
            >
              Filters
              {activeCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-oxblood text-[11px]">
                  {activeCount}
                </span>
              )}
              <ChevronDown size={15} />
            </button>
            <label className="flex flex-1 items-center gap-2 rounded-full border border-line bg-white/85 px-4 py-2.5 shadow-sm">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  touch();
                }}
                placeholder="Search name or model — e.g. Meridian, NC-OF-101…"
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-smoke/70"
                aria-label="Search products"
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="Clear search" className="shrink-0 text-smoke hover:text-ink">
                  <X size={16} />
                </button>
              )}
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="hidden shrink-0 rounded-full border border-line bg-white/85 px-4 py-2.5 text-[13px] font-medium shadow-sm outline-none md:block"
              aria-label="Sort products"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <div className="hidden shrink-0 rounded-full border border-line bg-white/85 p-1 shadow-sm sm:flex" role="group" aria-label="Change layout">
              <button
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
                aria-label="Grid view"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${view === 'grid' ? 'bg-ink text-ivory' : 'text-smoke hover:text-ink'}`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
                aria-label="List view"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${view === 'list' ? 'bg-ink text-ivory' : 'text-smoke hover:text-ink'}`}
              >
                <List size={15} />
              </button>
            </div>
          </div>

          {/* active chips */}
          {chips.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={chip.clear}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink py-1.5 pl-3.5 pr-2.5 text-[12px] font-medium text-ivory transition hover:bg-oxblood"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  {chip.label} <X size={13} />
                </button>
              ))}
              <button onClick={clearAll} className="shrink-0 px-2 text-[12px] font-semibold text-oxblood underline underline-offset-2">
                Clear all
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-1.5 text-[13px] text-smoke md:hidden" role="status">
            <span>
              <strong className="text-ink">{results.length}</strong> {results.length === 1 ? 'chair' : 'chairs'}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-line bg-white/85 px-3 py-1.5 text-[12px] font-medium outline-none"
              aria-label="Sort products"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <p className="hidden pt-1.5 text-[13px] text-smoke md:block" role="status">
            <strong className="text-ink">{results.length}</strong> of {totalCount} chairs
            {sort !== 'featured' && <> · sorted by <strong className="text-ink">{SORTS.find((s) => s.id === sort)?.label}</strong></>}
          </p>
        </div>

        {/* results */}
        {shown.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-20 text-center">
            <SearchX size={36} strokeWidth={1.5} className="text-smoke" />
            <h2 className="mt-4 font-display text-3xl font-light">No chairs match those filters</h2>
            <p className="mt-2 max-w-sm text-sm text-smoke">
              Try a different price range or search — or start fresh below.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={clearAll}
                className="rounded-full bg-ink px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory hover:bg-oxblood"
              >
                Clear all filters
              </button>
              {category !== 'all' && (
                <a
                  href="/shop"
                  className="rounded-full border border-ink px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] hover:bg-ink hover:text-ivory"
                >
                  Browse everything
                </a>
              )}
            </div>
          </div>
        ) : view === 'grid' ? (
          <>
            <motion.div layout className="mt-6 grid grid-cols-1 gap-x-5 gap-y-10 min-[480px]:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {shown.map((p) => (
                  <motion.div
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="group/cmp relative"
                  >
                    <ProductCard product={p} />
                    <CompareToggle slug={p.slug} active={compare.includes(p.slug)} onToggle={() => toggleCompare(p.slug)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <LoadMore visible={shown.length} total={results.length} onMore={() => setVisible((v) => v + PAGE_SIZE)} />
          </>
        ) : (
          <>
            <motion.div layout className="mt-6 space-y-4">
              <AnimatePresence mode="popLayout">
                {shown.map((p) => (
                  <motion.div
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListRow
                      product={p}
                      comparing={compare.includes(p.slug)}
                      onCompare={() => toggleCompare(p.slug)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <LoadMore visible={shown.length} total={results.length} onMore={() => setVisible((v) => v + PAGE_SIZE)} />
          </>
        )}
      </div>

      {/* mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75] bg-ink/45 backdrop-blur-sm lg:hidden"
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 280 }}
              className="absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-ivory"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <p className="font-display text-2xl font-light">
                  Filters {activeCount > 0 && <span className="text-base text-oxblood">({activeCount})</span>}
                </p>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5"
                  aria-label="Close filters"
                >
                  <X size={19} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">{panel}</div>
              <div className="border-t border-line bg-parchment/60 px-5 py-4">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-full rounded-full bg-ink py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory active:scale-[0.98]"
                >
                  Show {results.length} {results.length === 1 ? 'chair' : 'chairs'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* compare tray */}
      <AnimatePresence>
        {compare.length > 0 && !compareOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
          >
            <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-ivory/10 bg-ink px-4 py-3 text-ivory shadow-2xl">
              <div className="flex -space-x-2">
                {compareProducts.map((p) => (
                  <img key={p.slug} src={p.images[0]?.src} alt="" className="h-10 w-10 rounded-full border-2 border-ink object-cover" />
                ))}
              </div>
              <span className="text-[13px] text-ivory/80">
                {compare.length} of 3 selected
              </span>
              <button
                onClick={() => setCompare([])}
                className="text-[12px] text-ivory/60 underline underline-offset-2 hover:text-ivory"
              >
                Clear
              </button>
              <button
                onClick={() => setCompareOpen(true)}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-oxblood px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-oxblooddeep"
              >
                <ArrowLeftRight size={14} /> Compare
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* compare modal */}
      <AnimatePresence>
        {compareOpen && (
          <CompareModal products={compareProducts} onClose={() => setCompareOpen(false)} onRemove={(s) => toggleCompare(s)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterRadio({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] transition active:scale-[0.98] ${
        active ? 'bg-ink font-semibold text-ivory' : 'hover:bg-ink/[0.05]'
      }`}
    >
      <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${active ? 'border-ivory' : 'border-smoke/50'}`} aria-hidden="true">
        {active && <span className="h-1.5 w-1.5 rounded-full bg-oxblood" />}
      </span>
      <span className="truncate">{label}</span>
      <span className={`ml-auto text-[12px] ${active ? 'text-ivory/70' : 'text-smoke'}`}>{count}</span>
    </button>
  );
}

function CompareToggle({ slug, active, onToggle }: { slug: string; active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? 'Remove from compare' : 'Add to compare'}
      className={`absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur transition-all active:scale-95 md:opacity-0 md:group-hover/cmp:opacity-100 md:focus:opacity-100 ${
        active ? 'bg-oxblood text-white md:opacity-100' : 'bg-ivory/90 text-ink hover:bg-ivory'
      }`}
    >
      <ArrowLeftRight size={12} /> {active ? 'Added' : 'Compare'}
    </button>
  );
}

function ListRow({ product: p, comparing, onCompare }: { product: Product; comparing: boolean; onCompare: () => void }) {
  const out = p.availability === 'out-of-stock';
  return (
    <article className="flex gap-4 rounded-2xl border border-line bg-ivory p-3 transition hover:border-ink/40 hover:shadow-[0_10px_36px_rgba(22,19,14,0.08)] sm:gap-5 sm:p-4">
      <a href={`/product/${p.slug}`} className="relative block h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-parchment sm:h-36 sm:w-36">
        <img
          src={p.images[0]?.src}
          alt={p.images[0]?.alt ?? p.name}
          loading="lazy"
          className="img-warm h-full w-full object-cover"
        />
        {p.mrp && p.mrp > p.price && (
          <span className="absolute left-2 top-2 rounded-full bg-oxblood px-2.5 py-0.5 text-[10px] font-bold text-white">
            −{inr(p.mrp - p.price)}
          </span>
        )}
      </a>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-smoke">
          {p.category} · {p.sku}
        </p>
        <a href={`/product/${p.slug}`}>
          <h3 className="mt-0.5 truncate font-display text-xl font-medium hover:text-oxblood sm:text-2xl">{p.name}</h3>
        </a>
        <p className="mt-1 hidden text-[13px] leading-relaxed text-smoke min-[560px]:line-clamp-2">{p.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-2">
          <span className="text-lg font-bold">{inr(p.price)}</span>
          {p.mrp && p.mrp > p.price && <span className="text-[13px] text-smoke line-through">{inr(p.mrp)}</span>}
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${out ? 'bg-ink text-ivory' : 'bg-olive/10 text-olive'}`}>
            {AVAILABILITY_LABEL[p.availability]}
          </span>
          <span className="ml-auto flex gap-2">
            <button
              onClick={onCompare}
              aria-pressed={comparing}
              className={`rounded-full border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition active:scale-95 ${
                comparing ? 'border-oxblood bg-oxblood text-white' : 'border-line hover:border-ink'
              }`}
            >
              {comparing ? '✓ Added' : '+ Compare'}
            </button>
            <button
              onClick={() => addToCartWithToast(p.slug)}
              disabled={out}
              className="rounded-full bg-ink px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-ivory transition hover:bg-oxblood disabled:opacity-30"
              aria-label={out ? `${p.name} out of stock` : `Add ${p.name} to bag`}
            >
              <span className="hidden sm:inline">{out ? 'Sold out' : 'Add to bag'}</span>
              <ShoppingBag size={14} className="sm:hidden" />
            </button>
          </span>
        </div>
      </div>
    </article>
  );
}

function LoadMore({ visible, total, onMore }: { visible: number; total: number; onMore: () => void }) {
  if (visible >= total) {
    return (
      <p className="mt-12 text-center text-sm text-smoke">
        Showing all {total} {total === 1 ? 'chair' : 'chairs'} — you've seen everything.
      </p>
    );
  }
  return (
    <div className="mt-12 text-center">
      <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-line/60" aria-hidden="true">
        <div className="h-full rounded-full bg-oxblood transition-all" style={{ width: `${Math.round((visible / total) * 100)}%` }} />
      </div>
      <p className="mt-3 text-sm text-smoke">Showing {visible} of {total}</p>
      <button
        onClick={onMore}
        className="mt-4 rounded-full border border-ink px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] transition hover:bg-ink hover:text-ivory active:scale-95"
      >
        Load more chairs
      </button>
    </div>
  );
}

function CompareModal({ products, onClose, onRemove }: { products: Product[]; onClose: () => void; onRemove: (slug: string) => void }) {
  const specKeys = useMemo(() => {
    const keys: string[] = [];
    products.forEach((p) => Object.keys(p.specs).forEach((k) => {
      if (!keys.includes(k)) keys.push(k);
    }));
    return keys.slice(0, 14);
  }, [products]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[85] flex items-end justify-center bg-ink/55 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Compare chairs"
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-ivory p-5 sm:rounded-3xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-light md:text-3xl">Side by side.</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5" aria-label="Close compare">
            <X size={19} />
          </button>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-28 p-2 align-bottom text-[11px] font-semibold uppercase tracking-[0.14em] text-smoke">Chair</th>
                {products.map((p) => (
                  <th key={p.slug} className="min-w-[160px] p-2 align-top">
                    <div className="relative overflow-hidden rounded-xl bg-parchment aspect-[4/3]">
                      <img src={p.images[0]?.src} alt="" className="img-warm h-full w-full object-cover" />
                      <button
                        onClick={() => onRemove(p.slug)}
                        aria-label={`Remove ${p.name} from compare`}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-ivory hover:bg-oxblood"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <a href={`/product/${p.slug}`} className="mt-2 block font-display text-[17px] font-medium leading-tight hover:text-oxblood">
                      {p.name}
                    </a>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-smoke">{p.sku}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Price">
                {products.map((p) => (
                  <div key={p.slug} className="font-bold">
                    {inr(p.price)}
                    {p.mrp && p.mrp > p.price && (
                      <span className="ml-2 text-[12px] font-normal text-smoke line-through">{inr(p.mrp)}</span>
                    )}
                  </div>
                ))}
              </CompareRow>
              <CompareRow label="You save">
                {products.map((p) => (
                  <span key={p.slug} className={discountOf(p) > 0 ? 'font-semibold text-oxblood' : 'text-smoke'}>
                    {discountOf(p) > 0 ? inr(discountOf(p)) : '—'}
                  </span>
                ))}
              </CompareRow>
              <CompareRow label="Availability">
                {products.map((p) => (
                  <span key={p.slug} className="text-[13px] font-medium">{AVAILABILITY_LABEL[p.availability]}</span>
                ))}
              </CompareRow>
              {specKeys.map((k) => (
                <CompareRow key={k} label={k}>
                  {products.map((p) => (
                    <span key={p.slug} className="text-[13px] text-smoke">{p.specs[k] ?? '—'}</span>
                  ))}
                </CompareRow>
              ))}
              <tr>
                <td className="p-2" />
                {products.map((p) => (
                  <td key={p.slug} className="p-2">
                    <a
                      href={`/product/${p.slug}`}
                      className="block rounded-full bg-ink py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-ivory hover:bg-oxblood"
                    >
                      View chair
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CompareRow({ label, children }: { label: string; children: React.ReactNode[] }) {
  return (
    <tr className="border-t border-line/70">
      <th className="p-2 pr-3 align-top text-[11px] font-semibold uppercase tracking-[0.12em] text-smoke">{label}</th>
      {(Array.isArray(children) ? children : [children]).map((c, i) => (
        <td key={i} className="p-2 align-top">{c}</td>
      ))}
    </tr>
  );
}
