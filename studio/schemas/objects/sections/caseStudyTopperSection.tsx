import { defineField, defineArrayMember } from 'sanity'

export default defineField({
	name: 'caseStudyTopperSection',
	title: 'Case Study Topper',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
		}),
		defineField({
			type: 'structuredLink',
			name: 'link',
			title: 'Project Link',
			description: 'Link to relevant project or client website (optional)',
		}),
		defineField({
			name: 'location',
			title: 'Location',
			type: 'string',
			description: 'Example: "New York, NY"',
		}),
		defineField({
			name: 'collaborators',
			title: 'Collaborators',
			type: 'string',
			description: 'Design: Person Name',
		}),
		defineField({
			name: 'date',
			title: 'Project Date',
			type: 'date',
			description: 'Design: Person Name',
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
		defineField({
      name: 'slides',
      type: 'array',
			description: 'Add images and descriptions for each slide',
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
              name: 'description',
              type: 'text',
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
		})
	],
	preview: {
		select: {
			title: 'title',
		},
		prepare({ title }) {
			return {
				title: title,
			}
		}
	},
	initialValue: {
		bgColor: 'citrus',
	}
})