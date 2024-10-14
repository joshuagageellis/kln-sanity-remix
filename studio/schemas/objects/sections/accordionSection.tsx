import {EyeOff, FoldVertical} from 'lucide-react'
import { defineField } from 'sanity'

export default defineField({
	name:'accordionSection',
	title: 'Full Width Accordion',
	type: 'object',
	preview: {
		select: {
			title: 'title',
			settings: 'settings',
		},
		prepare({settings}: any) {
			return {
				title: 'Full Width Accordion',
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
			name: 'content',
			description: 'Inner accordion content.',
			type: 'internationalizedArrayRichtext',
			validation: Rule => Rule.required(),
		}),
		defineField({
			title: 'Read More Link',
			name: 'structuredLink',
			type: 'structuredLink',
		}),
		defineField({
			title: 'Image',
			name: 'image',
			type: 'image',
		}),
		defineField({
			title: 'Image Link',
			name: 'imageStructuredLink',
			type: 'structuredLink',
		}),
		defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
	],
	initialValue: {
		title: 'Service Name',
  },
})