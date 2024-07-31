import {EyeOff} from 'lucide-react';
import {defineField} from 'sanity';

export default defineField({
  name: 'imageBannerSection',
  title: 'Image Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      type: 'internationalizedArrayBannerRichtext',
    }),
    defineField({
      name: 'contentAlignment',
      type: 'string',
      options: {
        list: [
          {
            title: 'Left',
            value: 'left',
          },
          {
            title: 'Right',
            value: 'right',
          },
        ],
      },
    }),
    defineField({
      type: 'string',
      name: 'aspectRatioValues',
      options: {
        list: [
          {
            title: '16:9',
            value: '16/9',
          },
          {
            title: '4:3',
            value: '4/3',
          },
          {
            title: '5:4',
            value: '5/4',
          },
          {
            title: '1:1',
            value: '1/1',
          },
        ],
      },
    }),
    defineField({
      type: 'image',
      title: 'Image',
      name: 'backgroundImage',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    settings: {
      padding: {
        top: 0,
        bottom: 0,
      },
    },
  },
  preview: {
    select: {
      media: 'backgroundImage',
      settings: 'settings',
    },
    prepare({media, settings}: any) {
      return {
        title: 'Image Banner',
        media: settings.hide ? EyeOff : media,
      };
    },
  },
});
