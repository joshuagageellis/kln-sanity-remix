import type { CSSProperties } from 'react';
import type {ProductRecommendationsQuery} from 'storefrontapi.generated';

import {ProductCardGrid} from './ProductCardGrid';

export function RelatedProducts(props: {
  columns?: {
    desktop?: null | number;
    mobile?: null | number;
  };
  data: ProductRecommendationsQuery | null;
  heading?: null | string;
  maxProducts: number;
}) {
  const {data} = props;
  const products = data ? getRecommendedProducts(data, props.maxProducts) : [];

  if (products.length === 0) return null;

  return (
    <div
      style={{
        '--grid-horizontal-space': '0.5rem',
        '--grid-vertical-space': '1rem',
      } as CSSProperties}
    >
      {props.heading && <h2 className="h3 text-charcoal">{props.heading}</h2>}
      <div className="mt-2 lg:mt-3">
        <ProductCardGrid
          columns={{
            desktop: props.columns?.desktop,
          }}
          products={products}
        />
      </div>
    </div>
  );
}

function getRecommendedProducts(
  data: ProductRecommendationsQuery,
  maxProducts: number,
) {
  const mergedProducts = (data.recommended ?? [])
    .concat(data.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === data.mainProduct?.id,
  );

  mergedProducts.splice(originalProduct, 1);

  if (mergedProducts.length > maxProducts) {
    mergedProducts.splice(maxProducts);
  }

  return mergedProducts;
}
