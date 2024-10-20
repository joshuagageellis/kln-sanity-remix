import {EyeOff, TextSelect} from 'lucide-react';
import {defineField} from 'sanity';

export default defineField({
  name: 'richtextSection',
  title: 'Richtext',
  type: 'object',
  fields: [
    defineField({
      name: 'richtext',
      type: 'internationalizedArrayRichtext',
    }),
    // defineField({
    //   name: 'desktopContentPosition',
    //   description: 'Position is automatically optimized for mobile.',
    //   type: 'string',
    //   options: {
    //     list: [
    //       {
    //         title: 'Left',
    //         value: 'left',
    //       },
    //       {
    //         title: 'Center',
    //         value: 'center',
    //       },
    //       {
    //         title: 'Right',
    //         value: 'right',
    //       },
    //     ],
    //   },
    // }),
    // defineField({
    //   name: 'contentAlignment',
    //   type: 'string',
    //   options: {
    //     list: [
    //       {
    //         title: 'Left',
    //         value: 'left',
    //       },
    //       {
    //         title: 'Center',
    //         value: 'center',
    //       },
    //       {
    //         title: 'Right',
    //         value: 'right',
    //       },
    //     ],
    //   },
    // }),
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
    // desktopContentPosition: 'center',
    // contentAlignment: 'left',
  },
  preview: {
    select: {
      settings: 'settings',
    },
    prepare({settings}: any) {
      return {
        title: 'Richtext',
        media: () => (settings?.hide ? <EyeOff /> : <TextSelect />),
      };
    },
  },
});
