import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'caseStudy',
  title: 'Case Studies',
  type: 'document',
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      title: 'Title',
    }),
    defineField({
      name: 'sections',
      type: 'sections',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
			description: 'The URL path for this case study (eg. ../case-studies/{slug})',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'weight',
      type: 'number',
      title: 'Weight',
			description: 'Higher value will be shown first in the Case Study index.',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title?.[0]?.value || 'No title',
      };
    },
  },
});
