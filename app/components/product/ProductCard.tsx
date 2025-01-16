import type {ProductCardFragment} from 'storefrontapi.generated';

import {Link} from '@remix-run/react';
import {vercelStegaCleanAll} from '@sanity/client/stega';
import {flattenConnection} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {cn} from '~/lib/utils';

import {ShopifyImage} from '../ShopifyImage';
import {ShopifyMoney} from '../ShopifyMoney';
import {ProductBadges} from '../blocks/PriceBlock';
import {Card, CardContent, CardMedia} from '../ui/Card';

const InnerProductCard = ({
  ImageComponent,
  PriceComponent,
  path,
  skeleton = false,
  title,
}: {
  ImageComponent: any
  PriceComponent: any
  path: null|string|undefined
  skeleton?: boolean
  title: string
}) => {

  return (
    <div className={cn(
      'group relative',
      skeleton ? 'animate-pulse' : '',
    )}>
      {!skeleton && path && title && (
        <Link
          className="overlay-link absolute left-0 top-0 z-10 h-full w-full"
          prefetch='intent'
          to={path}
        >
          <span className="sr-only">{title}</span>
        </Link>
      )}
      <div className="">
        <div className="aspect-[5/4] relative">
          <ImageComponent />
        </div>
        <div className="data-text mt-3 flex w-full flex-row items-center justify-between gap-2">
          <p className={cn("h5", ! skeleton && 'highlight-hover highlight-hover--citrus')}>
            <span>{title}</span>
          </p>
          <p className="mr-[0.5rem]">
            <PriceComponent />
          </p>
        </div>
      </div>
    </div>
  );
};

export function ProductCard(props: {
  className?: string;
  columns?: {
    desktop?: null | number;
    mobile?: null | number;
  };
  product?: ProductCardFragment;
  skeleton?: {
    cardsNumber?: number;
  };
}) {
  const {columns, product, skeleton} = props;
  const variants = product?.variants?.nodes.length
    ? flattenConnection(product?.variants)
    : null;
  const firstVariant = variants?.[0];
  const sizes = cx([
    '(min-width: 1024px)',
    columns?.desktop ? `${100 / columns.desktop}vw,` : '33vw,',
    columns?.mobile ? `${100 / columns.mobile}vw` : '100vw',
  ]);

  const path = useLocalePath({path: `/products/${product?.handle}`});

  return (
    <>
      {!skeleton && product && firstVariant ? (
        <InnerProductCard
          ImageComponent={() => <>
            {firstVariant?.image && (
              <ShopifyImage
                aspectRatio="5/4"
                className="size-full object-cover"
                crop="center"
                data={firstVariant.image}
                loading="lazy"
                sizes={sizes}
              />
            )}
            <ProductBadges
              layout="card"
              variants={product?.variants.nodes}
            />
          </>}
          PriceComponent={() => <>
            {firstVariant.compareAtPrice && (
              <ShopifyMoney
                className=""
                data={firstVariant.compareAtPrice}
              />
            )}
            <ShopifyMoney
              className=""
              data={firstVariant.price}
            />
          </>}
          path={path}
          title={product.title}
        />
      ) : skeleton ? (
        <InnerProductCard
          ImageComponent={() => <>
            <div
              className={cn(
                'w-full bg-muted',
              )}
            />
          </>}
          PriceComponent={() => <>
            <span className="rounded text-sm md:text-base">
              Skeleton price
            </span>
          </>}
          path={null}
          skeleton
          title="Skeleton product title"
        />
      ) : null}
    </>
  );
}
