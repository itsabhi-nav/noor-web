import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, ChevronDown, Menu, MessageCircle, Search, ShoppingBag, X } from 'lucide-react';
import { NAV_LINKS, CATEGORY_NAV, BRAND, WHATSAPP_NUMBER } from '../config/brand';
import { LogoLockup } from './Logo';
import { useCartCount } from '../lib/cart';
import { getAllCategories, getProductsByCategory } from '../lib/repository';

export function openSearch() {
  window.dispatchEvent(new CustomEvent('noor:search-open'));
}
export function openCart() {
  window.dispatchEvent(new CustomEvent('noor:cart-open'));
}

const waGeneral = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Noor Chair, I have a question about your chairs.')}`;

export default function Header() {
  const count = useCartCount();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [path, setPath] = useState('');
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    setPath(window.location.pathname.replace(/\/$/, '') || '/');
  }, []);

  const isActive = (href: string) =>
    href === '/' ? path === '/' : path === href || path.startsWith(href + '/');
  const categoriesActive = path.startsWith('/category') || path.startsWith('/shop');

  const cats = useMemo(
    () =>
      getAllCategories().map((c) => ({
        ...c,
        count: getProductsByCategory(c.slug).length,
      })),
    [],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen ]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* announcement bar */}
        <div
          className={`overflow-hidden bg-ink text-ivory transition-all duration-500 ${
            scrolled ? 'max-h-0' : 'max-h-12'
          }`}
        >
          <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-5 text-[11px] font-medium uppercase tracking-[0.18em] md:px-10">
            <span className="truncate">Delhi seating studio · 100+ concepts · Fixed INR prices</span>
            <a
              href={waGeneral}
              target="_blank"
              rel="noopener"
              className="hidden shrink-0 items-center gap-1.5 text-ivory/80 hover:text-white sm:flex"
            >
              <MessageCircle size={13} /> Order on WhatsApp
            </a>
          </div>
        </div>

        {/* main bar */}
        <div
          className={`transition-all duration-500 ${
            scrolled ? 'bg-ivory/90 shadow-[0_1px_0_rgba(22,19,14,0.08)] backdrop-blur-md' : 'bg-transparent'
          }`}
        >
          <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-[72px] md:px-10">
            <a href="/" className="group flex shrink-0 items-center" aria-label="Noor Chair — home">
              <LogoLockup className="origin-left scale-[0.88] min-[400px]:scale-100" />
            </a>

            <nav className="hidden items-center gap-7 lg:flex xl:gap-8" aria-label="Primary">
              <a
                href="/"
                aria-current={isActive('/') ? 'page' : undefined}
                className="group relative py-2 text-[13px] font-medium uppercase tracking-[0.18em] text-ink/80 hover:text-ink"
              >
                Home
                <span className={`absolute -bottom-0.5 left-0 h-px bg-oxblood transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
              <a
                href="/shop"
                aria-current={isActive('/shop') ? 'page' : undefined}
                className="group relative py-2 text-[13px] font-medium uppercase tracking-[0.18em] text-ink/80 hover:text-ink"
              >
                Shop
                <span className={`absolute -bottom-0.5 left-0 h-px bg-oxblood transition-all duration-300 ${isActive('/shop') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button
                  onClick={() => setMegaOpen((v) => !v)}
                  aria-expanded={megaOpen}
                  aria-haspopup="true"
                  className="group relative flex items-center gap-1 py-2 text-[13px] font-medium uppercase tracking-[0.18em] text-ink/80 hover:text-ink"
                >
                  Categories
                  <motion.span animate={{ rotate: megaOpen ? 180 : 0 }} className="flex" aria-hidden="true">
                    <ChevronDown size={12} strokeWidth={2.5} />
                  </motion.span>
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-oxblood transition-all duration-300 ${
                      megaOpen || categoriesActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3"
                    >
                      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-line bg-ivory p-3 shadow-2xl">
                        {cats.map((c) => (
                          <a
                            key={c.slug}
                            href={`/category/${c.slug}`}
                            className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-ink/[0.04]"
                          >
                            <img
                              src={c.image}
                              alt=""
                              loading="lazy"
                              className="h-14 w-14 shrink-0 rounded-lg object-cover"
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-[14px] font-semibold">{c.name}</span>
                              <span className="block truncate text-[12px] text-smoke">
                                {c.count} concepts · {c.tagline}
                              </span>
                            </span>
                            <ArrowUpRight
                              size={15}
                              className="ml-auto shrink-0 text-smoke transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-oxblood"
                            />
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {NAV_LINKS.filter((l) => l.label !== 'Shop' && l.label !== 'Categories').map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  className="group relative py-2 text-[13px] font-medium uppercase tracking-[0.18em] text-ink/80 hover:text-ink"
                >
                  {l.label}
                  <span className={`absolute -bottom-0.5 left-0 h-px bg-oxblood transition-all duration-300 ${isActive(l.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1 md:gap-1.5">
              <a
                href="/shop"
                className="mr-0.5 hidden rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory transition hover:bg-oxblood min-[360px]:inline-flex md:hidden"
              >
                Shop
              </a>
              <button
                onClick={openSearch}
                className="hidden h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-[13px] text-smoke transition hover:border-ink hover:text-ink min-[480px]:flex"
                aria-label="Search products"
              >
                <Search size={15} strokeWidth={2} />
                <span className="hidden md:inline">Search…</span>
                <kbd className="hidden rounded border border-line bg-parchment px-1.5 text-[10px] lg:inline">⌘K</kbd>
              </button>
              <button
                onClick={openSearch}
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-ink/5 min-[480px]:hidden"
                aria-label="Search products"
              >
                <Search size={19} strokeWidth={1.75} />
              </button>
              <button
                onClick={openCart}
                className="relative flex h-10 items-center gap-1.5 rounded-full px-2.5 transition hover:bg-ink/5"
                aria-label={`Shopping bag, ${count} items`}
              >
                <ShoppingBag size={19} strokeWidth={1.75} />
                <AnimatePresence mode="popLayout">
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      className="flex h-5 min-w-5 items-center justify-center rounded-full bg-oxblood px-1 text-[11px] font-semibold text-white"
                    >
                      {count > 99 ? '99+' : count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <a
                href="/shop"
                className="ml-1 hidden items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.16em] text-ivory transition hover:bg-oxblood md:flex"
              >
                Shop <ArrowUpRight size={14} />
              </a>
              <button
                onClick={() => setMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-ink/5 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={20} strokeWidth={1.75} />
              </button>
            </div>
          </div>
          {/* scroll progress */}
          <motion.div style={{ scaleX: progress }} className="h-[2px] origin-left bg-oxblood" aria-hidden="true" />
        </div>
      </header>

      {/* mobile nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/45 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 280 }}
              className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-ivory px-7 pb-8 pt-5"
              onClick={(e) => e.stopPropagation()}
              aria-label="Mobile"
            >
              <div className="flex items-center justify-between">
                <span className="group flex items-center" aria-label="Noor Chair">
                  <LogoLockup compact />
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openSearch();
                }}
                className="mt-6 flex items-center gap-3 rounded-full border border-line bg-white/60 px-5 py-3.5 text-[15px] text-smoke"
              >
                <Search size={17} /> Search chairs, models…
              </button>
              <div className="mt-6 flex flex-col">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Shop all', href: '/shop' },
                  { label: 'Our Story', href: '/story' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Your bag', href: '/cart' },
                ].map((l, i) => (
                  <motion.a
                    key={l.label}
                    href={l.href}
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.35, ease: 'easeOut' }}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center justify-between border-b border-line/70 py-4 font-display text-[1.7rem] font-light leading-none"
                  >
                    {l.label}
                    <ArrowUpRight
                      size={20}
                      className="text-smoke transition group-hover:text-oxblood"
                    />
                  </motion.a>
                ))}
              </div>
              <p className="mt-7 text-[11px] font-semibold uppercase tracking-mega text-smoke">
                Collections
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {CATEGORY_NAV.map((c) => (
                  <a
                    key={c.href}
                    href={c.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl border border-line px-4 py-3 text-[14px] font-medium transition hover:border-ink hover:bg-ink hover:text-ivory"
                  >
                    {c.label}
                  </a>
                ))}
              </div>
              <a
                href={waGeneral}
                target="_blank"
                rel="noopener"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-oxblood px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white"
              >
                <MessageCircle size={15} /> {BRAND.whatsappLabel}
              </a>
              <p className="mt-4 text-center text-[13px] text-smoke">{BRAND.city} · Fixed INR prices</p>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
