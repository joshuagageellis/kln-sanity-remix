export const redirects = [
  {
    from: '/custom',
    status: 301,
    to: '/case-studies',
  },
  {
    from: '/cherry-millwork-crown-heights-residence',
    status: 301, 
    to: '/case-studies/sterling-place',
  },
  {
    from: '/staircase',
    status: 301,
    to: '/case-studies/washington-st-custom-staircase',
  },
  {
    from: '/tiina-the-store-1',
    status: 301,
    to: '/case-studies/hamptons-tiina-the-store',
  },
  {
    from: '/chum-shelves',
    status: 301,
    to: '/case-studies/nolita-walnut-bookshelves',
  },
  {
    from: '/tiina-the-store',
    status: 301,
    to: '/case-studies/hamptons-tiina-the-store',
  },
  {
    from: '/library-and-reading-nook-brooklyn',
    status: 301,
    to: '/case-studies',
  },
  {
    from: '/outdoor-table-tenafly-nj',
    status: 301,
    to: '/tenafly-outdoor-table',
  },
  {
    from: '/outdoor-table-tenafly-nj-2',
    status: 301,
    to: '/case-studies',
  },
  {
    from: '/duke-chair',
    status: 301,
    to: '/case-studies/duke-chair',
  },
  {
    from: '/platonic-chair',
    status: 301,
    to: '/case-studies',
  },
  {
    from: '/products',
    status: 301,
    to: '/collections/kln-designs',
  },
  {
    from: '/amp-copper-table',
    status: 301,
    to: '/products/amplitude-end-table',
  },
  {
    from: '/brotherton-bed',
    status: 301,
    to: '/products/brotherton-bed',
  },
  {
    from: '/ellen-cabinet',
    status: 301,
    to: '/collections/ellen-collection',
  },
  {
    from: '/elemen',
    status: 301,
    to: '/products/elemen-shelving',
  },
  {
    from: '/slaat',
    status: 301,
    to: '/collections/kln-designs',
  },
  {
    from: '/steelyard-island',
    status: 301,
    to: '/collections/kln-designs',
  },
  {
    from: '/sarpa-mirror-large',
    status: 301,
    to: '/collections/sarpa-collection',
  },
  {
    from: '/tube-end-table',
    status: 301,
    to: '/products/tube-nightstand',
  },
  {
    from: '/wiggle',
    status: 301,
    to: '/products/wiggle-coffee-table',
  },
  {
    from: '/palmettocoffee',
    status: 301,
    to: '/products/palmetto-coffee-table',
  },
  {
    from: '/violette-console',
    status: 301,
    to: '/products/violette-console',
  },
  {
    from: '/violette-bed',
    status: 301,
    to: '/products/violette-bed',
  },
  {
    from: '/violette-side-table',
    status: 301,
    to: '/products/violette-side-table',
  },
  {
    from: '/violette-stacking-stools',
    status: 301,
    to: '/products/violette-stacking-stools',
  },
  {
    from: '/wedge-counter',
    status: 301,
    to: '/products/wedge-counter',
  },
  {
    from: '/woodbine-coffee-table-cherry',
    status: 301,
    to: '/products/woodbine-dining-table-hardwood-veneer',
  },
  {
    from: '/woodbine-dining-table-cherry-copy',
    status: 301,
    to: '/products/woodbine-dining-table-hardwood-veneer',
  },
  {
    from: '/woodbine',
    status: 301,
    to: '/products/woodbine-dining-table-linoleum',
  },
];

export type Redirect = (typeof redirects)[number];