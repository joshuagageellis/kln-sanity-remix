import {q, z} from 'groqd';

import { sections } from '~/lib/sectionRelsolver';

import {FOOTERS_FRAGMENT} from './footers';
import {
  ANNOUCEMENT_BAR_ARRAY_FRAGMENT,
  CALL_TO_ACTION_FRAGMENT,
  COLOR_SCHEME_FRAGMENT,
  FONT_FRAGMENT,
  MENU_FRAGMENT,
  SETTINGS_FRAGMENT,
  SIMPLE_IMAGE_FRAGMENT,
} from './fragments';
import {
  COLLECTION_SECTIONS_FRAGMENT,
  PRODUCT_SECTIONS_FRAGMENT,
  SECTIONS_FRAGMENT,
  SECTIONS_FRAGMENT_CASE_STUDY_TOPPER,
} from './sections';
import {THEME_CONTENT_FRAGMENT} from './themeContent';
import {getIntValue} from './utils';

/*
|--------------------------------------------------------------------------
| Template Queries
|--------------------------------------------------------------------------
*/
export const DEFAULT_PRODUCT_TEMPLATE = q('*')
  .filter("_type == 'productTemplate' && default == true")
  .grab({
    _type: q.literal('productTemplate'),
    name: q.string().nullable(),
    sections: PRODUCT_SECTIONS_FRAGMENT,
  })
  .slice(0)
  .nullable();

export const DEFAULT_COLLECTION_TEMPLATE = q('*')
  .filter("_type == 'collectionTemplate' && default == true")
  .grab({
    _type: q.literal('collectionTemplate'),
    name: q.string().nullable(),
    sections: COLLECTION_SECTIONS_FRAGMENT,
  })
  .slice(0)
  .nullable();

/*
|--------------------------------------------------------------------------
| Page Query
|--------------------------------------------------------------------------
*/
export const PAGE_QUERY = q('*')
  .filter(
    `(
      _type == "page" &&
        ($handle != "home" && slug.current == $handle)
      ) || (
        _type == "home" &&
        $handle == "home"
      )
    `,
  )
  .grab({
    _type: q.literal('page').or(q.literal('home')),
    sections: SECTIONS_FRAGMENT,
    seo: q('seo')
      .grab({
        description: [getIntValue('description'), q.string().nullable()],
        image: q('image').grab(SIMPLE_IMAGE_FRAGMENT).nullable(),
        title: [getIntValue('title'), q.string().nullable()],
      })
      .nullable(),
  })
  .slice(0)
  .nullable();

/*
|--------------------------------------------------------------------------
| Case Study Index — Page Query
|--------------------------------------------------------------------------
*/
export const CASE_STUDY_INDEX_PAGE = q('*')
  .filter(
    `(
      _type == "page" &&
      slug.current == $handle
    )`,
  )
  .grab({
    _type: q.literal('page'),
    caseStudies: q('*[_type == "caseStudy"] | order(weight desc)[$first..$last]', {isArray: true})
      .grab({
        _id: q.string(),
        _type: q.literal('caseStudy'),
        sections: SECTIONS_FRAGMENT_CASE_STUDY_TOPPER,
        slug: q('slug').grab({
          current: q.string(),
        }),
        title: [getIntValue('title'), q.string().nullable()],
      }),
    caseStudiesTotal: q('count(*[_type == "caseStudy"])'),
    sections: SECTIONS_FRAGMENT,
    seo: q('seo')
      .grab({
        description: [getIntValue('description'), q.string().nullable()],
        image: q('image').grab(SIMPLE_IMAGE_FRAGMENT).nullable(),
        title: [getIntValue('title'), q.string().nullable()],
      })
      .nullable(),
    title: [getIntValue('title'), q.string().nullable()],
  })
  .slice(0)
  .nullable();

/*
|--------------------------------------------------------------------------
| Case Study Query
|--------------------------------------------------------------------------
*/
export const CASE_STUDY_QUERY = q('*')
  .filter(
    `(
      _type == "caseStudy" &&
      slug.current == $handle
    )
    `,
  )
  .grab({
    _type: q.literal('caseStudy'),
    sections: SECTIONS_FRAGMENT,
    seo: q('seo')
      .grab({
        description: [getIntValue('description'), q.string().nullable()],
        image: q('image').grab(SIMPLE_IMAGE_FRAGMENT).nullable(),
        title: [getIntValue('title'), q.string().nullable()],
      })
      .nullable(),
  })
  .slice(0)
  .nullable();

/*
|--------------------------------------------------------------------------
| Product Query
|--------------------------------------------------------------------------
*/
export const PRODUCT_QUERY = q('').grab({
  _type: ['"product"', q.literal('product')],
  defaultProductTemplate: DEFAULT_PRODUCT_TEMPLATE,
  product: q('*')
    .filter(`_type == "product" && store.slug.current == $productHandle`)
    .grab({
      store: q('store').grab({
        gid: q.string(),
      }),
      template: q('template').deref().grab({
        sections: PRODUCT_SECTIONS_FRAGMENT,
      }),
    })
    .slice(0)
    .nullable(),
});

/*
|--------------------------------------------------------------------------
| Collection Query
|--------------------------------------------------------------------------
*/
export const COLLECTION_QUERY = q('').grab({
  _type: ['"collection"', q.literal('collection')],
  collection: q('*')
    .filter(`_type == "collection" && store.slug.current == $collectionHandle`)
    .grab({
      store: q('store').grab({
        gid: q.string(),
      }),
      template: q('template').deref().grab({
        sections: COLLECTION_SECTIONS_FRAGMENT,
      }),
    })
    .slice(0)
    .nullable(),
  defaultCollectionTemplate: DEFAULT_COLLECTION_TEMPLATE,
});

/*
|--------------------------------------------------------------------------
| CMS Settings Queries
|--------------------------------------------------------------------------
*/
export const FONTS_QUERY = q('*')
  .filter("_type == 'typography'")
  .grab({
    body: q('body').grab(FONT_FRAGMENT),
    extra: q('extra').grab(FONT_FRAGMENT),
    heading: q('heading').grab(FONT_FRAGMENT),
  })
  .order('_createdAt asc')
  .slice(0)
  .nullable();

export const DEFAULT_COLOR_SCHEME_QUERY = q('*')
  .filter("_type == 'colorScheme' && default == true")
  .grab(COLOR_SCHEME_FRAGMENT)
  .slice(0)
  .nullable();

export const SETTINGS_QUERY = q('*')
  .filter("_type == 'settings'")
  .grab(SETTINGS_FRAGMENT)
  .slice(0)
  .nullable();

export const HEADER_QUERY = q('*')
  .filter("_type == 'header'")
  .grab({
    annoucementBar: ANNOUCEMENT_BAR_ARRAY_FRAGMENT,
    callToAction: CALL_TO_ACTION_FRAGMENT,
    menu: MENU_FRAGMENT,
  })
  .slice(0)
  .nullable();

export const FOOTER_QUERY = q('*')
  .filter("_type == 'footer'")
  .grab({
    footer: FOOTERS_FRAGMENT,
    sections: SECTIONS_FRAGMENT,
  })
  .slice(0)
  .nullable();

export const THEME_CONTENT_QUERY = q('*')
  .filter("_type == 'themeContent'")
  .grab(THEME_CONTENT_FRAGMENT)
  .slice(0)
  .nullable();

export const ROOT_QUERY = q('')
  .grab({
    _type: ['"root"', q.literal('root')],
    fonts: FONTS_QUERY,
    footer: FOOTER_QUERY,
    header: HEADER_QUERY,
    settings: SETTINGS_QUERY,
    themeContent: THEME_CONTENT_QUERY,
  })
  .nullable();
