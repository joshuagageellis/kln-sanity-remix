import {defineField} from 'sanity';

export default defineField({
	name: 'homepageLargeText',
	title: 'Large Text',
	type: 'object',
	preview: {
		select: {
			title: 'title',
		},
		prepare() {
			return {
				title: 'Large Text',
			};
		},
	},
	fields: [
    defineField({
      name: 'content',
      type: 'text',
			title: 'Content',
			validation: (Rule) => Rule.required().max(300),
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
		content: 'We are KLN...',
	},
})