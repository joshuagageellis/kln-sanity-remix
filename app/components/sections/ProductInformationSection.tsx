import type {TypeFromSelection} from 'groqd';
import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {Await, useLoaderData} from '@remix-run/react';
import {vercelStegaCleanAll} from '@sanity/client/stega';
import {flattenConnection} from '@shopify/hydrogen-react';
import {Suspense, createContext, useContext} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {PRODUCT_INFORMATION_SECTION_FRAGMENT} from '~/qroq/sections';
import type {loader} from '~/routes/($locale).products.$productHandle';

import {cn, getAspectRatioData} from '~/lib/utils';

import {Skeleton} from '../Skeleton';
import {MediaGallery} from '../product/MediaGallery';
import {ProductDetails} from '../product/ProductDetails';

export type ProductInformationSectionProps = TypeFromSelection<
  typeof PRODUCT_INFORMATION_SECTION_FRAGMENT
>;

type ProductVariantsContextType = {
  variants: ProductVariantFragmentFragment[];
};

export function ProductInformationSection(
  props: SectionDefaultProps & {
    data: ProductInformationSectionProps;
  },
) {
  const loaderData = useLoaderData<typeof loader>();
  const {data} = props;
  const variantsPromise = loaderData.variants;
  const aspectRatio = getAspectRatioData(data.mediaAspectRatio);

  if (variantsPromise) {
    return (
      <>
        <Suspense
          fallback={
            <Skeleton>
              <ProductInformationGrid
                data={vercelStegaCleanAll(data)}
                mediaGallery={<MediaGallery aspectRatio={aspectRatio} />}
                productDetails={<ProductDetails data={data} />}
              />
            </Skeleton>
          }
        >
          <Await
            errorElement={
              <Skeleton isError>
                <ProductInformationGrid
                  data={vercelStegaCleanAll(data)}
                  mediaGallery={<MediaGallery aspectRatio={aspectRatio} />}
                  productDetails={<ProductDetails data={data} />}
                />
              </Skeleton>
            }
            resolve={variantsPromise}
          >
            {({product}) => {
              const variants = product?.variants?.nodes.length
                ? flattenConnection(product.variants)
                : [];

              return (
                <ProductVariantsContext.Provider value={{variants}}>
                  <ProductInformationGrid
                    data={vercelStegaCleanAll(data)}
                    mediaGallery={<MediaGallery aspectRatio={aspectRatio} />}
                    productDetails={<ProductDetails data={data} />}
                  />
                </ProductVariantsContext.Provider>
              );
            }}
          </Await>
        </Suspense>
      </>
    );
  }

  return (
    <ProductInformationGrid
      data={vercelStegaCleanAll(data)}
      mediaGallery={<MediaGallery aspectRatio={aspectRatio} />}
      productDetails={<ProductDetails data={data} />}
    />
  );
}

function ProductInformationGrid({
  data,
  mediaGallery,
  productDetails,
}: {
  data: ProductInformationSectionProps;
  mediaGallery: React.ReactNode;
  productDetails: React.ReactNode;
}) {
  return (
    <div className="container-w-padding pt-6 md:pt-12">
      <div className={cn('grid gap-10 lg:grid-cols-12')}>
        <div
          className={cn(
            'lg:col-span-6',
          )}
        >
          {mediaGallery}
        </div>
        <div
          className={cn(
            'lg:col-span-6',
            'lg:mt-6'
          )}
        >
          {productDetails}
        </div>
      </div>
    </div>
  );
}

export const ProductVariantsContext =
  createContext<ProductVariantsContextType | null>(null);

export function useProductVariants() {
  return useContext(ProductVariantsContext);
}
