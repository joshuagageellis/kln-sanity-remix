/* eslint perfectionist/sort-objects: 0 */
import type {Config} from 'tailwindcss';

import typographyPlugin from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';
import tailwindAnimatePlugin from 'tailwindcss-animate';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      'panther': '#3E4041',
      'yosemite': '#49A0C4',
      'citrus': '#92D67A',
      'amethyst': '#C0AED8',
      'salsa': '#CC5242',
      'marble': '#F0EBD9',
      'peachy': '#F3A985',
      'yellow': '#FFDE42',
      'cream': '#EBE8DE',
      'charcoal': '#1E1F20',
      'black': '#000000',
      'white': '#FFFFFF',
    },
    fontFamily: {
      sans: ['Archivo', 'sans-serif'],
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    typographyPlugin,
    tailwindAnimatePlugin,
    plugin(({addComponents, addVariant}) => {
      // Target touch and non-touch devices
      addVariant('touch', '@media (pointer: coarse)');
      addVariant('notouch', '@media (hover: hover)');
    }),
  ],
} satisfies Config;
