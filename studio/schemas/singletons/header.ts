import {defineField, defineType} from 'sanity';
import {internalLinkField} from '../objects/global/headerNavigation';

const GROUPS = [
  {
    name: 'navigation',
    title: 'Navigation',
    default: true,
  },
  {
    name: 'announcementBar',
    title: 'Announcement Bar',
  },
];

export default defineType({
  name: 'header',
  type: 'document',
  __experimental_formPreviewTitle: false,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'annoucementBar',
      group: 'announcementBar',
      type: 'internationalizedArrayAnnouncementBar',
    }),
    defineField({
      name: 'menu',
      group: 'navigation',
      type: 'internationalizedArrayHeaderNavigation',
    }),
    defineField({
      name: 'callToAction',
      type: 'object',
      group: 'navigation',
      fields: [
        defineField({
          name: 'text',
          type: 'string',
        }),
        internalLinkField,
        defineField({
          name: 'externalLink',
          description: "Will be used if internal link isn't provided.",
          type: 'url',
        }),
        defineField({
          name: 'openInNewTab',
          title: 'Open external link in new tab',
          type: 'boolean',
        }),
      ],
    })
  ],
  preview: {
    prepare: () => ({title: 'Header'}),
  },
});
