import {EyeOff, Images} from 'lucide-react';
import {defineField, defineArrayMember} from 'sanity';

export default defineField({
	name: 'featuredWorkSection',
	title: 'Featured Work',
	type: 'object',
	preview: {
    select: {
      title: 'title',
      settings: 'settings',
    },
    prepare({settings}: any) {
      return {
        title: 'Featured Work',
        media: settings.hide ? EyeOff : Images,
      };
    },
  },
	fields: [
		defineField({
			name: 'title',
			type: 'string',
		}),
		defineField({
			name: 'deck',
			type: 'text',
		}),
		defineField({
      title: 'Work Samples',
      name: 'workSamples',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'slide',
          type: 'object',
          fields: [
            defineField({
              name: 'image',              
              type: 'image',
							validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'structuredLink',
              description: 'If this is a product slide, link to the product page. If this is a page slide, link to the page.',
              type: 'structuredLink',
							validation: Rule => Rule.required(),
            }),
          ],          
          preview: {
            select: {
              media: 'image',
            },
            prepare(context) {
              return {
                title: 'Work',
                media: context.media,
              };
            },
          },
        }),
      ],
			validation: Rule => Rule.required().max(3),
    }),
		defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
	],
	initialValue: {
		title: 'Featured Work',
		deck: 'Check out some of our latest projects.',
  },
});

