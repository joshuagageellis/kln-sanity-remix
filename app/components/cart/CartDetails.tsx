import type {Cart as CartType} from '@shopify/hydrogen/storefront-api-types';
import type {Variants} from 'framer-motion';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

import {CartForm} from '@shopify/hydrogen';
import {AnimatePresence} from 'framer-motion';
import {useMemo} from 'react';

import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';

import type {CartLayouts} from './Cart';

import {ProgressiveMotionDiv} from '../ProgressiveMotionDiv';
import {ShopifyMoney} from '../ShopifyMoney';
import {IconLoader} from '../icons/IconLoader';
import {Button} from '../ui/Button';
import {Card, CardContent} from '../ui/Card';
import {CartDiscounts} from './CartDiscounts';
import {CartLines} from './CartLines';

export function CartDetails({
  checkoutUrl,
  cost,
  discountCodes,
  layout,
  lines,
  onClose,
  totalQuantity,
}: {
  checkoutUrl?: string;
  cost?: CartApiQueryFragment['cost'];
  discountCodes: CartType['discountCodes'];
  layout: CartLayouts;
  lines?: CartApiQueryFragment['lines'];
  onClose?: () => void;
  totalQuantity?: number;
}) {
  // @todo: get optimistic cart cost
  const cartHasItems = totalQuantity && totalQuantity > 0;

  const drawerMotionVariants: Variants = {
    hide: {
      height: 0,
    },
    show: {
      height: 'auto',
    },
  };

  const pageMotionVariants: Variants = {
    hide: {
      opacity: 0,
      transition: {
        duration: 0,
      },
    },
    show: {
      opacity: 1,
    },
  };

  return (
    <CartDetailsLayout layout={layout}>
      <CartLines layout={layout} lines={lines} onClose={onClose} />
      <div
        className={cn([
          layout === 'page' && 'col-span-full md:col-span-5',
        ])}
      >
        <AnimatePresence>
          {cartHasItems && (
            <ProgressiveMotionDiv
              animate="show"
              className={cn([
                layout === 'page' &&
                  'lg:sticky lg:top-[var(--header-height)]',
              ])}
              exit="hide"
              forceMotion={layout === 'drawer'}
              initial="show"
              variants={
                layout === 'drawer' ? drawerMotionVariants : pageMotionVariants
              }
            >
              <CartSummary cost={cost} layout={layout}>
                <CartDiscounts discountCodes={discountCodes} layout={layout} />
                <CartCheckoutActions checkoutUrl={checkoutUrl} />
              </CartSummary>
            </ProgressiveMotionDiv>
          )}
        </AnimatePresence>
      </div>
    </CartDetailsLayout>
  );
}

function CartDetailsLayout(props: {
  children: React.ReactNode;
  layout: CartLayouts;
}) {
  return props.layout === 'drawer' ? (
    <>{props.children}</>
  ) : (
    <div className="site-grid my-12 md:min-h-[450px]">
      {props.children}
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  const {themeContent} = useSanityThemeContent();
  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);
  const cartIsLoading = Boolean(addToCartFetchers.length);

  return (
    <div className="mt-1 flex flex-col">
      <Button asChild>
        <a
          className={cn(
            (cartIsLoading || !checkoutUrl) &&
              'pointer-events-none cursor-pointer',
          )}
          href={checkoutUrl}
          target="_self"
        >
          {cartIsLoading ? (
            <IconLoader className="size-5 animate-spin" />
          ) : (
            <span>{themeContent?.cart?.proceedToCheckout}</span>
          )}
        </a>
      </Button>
      {/* @todo: <CartShopPayButton cart={cart} /> */}
    </div>
  );
}

function CartSummary({
  children = null,
  cost,
  layout,
}: {
  children?: React.ReactNode;
  cost?: CartApiQueryFragment['cost'];
  layout: CartLayouts;
}) {
  const {themeContent} = useSanityThemeContent();

  const Content = useMemo(
    () => (
      <div
        aria-labelledby="summary-heading"
        className={cn([
          layout === 'drawer' && 'grid gap-2 border-t-[2px] border-charcoal p-6',
          layout === 'page' && 'grid gap-6',
        ])}
      >
        <h2 className="sr-only">{themeContent?.cart?.orderSummary}</h2>
        <dl className="grid">
          <div className="flex items-center justify-between">
            <span className="info-16">{themeContent?.cart?.subtotal}</span>
            {cost?.subtotalAmount &&
              parseFloat(cost.subtotalAmount.amount) > 0 && (
                <span>
                  <ShopifyMoney data={cost?.subtotalAmount} />
                </span>
              )}
          </div>
        </dl>
        {children}
      </div>
    ),
    [children, cost?.subtotalAmount, layout, themeContent],
  );

  if (layout === 'drawer') {
    return Content;
  }

  return (
    <Card className="mt-5">
      <CardContent className={cn([
        layout === 'page' ? '' : 'px-5 py-6 lg:p-8',
      ])}>{Content}</CardContent>
    </Card>
  );
}
