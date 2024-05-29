import {defineField} from 'sanity';

export default defineField({
  type: 'object',
  name: 'sectionSettings',
  fields: [
    defineField({
      name: 'hide',
      title: 'Hide section',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
