import type {Selection} from 'groqd';

import {q} from 'groqd';

/*
|--------------------------------------------------------------------------
| Links Fragments
|--------------------------------------------------------------------------
*/
export const LINK_REFERENCE_FRAGMENT = q('link')
  .deref()
  .grab({
    documentType: ['_type', q.string()],
    slug: [
      `coalesce(
        slug,
        store.slug
      )`,
      q.object({
        _type: q.string(),
        current: q.string(),
      }),
    ],
  })
  .nullable();

export const INTERNAL_LINK_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('internalLink'),
  anchor: q.string().nullable(),
  link: LINK_REFERENCE_FRAGMENT,
  name: q.string().nullable(),
} satisfies Selection;

export const EXTERNAL_LINK_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('externalLink'),
  link: q.string().nullable(),
  name: q.string().nullable(),
  openInNewTab: q.boolean().nullable(),
} satisfies Selection;

export const NESTED_NAVIGATION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('nestedNavigation'),
  childLinks: q('childLinks[]', {isArray: true}).select({
    '_type == "externalLink"': EXTERNAL_LINK_FRAGMENT,
    '_type == "internalLink"': INTERNAL_LINK_FRAGMENT,
  }),
  link: INTERNAL_LINK_FRAGMENT.link,
  name: INTERNAL_LINK_FRAGMENT.name,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| List of Links
|--------------------------------------------------------------------------
*/
export const LINKS_LIST_SELECTION = {
  '_type == "externalLink"': EXTERNAL_LINK_FRAGMENT,
  '_type == "internalLink"': INTERNAL_LINK_FRAGMENT,
  '_type == "nestedNavigation"': NESTED_NAVIGATION_FRAGMENT,
};

/*
|--------------------------------------------------------------------------
| Structured Link
|--------------------------------------------------------------------------
*/
export const STRUCTURED_LINK_FRAGMENT = {
  _type: q.literal('structuredLink'),
  externalLink: q.boolean().nullable(),
  manualLink: q.string().nullable(),
  reference: q('reference')
    .deref()
    .grab({
      documentType: ['_type', q.string()],
      /**
       * Attempt to get a product reference.
       * Nullable if this is not a product.
       */
      product: q('store')
        .grab({
          firstVariant: q('variants[]', {isArray: true})
            .slice(0)
            .deref()
            .grab({
              store: q('store').grab({
                gid: q.string(),
                previewImageUrl: q.string().nullable(),
                price: q.number(),
              }),
            })
            .nullable(),
          gid: q.string(),
          options: q('options[]', {isArray: true})
            .grab({
              name: q.string(),
              values: q.array(q.string()),
            })
            .nullable(),
          previewImageUrl: q.string().nullable(),
          title: q.string(),
        })
        .nullable(),
      slug: [
        `coalesce(
          slug,
          store.slug
        )`,
        q.object({
          _type: q.string(),
          current: q.string(),
        }),
      ],
    })
    .nullable(),
  title: q.string().nullable(),
} satisfies Selection;
