import {defineField} from 'sanity';

export default defineField({
	name: 'structuredLink',
	title: 'Structured Link',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'externalLink',
			title: 'External Link?',
			type: 'boolean',
		}),
		defineField({
			name: 'reference',
			title: 'Link',
			type: 'reference',
			weak: true,
			to: [{type: 'page'}, {type: 'shopifyProduct'}, {type: 'shopifyCollection'}],
			hidden: ({parent}) => parent?.externalLink,
		}),
		defineField({
			name: 'manualLink',
			title: 'Manual Link',
			type: 'url',
			hidden: ({parent}) => !parent?.externalLink,
		}),
	],
	initialValue: {
		externalLink: false,
	},
})