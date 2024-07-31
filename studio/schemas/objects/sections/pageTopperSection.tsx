import { defineField } from 'sanity'

export default defineField({
	name: 'pageTopperSection',
	title: 'Page Topper',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
		}),
		defineField({
			name: 'subtitle',
			title: 'Subtitle',
			type: 'string',
		}),
		defineField({
			name: 'deck',
			title: 'Deck (max: 280 characters)',
			type: 'text',
			validation: (Rule) => Rule.max(280),
		}),
		defineField({
			type: 'boolean',
			name: 'displayButton',
			title: 'Display Button?',
		}),
		defineField({
			type: 'structuredLink',
			name: 'link',
			title: 'Button Link',
			hidden: ({ parent }) => !parent.displayButton,
		}),
		defineField({
			name: 'bgColor',
			title: 'Background Color',
			type: 'string',
			options: {
				list: ['citrus', 'charcoal', 'salsa'],
				layout: 'radio',
			}
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'subtitle',
		},
		prepare({ title, subtitle }) {
			return {
				title: title,
				subtitle: subtitle,
			}
		}
	},
	initialValue: {
		bgColor: 'citrus',
		displayButton: false,
	}
})