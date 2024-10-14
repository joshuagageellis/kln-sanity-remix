import type {Selection} from 'groqd';

import {q, z} from 'groqd';

import {
  BANNER_RICHTEXT_BLOCKS,
  PRODUCT_RICHTEXT_BLOCKS,
  RICHTEXT_BLOCKS,
} from './blocks';
import {COLOR_SCHEME_FRAGMENT, IMAGE_FRAGMENT} from './fragments';
import {STRUCTURED_LINK_FRAGMENT} from './links';
import {getIntValue} from './utils';

export const contentPositionValues = [
  'top_left',
  'top_center',
  'top_right',
  'middle_left',
  'middle_center',
  'middle_right',
  'bottom_left',
  'bottom_center',
  'bottom_right',
] as const;

export const contentAlignmentValues = ['left', 'center', 'right'] as const;

export const aspectRatioValues = ['square', 'video', 'auto'] as const;

/*
|--------------------------------------------------------------------------
| Section Settings
|--------------------------------------------------------------------------
*/
export const SECTION_SETTINGS_FRAGMENT = q('settings')
  .grab({
    hide: q.boolean().nullable(),
  })
  .nullable();

/*
|--------------------------------------------------------------------------
| Page Topper
|--------------------------------------------------------------------------
*/
export const PAGE_TOPPER_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('pageTopperSection'),
  bgColor: q.string().nullable(),
  deck: q.string().nullable(),
  displayButton: q.boolean().nullable(),
  link: q('link').grab(STRUCTURED_LINK_FRAGMENT).nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  subtitle: q.string().nullable(),
  title: q.string().nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Case Study Topper
|--------------------------------------------------------------------------
*/
export const CASE_STUDY_TOPPER_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('caseStudyTopperSection'),
  bgColor: q.string().nullable(),
  collaborators: q.string().nullable(),
  date: q.string().nullable(),
  link: q('link').grab(STRUCTURED_LINK_FRAGMENT).nullable(),
  location: q.string().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  slides: q('slides[]', {isArray: true})
    .grab({
      _key: q.string(),
      description: q.string().nullable(),
      image: q('image').grab(IMAGE_FRAGMENT).nullable(),
    })
    .nullable(),
  title: q.string().nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Two Column With Accordion
|--------------------------------------------------------------------------
*/
export const TWO_COLUMN_ACCORDION_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('twoColumnAccordionSection'),
  accordions: q('accordions[]', {isArray: true})
    .grab({
      _key: q.string(),
      content: q(
        `coalesce(
          content[_key == $language][0].value[],
          content[_key == $defaultLanguage][0].value[],
        )[]`,
        {isArray: true},
      )
        .filter()
        .select(RICHTEXT_BLOCKS)
        .nullable(),
      title: q.string().nullable(),
    })
    .nullable(),
  deck: q.string().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  structuredLink: q('structuredLink').grab(STRUCTURED_LINK_FRAGMENT).nullable(),
  title: q.string().nullable(),
};

/*
|--------------------------------------------------------------------------
| Featured Work Section
|--------------------------------------------------------------------------
*/
export const FEATURED_WORK_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('featuredWorkSection'),
  deck: q.string().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  title: q.string().nullable(),
  workSamples: q('workSamples[]', {isArray: true})
    .grab({
      _key: q.string(),
      image: q('image').grab(IMAGE_FRAGMENT).nullable(),
      structuredLink: q('structuredLink')
        .grab(STRUCTURED_LINK_FRAGMENT)
        .nullable(),
    })
    .nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Homepage Carousel Section
|--------------------------------------------------------------------------
*/
export const HOMEPAGE_CAROUSEL_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('homepageCarouselSection'),
  settings: SECTION_SETTINGS_FRAGMENT,
  slides: q('slides[]', {isArray: true})
    .grab({
      _key: q.string(),
      description: q.string().nullable(),
      image: q('image').grab(IMAGE_FRAGMENT).nullable(),
      link: q('link').grab(STRUCTURED_LINK_FRAGMENT).nullable(),
      title: q.string().nullable(),
    })
    .nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Large Text Section
|--------------------------------------------------------------------------
*/
export const HOMEPAGE_LARGE_TEXT_SECTION = {
  _key: q.string().nullable(),
  _type: q.literal('homepageLargeText'),
  content: q.string().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Accordion Section
|--------------------------------------------------------------------------
*/
export const ACCORDION_SECTION = {
  _key: q.string().nullable(),
  _type: q.literal('accordionSection'),
  content: q(
    `coalesce(
      content[_key == $language][0].value[],
      content[_key == $defaultLanguage][0].value[],
    )[]`,
    {isArray: true},
  )
    .filter()
    .select(RICHTEXT_BLOCKS)
    .nullable(),
  image: q('image').grab(IMAGE_FRAGMENT).nullable(),
  imageStructuredLink: q('imageStructuredLink').grab(STRUCTURED_LINK_FRAGMENT).nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  structuredLink: q('structuredLink').grab(STRUCTURED_LINK_FRAGMENT).nullable(),
  title: q.string().nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Image Banner Section
|--------------------------------------------------------------------------
*/
export const IMAGE_BANNER_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('imageBannerSection'),
  aspectRatioValues: q.string().nullable(),
  backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT).nullable(),
  content: q(
    `coalesce(
        content[_key == $language][0].value[],
        content[_key == $defaultLanguage][0].value[],
      )[]`,
    {isArray: true},
  )
    .filter()
    .select(BANNER_RICHTEXT_BLOCKS)
    .nullable(),
    contentAlignment: q.string().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Featured Collection Section
|--------------------------------------------------------------------------
*/
export const FEATURED_COLLECTION_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('featuredCollectionSection'),
  collection: q('collection')
    .deref()
    .grab({
      store: q('store').grab({
        gid: q.string(),
        slug: q
          .object({
            _type: q.literal('slug'),
            current: q.string(),
          })
          .nullable(),
        title: q.string(),
      }),
    })
    .nullable(),
  desktopColumns: q.number().nullable(),
  heading: [getIntValue('heading'), q.string().nullable()],
  maxProducts: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  viewAll: q.boolean().nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Featured Product Section
|--------------------------------------------------------------------------
*/
export const FEATURED_PRODUCT_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('featuredProductSection'),
  mediaAspectRatio: z.enum(aspectRatioValues).nullable(),
  product: q('product')
    .deref()
    .grab({
      store: q('store').grab({
        descriptionHtml: q.string(),
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
      }),
    })
    .nullable(),
  richtext: q(
    `coalesce(
        richtext[_key == $language][0].value[],
        richtext[_key == $defaultLanguage][0].value[],
      )[]`,
    {isArray: true},
  )
    .filter()
    .select(PRODUCT_RICHTEXT_BLOCKS)
    .nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Product Information Section
|--------------------------------------------------------------------------
*/
export const PRODUCT_INFORMATION_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('productInformationSection'),
  desktopMediaPosition: z.enum(['left', 'right']).nullable(),
  desktopMediaWidth: z.enum(['small', 'medium', 'large']).nullable(),
  mediaAspectRatio: z.enum(aspectRatioValues).nullable(),
  richtext: q(
    `coalesce(
      richtext[_key == $language][0].value[],
      richtext[_key == $defaultLanguage][0].value[],
    )[]`,
    {isArray: true},
  )
    .filter()
    .select(PRODUCT_RICHTEXT_BLOCKS)
    .nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Related Products Section
|--------------------------------------------------------------------------
*/
export const RELATED_PRODUCTS_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('relatedProductsSection'),
  desktopColumns: q.number().nullable(),
  heading: [getIntValue('heading'), q.string().nullable()],
  maxProducts: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Collection List Section
|--------------------------------------------------------------------------
*/
export const COLLECTION_LIST_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('collectionListSection'),
  collections: q('collections[]', {isArray: true})
    .deref()
    .grab({
      store: q('store').grab({
        gid: q.string(),
      }),
    })
    .nullable(),
  desktopColumns: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Carousel Section
|--------------------------------------------------------------------------
*/
export const CAROUSEL_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('carouselSection'),
  introLinks: q('introLinks[]', {isArray: true}).grab({
    _key: q.string(),
    structuredLink: q('structuredLink')
      .grab(STRUCTURED_LINK_FRAGMENT)
      .nullable(),
  }),
  settings: SECTION_SETTINGS_FRAGMENT,
  slides: q('slides[]', {isArray: true})
    .grab({
      _key: q.string(),
      image: q('image').grab(IMAGE_FRAGMENT).nullable(),
      structuredLink: q('structuredLink')
        .grab(STRUCTURED_LINK_FRAGMENT)
        .nullable(),
    })
    .nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Richtext Section
|--------------------------------------------------------------------------
*/
export const RICHTEXT_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('richtextSection'),
  contentAlignment: z.enum(contentAlignmentValues).nullable(),
  desktopContentPosition: z.enum(contentAlignmentValues).nullable(),
  richtext: q(
    `coalesce(
      richtext[_key == $language][0].value[],
      richtext[_key == $defaultLanguage][0].value[],
    )[]`,
    {isArray: true},
  )
    .filter()
    .select(RICHTEXT_BLOCKS)
    .nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Collection Banner Section
|--------------------------------------------------------------------------
*/
export const COLLECTION_BANNER_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('collectionBannerSection'),
  bannerHeight: q.number().nullable(),
  contentAlignment: z.enum(contentAlignmentValues).nullable(),
  contentPosition: z.enum(contentPositionValues).nullable(),
  overlayOpacity: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  showDescription: q.boolean().nullable(),
  showImage: q.boolean().nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Collection Banner Section
|--------------------------------------------------------------------------
*/
export const COLLECTION_PRODUCT_GRID_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('collectionProductGridSection'),
  desktopColumns: q.number().nullable(),
  enableFiltering: q.boolean().nullable(),
  enableSorting: q.boolean().nullable(),
  mobileColumns: q.number().nullable(),
  productsPerPage: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| List of sections
|--------------------------------------------------------------------------
*/
export const SECTIONS_LIST_SELECTION = {
  "_type == 'accordionSection'": ACCORDION_SECTION,
  "_type == 'carouselSection'": CAROUSEL_SECTION_FRAGMENT,
  "_type == 'caseStudyTopperSection'": CASE_STUDY_TOPPER_SECTION_FRAGMENT,
  "_type == 'collectionListSection'": COLLECTION_LIST_SECTION_FRAGMENT,
  "_type == 'featuredCollectionSection'": FEATURED_COLLECTION_SECTION_FRAGMENT,
  "_type == 'featuredProductSection'": FEATURED_PRODUCT_SECTION_FRAGMENT,
  "_type == 'featuredWorkSection'": FEATURED_WORK_SECTION_FRAGMENT,
  "_type == 'homepageCarouselSection'": HOMEPAGE_CAROUSEL_SECTION_FRAGMENT,
  "_type == 'homepageLargeText'": HOMEPAGE_LARGE_TEXT_SECTION,
  "_type == 'imageBannerSection'": IMAGE_BANNER_SECTION_FRAGMENT,
  "_type == 'pageTopperSection'": PAGE_TOPPER_SECTION_FRAGMENT,
  "_type == 'richtextSection'": RICHTEXT_SECTION_FRAGMENT,
  "_type == 'twoColumnAccordionSection'": TWO_COLUMN_ACCORDION_SECTION_FRAGMENT,
};

export const SECTIONS_FRAGMENT = q('sections[]', {isArray: true})
  .select(SECTIONS_LIST_SELECTION)
  .nullable();

/**
 * Used to grab only the case study toppers when displaying in feeds.
 */
export const SECTIONS_FRAGMENT_CASE_STUDY_TOPPER = q('sections[]', {isArray: true})
  .select({"_type == 'caseStudyTopperSection'": SECTIONS_LIST_SELECTION["_type == 'caseStudyTopperSection'"]})
  .nullable();


/*
|--------------------------------------------------------------------------
| Product Sections Fragment
|--------------------------------------------------------------------------
*/
export const PRODUCT_SECTIONS_FRAGMENT = q('sections[]', {isArray: true})
  .select({
    "_type == 'productInformationSection'":
      PRODUCT_INFORMATION_SECTION_FRAGMENT,
    "_type == 'relatedProductsSection'": RELATED_PRODUCTS_SECTION_FRAGMENT,
    ...SECTIONS_LIST_SELECTION,
  })
  .nullable();

/*
|--------------------------------------------------------------------------
| Collection Sections Fragment
|--------------------------------------------------------------------------
*/
export const COLLECTION_SECTIONS_FRAGMENT = q('sections[]', {isArray: true})
  .select({
    "_type == 'collectionBannerSection'": COLLECTION_BANNER_SECTION_FRAGMENT,
    "_type == 'collectionProductGridSection'":
      COLLECTION_PRODUCT_GRID_SECTION_FRAGMENT,
    ...SECTIONS_LIST_SELECTION,
  })
  .nullable();
