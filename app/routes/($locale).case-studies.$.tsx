import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {useLoaderData} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {DEFAULT_LOCALE} from 'countries';

import type {I18nLocale} from '~/lib/type';

import {CmsSection} from '~/components/CmsSection';
import {useSanityData} from '~/hooks/useSanityData';
import {resolveShopifyPromises} from '~/lib/resolveShopifyPromises';
import {sanityPreviewPayload} from '~/lib/sanity/sanity.payload.server';
import {seoPayload} from '~/lib/seo.server';
import {CASE_STUDY_QUERY} from '~/qroq/queries';

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {env, locale, sanity, storefront} = context;
  const pathname = new URL(request.url).pathname;
  const handle = getPageHandle({locale, params, pathname});
  const language = locale?.language.toLowerCase();

  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    handle,
    language,
  };

  const page = await sanity.query({
    groqdQuery: CASE_STUDY_QUERY,
    params: queryParams,
  });

  const {
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
  } = resolveShopifyPromises({
    document: page,
    request,
    storefront,
  });

  if (!page.data) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const seo = seoPayload.caseStudy({
    page: page.data,
    sanity: {
      dataset: env.SANITY_STUDIO_DATASET,
      projectId: env.SANITY_STUDIO_PROJECT_ID,
    },
  });

  return defer({
    analytics: {
      pageType: AnalyticsPageType.page,
    },
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    page,
    seo,
    ...sanityPreviewPayload({
      context,
      params: queryParams,
      query: CASE_STUDY_QUERY.query,
    }),
  });
}

export default function PageRoute() {
  const {page} = useLoaderData<typeof loader>();
  const {data, encodeDataAttribute} = useSanityData({
    initial: page,
  });

  return data?.sections && data.sections.length > 0
    ? data.sections.map((section) => (
        <CmsSection
          data={section}
          encodeDataAttribute={encodeDataAttribute}
          key={section._key}
        />
      ))
    : null;
}

function getPageHandle(args: {
  locale: I18nLocale;
  params: LoaderFunctionArgs['params'];
  pathname: string;
}) {
  const {locale, pathname} = args;
	return pathname
		.replace(`${locale?.pathPrefix}`, '')
		.replace('case-studies/', '')
		.replace(/^\/+/g, '');
}
