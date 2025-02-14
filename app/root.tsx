import type {ShouldRevalidateFunction} from '@remix-run/react';
import type {CustomerAccessToken} from '@shopify/hydrogen/storefront-api-types';
import type {
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from '@shopify/remix-oxygen';

import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useMatches,
  useNavigate,
  useRouteError,
} from '@remix-run/react';
/**
 * @todo
 * Upgrade the meta handling to use getSeoMeta:
 * https://shopify.dev/docs/api/hydrogen/2024-04/utilities/getseometa
 */
import {Seo, useNonce} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {DEFAULT_LOCALE} from 'countries';
import {createContext, useEffect, useReducer} from 'react';

import {Layout} from '~/components/layout/Layout';

import type {HydrogenSession} from './lib/hydrogen.session.server';

import faviconAsset from '../public/favicon.ico';
import {generateSanityImageUrl} from './components/sanity/SanityImage';
import {Button} from './components/ui/Button';
import {useAnalytics} from './hooks/useAnalytics';
import {useSanityThemeContent} from './hooks/useSanityThemeContent';
import * as gtag from './lib/gtag';
import {resolveShopifyPromises} from './lib/resolveShopifyPromises';
import {sanityPreviewPayload} from './lib/sanity/sanity.payload.server';
import {seoPayload} from './lib/seo.server';
import {ROOT_QUERY} from './qroq/queries';
import headerCss from './styles/header.css';
import sectionCss from './styles/sections.css';
import tailwindCss from './styles/tailwind.css';
import { GTMInstall } from './lib/gtag';

// This is important to avoid re-fetching root queries on sub-navigations
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  formMethod,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    {
      href: 'https://cdn.shopify.com',
      rel: 'preconnect',
    },
    {
      href: 'https://shop.app',
      rel: 'preconnect',
    },
    {href: tailwindCss, rel: 'stylesheet'},
    {href: headerCss, rel: 'stylesheet'},
    {href: sectionCss, rel: 'stylesheet'},
    {href:"https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&display=swap", rel: 'stylesheet'},
  ];
}

export const meta: MetaFunction<typeof loader> = (loaderData) => {
  const {data} = loaderData;
  return [
    {
      // Preconnect to the Sanity CDN before loading fonts
      href: 'https://cdn.sanity.io',
      rel: 'preconnect',
      tagName: 'link',
    },
    ...generateFaviconUrls(data as SerializeFrom<typeof loader>),
  ];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {cart, env, locale, sanity, sanityPreviewMode, session, storefront} =
    context;
  const language = locale?.language.toLowerCase();
  const customerAccessToken = await session.get('customerAccessToken');

  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    language,
  };

  const rootData = Promise.all([
    sanity.query({
      groqdQuery: ROOT_QUERY,
      params: queryParams,
    }),
    storefront.query(`#graphql
      query layout {
        shop {
          id
        } 
      }
    `),
  ]);

  const [sanityRoot, layout] = await rootData;

  const seo = seoPayload.root({
    root: sanityRoot.data,
    sanity: {
      dataset: env.SANITY_STUDIO_DATASET,
      projectId: env.SANITY_STUDIO_PROJECT_ID,
    },
    url: request.url,
  });

  // validate the customer access token is valid
  const {headers, isLoggedIn} = await validateCustomerAccessToken(
    session,
    customerAccessToken,
  );

  const {
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
  } = resolveShopifyPromises({
    document: sanityRoot,
    request,
    storefront,
  });

  // defer the cart query by not awaiting it
  const cartPromise = cart.get();

  return defer(
    {
      analytics: {
        shopId: layout.shop.id,
        shopifySalesChannel: locale.salesChannel,
      },
      cart: cartPromise,
      collectionListPromise,
      env: {
        GTM_ID: env.GTM_ID,
        /*
         * Be careful not to expose any sensitive environment variables here.
         */
        NODE_ENV: env.NODE_ENV,
        PUBLIC_STORE_DOMAIN: env.PUBLIC_STORE_DOMAIN,
        PUBLIC_STOREFRONT_API_TOKEN: env.PUBLIC_STOREFRONT_API_TOKEN,
        PUBLIC_STOREFRONT_API_VERSION: env.PUBLIC_STOREFRONT_API_VERSION,
        SANITY_STUDIO_API_VERSION: env.SANITY_STUDIO_API_VERSION,
        SANITY_STUDIO_DATASET: env.SANITY_STUDIO_DATASET,
        SANITY_STUDIO_PROJECT_ID: env.SANITY_STUDIO_PROJECT_ID,
        SANITY_STUDIO_URL: env.SANITY_STUDIO_URL,
        SANITY_STUDIO_USE_PREVIEW_MODE: env.SANITY_STUDIO_USE_PREVIEW_MODE,
      },
      featuredCollectionPromise,
      featuredProductPromise,
      isLoggedIn,
      locale,
      sanityPreviewMode,
      sanityRoot,
      seo,
      ...sanityPreviewPayload({
        context,
        params: queryParams,
        query: ROOT_QUERY.query,
      }),
    },
    {headers},
  );
}

/**
 * Theme context provider.
 * Used for setting the theme color of the topper.
 * Good place to add additional color/themematic changes that rely on route data.
 */
export enum ThemeContextActionType {
  RESET_TOPPER = 'RESET_TOPPER',
  SET_TOPPER = 'SET_TOPPER',
}

interface ThemeContextAction {
  payload?: string;
  type: ThemeContextActionType;
}

interface ThemeContextState {
  dataTopperColor: string;
}

export const themeContextDefault: ThemeContextState = {
  dataTopperColor: 'charcoal',
}

const themeReducer = (state: ThemeContextState, action: ThemeContextAction): ThemeContextState => {
  switch (action.type) {
    case ThemeContextActionType.SET_TOPPER:
      if (!action.payload) {
        return state;
      }
      return {
        ...state,
        dataTopperColor: action.payload,
      };
    case ThemeContextActionType.RESET_TOPPER:
      return {
        ...state,
        dataTopperColor: themeContextDefault.dataTopperColor,
      };
    default:
      return state;
  }
};

export const ThemeContext = createContext<{
  setTheme: (action: ThemeContextAction) => void;
  theme: ThemeContextState;
}>({
  setTheme: () => {},
  theme: themeContextDefault,
});

export default function App() {
  const nonce = useNonce();
  const {env, locale} = useRootLoaderData();
  const hasUserConsent = true;
  const [theme, setTheme] = useReducer<React.Reducer<ThemeContextState, ThemeContextAction>>(themeReducer, themeContextDefault);

  useAnalytics(hasUserConsent);

  return (
    <ThemeContext.Provider value={{
      setTheme,
      theme,
    }}>
      <html data-topper-color={theme.dataTopperColor} lang={locale.language.toLowerCase()}>
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width,initial-scale=1" name="viewport" />
          <Meta />
          {/* <Seo /> */}
          <Links />
        </head>
        <body className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
          <GTMInstall gtm={env.GTM_ID} isDev={env.NODE_ENV === "development"} nonce={nonce} />
          <Layout>
            <Outlet />
          </Layout>
          <ScrollRestoration nonce={nonce} />
          <Scripts nonce={nonce} />
          <LiveReload nonce={nonce} />
        </body>
      </html>
    </ThemeContext.Provider>
  );
}

export function ErrorBoundary() {
  const nonce = useNonce();
  const routeError = useRouteError();
  const {locale} = useRootLoaderData();
  const isRouteError = isRouteErrorResponse(routeError);
  const {themeContent} = useSanityThemeContent();
  const errorStatus = isRouteError ? routeError.status : 500;
  const navigate = useNavigate();

  let title = themeContent?.error?.serverError;
  let pageType = 'page';

  if (isRouteError) {
    title = themeContent?.error?.pageNotFound;
    if (errorStatus === 404) pageType = routeError.data || pageType;
  }

  return (
    <html lang={locale.language.toLowerCase()}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
        <Layout>
          <section>
            <div className="container-w-padding bg-cream flex flex-col items-center justify-center py-20 text-center">
              <span className="info-16">{errorStatus}</span>
              <h1 className="mt-5">{title}</h1>
              {errorStatus === 404 ? (
                <Button asChild className="mt-6" variant="default">
                  <Link to={'/'}>
                    Return Home
                  </Link>
                </Button>
              ) : (
                <Button
                  className="mt-6"
                  onClick={() => navigate(0)}
                  variant="default"
                >
                  {themeContent?.error?.reloadPage}
                </Button>
              )}
            </div>
          </section>
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

/**
 * Validates the customer access token and returns a boolean and headers
 * @see https://shopify.dev/docs/api/storefront/latest/objects/CustomerAccessToken
 *
 * @example
 * ```js
 * const {isLoggedIn, headers} = await validateCustomerAccessToken(
 *  customerAccessToken,
 *  session,
 * );
 * ```
 */
async function validateCustomerAccessToken(
  session: HydrogenSession,
  customerAccessToken?: CustomerAccessToken,
) {
  let isLoggedIn = false;
  const headers = new Headers();
  if (!customerAccessToken?.accessToken || !customerAccessToken?.expiresAt) {
    return {headers, isLoggedIn};
  }

  const expiresAt = new Date(customerAccessToken.expiresAt).getTime();
  const dateNow = Date.now();
  const customerAccessTokenExpired = expiresAt < dateNow;

  if (customerAccessTokenExpired) {
    session.unset('customerAccessToken');
    headers.append('Set-Cookie', await session.commit());
  } else {
    isLoggedIn = true;
  }

  return {headers, isLoggedIn};
}

function generateFaviconUrls(loaderData: SerializeFrom<typeof loader>) {
  const {env, sanityRoot} = loaderData;
  const favicon = sanityRoot.data?.settings?.favicon;

  if (!favicon) {
    return [
      {
        href: faviconAsset,
        rel: 'icon',
        tagName: 'link',
        type: 'image/x-icon',
      },
    ];
  }

  const faviconUrl = generateSanityImageUrl({
    dataset: env.SANITY_STUDIO_DATASET,
    height: 32,
    projectId: env.SANITY_STUDIO_PROJECT_ID,
    ref: favicon?._ref,
    width: 32,
  });

  const appleTouchIconUrl = generateSanityImageUrl({
    dataset: env.SANITY_STUDIO_DATASET,
    height: 180,
    projectId: env.SANITY_STUDIO_PROJECT_ID,
    ref: favicon?._ref,
    width: 180,
  });

  return [
    {
      href: faviconUrl,
      rel: 'icon',
      tagName: 'link',
      type: 'image/x-icon',
    },
    {
      href: appleTouchIconUrl,
      rel: 'apple-touch-icon',
      tagName: 'link',
    },
    {
      href: appleTouchIconUrl,
      rel: 'apple-touch-icon-precomposed',
      tagName: 'link',
    },
  ];
}
