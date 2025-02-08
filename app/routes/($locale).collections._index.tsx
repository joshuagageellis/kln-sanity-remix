import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {CSSProperties} from 'react';

import {useLoaderData} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';

import {CollectionListGrid} from '~/components/CollectionListGrid';
import {PageTopperSection} from '~/components/sections/PageTopperSection';
import {COLLECTIONS_QUERY} from '~/graphql/queries';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {seoPayload} from '~/lib/seo.server';

const PAGINATION_SIZE = 4;

export const loader = async ({
  context: {storefront},
  request,
}: LoaderFunctionArgs) => {
  const variables = getPaginationVariables(request, {
    pageBy: PAGINATION_SIZE,
  });
  const {collections} = await storefront.query(COLLECTIONS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const seo = seoPayload.listCollections({
    collections,
    url: request.url,
  });

  return json({collections, seo});
};

export default function Collections() {
  const data = useLoaderData<typeof loader>();
  const themeContent = useSanityRoot().data?.themeContent;

  return (
    <>
      <div className="pb-20">
        <PageTopperSection
          data={{
            _key: 'allProducts',
            _type: 'pageTopperSection',
            bgColor: 'charcoal',
            deck: null,
            displayButton: false,
            link: null,
            settings: {hide: false},
            subtitle: null,
            title: 'Collections',
          }}
        />
      </div>
      <div
        className="container-w-padding pb-20"
        style={
          {
            '--grid-horizontal-space': '0.5rem',
            '--grid-vertical-space': '1rem',
          } as CSSProperties
        }
      >
        {data.collections?.nodes.length > 0 ? (
          <CollectionListGrid collections={data.collections} />
        ) : (
          <p>{themeContent?.collection?.noCollectionFound}</p>
        )}
      </div>
    </>
  );
}
