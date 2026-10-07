export const BRAND = {
  name: 'Noor Chair',
  wordmark: 'NOOR',
  suffix: 'CHAIR',
  tagline: 'Thoughtful seating for the spaces where life and work happen.',
  city: 'Delhi, India',
  localeDetail: 'New Delhi — Studio & Seating Gallery',
  whatsappLabel: 'Order on WhatsApp',
} as const;

/**
 * WhatsApp business number in international format WITHOUT "+" or spaces.
 * Live business number for WhatsApp click-to-chat redirection.
 * Future backend: move to env / Workers KV.
 */
export const WHATSAPP_NUMBER = '918529456730';
export const WHATSAPP_NUMBER_NOTE =
  'Live number — all enquiry CTAs across the site redirect here via wa.me links.';

export const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/#collections' },
  { label: 'Our Story', href: '/story' },
  { label: 'Contact', href: '/contact' },
] as const;

export const CATEGORY_NAV = [
  { label: 'Office Chairs', href: '/shop?cat=office' },
  { label: 'Visitor Chairs', href: '/shop?cat=visitor' },
  { label: 'Gaming Chairs', href: '/shop?cat=gaming' },
  { label: 'School Chairs', href: '/shop?cat=school' },
  { label: 'Plastic Chairs', href: '/shop?cat=plastic' },
  { label: 'Other Seating', href: '/shop?cat=other' },
] as const;
