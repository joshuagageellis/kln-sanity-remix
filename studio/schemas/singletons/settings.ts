import {defineArrayMember, defineField, defineType} from 'sanity';
import {getAllLocales} from '../../../countries';
import {setShowTrailingZeroKeyValue} from '../../../app/lib/utils';

const GROUPS = [
  {
    name: 'brand',
    default: true,
  },
  {
    name: 'badges',
  },
  {
    name: 'currencyFormat',
  },
  {
    name: 'cart',
  },
  {
    name: 'socialMedia',
  },
];

export default defineType({
  title: 'Settings',
  name: 'settings',
  groups: GROUPS,
  type: 'document',
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      group: 'brand',
      initialValue: 'Fluid',
    }),
    defineField({
      name: 'siteDescription',
      description: 'Short description of your store used for SEO purposes.',
      title: 'Site description',
      type: 'string',
      group: 'brand',
    }),
    defineField({
      name: 'logo',
      type: 'image',
      group: 'brand',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'favicon',
      description: 'Will be scaled down to 32 x 32 px',
      group: 'brand',
      type: 'image',
    }),
    defineField({
      name: 'socialSharingImagePreview',
      description:
        'When you share a link to your store on social media, an image is usually shown in your post. This one will be used if another relevant image cannot be found. (Recommended size: 1200 x 628 px)',
      type: 'image',
      group: 'brand',
    }),
    defineField({
      name: 'badgesPosition',
      title: 'Position on cards',
      group: 'badges',
      type: 'string',
      options: {
        list: [
          {
            title: 'Bottom Left',
            value: 'bottom_left',
          },
          {
            title: 'Bottom Right',
            value: 'bottom_right',
          },
          {
            title: 'Top Left',
            value: 'top_left',
          },
          {
            title: 'Top Right',
            value: 'top_right',
          },
        ],
      },
    }),
    defineField({
      name: 'showCurrencyCodes',
      group: 'currencyFormat',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showTrailingZeros',
      group: 'currencyFormat',
      description:
        'Select which countries where you want to show trailing zeros ($15.00).',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: getAllLocales().map((locale) => {
          return {
            title: locale.label,
            value: setShowTrailingZeroKeyValue(locale),
          };
        }),
      },
    }),
    defineField({
      name: 'cartCollection',
      group: 'cart',
      type: 'reference',
      description: 'Visible when cart is empty.',
      to: [{type: 'collection'}],
    }),
    defineField({
      name: 'cartColorScheme',
      description: 'Default color scheme is used if none is set.',
      group: 'cart',
      type: 'reference',
      to: [{type: 'colorScheme'}],
    }),
    defineField({
      name: 'facebook',
      type: 'url',
      group: 'socialMedia',
    }),
    defineField({
      name: 'instagram',
      type: 'url',
      group: 'socialMedia',
    }),
    defineField({
      name: 'tiktok',
      title: 'TikTok',
      type: 'url',
      group: 'socialMedia',
    }),
    defineField({
      name: 'twitter',
      type: 'url',
      group: 'socialMedia',
    }),
    defineField({
      title: 'YouTube',
      name: 'youtube',
      type: 'url',
      group: 'socialMedia',
    }),
    defineField({
      name: 'linkedin',
      type: 'url',
      group: 'socialMedia',
    }),
    defineField({
      name: 'snapchat',
      type: 'url',
      group: 'socialMedia',
    }),
    defineField({
      name: 'pinterest',
      type: 'url',
      group: 'socialMedia',
    }),
    defineField({
      name: 'tumblr',
      type: 'url',
      group: 'socialMedia',
    }),
    defineField({
      name: 'vimeo',
      type: 'url',
      group: 'socialMedia',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Settings'}),
  },
});