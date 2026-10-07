# Noor Chair — Cinematic Furniture Commerce (Demo)

Astro + React + Tailwind + Motion storefront for **Noor Chair, Delhi**. Static-first, no backend.
100-product typed mock catalogue, working cart (localStorage), live search, WhatsApp enquiry handoff.

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ — static, Cloudflare Pages ready
npm run preview
```

## Structure

- `src/config/brand.ts` — brand + **WhatsApp business number** (`918529456730`, used by every `wa.me` enquiry CTA)
- `src/data/products.ts` — typed mock catalogue (100 products, 6 categories). Imagery: local hero (`public/images/*`) + hotlinked Unsplash concept photos (illustrative, not verified stock photos).
- `src/lib/repository.ts` — **the only data seam**. UI imports from here; swap bodies for `/api/*` fetches when Cloudflare D1+R2 lands. Types stay stable.
- `src/lib/cart.ts` — cart store (stores `{slug, qty, color}` only; prices re-derived from catalogue; `noor:cart` events; `localStorage` key `noor-cart-v1`).
- `src/lib/format.ts` — INR formatting + WhatsApp URL builders.
- `src/components/*` — Header, SearchOverlay, CartDrawer, ProductCard, Hero, ScrollReveal, Spaces, ShopExplorer, ProductDetail, CartPage, ContactForm…
- `src/pages/` — `index`, `shop` (all collections; categories open as `/shop?cat=office` etc. — no separate category pages), `product/[slug]` (100 static paths + JSON-LD), `cart`, `story`, `contact`, `privacy`, `terms`, `404`. `public/_redirects` keeps old `/category/*` links working.

## Notes

- No DB, auth, payments. Enquiry forms validate locally and open WhatsApp (`wa.me`) with a pre-filled message — the customer presses send; nothing is auto-sent or stored.
- Reduced-motion respected; images lazy below the fold; hero eager + local.
- `npm run build` must pass with zero errors before handoff.
- `node_modules/`, `dist/` and `.astro/` are git-ignored (see `.gitignore`). Only source + config are versioned — reinstall with `npm install`, rebuild with `npm run build`.

## Security posture (static site)

- No server, no database, no cookies, no auth tokens — nothing to breach at runtime.
- No `innerHTML`/`eval`; the single `set:html` is JSON-LD built via `JSON.stringify` from our own catalogue data.
- All outbound links are HTTPS; every `target="_blank"` carries `rel="noopener"`.
- Form input is never rendered as HTML — it only goes into `wa.me` URLs via `encodeURIComponent`.
- Cart + recently-viewed live in `localStorage` (this browser only); prices are re-derived from the catalogue, never trusted from storage.
- `public/_headers` ships hardened response headers on Cloudflare Pages (frame/clickjacking, MIME-sniffing, referrer, permissions, opener policy). Strict CSP `script-src` is deliberately omitted — Astro island hydration uses inline module scripts and a naive CSP would break interactivity; add nonce-based CSP when moving to Workers SSR.
- `npm audit` flags only build-toolchain advisories (Astro/Vite/Tailwind dev chain); none ship to the browser. Deliberately not "fixed" — toolchain upgrades are pinned to keep builds reproducible.

## Still needed before launch (real business info)

1. Real product photos, final prices, stock truth (replace mock catalogue / wire D1+R2)
2. Shop/studio address + hours (footer/contact currently say “Delhi, India” only)
3. Real product photos, final prices, stock truth (replace mock catalogue / wire D1+R2)
4. Delivery zones + charges policy, bulk/office pricing rules
5. Final privacy/terms copy, domain + OG image, favicon art if rebranded
