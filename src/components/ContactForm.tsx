import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../config/brand';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', topic: 'A chair I saw', message: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError('Please enter your name.');
    if (form.message.trim().length < 10) return setError('Tell us a little more (10+ characters).');
    setError('');
    const msg = [`Hello Noor Chair,`, ``, `Name: ${form.name}`, form.phone ? `Phone: ${form.phone}` : '', `Topic: ${form.topic}`, ``, form.message].filter(Boolean).join('\n');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-line bg-parchment/50 p-8 text-center">
        <p className="font-display text-3xl font-light">WhatsApp opened.</p>
        <p className="mx-auto mt-3 max-w-sm text-[15px] text-smoke">
          Your message was prepared in WhatsApp — press send there to reach us. Nothing was saved
          to any database on this demo site.
        </p>
        <button onClick={() => setSent(false)} className="mt-6 rounded-full border border-ink px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] hover:bg-ink hover:text-ivory transition">
          Write another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-parchment/50 p-6 md:p-8" noValidate>
      <h2 className="font-display text-3xl font-light">Send an enquiry</h2>
      <p className="mt-1 text-[13px] text-smoke">Opens WhatsApp with your message — you press send.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input value={form.name} onChange={set('name')} placeholder="Full name *" aria-label="Full name" className="rounded-xl border border-line bg-white/70 px-4 py-3 text-[15px] outline-none focus:border-ink" />
        <input value={form.phone} onChange={set('phone')} placeholder="Phone (optional)" inputMode="tel" aria-label="Phone" className="rounded-xl border border-line bg-white/70 px-4 py-3 text-[15px] outline-none focus:border-ink" />
        <select value={form.topic} onChange={set('topic')} aria-label="Topic" className="rounded-xl border border-line bg-white/70 px-4 py-3 text-[15px] outline-none focus:border-ink sm:col-span-2">
          <option>A chair I saw</option>
          <option>Office / bulk seating</option>
          <option>School seating</option>
          <option>Delivery & stock question</option>
          <option>Something else</option>
        </select>
        <textarea value={form.message} onChange={set('message')} placeholder="How can we help? (e.g. I need 8 mesh chairs for a Karol Bagh office…)" rows={5} aria-label="Message" className="rounded-xl border border-line bg-white/70 px-4 py-3 text-[15px] outline-none focus:border-ink sm:col-span-2" />
      </div>
      {error && <p className="mt-3 text-[14px] font-medium text-oxblood" role="alert">{error}</p>}
      <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-oxblood px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-oxblooddeep transition">
        <MessageCircle size={15} /> Continue on WhatsApp
      </button>
    </form>
  );
}
