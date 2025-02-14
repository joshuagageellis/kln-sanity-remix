import {ArrayOfObjectsInputProps, defineField} from 'sanity';

import SectionsListInput from '../../../components/SectionsListInput';

const globalSections = [
  {
    type: 'imageBannerSection',
  },
  /**
   * @todo Implement these sections as products are added to the site.
   * Shopify sections.
   */
  // {
  //   type: 'featuredCollectionSection',
  // },
  // {
  //   type: 'featuredProductSection',
  // },
  // {
  //   type: 'collectionListSection',
  // },
  {
    type: 'carouselSection',
  },
  {
    type: 'accordionSection',
  },
  {
    type: 'richtextSection',
  },
  {
    type: 'twoColumnAccordionSection'
  },
  {
    type: 'pageTopperSection'
  },
  {
    type: 'caseStudyTopperSection'
  },
  {
    type: 'homepageLargeText'
  }
];

const homepageSectionList = [
  ...globalSections,
  {
    type: 'homepageCarouselSection'
  },
  {
    type: 'featuredWorkSection'
  },
];

const pdpSections = [
  {
    type: 'productInformationSection',
  },
  {
    type: 'relatedProductsSection',
  },
  /**
   * @todo Implement these sections as products are added to the site.
   */
  // ...globalSections,
];

const collectionSectionsList = [
  {
    type: 'collectionBannerSection',
  },
  {
    type: 'collectionProductGridSection',
  },
    /**
   * @todo Implement these sections as products are added to the site.
   */
  // ...globalSections,
];

export default defineField({
  title: 'Sections',
  name: 'sections',
  type: 'array',
  group: 'pagebuilder',
  of: globalSections,
  components: {
    input: (props: ArrayOfObjectsInputProps) =>
      SectionsListInput({type: 'section', ...props}),
  },
});

export const homepageSections = defineField({
  title: 'Sections',
  name: 'homepageSections',
  type: 'array',
  group: 'pagebuilder',
  of: homepageSectionList,
  components: {
    input: (props: ArrayOfObjectsInputProps) =>
      SectionsListInput({type: 'section', ...props}),
  },
});

export const productSections = defineField({
  title: 'Sections',
  name: 'productSections',
  type: 'array',
  group: 'pagebuilder',
  of: pdpSections,
  components: {
    input: (props: ArrayOfObjectsInputProps) =>
      SectionsListInput({type: 'section', ...props}),
  },
});

export const collectionSections = defineField({
  title: 'Sections',
  name: 'collectionSections',
  type: 'array',
  group: 'pagebuilder',
  of: collectionSectionsList,
  components: {
    input: (props: ArrayOfObjectsInputProps) =>
      SectionsListInput({type: 'section', ...props}),
  },
});
