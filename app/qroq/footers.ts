import type {Selection} from 'groqd';

import {q} from 'groqd';

import {COLOR_SCHEME_FRAGMENT} from './fragments';
import {STRUCTURED_LINK_FRAGMENT} from './links';
import {getIntValue} from './utils';

/*
|--------------------------------------------------------------------------
| Footer Settings
|--------------------------------------------------------------------------
*/
export const FOOTER_SETTINGS_FRAGMENT = q('settings').grab({
  customCss: q
    .object({
      code: q.string().optional(),
    })
    .nullable(),
  hide: q.boolean().nullable(),
  padding: q
    .object({
      bottom: q.number().nullable(),
      top: q.number().nullable(),
    })
    .nullable(),
});

/*
|--------------------------------------------------------------------------
| Social Links Only
|--------------------------------------------------------------------------
*/
export const FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('socialLinksOnly'),
  copyright: [getIntValue('copyright'), q.string()],
  settings: FOOTER_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Primary Footer
|--------------------------------------------------------------------------
*/
export const PRIMARY_FOOTER = {
  _key: q.string().nullable(),
  _type: q.literal('socialLinksOnly'),
  displaySocial: q.boolean().nullable(),
  mcTitle: q.string().nullable(),
  navigation: q('navigation[]', {isArray: true})
    .grab({
      _key: q.string(),
      structuredLink: q('structuredLink').grab(STRUCTURED_LINK_FRAGMENT).nullable(),
    }),
  settings: FOOTER_SETTINGS_FRAGMENT,
  structuredLink: q('structuredLink').grab(STRUCTURED_LINK_FRAGMENT).nullable(),
} satisfies Selection;


/*
|--------------------------------------------------------------------------
| List of footer
|--------------------------------------------------------------------------
*/
export const FOOTERS_LIST_SELECTION = {
  "_type == 'primaryFooter'": PRIMARY_FOOTER,
  "_type == 'socialLinksOnly'": FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT,
};

/*
|--------------------------------------------------------------------------
| Footers Fragment
|--------------------------------------------------------------------------
*/
export const FOOTERS_FRAGMENT = q('footers[]', {isArray: true})
  .select(FOOTERS_LIST_SELECTION)
  .slice(0)
  .nullable();
