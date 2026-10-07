import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Minus, Plus, Trash2, MessageCircle, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { resolveCart, setQty, removeLine, clearCart, useCartState } from '../lib/cart';
import { inr, buildWhatsAppUrl, type EnquiryCustomer } from '../lib/format';
import { WHATSAPP_NUMBER } from '../config/brand';

type Errors = Partial<Record<keyof EnquiryCustomer, string>>;

function validate(c: EnquiryCustomer): Errors {
  const e: Errors = {};
  if (c.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!/^[6-9]\d{9}$/.test(c.phone.replace(/[\s+\-]/g, '').replace(/^91/, ''))) {
    // accept 10-digit Indian mobile, optionally prefixed with 91
    const digits = c.phone.replace(/\D/g, '');
    const local = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    if (!/^[6-9]\d{9}$/.test(local)) e.phone = 'Enter a valid 10-digit mobile number.';
  }
  if (c.address.trim().length < 6) e.address = 'Please enter your street address.';
  if (c.city.trim().length < 2) e.city = 'City is required.';
  if (c.state.trim().length < 2) e.state = 'State is required.';
  if (!/^\d{6}$/.test(c.pin.replace(/\s/g, ''))) e.pin = 'PIN code must be 6 digits.';
  return e;
}

const inputCls = (bad?: string) =>
  `w-full rounded-xl border bg-white/70 px-4 py-3.5 text-base outline-none transition placeholder:text-smoke/60 ${
    bad ? 'border-oxblood' : 'border-line focus:border-ink'
  }`;

export default function CartPage() {
  const { lines, subtotal, count } = useCartState();
  const available = useMemo(() => lines.filter((l) => l.available), [lines]);
  const [form, setForm] = useState<EnquiryCustomer>({
    name: '', phone: '', address: '', city: '', state: '', pin: '', notes: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);

  const set = (k: keyof EnquiryCustomer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (touched) setErrors(validate({ ...form, [k]: e.target.value }));
  };

  const generate = () => {
    setTouched(true);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const url = buildWhatsAppUrl(
      WHATSAPP_NUMBER,
      form,
      available.map((l) => ({ name: l.name, sku: l.sku, qty: l.qty, unitPrice: l.price })),
    );
    setWaUrl(url);
  };

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <ShoppingBag size={40} strokeWidth={1.25} className="text-smoke" />
        <h1 className="mt-5 font-display text-4xl md:text-5xl font-light">Your bag is empty</h1>
        <p className="mt-3 max-w-sm text-[15px] text-smoke">
          Add a few chairs and come back — your picks are saved in this browser automatically.
        </p>
        <a href="/shop" className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory hover:bg-oxblood">
          Browse chairs <ArrowRight size={14} />
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
      <div>
        <h1 className="font-display text-4xl md:text-5xl font-light">
          Your bag <span className="text-xl text-smoke">({count})</span>
        </h1>
        <ul className="mt-6 divide-y divide-line/70 border-y border-line/70">
          {lines.map((l) => (
            <motion.li key={l.slug + (l.color ?? '')} layout className="flex gap-4 py-5">
              <a href={`/product/${l.slug}`}>
                <img src={l.image} alt="" className="h-24 w-24 rounded-xl object-cover" />
              </a>
              <div className="min-w-0 flex-1">
                <a href={`/product/${l.slug}`} className="font-medium hover:text-oxblood">{l.name}</a>
                <p className="text-[12px] uppercase tracking-[0.12em] text-smoke">
                  {l.sku}{l.color ? ` · ${l.color}` : ''}
                </p>
                {!l.available && (
                  <p className="mt-1 text-[13px] font-medium text-oxblood">
                    Out of stock — remove it or ask on WhatsApp about restock.
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center rounded-full border border-line">
                    <button onClick={() => setQty(l.slug, l.qty - 1, l.color)} className="flex h-9 w-9 items-center justify-center hover:text-oxblood" aria-label="Decrease quantity"><Minus size={14} /></button>
                    <span className="w-7 text-center text-sm font-semibold">{l.qty}</span>
                    <button onClick={() => setQty(l.slug, Math.min(99, l.qty + 1), l.color)} className="flex h-9 w-9 items-center justify-center hover:text-oxblood" aria-label="Increase quantity"><Plus size={14} /></button>
                  </div>
                  <span className="font-semibold">{inr(l.lineTotal)}</span>
                </div>
              </div>
              <button onClick={() => removeLine(l.slug, l.color)} className="self-start rounded-full p-2 text-smoke hover:text-oxblood" aria-label={`Remove ${l.name}`}>
                <Trash2 size={16} />
              </button>
            </motion.li>
          ))}
        </ul>
        <button onClick={clearCart} className="mt-4 text-[13px] text-smoke underline underline-offset-4 hover:text-oxblood">
          Clear entire bag
        </button>
      </div>

      <div id="enquiry" className="h-fit rounded-2xl border border-line bg-parchment/50 p-6 md:p-8 lg:sticky lg:top-24 scroll-mt-28">
        <h2 className="font-display text-3xl font-light">Order summary</h2>
        <div className="mt-4 space-y-1.5 text-[14px]">
          {available.map((l) => (
            <div key={l.slug + (l.color ?? '')} className="flex justify-between gap-3">
              <span className="text-smoke">{l.name} × {l.qty}</span>
              <span className="font-medium">{inr(l.lineTotal)}</span>
            </div>
          ))}
          {lines.some((l) => !l.available) && (
            <p className="text-[13px] text-oxblood">Out-of-stock items are excluded from the total.</p>
          )}
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <span className="font-medium">Estimated product total</span>
            <span className="font-display text-2xl font-medium">{inr(subtotal)}</span>
          </div>
          <p className="text-[12px] text-smoke">Delivery charges are confirmed on WhatsApp — nothing is charged here.</p>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
            {[
              { icon: ShieldCheck, t: 'No prepayment' },
              { icon: MessageCircle, t: 'Stock confirmed live' },
              { icon: Truck, t: 'Delivery quoted upfront' },
            ].map(({ icon: Icon, t }) => (
              <div key={t} className="flex flex-col items-center gap-1.5 rounded-xl bg-ivory px-2 py-3 text-center">
                <Icon size={17} className="text-oxblood" />
                <span className="text-[11px] font-semibold leading-tight">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <h3 className="mt-7 font-display text-2xl font-light">Your details</h3>
        <p className="mt-1 text-[13px] text-smoke">
          Nothing is saved on this site. Your details go only into the WhatsApp order
          message <em>you</em> choose to send.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <input value={form.name} onChange={set('name')} placeholder="Full name *" className={inputCls(errors.name)} aria-label="Full name" />
            {errors.name && <p className="mt-1 text-[13px] text-oxblood">{errors.name}</p>}
          </div>
          <div>
            <input value={form.phone} onChange={set('phone')} placeholder="Phone *" inputMode="tel" className={inputCls(errors.phone)} aria-label="Phone" />
            {errors.phone && <p className="mt-1 text-[13px] text-oxblood">{errors.phone}</p>}
          </div>
          <div>
            <input value={form.pin} onChange={set('pin')} placeholder="PIN code *" inputMode="numeric" className={inputCls(errors.pin)} aria-label="PIN code" />
            {errors.pin && <p className="mt-1 text-[13px] text-oxblood">{errors.pin}</p>}
          </div>
          <div className="sm:col-span-2">
            <input value={form.address} onChange={set('address')} placeholder="Street address *" className={inputCls(errors.address)} aria-label="Street address" />
            {errors.address && <p className="mt-1 text-[13px] text-oxblood">{errors.address}</p>}
          </div>
          <div>
            <input value={form.city} onChange={set('city')} placeholder="City *" className={inputCls(errors.city)} aria-label="City" />
            {errors.city && <p className="mt-1 text-[13px] text-oxblood">{errors.city}</p>}
          </div>
          <div>
            <input value={form.state} onChange={set('state')} placeholder="State *" className={inputCls(errors.state)} aria-label="State" />
            {errors.state && <p className="mt-1 text-[13px] text-oxblood">{errors.state}</p>}
          </div>
          <div className="sm:col-span-2">
            <textarea value={form.notes ?? ''} onChange={set('notes')} placeholder="Notes (optional) — e.g. need 12 chairs for office" rows={3} className={inputCls()} aria-label="Notes" />
          </div>
        </div>

        {!waUrl ? (
          <button
            onClick={generate}
            disabled={available.length === 0}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-oxblood px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-oxblooddeep disabled:opacity-40"
          >
            <MessageCircle size={15} /> Continue to order
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl bg-ink p-5 text-ivory">
            <p className="text-[14px] leading-relaxed text-ivory/80">
              Your order is ready with {available.length} item{available.length > 1 ? 's' : ''} totalling{' '}
              <strong className="text-ivory">{inr(subtotal)}</strong>. Tap below to open WhatsApp
              and press send — nothing is sent until you do.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-ink transition hover:brightness-110"
            >
              <MessageCircle size={15} /> Order on WhatsApp
            </a>
            <button onClick={() => setWaUrl(null)} className="mt-2 w-full text-center text-[13px] text-ivory/60 underline underline-offset-4">
              Edit details
            </button>
          </motion.div>
        )}
        {available.length === 0 && (
          <p className="mt-3 text-[13px] text-oxblood">All items in your bag are out of stock — add an available chair to order.</p>
        )}
      </div>
    </div>
  );
}

export { resolveCart };
