/**
 * Noor Chair — typed mock catalogue.
 *
 * FUTURE BACKEND INTEGRATION (Cloudflare D1 + R2):
 * - Replace the functions in `src/lib/repository.ts` with fetch calls to
 *   `/api/products`, `/api/products/:slug`, etc.
 * - Types in this file (Product, Category, CartItem) are already shaped to
 *   match future API responses. Keep them stable.
 * - Images: `src` will become R2 object URLs. Gallery arrays stay the same shape.
 * - Prices are INR integers (paise not used at this phase).
 *
 * All imagery below is illustrative (Unsplash, freely usable) and represents
 * product concepts — not verified photos of Noor Chair inventory.
 */

export type CategorySlug = 'office' | 'visitor' | 'gaming' | 'school' | 'plastic' | 'other';

export type Availability = 'in-stock' | 'low-stock' | 'made-to-order' | 'out-of-stock';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: CategorySlug;
  description: string;
  price: number;
  mrp?: number;
  images: ProductImage[];
  specs: Record<string, string>;
  colors?: ProductColor[];
  availability: Availability;
  featured?: boolean;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  tagline: string;
  description: string;
  image: string;
}

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

const img = (id: string, alt: string, w = 1200): ProductImage => ({ src: u(id, w), alt });

// ---- Shared image pools (all IDs verified live, Unsplash) ----
const OFFICE = [
  '1592078615290-033ee584e267',
  '1561677978-583a8c7a4b43',
  '1538688525198-9b88f6f53126',
  '1547394765-185e1e68f34e',
  '1595515106969-1ce29566ff1c',
  '1580480055273-228ff5388ef8',
];
const VISITOR = [
  '1519947486511-46149fa0a254',
  '1503602642458-232111445657',
  '1581539250439-c96689b516dd',
  '1506439773649-6e0eb8cfb237',
  '1519710164239-da123dc03ef4',
  '1598300042247-d088f8ab3a91',
];
const GAMING = [
  '1541558869434-2840d308329a',
  '1598550476439-6847785fcea6',
  '1583847268964-b28dc8f51f92',
  '1567538096630-e0c55bd6374c',
  '1538688525198-9b88f6f53126',
];
const SCHOOL = [
  '1509062522246-3755977927d7',
  '1580582932707-520aed937b7b',
  '1549187774-b4e9b0445b41',
  '1506439773649-6e0eb8cfb237',
  '1519710164239-da123dc03ef4',
];
const PLASTIC = [
  '1503602642458-232111445657',
  '1581539250439-c96689b516dd',
  '1519947486511-46149fa0a254',
  '1506439773649-6e0eb8cfb237',
];
const OTHER = [
  '1567538096630-e0c55bd6374c',
  '1586023492125-27b2c045efd7',
  '1598300042247-d088f8ab3a91',
  '1555041469-a586c61ea9bc',
  '1595428774223-ef52624120d2',
];
const DETAIL = [
  '1524758631624-e2822e304c36',
  '1497366216548-37526070297c',
  '1554995207-c18c203602cb',
  '1616486338812-3dadae4b4ace',
  '1618221195710-dd6b41faaea6',
];

export const CATEGORIES: Category[] = [
  {
    slug: 'office',
    name: 'Office Chairs',
    short: 'Office',
    tagline: 'Engineered for long days',
    description:
      'Ergonomic desk chairs, mesh backs and executive seating — illustrative concepts for modern Delhi workspaces.',
    image: u('1592078615290-033ee584e267', 1400),
  },
  {
    slug: 'visitor',
    name: 'Visitor Chairs',
    short: 'Visitor',
    tagline: 'First impressions, seated',
    description:
      'Meeting-room and reception chairs with quiet profiles and stackable practicality.',
    image: u('1519947486511-46149fa0a254', 1400),
  },
  {
    slug: 'gaming',
    name: 'Gaming Chairs',
    short: 'Gaming',
    tagline: 'Built for the long session',
    description:
      'High-back bucket seats, 4D arms and deep recline — concepts for play and streaming setups.',
    image: u('1541558869434-2840d308329a', 1400),
  },
  {
    slug: 'school',
    name: 'School Chairs',
    short: 'School',
    tagline: 'Learn in comfort',
    description:
      'Classroom and study chairs sized for focus — sturdy, light and easy to maintain.',
    image: u('1509062522246-3755977927d7', 1400),
  },
  {
    slug: 'plastic',
    name: 'Plastic Chairs',
    short: 'Plastic',
    tagline: 'Everyday utility',
    description:
      'Lightweight, stackable, monsoon-friendly seating for homes, events and shops.',
    image: u('1581539250439-c96689b516dd', 1400),
  },
  {
    slug: 'other',
    name: 'Other Seating',
    short: 'Other',
    tagline: 'Lounge, wait, unwind',
    description: 'Lounge chairs, stools, benches and accent seating for in-between spaces.',
    image: u('1567538096630-e0c55bd6374c', 1400),
  },
];

export const CATEGORY_MAP: Record<CategorySlug, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<CategorySlug, Category>;

interface Def {
  name: string;
  sku: string;
  price: number;
  mrp?: number;
  desc: string;
  specs: Record<string, string>;
  colors?: ProductColor[];
  avail: Availability;
  featured?: boolean;
}

const BLACK = { name: 'Ink Black', hex: '#1c1a17' };
const GRAPHITE = { name: 'Graphite', hex: '#4a4a4a' };
const OAT = { name: 'Oat', hex: '#d9cdb8' };
const TAN = { name: 'Saddle Tan', hex: '#a9713f' };
const OLIVE = { name: 'Deep Olive', hex: '#4a5240' };
const OXBLOOD = { name: 'Oxblood', hex: '#86281c' };
const NAVY = { name: 'Midnight', hex: '#232c3d' };
const GREY = { name: 'Stone Grey', hex: '#9a938a' };
const WHITE = { name: 'Mineral White', hex: '#f2ede3' };
const RED = { name: 'Crimson', hex: '#a41f26' };
const BLUE = { name: 'Classroom Blue', hex: '#2f5d8a' };
const GREEN = { name: 'Leaf Green', hex: '#3e6b4f' };

function build(
  category: CategorySlug,
  pool: string[],
  defs: Def[],
  altBase: string,
): Product[] {
  return defs.map((d, i) => {
    const a = pool[i % pool.length];
    const b = pool[(i + 2) % pool.length];
    const c = DETAIL[(i + defs.length) % DETAIL.length];
    const slug =
      d.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + `-${d.sku.toLowerCase()}`;
    return {
      id: `${category}-${d.sku.toLowerCase()}`,
      name: d.name,
      slug,
      sku: d.sku,
      category,
      description: d.desc,
      price: d.price,
      mrp: d.mrp,
      images: [
        img(a, `${altBase} — ${d.name}, front view`),
        img(b, `${altBase} — ${d.name}, alternate angle`),
        img(c, `${altBase} — ${d.name}, styled interior detail`),
      ],
      specs: d.specs,
      colors: d.colors,
      availability: d.avail,
      featured: d.featured,
    };
  });
}

// ---------------------------------------------------------------- OFFICE (24)
const officeDefs: Def[] = [
  { name: 'Meridian Ergo Mesh Chair', sku: 'NC-OF-101', price: 18999, mrp: 22999, desc: 'Breathable mesh back with synchro-tilt, 3D arms and deep-seat slider. A daily workhorse for 8+ hour desks.', specs: { 'Back': 'Breathable mesh, adjustable lumbar', 'Mechanism': 'Synchro-tilt, 3-position lock', 'Arms': '3D adjustable PU arms', 'Base': 'Glass-filled nylon, 60mm castors', 'Seat height': '450–550 mm', 'Max load': '120 kg' }, colors: [BLACK, GRAPHITE], avail: 'in-stock', featured: true },
  { name: 'Aarav High-Back Executive', sku: 'NC-OF-102', price: 27499, mrp: 31999, desc: 'Tall cushioned back, waterfall seat and brushed-aluminium base. Boardroom presence without stiffness.', specs: { 'Upholstery': 'Premium leatherette, high-resilience foam', 'Mechanism': 'Knee-tilt with tension control', 'Base': 'Polished aluminium', 'Seat height': '470–560 mm', 'Max load': '130 kg' }, colors: [BLACK, TAN], avail: 'in-stock', featured: true },
  { name: 'Kavya Mid-Back Task Chair', sku: 'NC-OF-103', price: 12499, desc: 'Compact mid-back for home offices and study desks. Lumbar curve, flip-up arms, easy assembly.', specs: { 'Back': 'Contoured nylon + mesh', 'Arms': 'Flip-up', 'Base': 'Nylon, 50mm castors', 'Seat height': '440–540 mm', 'Max load': '110 kg' }, colors: [BLACK, GREY], avail: 'in-stock' },
  { name: 'Zenith Drafting Stool Chair', sku: 'NC-OF-104', price: 14999, desc: 'Extended-height task chair with footring for counters, studios and lab benches.', specs: { 'Seat height': '560–760 mm', 'Footring': 'Height-adjustable chrome', 'Back': 'Mesh with lumbar pad', 'Max load': '110 kg' }, colors: [BLACK], avail: 'in-stock' },
  { name: 'Onyx Leatherette Director', sku: 'NC-OF-105', price: 21999, mrp: 25999, desc: 'Padded arm director with stitched panels and a heavy-duty tilt core.', specs: { 'Upholstery': 'Stitched leatherette', 'Mechanism': 'Centre-tilt, locking', 'Base': 'Nylon spider', 'Max load': '120 kg' }, colors: [BLACK, TAN], avail: 'low-stock' },
  { name: 'Airweave Full-Mesh Pro', sku: 'NC-OF-106', price: 23999, desc: 'Full-mesh seat and back for Delhi summers. Dynamic lumbar follows your spine as you move.', specs: { 'Frame': 'Glass-reinforced nylon', 'Mesh': 'Korean elastomer, 120k abrasion', 'Mechanism': 'Multi-lock synchro', 'Max load': '125 kg' }, colors: [GRAPHITE, BLACK], avail: 'in-stock', featured: true },
  { name: 'Saanjh Fabric Comfort Chair', sku: 'NC-OF-107', price: 13999, desc: 'Soft woven fabric over moulded foam — warm to sit on, quiet to move.', specs: { 'Upholstery': 'Woven polyester fabric', 'Arms': 'Fixed loop arms', 'Base': 'Nylon', 'Max load': '110 kg' }, colors: [GREY, OAT, OLIVE], avail: 'in-stock' },
  { name: 'Regal Chester Executive', sku: 'NC-OF-108', price: 32999, mrp: 38999, desc: 'Buttoned-back executive chair with mahogany-finish arms. For chambers and senior cabins.', specs: { 'Upholstery': 'Top-grain-look leatherette', 'Arms': 'Wood-finish with pads', 'Mechanism': 'Knee-tilt', 'Max load': '130 kg' }, colors: [BLACK, TAN], avail: 'made-to-order' },
  { name: 'Nimbus Compact Work Chair', sku: 'NC-OF-109', price: 9499, desc: 'Small-footprint task chair that tucks fully under desks. Ideal for apartments.', specs: { 'Back': 'Low-profile mesh', 'Arms': 'Armless (optional add-on)', 'Base': 'Nylon', 'Max load': '100 kg' }, colors: [BLACK, GREY, WHITE], avail: 'in-stock' },
  { name: 'Atlas Heavy-Duty 150', sku: 'NC-OF-110', price: 26999, desc: 'Reinforced frame rated to 150 kg with a wider seat pan and steel core.', specs: { 'Frame': 'Steel-reinforced', 'Seat width': '540 mm', 'Mechanism': 'Heavy-duty synchro', 'Max load': '150 kg' }, colors: [BLACK], avail: 'in-stock' },
  { name: 'Loom Knit Task Chair', sku: 'NC-OF-111', price: 16999, desc: 'Knitted-back task chair with flex zones — supportive with a soft first touch.', specs: { 'Back': '3D-knit elastomer', 'Arms': '2D adjustable', 'Base': 'Nylon', 'Max load': '115 kg' }, colors: [GREY, OLIVE, BLACK], avail: 'in-stock' },
  { name: 'Pinnacle Leather Executive', sku: 'NC-OF-112', price: 41999, mrp: 47999, desc: 'Flagship high-back in pebbled leatherette with aluminium spine and headrest.', specs: { 'Upholstery': 'Pebbled leatherette', 'Headrest': '2D adjustable', 'Base': 'Aluminium', 'Max load': '130 kg' }, colors: [BLACK, TAN], avail: 'made-to-order', featured: true },
  { name: 'Drift Lounge-Work Hybrid', sku: 'NC-OF-113', price: 19999, desc: 'Recline-friendly hybrid between a task chair and a lounge chair for reading corners.', specs: { 'Recline': '135°, lockable', 'Upholstery': 'Fabric + mesh combo', 'Base': '4-star aluminium (glides)', 'Max load': '120 kg' }, colors: [OAT, OLIVE], avail: 'low-stock' },
  { name: 'Verge Conference Pushback', sku: 'NC-OF-114', price: 11499, desc: 'Sled-base meeting chair with a gentle flex back. Stacks four high.', specs: { 'Frame': 'Powder-coated steel sled', 'Stacking': 'Up to 4', 'Upholstery': 'Fabric over foam', 'Max load': '110 kg' }, colors: [BLACK, GREY, NAVY], avail: 'in-stock' },
  { name: 'Halcyon White Studio Chair', sku: 'NC-OF-115', price: 15999, desc: 'Light-frame studio chair in mineral white — loved by architects and editors.', specs: { 'Frame': 'White nylon + grey mesh', 'Arms': 'Fixed', 'Base': 'White nylon', 'Max load': '110 kg' }, colors: [WHITE, GREY], avail: 'in-stock' },
  { name: 'Oxblood Accent Task Chair', sku: 'NC-OF-116', price: 17499, desc: 'Signature oxblood back on an ink frame. Same ergo core as Meridian.', specs: { 'Back': 'Mesh, oxblood finish', 'Mechanism': 'Synchro-tilt', 'Max load': '120 kg' }, colors: [OXBLOOD, BLACK], avail: 'low-stock', featured: true },
  { name: 'Sprint 24-Hour Duty Chair', sku: 'NC-OF-117', price: 28999, desc: 'Built for control rooms and shared shifts — extra-thick seat foam, steel mechanism.', specs: { 'Foam': '75mm HR foam', 'Mechanism': 'Steel synchro, 24-hr rated', 'Max load': '130 kg' }, colors: [BLACK], avail: 'in-stock' },
  { name: 'Fable Wood-Leg Work Chair', sku: 'NC-OF-118', price: 11999, desc: 'Upholstered shell on solid-look wood legs for boutique studios and home offices.', specs: { 'Shell': 'Fabric over moulded ply', 'Legs': 'Rubberwood finish', 'Assembly': '4 bolts, 10 min', 'Max load': '110 kg' }, colors: [OAT, OLIVE, GREY], avail: 'in-stock' },
  { name: 'Torque Big & Tall XL', sku: 'NC-OF-119', price: 24999, desc: 'XL seat (560 mm) and reinforced tilt for taller frames.', specs: { 'Seat width': '560 mm', 'Back height': '720 mm', 'Max load': '150 kg' }, colors: [BLACK, GRAPHITE], avail: 'in-stock' },
  { name: 'Mira Training-Room Flip', sku: 'NC-OF-120', price: 9999, desc: 'Flip-seat nesting chair with tablet arm option for training halls.', specs: { 'Nesting': 'Yes, horizontal stack', 'Tablet': 'Optional fold-away', 'Max load': '110 kg' }, colors: [BLACK, GREY, BLUE], avail: 'in-stock' },
  { name: 'Solace Ortho Lumbar Chair', sku: 'NC-OF-121', price: 20999, desc: 'Dual-zone lumbar with seat-tilt memory — a back-friendly concept for long sitters.', specs: { 'Lumbar': 'Dual-zone adjustable', 'Seat': 'Waterfall HR foam', 'Max load': '120 kg' }, colors: [BLACK, GRAPHITE], avail: 'low-stock' },
  { name: 'Cadence Hot-Desking Chair', sku: 'NC-OF-122', price: 10999, desc: 'Feather-touch adjustments for shared desks — one lever does height + lock.', specs: { 'Controls': 'Single-lever', 'Weight': '13.5 kg', 'Max load': '110 kg' }, colors: [BLACK, GREY], avail: 'in-stock' },
  { name: 'Monarch Visitor-Executive Duo', sku: 'NC-OF-123', price: 17999, desc: 'Cantilever visitor chair matched to the Monarch executive line.', specs: { 'Frame': 'Chrome cantilever', 'Upholstery': 'Leatherette', 'Max load': '115 kg' }, colors: [BLACK, TAN], avail: 'made-to-order' },
  { name: 'Aero Slim Home-Office', sku: 'NC-OF-124', price: 13499, desc: 'Slim-profile home-office chair with breathable back and quiet castors.', specs: { 'Back': 'Slim mesh', 'Castors': 'Quiet PU, floor-safe', 'Max load': '110 kg' }, colors: [GREY, BLACK, WHITE], avail: 'in-stock' },
];

// ---------------------------------------------------------------- VISITOR (16)
const visitorDefs: Def[] = [
  { name: 'Greet Sled Visitor Chair', sku: 'NC-VS-201', price: 5499, desc: 'Cantilever-flex visitor chair with a wipe-clean seat. For cabins and clinics.', specs: { 'Frame': 'Steel sled, chrome', 'Seat': 'Moulded ply + fabric', 'Stacking': 'Up to 6', 'Max load': '110 kg' }, colors: [BLACK, GREY, NAVY], avail: 'in-stock', featured: true },
  { name: 'Salon Reception Armchair', sku: 'NC-VS-202', price: 8999, desc: 'Low, welcoming reception chair with wide arms and soft foam.', specs: { 'Upholstery': 'Fabric over HR foam', 'Legs': 'Steel, wood-finish option', 'Max load': '115 kg' }, colors: [OAT, OLIVE, GREY], avail: 'in-stock' },
  { name: 'Queue Beam 3-Seater', sku: 'NC-VS-203', price: 18999, desc: 'Three-seat beam bench for waiting areas with shared steel spine.', specs: { 'Seats': '3 × perforated steel / PU option', 'Frame': 'Steel beam + disc feet', 'Max load': '330 kg total' }, colors: [GRAPHITE, BLUE], avail: 'in-stock' },
  { name: 'Clasp Stackable Shell', sku: 'NC-VS-204', price: 3999, desc: 'One-piece shell that stacks ten high — training rooms love it.', specs: { 'Shell': 'Polypropylene + glass fibre', 'Stacking': 'Up to 10', 'Max load': '120 kg' }, colors: [WHITE, GREY, BLACK, BLUE], avail: 'in-stock' },
  { name: 'Embrace Padded Visitor', sku: 'NC-VS-205', price: 7499, desc: 'Fully padded visitor chair with sled base and lumbar pillow-top.', specs: { 'Upholstery': 'Leatherette over foam', 'Base': 'Chrome sled', 'Max load': '115 kg' }, colors: [BLACK, TAN], avail: 'low-stock' },
  { name: 'Atrium Lobby Lounge Pair', sku: 'NC-VS-206', price: 24999, desc: 'Twin low lounge chairs joined by a side table for lobbies.', specs: { 'Configuration': '2 seats + table', 'Upholstery': 'Fabric', 'Max load': '110 kg / seat' }, colors: [OAT, OLIVE], avail: 'made-to-order' },
  { name: 'Foldaway Guest Chair', sku: 'NC-VS-207', price: 4999, desc: 'Folding guest chair with padded seat that hangs flat on wall hooks.', specs: { 'Folded depth': '150 mm', 'Frame': 'Powder-coated steel', 'Max load': '110 kg' }, colors: [BLACK, GREY], avail: 'in-stock' },
  { name: 'Crest Wood-Frame Visitor', sku: 'NC-VS-208', price: 8499, desc: 'Solid-look wood frame with cane-texture back — warm for studios and clinics.', specs: { 'Frame': 'Rubberwood finish', 'Back': 'Cane-texture panel', 'Max load': '110 kg' }, colors: [TAN, OAT], avail: 'in-stock', featured: true },
  { name: 'Metro Mesh Back Visitor', sku: 'NC-VS-209', price: 6499, desc: 'Breathable mesh-back visitor on four legs with linking glides.', specs: { 'Back': 'Mesh', 'Linking': 'Gang-link included', 'Max load': '110 kg' }, colors: [BLACK, GREY], avail: 'in-stock' },
  { name: 'Duo Conversation Settee', sku: 'NC-VS-210', price: 15999, desc: 'Two-seat settee for reception corners and boutique retail.', specs: { 'Seats': '2, shared frame', 'Upholstery': 'Bouclé-look fabric', 'Max load': '220 kg total' }, colors: [OAT, GREY], avail: 'made-to-order' },
  { name: 'Perch Counter Visitor Stool', sku: 'NC-VS-211', price: 6999, desc: 'Counter-height visitor stool with backrest and footrail.', specs: { 'Height': '750 mm seat', 'Frame': 'Steel', 'Max load': '110 kg' }, colors: [BLACK, WHITE], avail: 'in-stock' },
  { name: 'Halo Transparent Accent', sku: 'NC-VS-212', price: 7999, desc: 'Clear-look polycarbonate accent for salons and galleries.', specs: { 'Shell': 'Polycarbonate', 'Legs': 'Matching clear', 'Max load': '100 kg' }, colors: [WHITE], avail: 'low-stock' },
  { name: 'Summit Boardroom Side Chair', sku: 'NC-VS-213', price: 9499, desc: 'Upholstered boardroom side chair with waterfall seat and chrome cantilever.', specs: { 'Frame': 'Chrome cantilever', 'Upholstery': 'Leatherette', 'Max load': '115 kg' }, colors: [BLACK, TAN], avail: 'in-stock' },
  { name: 'Nook Corner Waiting Bench', sku: 'NC-VS-214', price: 12999, desc: 'Curved two-person bench that softens corridors and corners.', specs: { 'Seats': '2', 'Frame': 'Steel + ply', 'Max load': '220 kg total' }, colors: [OLIVE, OAT], avail: 'made-to-order' },
  { name: 'Stride Stacking Armchair', sku: 'NC-VS-215', price: 5999, desc: 'Stackable armchair for seminars — arms, comfort and a small footprint.', specs: { 'Stacking': 'Up to 5', 'Frame': 'Steel', 'Max load': '110 kg' }, colors: [BLACK, GREY, BLUE], avail: 'in-stock' },
  { name: 'Ivy Outdoor-In Visitor', sku: 'NC-VS-216', price: 4499, desc: 'Weather-tolerant visitor chair for verandas and semi-open lounges.', specs: { 'Material': 'UV-stabilised polypropylene', 'Drainage': 'Seat slots', 'Max load': '120 kg' }, colors: [WHITE, OLIVE, GREY], avail: 'in-stock' },
];

// ---------------------------------------------------------------- GAMING (14)
const gamingDefs: Def[] = [
  { name: 'Respawn Racing Bucket Seat', sku: 'NC-GM-301', price: 17999, mrp: 21999, desc: 'Signature bucket-seat gamer with 165° recline, neck + lumbar pillows.', specs: { 'Recline': '90–165°', 'Arms': '2D adjustable', 'Base': 'Nylon + 60mm castors', 'Max load': '130 kg' }, colors: [BLACK, RED], avail: 'in-stock', featured: true },
  { name: 'Overdrive Pro 4D Chair', sku: 'NC-GM-302', price: 24999, mrp: 29999, desc: 'Flagship 4D arms, magnetic headrest and cold-cure foam that holds shape.', specs: { 'Arms': '4D', 'Foam': 'Cold-cure 60 density', 'Tilt': 'Multi-lock + rock', 'Max load': '140 kg' }, colors: [BLACK, OXBLOOD], avail: 'in-stock', featured: true },
  { name: 'Pixel Compact Gamer', sku: 'NC-GM-303', price: 13999, desc: 'Smaller bucket for teens and compact rooms — full recline, lighter frame.', specs: { 'Recline': '90–150°', 'Seat width': '500 mm', 'Max load': '110 kg' }, colors: [BLACK, BLUE], avail: 'in-stock' },
  { name: 'Stealth All-Black Ops', sku: 'NC-GM-304', price: 19999, desc: 'Murdered-out all-black with carbon-texture panels and silent castors.', specs: { 'Upholstery': 'Carbon-texture leatherette', 'Castors': 'Silent PU', 'Max load': '130 kg' }, colors: [BLACK], avail: 'low-stock' },
  { name: 'Crit-Heal Fabric Gamer', sku: 'NC-GM-305', price: 21999, desc: 'Breathable fabric gamer for long summer sessions — no stick, all support.', specs: { 'Upholstery': 'Woven fabric', 'Recline': '165°', 'Max load': '130 kg' }, colors: [GRAPHITE, OLIVE], avail: 'in-stock' },
  { name: 'Boss Streamer XL Throne', sku: 'NC-GM-306', price: 28999, desc: 'Extra-wide throne for streamers — XL seat, footrest and RGB-ready piping.', specs: { 'Seat width': '580 mm', 'Footrest': 'Retractable', 'Max load': '150 kg' }, colors: [BLACK, RED], avail: 'made-to-order' },
  { name: 'Noob Entry Racer', sku: 'NC-GM-307', price: 11999, desc: 'Honest entry racer: bucket comfort, fixed arms, honest price.', specs: { 'Recline': '135°', 'Arms': 'Fixed loop', 'Max load': '120 kg' }, colors: [BLACK, BLUE], avail: 'in-stock' },
  { name: 'Vandal White-Out Gamer', sku: 'NC-GM-308', price: 22999, desc: 'Mineral-white shell with oxblood stitching — built for bright setups.', specs: { 'Upholstery': 'White leatherette + oxblood stitch', 'Arms': '2D', 'Max load': '125 kg' }, colors: [WHITE, OXBLOOD], avail: 'low-stock' },
  { name: 'Tank Rocking Recliner Seat', sku: 'NC-GM-309', price: 26999, desc: 'Rocker-base gaming recliner for console corners — no wheels, all chill.', specs: { 'Base': 'Rocker + swivel', 'Recline': '150°', 'Max load': '130 kg' }, colors: [BLACK, GRAPHITE], avail: 'made-to-order' },
  { name: 'Duo Stream Deck Chair', sku: 'NC-GM-310', price: 15999, desc: 'Mid-size streamer with flip-back arms for guitar + controller freedom.', specs: { 'Arms': 'Flip-back', 'Recline': '150°', 'Max load': '120 kg' }, colors: [BLACK, GREY], avail: 'in-stock' },
  { name: 'Siege Ergonomic Pro Gamer', sku: 'NC-GM-311', price: 25999, desc: 'Ergo-first gamer: mesh back + bucket wings for posture-conscious players.', specs: { 'Back': 'Mesh + wings', 'Lumbar': 'Dynamic', 'Max load': '130 kg' }, colors: [BLACK], avail: 'in-stock' },
  { name: 'Pocket Junior Gamer', sku: 'NC-GM-312', price: 9999, desc: 'Junior-size bucket for young players — same look, safer scale.', specs: { 'Seat height': '380–460 mm', 'Max load': '80 kg' }, colors: [BLUE, RED, BLACK], avail: 'in-stock' },
  { name: 'Overtime Office-Gamer Cross', sku: 'NC-GM-313', price: 18999, desc: 'Boardroom by day, battlestation by night — subtle shell, gamer core.', specs: { 'Recline': '150°', 'Upholstery': 'Charcoal fabric', 'Max load': '125 kg' }, colors: [GRAPHITE, BLACK], avail: 'in-stock' },
  { name: 'Apex Tournament Edition', sku: 'NC-GM-314', price: 31999, desc: 'Tournament-spec build: aluminium base, memory-foam seat, numbered badge.', specs: { 'Base': 'Aluminium', 'Foam': 'Memory + HR stack', 'Max load': '140 kg' }, colors: [BLACK, OXBLOOD], avail: 'low-stock', featured: true },
];

// ---------------------------------------------------------------- SCHOOL (16)
const schoolDefs: Def[] = [
  { name: 'Pathshala Classroom Shell', sku: 'NC-SC-401', price: 2499, desc: 'One-piece classroom shell with book-box stance. Wipes clean in seconds.', specs: { 'Shell': 'Polypropylene', 'Frame': 'Steel sled', 'Sizes': '3 heights available', 'Max load': '90 kg' }, colors: [BLUE, GREEN, GREY], avail: 'in-stock', featured: true },
  { name: 'Adhyayan Study Chair', sku: 'NC-SC-402', price: 4999, desc: 'Padded study chair with posture curve for home desks and tuitions.', specs: { 'Seat': 'Padded ply', 'Back': 'Curved veneer', 'Max load': '100 kg' }, colors: [TAN, GREY, BLUE], avail: 'in-stock' },
  { name: 'Junior Ergo Scholar', sku: 'NC-SC-403', price: 6499, desc: 'Height-adjustable scholar chair that grows from Class 3 to Class 10.', specs: { 'Seat height': '350–480 mm', 'Adjustment': 'Gas-lift + footring', 'Max load': '90 kg' }, colors: [BLUE, GREEN], avail: 'in-stock' },
  { name: 'Library Stack Chair', sku: 'NC-SC-404', price: 3299, desc: 'Light library chair, stacks 8 high for halls and reading rooms.', specs: { 'Stacking': 'Up to 8', 'Frame': 'Steel', 'Max load': '110 kg' }, colors: [GREY, BLUE, WHITE], avail: 'in-stock' },
  { name: 'Lab Stool with Backrest', sku: 'NC-SC-405', price: 4499, desc: 'Lab-height stool with backrest and footring for practical rooms.', specs: { 'Height': '600–800 mm', 'Footring': 'Chrome, adjustable', 'Max load': '100 kg' }, colors: [BLACK, BLUE], avail: 'in-stock' },
  { name: 'Kinder Tiny Chair', sku: 'NC-SC-406', price: 1999, desc: 'Rounded-edge tiny chair for kindergarten — no sharp corners.', specs: { 'Seat height': '260 mm', 'Edges': 'Fully radiused', 'Max load': '50 kg' }, colors: [RED, BLUE, GREEN], avail: 'in-stock' },
  { name: 'Exam Hall Tablet Chair', sku: 'NC-SC-407', price: 5999, desc: 'Tablet-arm exam chair with under-seat book rack.', specs: { 'Tablet': 'Fold-away MDF', 'Rack': 'Wire book basket', 'Max load': '110 kg' }, colors: [GREY, BLUE], avail: 'low-stock' },
  { name: 'Dorm Bunk Study Seat', sku: 'NC-SC-408', price: 3999, desc: 'Slim dorm chair that hooks onto bunks and desks.', specs: { 'Width': '420 mm', 'Hook': 'Bunk-compatible', 'Max load': '100 kg' }, colors: [GREY, BLACK], avail: 'in-stock' },
  { name: 'Art Room Draft Stool', sku: 'NC-SC-409', price: 5499, desc: 'Swivel art stool with adjustable height for studios and art rooms.', specs: { 'Height': '500–700 mm', 'Seat': 'Round beech-look', 'Max load': '100 kg' }, colors: [TAN, BLACK], avail: 'in-stock' },
  { name: 'Auditorium Tip-Up Seat', sku: 'NC-SC-410', price: 7999, desc: 'Tip-up auditorium seat with quiet return for halls and AV rooms.', specs: { 'Mechanism': 'Gravity tip-up, silent', 'Upholstery': 'Fabric', 'Max load': '120 kg' }, colors: [RED, BLUE, GRAPHITE], avail: 'made-to-order' },
  { name: 'Teacher Revolving Chair', sku: 'NC-SC-411', price: 7499, desc: 'Mid-back revolving chair with a teacher-friendly upright lock.', specs: { 'Back': 'Mid, mesh + fabric', 'Lock': 'Upright tilt lock', 'Max load': '110 kg' }, colors: [BLACK, BLUE], avail: 'in-stock' },
  { name: 'Buddy Double Desk Chair', sku: 'NC-SC-412', price: 8999, desc: 'Two-seat attached bench for paired learning and coaching rows.', specs: { 'Seats': '2 attached', 'Frame': 'Shared steel', 'Max load': '180 kg total' }, colors: [BLUE, GREY], avail: 'made-to-order' },
  { name: 'Focus Wobble Stool', sku: 'NC-SC-413', price: 3499, desc: 'Gentle wobble stool that channels fidgets into focus.', specs: { 'Base': 'Convex wobble', 'Height': '450 mm', 'Max load': '90 kg' }, colors: [GREEN, BLUE, GREY], avail: 'low-stock' },
  { name: 'Senior Desk-Exam Combo', sku: 'NC-SC-414', price: 6999, desc: 'Attached desk + chair combo for senior classrooms and test centres.', specs: { 'Desk': 'Attached flip-top', 'Frame': 'Heavy steel', 'Max load': '110 kg' }, colors: [GREY], avail: 'made-to-order' },
  { name: 'Canteen Bench-Chair Set', sku: 'NC-SC-415', price: 10999, desc: 'Linked canteen table-bench seating for 6 — easy to mop under.', specs: { 'Seats': '6 (linked set)', 'Top': 'Laminated', 'Frame': 'Steel' }, colors: [BLUE, GREY], avail: 'made-to-order' },
  { name: 'Scholar Plus Cushion Chair', sku: 'NC-SC-416', price: 5499, desc: 'Cushioned scholar chair with backvents for long tuition evenings.', specs: { 'Seat': 'Ventilated cushion', 'Back': 'Vented shell', 'Max load': '100 kg' }, colors: [BLUE, GREY, GREEN], avail: 'in-stock' },
];

// ---------------------------------------------------------------- PLASTIC (16)
const plasticDefs: Def[] = [
  { name: 'Ghar Everyday Plastic Chair', sku: 'NC-PL-501', price: 899, mrp: 1199, desc: 'The everyday hero — light, stackable, monsoon-proof. Set of one, buy in multiples.', specs: { 'Material': 'Virgin polypropylene', 'Stacking': 'Up to 12', 'Max load': '120 kg' }, colors: [WHITE, BLUE, GREEN, RED], avail: 'in-stock', featured: true },
  { name: 'Milano Mid-Back Plastic', sku: 'NC-PL-502', price: 1499, desc: 'Mid-back with armrests and a breathable slatted back.', specs: { 'Back': 'Slatted, ventilated', 'Arms': 'Integrated', 'Max load': '130 kg' }, colors: [WHITE, GREY, BLUE], avail: 'in-stock' },
  { name: 'Dawat Event Chair (Set of 4)', sku: 'NC-PL-503', price: 4999, desc: 'Event-ready set of four with linking clips for functions and pandals.', specs: { 'Set': '4 chairs + linking clips', 'Stacking': 'Up to 15', 'Max load': '130 kg each' }, colors: [WHITE, BLUE], avail: 'in-stock' },
  { name: 'Aangan Low Lounge Plastic', sku: 'NC-PL-504', price: 1899, desc: 'Low, loungey plastic armchair for verandas and gardens.', specs: { 'Seat height': '360 mm', 'UV': 'Stabilised', 'Max load': '130 kg' }, colors: [WHITE, OLIVE, GREY], avail: 'in-stock' },
  { name: 'Bhoj Dining-Height Plastic', sku: 'NC-PL-505', price: 1299, desc: 'Dining-height with a wipe-clean seat for kitchens and dhabas.', specs: { 'Seat height': '450 mm', 'Finish': 'Matte, wipe-clean', 'Max load': '130 kg' }, colors: [WHITE, RED, BLUE], avail: 'in-stock' },
  { name: 'Stackline Cafe Chair', sku: 'NC-PL-506', price: 1699, desc: 'Cafe-profile plastic chair with wood-look legs option.', specs: { 'Legs': 'Plastic / wood-look', 'Stacking': 'Up to 8', 'Max load': '120 kg' }, colors: [WHITE, GREY, TAN], avail: 'low-stock' },
  { name: 'Tent House Supreme (Set of 10)', sku: 'NC-PL-507', price: 11499, desc: 'Bulk set of ten for tent houses and banquet vendors.', specs: { 'Set': '10 chairs', 'Stacking': 'Up to 20', 'Max load': '130 kg each' }, colors: [WHITE, BLUE], avail: 'in-stock' },
  { name: 'Chai Stall Stool-Chair', sku: 'NC-PL-508', price: 749, desc: 'Compact armless chair that doubles as a side table. Stall-tough.', specs: { 'Width': '400 mm', 'Weight': '2.8 kg', 'Max load': '120 kg' }, colors: [RED, BLUE, GREEN], avail: 'in-stock' },
  { name: 'Relaxo Recliner Plastic', sku: 'NC-PL-509', price: 2499, desc: 'Recline-back plastic lounger with extendable leg rest.', specs: { 'Recline': '3 positions', 'Leg rest': 'Extendable', 'Max load': '130 kg' }, colors: [WHITE, BLUE, GREEN], avail: 'low-stock' },
  { name: 'Kids Pop Chair', sku: 'NC-PL-510', price: 649, desc: 'Cheerful pop colours, rounded edges, feather-light for kids.', specs: { 'Seat height': '300 mm', 'Weight': '1.9 kg', 'Max load': '60 kg' }, colors: [RED, BLUE, GREEN], avail: 'in-stock' },
  { name: 'Office Visitor Plastic Plus', sku: 'NC-PL-511', price: 1999, desc: 'Padded-seat plastic visitor for shops and small offices.', specs: { 'Seat': 'Cushion add-on', 'Frame': 'Steel legs + PP shell', 'Max load': '120 kg' }, colors: [BLACK, GREY, BLUE], avail: 'in-stock' },
  { name: 'Monsoon All-Weather Chair', sku: 'NC-PL-512', price: 1799, desc: 'Drainage-slot seat and rust-proof build for balconies.', specs: { 'Drainage': 'Seat + back slots', 'Hardware': 'Rust-proof', 'Max load': '130 kg' }, colors: [OLIVE, GREY, WHITE], avail: 'in-stock' },
  { name: 'Satsang Hall Chair', sku: 'NC-PL-513', price: 1099, desc: 'Armless hall chair with carry-handle back for quick layouts.', specs: { 'Handle': 'Integrated carry slot', 'Stacking': 'Up to 15', 'Max load': '130 kg' }, colors: [WHITE, BLUE], avail: 'in-stock' },
  { name: 'Plaza Outdoor Armchair', sku: 'NC-PL-514', price: 2299, desc: 'Wide-arm outdoor chair with a sturdy cross-brace.', specs: { 'Brace': 'Cross, anti-wobble', 'UV': 'Stabilised', 'Max load': '140 kg' }, colors: [WHITE, GREY, OLIVE], avail: 'low-stock' },
  { name: 'Study Plastic-Plus Chair', sku: 'NC-PL-515', price: 1599, desc: 'Study-tough plastic with a book-slot back and anti-slip feet.', specs: { 'Back': 'Book slot', 'Feet': 'Anti-slip', 'Max load': '110 kg' }, colors: [BLUE, GREY, GREEN], avail: 'in-stock' },
  { name: 'Heritage Cane-Look Plastic', sku: 'NC-PL-516', price: 2799, desc: 'Cane-texture premium plastic — heritage look, zero maintenance.', specs: { 'Texture': 'Cane-look mould', 'Finish': 'Matte premium', 'Max load': '130 kg' }, colors: [TAN, WHITE], avail: 'made-to-order', featured: true },
];

// ---------------------------------------------------------------- OTHER (14)
const otherDefs: Def[] = [
  { name: 'Wali Lounge Accent Chair', sku: 'NC-OT-601', price: 14999, desc: 'Sculptural lounge chair with bouclé-look upholstery. The living-room anchor.', specs: { 'Upholstery': 'Bouclé-look fabric', 'Legs': 'Solid-look wood', 'Max load': '120 kg' }, colors: [OAT, OLIVE], avail: 'in-stock', featured: true },
  { name: 'Eames-Style Lounge + Ottoman', sku: 'NC-OT-602', price: 32999, mrp: 38999, desc: 'Moulded-ply lounge + ottoman concept in the classic mould — reading-corner royalty.', specs: { 'Set': 'Chair + ottoman', 'Shell': 'Moulded ply, leatherette', 'Swivel': '360° aluminium base' }, colors: [BLACK, TAN], avail: 'made-to-order' },
  { name: 'Trio Waiting Bench', sku: 'NC-OT-603', price: 16999, desc: 'Three-pad beam bench for clinics and showrooms.', specs: { 'Pads': '3 PU pads', 'Beam': 'Steel', 'Max load': '300 kg total' }, colors: [BLACK, GREY], avail: 'in-stock' },
  { name: 'Mudha Cane Lounge Chair', sku: 'NC-OT-604', price: 11999, desc: 'Handwoven-look cane lounge that breathes through summer.', specs: { 'Weave': 'Cane-look PE', 'Frame': 'Steel-core', 'Max load': '120 kg' }, colors: [TAN], avail: 'low-stock' },
  { name: 'Perch Bar Stool (Set of 2)', sku: 'NC-OT-605', price: 8999, desc: 'Counter-height stools with footrails — pair for islands and cafes.', specs: { 'Set': '2 stools', 'Height': '750 mm', 'Max load': '110 kg each' }, colors: [BLACK, TAN, WHITE], avail: 'in-stock' },
  { name: 'Rock Steady Rocker', sku: 'NC-OT-606', price: 13999, desc: 'Gentle-glide rocker with high back for nurseries and verandas.', specs: { 'Glide': 'Silent rocker rails', 'Cushion': 'Washable covers', 'Max load': '120 kg' }, colors: [OAT, GREY], avail: 'made-to-order' },
  { name: 'Diwan Bench with Back', sku: 'NC-OT-607', price: 18999, desc: 'Upholstered diwan bench with backrest for entryways and foot-of-bed.', specs: { 'Length': '1400 mm', 'Storage': 'Optional box base', 'Max load': '250 kg total' }, colors: [OLIVE, OAT, GREY], avail: 'made-to-order' },
  { name: 'Fold Flat Lounge Deck Chair', sku: 'NC-OT-608', price: 5999, desc: 'Fold-flat deck lounger for terraces and farmhouses.', specs: { 'Fold': 'Flat, carry strap', 'Fabric': 'Weather-tough sling', 'Max load': '120 kg' }, colors: [OAT, OLIVE, WHITE], avail: 'in-stock' },
  { name: 'Sofa-One Compact Loveseat', sku: 'NC-OT-609', price: 21999, desc: 'Compact two-seat loveseat for studio apartments and waiting nooks.', specs: { 'Seats': '2', 'Upholstery': 'Fabric', 'Max load': '220 kg total' }, colors: [GREY, OLIVE, OAT], avail: 'low-stock' },
  { name: 'Ottoman Pouf Duo', sku: 'NC-OT-610', price: 4999, desc: 'Twin pouf ottomans — footrest, extra seat, side table in one.', specs: { 'Set': '2 poufs', 'Fill': 'EPS + foam wrap', 'Max load': '100 kg each' }, colors: [OAT, OXBLOOD, OLIVE], avail: 'in-stock' },
  { name: 'Chowki Low Stool', sku: 'NC-OT-611', price: 2999, desc: 'Low solid-look chowki stool for seating, tables and prayer corners.', specs: { 'Height': '300 mm', 'Top': '450 × 450 mm', 'Max load': '130 kg' }, colors: [TAN], avail: 'in-stock' },
  { name: 'Salon Shampoo Recline Unit', sku: 'NC-OT-612', price: 27999, desc: 'Salon shampoo recliner concept with leg rest and basin cut-out.', specs: { 'Recline': 'Leg-rest linked', 'Basin': 'Cut-out ready', 'Max load': '130 kg' }, colors: [BLACK], avail: 'made-to-order' },
  { name: 'Park Bench Two-Seater', sku: 'NC-OT-613', price: 12999, desc: 'Slatted two-seat garden bench in weather-tough finish.', specs: { 'Slats': 'Composite wood-look', 'Frame': 'Steel', 'Max load': '240 kg total' }, colors: [TAN, OLIVE], avail: 'in-stock' },
  { name: 'Throne Accent Chair', sku: 'NC-OT-614', price: 17999, desc: 'High-back accent throne in oxblood velvet-look for salons and sets.', specs: { 'Upholstery': 'Velvet-look', 'Back height': '1100 mm', 'Max load': '120 kg' }, colors: [RED, BLACK], avail: 'low-stock', featured: true },
];

function withOutOfStock(list: Product[], every = 17): Product[] {
  return list.map((p, i) => ((i + 1) % every === 0 ? { ...p, availability: 'out-of-stock' as Availability } : p));
}

export const PRODUCTS: Product[] = withOutOfStock([
  ...build('office', OFFICE, officeDefs, 'Office chair'),
  ...build('visitor', VISITOR, visitorDefs, 'Visitor chair'),
  ...build('gaming', GAMING, gamingDefs, 'Gaming chair'),
  ...build('school', SCHOOL, schoolDefs, 'School chair'),
  ...build('plastic', PLASTIC, plasticDefs, 'Plastic chair'),
  ...build('other', OTHER, otherDefs, 'Lounge and accent seating'),
]);

export const PRODUCT_MAP: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]));

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  'in-stock': 'In stock',
  'low-stock': 'Selling fast',
  'made-to-order': 'Made to order',
  'out-of-stock': 'Out of stock',
};
