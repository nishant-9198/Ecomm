// NAV LINKS
export const navLinks = [
  { label: 'Collections', href: '#collections' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'Atelier', href: '#atelier' },
  { label: 'Journal', href: '#footer' },
];

// MODELS DATA
export const models = [
  {
    id: 1,
    image: '/models/model-1.jpg',
    cardImage: '/models/model-1.jpg',
    collection: 'Noir Series',
  },
  {
    id: 2,
    image: '/models/model-2.jpg',
    cardImage: '/models/model-2.jpg',
    collection: 'Silk Atelier',
  },
  {
    id: 3,
    image: '/models/model-3.jpg',
    cardImage: '/models/model-3.jpg',
    collection: 'Evening Edit',
  },
  {
    id: 4,
    image: '/models/model-4.jpg',
    cardImage: '/models/model-4.jpg',
    collection: 'Monochrome',
  },
  {
    id: 5,
    image: '/models/model-5.jpg',
    cardImage: '/models/model-5.jpg',
    collection: 'Runway SS26',
  },
];

// PRODUCTS
export const products = [
  {
    id: 1,
    name: 'Noir Enchanté Gown',
    price: '€1,240',
    rating: 4.9,
    image: '/models/model-1.jpg',
    category: 'Evening',
  },
  {
    id: 2,
    name: 'Silk Drapé Dress',
    price: '€890',
    rating: 4.8,
    image: '/models/model-2.jpg',
    category: 'Ready-to-Wear',
  },
  {
    id: 3,
    name: 'Column Midi',
    price: '€620',
    rating: 4.9,
    image: '/models/model-3.jpg',
    category: 'Essentials',
  },
  {
    id: 4,
    name: 'Tailored Blazer Dress',
    price: '€780',
    rating: 4.7,
    image: '/models/model-4.jpg',
    category: 'Tailoring',
  },
  {
    id: 5,
    name: 'Velvet Slip Gown',
    price: '€1,050',
    rating: 4.9,
    image: '/models/model-5.jpg',
    category: 'Evening',
  },
];

// RELATIVE POSITION
export function getRelativePosition(modelIndex, activeIndex, total) {
  let diff = modelIndex - activeIndex;

  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;

  return diff;
}

// CAROUSEL SLOT (SMALL)
export function getCarouselSlot(relativePos) {
  const abs = Math.abs(relativePos);

  if (abs === 0) {
    return { width: 220, opacity: 1, y: 0, zIndex: 5 };
  }
  if (abs === 1) {
    return { width: 168, opacity: 0.92, y: 14, zIndex: 3 };
  }
  if (abs === 2) {
    return { width: 128, opacity: 0.8, y: 26, zIndex: 1 };
  }

  return { width: 100, opacity: 0, y: 36, zIndex: 0 };
}

// CAROUSEL SLOT (MEDIUM)
export function getCarouselSlotMd(relativePos) {
  const abs = Math.abs(relativePos);

  if (abs === 0) {
    return { width: 272, opacity: 1, y: 0, zIndex: 5 };
  }
  if (abs === 1) {
    return { width: 208, opacity: 0.92, y: 16, zIndex: 3 };
  }
  if (abs === 2) {
    return { width: 160, opacity: 0.8, y: 30, zIndex: 1 };
  }

  return { width: 120, opacity: 0, y: 40, zIndex: 0 };
}

// EDITORIAL SLOT
export function getEditorialSlot(relativePos, isLg) {
  const abs = Math.abs(relativePos);

  if (abs === 0) {
    return { width: isLg ? 190 : 168, opacity: 1, y: 0, zIndex: 5 };
  }

  if (abs === 1) {
    return { width: isLg ? 130 : 118, opacity: 0.9, y: 12, zIndex: 3 };
  }

  return { width: 100, opacity: 0, y: 20, zIndex: 0 };
}