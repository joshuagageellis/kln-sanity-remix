import type {HydrogenImageProps} from '@shopify/hydrogen-react/Image';
import type {ImageFragmentFragment} from 'storefrontapi.generated';

import {Image, parseGid} from '@shopify/hydrogen';

import {cn} from '~/lib/utils';

/**
 * `ShopifyImage` is a wrapper around the `Image` component from `@shopify/hydrogen`.
 * It displays a Shopify image with a blur effect preview while the image is loading.
 */
export function ShopifyImage({
  className,
  data,
  parentClass,
  ...props
}: {
  className?: string;
  data: ImageFragmentFragment;
  parentClass?: string;
} & HydrogenImageProps) {
  const id = parseGid(data.id || undefined).id;
  // No padding should be applied to the wrapper <span/> or the <img/> tag to avoid blurry LQIP becoming visible
  return (
    <span
      className={cn(
        'relative block overflow-hidden !p-0',
        parentClass,
      )}
      id={id ? `img-${id}` : undefined}
    >
      <Image
        className={cn('relative z-[1]', className, '!p-0')}
        data={data}
        {...props}
      />
      {id && (
        <style
          // Blurry bg image used as LQIP (Low Quality Image Placeholder)
          // while high quality image is loading.
          dangerouslySetInnerHTML={{
            __html: `
              #img-${id}::before {
                content: "";
                position: absolute;
                background: url(${data.thumbnail});
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                filter: blur(6px);
              }
            `.trim(),
          }}
        />
      )}
    </span>
  );
}
