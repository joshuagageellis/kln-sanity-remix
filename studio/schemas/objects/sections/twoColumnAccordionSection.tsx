import {EyeOff, FoldVertical} from 'lucide-react'
import { defineField, defineArrayMember } from 'sanity'

export default defineField({
	name:'twoColumnAccordionSection',
	title: 'Two Columns with Accordions',
	type: 'object',
	preview: {
		select: {
			title: 'title',
			settings: 'settings',
		},
		prepare({settings}: any) {
			return {
				title: 'Two Columns with Accordions',
				media: settings.hide ? EyeOff : FoldVertical,
			}
		},
	},
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'deck',
			type: 'text',
		}),
		defineField({
			title: 'Button Link',
			name: 'structuredLink',
			type: 'structuredLink',
		}),
		defineField({
      title: 'Accordion',
      name: 'accordions',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'accordion',
          type: 'object',
          fields: [
            defineField({
              name: 'title',              
              type: 'text',
							validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'content',
              description: 'Inner accordion content.',
              type: 'internationalizedArrayRichtext',
							validation: Rule => Rule.required(),
            }),
          ],          
          preview: {
            select: {
							title: 'title',
						},
            prepare(context) {
              return {
                title: context.title,
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
		defineField({
      type: 'boolean',
      name: 'darkMode',
      title: 'Dark Mode',
      description: 'Use dark background and light text for this section.',
    }),
	],
	initialValue: {
		title: 'Our Process',
		deck: 'This is how we do it...',
  },
})