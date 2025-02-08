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
			name: 'sectionId',
			title: 'Section ID',
			description: 'Used for direct linking to this section (optional)',
			type: 'string',
			validation: Rule => Rule.custom((value) => {
				if (!value) return true; // Allow empty values
				const urlSafePattern = /^[a-zA-Z0-9-_]+$/;
				if (!urlSafePattern.test(value)) {
					return 'Section ID must contain only letters, numbers, hyphens and underscores';
				}
				return true;
			}),
		}),
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
			description: 'If an image is provided this link will wrap the image.',
			name: 'structuredLink',
			type: 'structuredLink',
		}),
		defineField({
			title: 'Image',
			name: 'image',
			type: 'image',
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