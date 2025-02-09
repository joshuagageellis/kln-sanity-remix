import { useLocation } from "@remix-run/react";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (
      option: string,
      gaTrackingId: string,
      options: Record<string, unknown>,
    ) => void;
  }
}

/**
 * @example
 * https://developers.google.com/analytics/devguides/collection/gtagjs/pages
 */
export const pageview = (url: string, trackingId: string) => {
  if (!window.gtag) {
    console.warn(
      "window.gtag is not defined. This could mean your google analytics script has not loaded on the page yet.",
    );
    return;
  }
  window.gtag("config", trackingId, {
    page_path: url,
  });
};

/**
 * @example
 * https://developers.google.com/analytics/devguides/collection/gtagjs/events
 */
export const event = ({
  action,
  category,
  label,
  value,
}: Record<string, string>) => {
  if (!window.gtag) {
    console.warn(
      "window.gtag is not defined. This could mean your google analytics script has not loaded on the page yet.",
    );
    return;
  }
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

interface GTMInstallProps {
  env: string;
  gaTrackingId: string;
  location: Location;
}

export function GTMInstall({
  gtm,
  isDev,
  nonce,
}: {
  gtm: string;
  isDev: boolean;
  nonce: string;
}) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname && gtm && ! isDev) {
      pageview(location.pathname, gtm);
    }
  }, [location, gtm, isDev]);

  if (isDev || !gtm) {
    return null;
  }
  return (
    <>
        <script
          async
          nonce={nonce}
          src={`https://www.googletagmanager.com/gtag/js?id=${gtm}`}
        />
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${gtm}', {
              page_path: window.location.pathname,
            });
          `,
          }}
          id="gtag-init"
          nonce={nonce}
        />
      </>
  )
}