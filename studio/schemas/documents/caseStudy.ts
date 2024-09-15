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
