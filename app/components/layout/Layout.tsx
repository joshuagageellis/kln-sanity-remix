import {ShopifyProvider} from '@shopify/hydrogen-react';
import {Suspense, lazy} from 'react';

import {useRootLoaderData} from '~/root';

import {TailwindIndicator} from '../TailwindIndicator';
import {TogglePreviewMode} from '../sanity/TogglePreviewMode';
import {AnnouncementBar} from './AnnoucementBar';
import {Footer} from './Footer';
import {FramerMotion} from './FramerMotion';
import {Header} from './Header';

const VisualEditing = lazy(() =>
  import('~/components/sanity/VisualEditing').then((mod) => ({
    default: mod.VisualEditing,
  })),
);

export type LayoutProps = {
  children?: React.ReactNode;
};

export function Layout({children = null}: LayoutProps) {
  const {env, locale, sanityPreviewMode} = useRootLoaderData();

  return (
    <ShopifyProvider
      countryIsoCode={locale.country || 'US'}
      languageIsoCode={locale.language || 'EN'}
      storeDomain={env.PUBLIC_STORE_DOMAIN}
      storefrontApiVersion={env.PUBLIC_STOREFRONT_API_VERSION}
      storefrontToken={env.PUBLIC_STOREFRONT_API_TOKEN}
    >
      <FramerMotion>
        <AnnouncementBar />
        <Header />
        <main className="">
          {children}
        </main>
        <Footer />
        <TailwindIndicator />
        {sanityPreviewMode ? (
          <Suspense>
            <VisualEditing />
          </Suspense>
        ) : (
          <TogglePreviewMode />
        )}
      </FramerMotion>
    </ShopifyProvider>
  );
}
