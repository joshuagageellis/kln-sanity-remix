import {defineArrayMember, defineField} from 'sanity';

export default defineField({
	name: 'homepageCarouselSection',
	title: 'Homepage Carousel',
	type: 'object',
	preview: {
		select: {
			title: 'title',
			settings: 'settings',
		},
		prepare() {
			return {
				title: 'Homepage Carousel',
			};
		},
	},
	fields: [
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
							validation: Rule => Rule.required(),
            }),
						defineField({
              name: 'title',
              type: 'string',
							validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'text',
            }),
						defineField({
              name: 'link',
              type: 'structuredLink',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
            prepare(context) {
              return {
                title: context.title,
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
  initialValue: {},
})