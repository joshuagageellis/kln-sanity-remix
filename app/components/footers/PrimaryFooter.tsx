import type {TypeFromSelection} from 'groqd';

import {useLocation} from '@remix-run/react';

import type {SectionDefaultProps} from '~/lib/type';
import type {PRIMARY_FOOTER} from '~/qroq/footers';

import {useLocalePath} from '~/hooks/useLocalePath';

import type { StructuredLinkProps } from '../sanity/link/StructuredLink';

import {SocialMediaButtons} from '../SocialMedia';
import { StructuredLink } from '../sanity/link/StructuredLink';
import { ArrowLink } from '../ui/ArrowLink';
import {MailchimpForm} from './MailchimpForm';

type PrimaryFooterProps = TypeFromSelection<
  typeof PRIMARY_FOOTER
>;

export function PrimaryFooter({data}: SectionDefaultProps & {data: PrimaryFooterProps}) {
  const {
    displaySocial,
    mcTitle,
    navigation,
    structuredLink,
  } = data;

  
  /**
   * Hide the top CTA if on the internally linked page.
  */
  const {pathname} = useLocation();
  const path = useLocalePath({
    path: pathname
  });
  const hideTopCTA = path.replace(/^\/+/g, '') === structuredLink?.reference?.slug?.current

  return (
    <footer className="text-on-dark">
      {structuredLink && !hideTopCTA && (
        <div className="border-y-[2px] border-panther">
          <StructuredLink
            className="transition-all duration-300 block hover:bg-citrus focus-visible:bg-citrus hover:text-charcoal focus-visible:text-charcoal"
            {...(structuredLink as StructuredLinkProps)}
          >
            <ArrowLink
              className="justify-between container-w-padding py-8 md:py-12"
              size="large"
              variant="primary"
            >
              {structuredLink.title}
            </ArrowLink>
          </StructuredLink>
        </div>
      )}
      <div className="container-w-padding site-grid pt-8 md:pt-14 pb-12 md:pb-16 lg:pb-20">
        <div className="col-span-full lg:col-span-5 mb-6 lg:mb-0">
          <MailchimpForm title={mcTitle} />
        </div>
        <div className="col-span-full lg:col-span-5 lg:col-start-7">
          {/* Navigation */}
          {navigation && (
            <nav>
              <ul className="flex flex-col gap-3 md:gap-4 md:flex-row flex-wrap">
                {navigation.map((navItem) => (
                  <li className="md:basis-[calc(50%-0.5rem)]" key={navItem._key}>
                    <StructuredLink
                      {...(navItem.structuredLink as StructuredLinkProps)}
                      className="transition-all duration-300 primary-nav-sub-link hover:text-amethyst focus-visible:text-amethyst"
                    >
                      {navItem.structuredLink?.title}
                    </StructuredLink>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          {displaySocial && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1 mt-4 md:mt-6">
              <SocialMediaButtons />
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}