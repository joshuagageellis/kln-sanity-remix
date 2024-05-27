import {m} from 'framer-motion';
import {useCallback, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {ClientOnly} from 'remix-utils/client-only';

import {useDevice} from '~/hooks/useDevice';
import {cn} from '~/lib/utils';

import type {CallToActionProps, NavigationProps} from './DesktopNavigation';
import type {SanityNestedNavigationProps} from './NestedNavigation';

import {IconCircleArrow} from '../icons/IconCircleArrow';
import {IconMenu} from '../icons/IconMenu';
import {SanityExternalLink} from '../sanity/link/SanityExternalLink';
import {SanityInternalLink} from '../sanity/link/SanityInternalLink';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/Accordion';
import {ScrollArea} from '../ui/ScrollArea';

export function MobileNavigation(props: {
  callToAction?: CallToActionProps;
  data?: NavigationProps;
}) {
  const {callToAction, data} = props;

  const [open, setOpen] = useState(false);
  // Used to restore scroll to top if opened while alert is visible.
  const [activeAlert, setActiveAlert] = useState(false);
  const device = useDevice();

  const handleOpen = useCallback(
    (action: boolean) => {
      // If within alert bar scroll, scroll to bottom of alert.
      const alertBar = document.getElementById('announcement-bar');
      if (action) {
        if (alertBar) {
          const alertHeight = alertBar.offsetHeight || 0;
          const scrollY = window.scrollY;
          if (scrollY < alertHeight) {
            alertBar.style.display = 'none';
            setActiveAlert(true);
          } else {
            setActiveAlert(false);
          }
        }
      }

      // Prevent scrolling when mobile menu is open
      if (action) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }

      // Restore alert bar scroll if open.
      if (!action && activeAlert && alertBar) {
        alertBar.style.display = 'block';
        setActiveAlert(false);
      }

      // Set focus to first item on open.
      if (action) {
        const firstItem = document
          .getElementById('mobile-menu')
          ?.querySelectorAll('a')[0];
        if (firstItem) {
          firstItem.focus();
        }
      }

      setOpen(action);
    },
    [setOpen, setActiveAlert, activeAlert],
  );

  if ('mobile' !== device && open) {
    handleOpen(false);
  }

  // Keyboard event listeners.
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        handleOpen(false);
      }
    },
    [handleOpen, open],
  );

  const handleExtraneousTrigger = useCallback(
    (e: MouseEvent) => {
      if (open) {
        handleOpen(false);
      }
    },
    [handleOpen, open],
  );

  useEffect(() => {
    const mainLogo = document.querySelector(
      '#main-logo-link',
    ) as HTMLAnchorElement;
    window.addEventListener('keydown', handleKeyDown);
    mainLogo?.addEventListener('mousedown', handleExtraneousTrigger);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      mainLogo?.removeEventListener('mousedown', handleExtraneousTrigger);
    };
  }, [handleKeyDown, handleExtraneousTrigger]);

  return (
    <div className="lg:hidden" id="mobile-nav">
      <button
        className="flex h-[44px] w-[44px] items-center justify-center p-2 text-marble"
        onClick={() => handleOpen(!open)}
      >
        <IconMenu className="h-auto w-[24px]" menuState={open} />
      </button>

      {/* Render Menu In Portal */}
      <ClientOnly>
        {() =>
          createPortal(
            <MobileMenuModal
              callToAction={callToAction}
              data={data}
              handleOpen={handleOpen}
              open={open}
            />,
            document.body,
          )
        }
      </ClientOnly>
    </div>
  );
}

const mobileMenuLinkClass = cn([
  'text-marble',
  'mobile-nav-link', // Custom class
]);

const mobileMenuCTAClass = cn([
  mobileMenuLinkClass,
  'text-charcoal flex flex-row justify-between items-center gap-4 container-w-padding',
  'pb-4 pt-6 bg-citrus w-full hover:bg-amethyst transition-all duration-200',
  'mobile-nav-cta', // Custom class
]);

function MobileMenuModal(props: {
  callToAction?: CallToActionProps;
  data?: NavigationProps;
  handleOpen: (action: boolean) => void;
  open: boolean;
}) {
  useMobileMenuOffset();
  const {callToAction, data, handleOpen, open} = props;
  return (
    <m.div
      animate={{
        // opacity: open ? 1 : 0,
        transition: {duration: 0.2},
        x: open ? 0 : '100%',
      }}
      className="fixed top-[var(--mobile-menu-offset)] z-50 h-[calc(100vh-var(--mobile-menu-offset))] w-[100vw] bg-charcoal"
      id="mobile-menu"
      initial={false}
    >
      <div className="mb-[var(--mobile-menu-offset)] flex h-full flex-col justify-between">
        <ScrollArea className="container-w-padding">
          <div className="flex flex-col justify-between">
            <nav>
              <ul className="mt-8 flex flex-col gap-4">
                {data &&
                  data?.length > 0 &&
                  data?.map((item: any) => (
                    <li key={item._key}>
                      {item._type === 'internalLink' && (
                        <SanityInternalLink
                          className={mobileMenuLinkClass}
                          data={item}
                          onClick={() => handleOpen(false)}
                        />
                      )}
                      {item._type === 'externalLink' && (
                        <SanityExternalLink
                          className={mobileMenuLinkClass}
                          data={item}
                        />
                      )}
                      {item._type === 'nestedNavigation' && (
                        <MobileNavigationNested
                          data={item}
                          handleOpen={handleOpen}
                        />
                      )}
                    </li>
                  ))}
              </ul>
            </nav>
          </div>
        </ScrollArea>
        {callToAction && (
          <div className="mt-6">
            {callToAction.link ? (
              <SanityInternalLink
                className={cn([
                  mobileMenuLinkClass,
                  'container-w-padding flex flex-row items-center justify-between gap-4 text-charcoal',
                  'w-full bg-citrus pb-4 pt-6 transition-all duration-200 hover:bg-amethyst',
                  'mobile-nav-cta', // Custom class
                ])}
                data={{
                  _key: 'mobileNavCTA',
                  _type: 'internalLink',
                  anchor: null,
                  link: callToAction.link,
                  name: callToAction.text,
                }}
                onClick={() => handleOpen(false)}
              >
                <span>{callToAction.text}</span>
                <span>
                  <IconCircleArrow />
                </span>
              </SanityInternalLink>
            ) : (
              callToAction.externalLink && (
                <SanityExternalLink
                  className={mobileMenuCTAClass}
                  data={{
                    _key: 'mobileNavCTA',
                    _type: 'externalLink',
                    link: callToAction.externalLink,
                    name: callToAction.text,
                    openInNewTab: callToAction.openInNewTab,
                  }}
                >
                  <span>{callToAction.text}</span>
                  <span>
                    <IconCircleArrow />
                  </span>
                </SanityExternalLink>
              )
            )}
          </div>
        )}
      </div>
    </m.div>
  );
}

const mobileMenuSubLinkClass = cn([
  'text-cream',
  'mobile-nav-sub-link', // Custom class
]);

// Accordion like nested navigation.
function MobileNavigationNested(props: {
  data: SanityNestedNavigationProps;
  handleOpen: (action: boolean) => void;
}) {
  const {data, handleOpen} = props;

  const uuid = data._key;
  if (!uuid) return null;

  return (
    <Accordion collapsible type="single">
      <AccordionItem value={uuid}>
        <AccordionTrigger className="mobile-nav-accordion flex w-full flex-row items-center justify-between text-cream">
          <SanityInternalLink
            className={mobileMenuLinkClass}
            data={{
              _key: data._key,
              _type: 'internalLink',
              anchor: null,
              link: data.link,
              name: data.name,
            }}
            onClick={() => handleOpen(false)}
          />
        </AccordionTrigger>
        <AccordionContent>
          <ul className="mt-6 flex flex-col gap-4">
            {data.childLinks &&
              data.childLinks.length > 0 &&
              data.childLinks.map((child) => (
                <li key={child._key}>
                  {child._type === 'internalLink' ? (
                    <SanityInternalLink
                      className={mobileMenuSubLinkClass}
                      data={child}
                      onClick={() => handleOpen(false)}
                    />
                  ) : child._type === 'externalLink' ? (
                    <SanityExternalLink
                      className={mobileMenuSubLinkClass}
                      data={child}
                    />
                  ) : null}
                </li>
              ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const useMobileMenuOffset = () => {
  const calcOffset = useCallback(() => {
    const header = document.getElementById('main-header');
    const hHeight = header?.offsetHeight || 0;
    document.documentElement.style.setProperty(
      '--mobile-menu-offset',
      `${hHeight}px`,
    );
  }, []);

  useEffect(() => {
    calcOffset();
    window.addEventListener('resize', calcOffset);
    window.addEventListener('scroll', calcOffset);

    return () => {
      window.removeEventListener('resize', calcOffset);
      window.removeEventListener('scroll', calcOffset);
    };
  }, [calcOffset]);
};
