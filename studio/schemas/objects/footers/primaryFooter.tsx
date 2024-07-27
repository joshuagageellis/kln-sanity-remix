import {defineField, defineArrayMember} from 'sanity';

export default defineField({
  name: 'primaryFooter',
  title: 'Primary Footer with Mailchimp Embed and Navigation',
  type: 'object',
  fields: [
		defineField({
			name: 'structuredLink',
			type: 'structuredLink',
			title: 'Call to Action Link (Optional)',
		}),
    defineField({
      name: 'mcTitle',
      title: 'Mailchimp Form Title',
			description: 'This is the title that will be displayed above the Mailchimp form. Form changes require code edits.',
      type: 'text',
    }),
		defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'array',
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
                title: context.title ? context.title : 'Nav Item',
              };
            },
          },
        }),
      ],
    }),
		defineField({
      name: 'displaySocial',
      title: 'Display Social Links?',
      type: 'boolean',
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  preview: {
    prepare({}: any) {
      return {
        title: 'Primary Footer',
      };
    },
  },
});
