import type {ActionFunctionArgs, LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {useLoaderData} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {DEFAULT_LOCALE} from 'countries';

import {CmsSection} from '~/components/CmsSection';
import {ContactForm} from '~/components/forms/ContactForm';
import {useSanityData} from '~/hooks/useSanityData';
import {resolveShopifyPromises} from '~/lib/resolveShopifyPromises';
import {sanityPreviewPayload} from '~/lib/sanity/sanity.payload.server';
import {seoPayload} from '~/lib/seo.server';
import {PAGE_QUERY} from '~/qroq/queries';

export async function loader({context, request}: LoaderFunctionArgs) {
  const {env, locale, sanity, storefront} = context;
  const handle = 'contact';
  const language = locale?.language.toLowerCase();

  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    handle,
    language,
  };

  const page = await sanity.query({
    groqdQuery: PAGE_QUERY,
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

  const seo = seoPayload.home({
    page: page.data,
    sanity: {
      dataset: env.SANITY_STUDIO_DATASET,
      projectId: env.SANITY_STUDIO_PROJECT_ID,
    },
  });

  return defer({
    analytics: {
      pageType: AnalyticsPageType.page
    },
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    page,
    seo,
    ...sanityPreviewPayload({
      context,
      params: queryParams,
      query: PAGE_QUERY.query,
    }),
  });
}

export default function PageRoute() {
  const {page} = useLoaderData<typeof loader>();
  const {data, encodeDataAttribute} = useSanityData({
    initial: page,
  });

  return (
    <>
      {data?.sections && data.sections.length > 0
        ? data.sections.map((section) => (
        <CmsSection
          data={section}
          encodeDataAttribute={encodeDataAttribute}
          key={section._key}
        />
      )): null}
      {/* Contact Form */}
      <ContactForm />
    </>
  );
}