export function inr(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

export interface EnquiryLine {
  name: string;
  sku: string;
  qty: number;
  unitPrice: number;
}

export interface EnquiryCustomer {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  notes?: string;
}

export function buildWhatsAppUrl(
  businessNumber: string,
  customer: EnquiryCustomer,
  lines: EnquiryLine[],
): string {
  const subtotal = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const itemLines = lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.name} (${l.sku}) × ${l.qty} — ${inr(l.unitPrice)} each = ${inr(l.qty * l.unitPrice)}`,
    )
    .join('\n');
  const msg = [
    'Hello Noor Chair, I would like to enquire about the following chairs:',
    '',
    itemLines,
    '',
    `Estimated product total: ${inr(subtotal)}`,
    'Please confirm stock and delivery charges.',
    '',
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}, ${customer.city}, ${customer.state} — ${customer.pin}`,
    customer.notes ? `Notes: ${customer.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  return `https://wa.me/${businessNumber}?text=${encodeURIComponent(msg)}`;
}

export function productWhatsAppUrl(businessNumber: string, name: string, sku: string, price: number): string {
  const msg = `Hello Noor Chair, I am interested in ${name} (${sku}) priced at ${inr(price)}. Please confirm stock and delivery charges.`;
  return `https://wa.me/${businessNumber}?text=${encodeURIComponent(msg)}`;
}
