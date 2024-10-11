import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {visionTool} from '@sanity/vision';
import {internationalizedArray} from 'sanity-plugin-internationalized-array';
import {media, mediaAssetSource} from 'sanity-plugin-media';
import {fontPicker} from '@frontvibe/sanity-font-picker';
import {colorPicker} from '@frontvibe/sanity-color-picker';
import {rangeSlider} from '@frontvibe/sanity-plugin-range-slider';
import {codeInput} from '@sanity/code-input';
import {presentationTool} from '@sanity/presentation';
import {languageFilter} from '@sanity/language-filter';
import {groqdPlaygroundTool} from 'groqd-playground';

import {schemaTypes} from './schemas';
import {defaultDocumentNode, structure} from './structure';
import {projectDetails} from './project.details';
import {getAllLanguages} from '../countries';
import {customDocumentActions} from './plugins/customDocumentActions';
import {singletonActions, singletonsTypes} from './structure/singletons';
import {locate} from './presentation/locate';
import {PreviewIcon} from './components/icons/Preview';

const isDev = process.env.MODE === 'development';
const {projectId, dataset, apiVersion, previewUrl} = projectDetails;
console.log('projectDetails', JSON.stringify(projectDetails, null, 2));
const FE_PREVIEW = previewUrl && isDev ? previewUrl : 'https://kln-73b18c45cdf29e90ae6b.o2.myshopify.dev'

const languages = getAllLanguages();
const devOnlyPlugins = [
  visionTool({
    defaultApiVersion: apiVersion,
    defaultDataset: dataset,
  }),
  groqdPlaygroundTool(),
];

console.log('FE_PREVIEW', FE_PREVIEW);

export default defineConfig({
  name: 'default',
  title: 'KLN Studios',
  projectId,
  dataset,
  plugins: [
    fontPicker(),
    rangeSlider(),
    colorPicker(),
    codeInput(),
    structureTool({structure, defaultDocumentNode}),
    customDocumentActions(),
    media(),
    presentationTool({
      // Required: set the base URL to the preview location in the front end
      previewUrl: `${FE_PREVIEW}/sanity/preview`,
      locate,
      icon: PreviewIcon,
      title: 'Preview',
    }),
    internationalizedArray({
      languages: getAllLanguages(),
      defaultLanguages: [languages[0].id],
      fieldTypes: [
        'string',
        'text',
        'slug',
        'headerNavigation',
        'announcementBar',
        'productRichtext',
        'richtext',
        'bannerRichtext',
      ],
      buttonLocations: ['field'],
    }),
    languageFilter({
      supportedLanguages: getAllLanguages(),
      defaultLanguages: [languages[0].id],
      documentTypes: [
        'page',
        'home',
        'themeContent',
        'header',
        'footer',
        'product',
        'collection',
      ],
    }),
    ...(isDev ? devOnlyPlugins : []),
  ],
  schema: {
    types: schemaTypes,
    // Filter out singleton types from the global “New document” menu options
    templates: (templates) =>
      templates.filter(({schemaType}) => !singletonsTypes.has(schemaType)),
  },
  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` list defined above
    actions: (input, context) =>
      singletonsTypes.has(context.schemaType)
        ? input.filter(({action}) => action && singletonActions.has(action))
        : input,
  },
  form: {
    file: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter(
          (assetSource) => assetSource !== mediaAssetSource,
        );
      },
    },
    image: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter(
          (assetSource) => assetSource === mediaAssetSource,
        );
      },
    },
  },
});
