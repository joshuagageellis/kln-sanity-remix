export const redirects = [
  {
    from: '/about-us',
    status: 301,
    to: '/about',
  },
];

export type Redirect = (typeof redirects)[number];