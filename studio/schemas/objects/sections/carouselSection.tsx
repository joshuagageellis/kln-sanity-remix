import {EyeOff, GalleryHorizontal} from 'lucide-react';
import {defineArrayMember, defineField} from 'sanity';

export default defineField({
  name: 'carouselSection',
  title: 'Carousel',
  type: 'object',
  preview: {
    select: {
      title: 'title',
      settings: 'settings',
    },
    prepare({settings}: any) {
      return {
        title: 'Carousel Section',
        media: settings.hide ? EyeOff : GalleryHorizontal,
      };
    },
  },
  fields: [
    defineField({
      name: 'displayStyle',
      title: 'Display slide card style',
      type: 'string',
      description: 'Choose the style of the slide card',
      validation: (Rule: any) => Rule.required(),
      options: {
        list: [
          {title: 'Page', value: 'page'},
          {title: 'Product (Shows Price)', value: 'product'},
        ]
      }
    }),
    defineField({
      name: 'introLinks',
      title: 'Introduction Links',
      description: 'Title Like Links. 2 or more links will be displayed in oversized style aligned to the left.',
      type: 'array',
      validation: (Rule: any) => Rule.max(3),
      of: [
        defineArrayMember({
          name: 'introLink',
          type: 'object',
          fields: [
            defineField({
              name: 'structuredLink',
              type: 'structuredLink',
            }),
          ],
          preview: {
            select: {
              title: 'structuredLink.title',
            },
            prepare(context) {
              return {
                title: context.title ? context.title : 'Intro Link',
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'slides',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'slide',
          type: 'object',
          fields: [
            defineField({
              name: 'image',              
              type: 'image',
            }),
            defineField({
              name: 'structuredLink',
              description: 'If this is a product slide, link to the product page. If this is a page slide, link to the page.',
              type: 'structuredLink',
            }),
          ],          
          preview: {
            select: {
              media: 'image',
            },
            prepare(context) {
              return {
                title: 'Slide',
                media: context.media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    pagination: true,
    arrows: true,
    autoplay: false,
    loop: false,
    slidesPerViewDesktop: 3,
  },
});
