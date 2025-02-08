import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {CSSProperties} from 'react';

import {useLoaderData} from '@remix-run/react';
import {flattenConnection, getPaginationVariables} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';

import {ProductCardGrid} from '~/components/product/ProductCardGrid';
import {PageTopperSection} from '~/components/sections/PageTopperSection';
import {ALL_PRODUCTS_QUERY} from '~/graphql/queries';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {seoPayload} from '~/lib/seo.server';

const PAGE_BY = 9;

export async function loader({
  context: {storefront},
  request,
}: LoaderFunctionArgs) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});

  const data = await storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const seo = seoPayload.collection({
    collection: {
      description: 'All the store products',
      descriptionHtml: 'All the store products',
      handle: 'products',
      id: 'all-products',
      metafields: [],
      products: data.products,
      seo: {
        description: 'All the store products',
        title: 'All Products',
      },
      title: 'All Products',
      updatedAt: '',
    },
    url: request.url,
  });

  return json({products: data.products, seo});
}

export default function AllProducts() {
  const data = useLoaderData<typeof loader>();
  const themeContent = useSanityRoot().data?.themeContent;
  const products = data.products?.nodes.length
    ? flattenConnection(data.products)
    : [];

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
            subtitle: '',
            title: 'Available Products',
          }}
        />
      </div>
      <div
        className="container-w-padding pb-20"
        style={{
          '--grid-horizontal-space': '0.5rem',
          '--grid-vertical-space': '1rem',
        } as CSSProperties}
      >
        {products.length > 0 ? (
          <ProductCardGrid products={products} />
        ) : (
          <p>{themeContent?.collection?.noProductFound}</p>
        )}
      </div>
    </>
  );
}
