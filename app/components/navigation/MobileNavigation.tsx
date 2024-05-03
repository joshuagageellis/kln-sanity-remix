import { m } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ClientOnly } from 'remix-utils/client-only';

import { useDevice } from '~/hooks/useDevice';
import { cn } from '~/lib/utils';

import type { NavigationProps } from './DesktopNavigation';
import type { SanityNestedNavigationProps } from './NestedNavigation';

import { IconMenu } from '../icons/IconMenu';
import { SanityExternalLink } from '../sanity/link/SanityExternalLink';
import { SanityInternalLink } from '../sanity/link/SanityInternalLink';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '../ui/Accordion';
import { ScrollArea } from '../ui/ScrollArea';

export function MobileNavigation(props: { data?: NavigationProps }) {
  const {
    data,
  } = props;

  const [open, setOpen] = useState(false);
  // Used to restore scroll to top if opened while alert is visible.
  const [activeAlert, setActiveAlert] = useState(false);
  const device = useDevice();

  const handleOpen = useCallback((action: boolean) => {
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
      const firstItem = document.getElementById('mobile-menu')?.querySelectorAll('a')[0];
      if (firstItem) {
        firstItem.focus();
      }
    }

    setOpen(action);
  }, [setOpen, setActiveAlert, activeAlert])

  if ('mobile' !== device && open) {
    handleOpen(false);
  }

  // Keyboard event listeners.
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      handleOpen(false);
    }
  }, [handleOpen, open]);

  const handleExtraneousTrigger = useCallback((e: MouseEvent) => {
    if (open) {
      handleOpen(false);
    }
  }, [handleOpen, open])

  useEffect(() => {
    const mainLogo = document.querySelector('#main-logo-link') as HTMLAnchorElement;
    window.addEventListener('keydown', handleKeyDown);
    mainLogo?.addEventListener('mousedown', handleExtraneousTrigger);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      mainLogo?.removeEventListener('mousedown', handleExtraneousTrigger);
    }
  }, [handleKeyDown, handleExtraneousTrigger])

  return (
    <div className='md:hidden' id="mobile-nav">
      <button
        className="text-cream h-[44px] w-[44px] p-2 flex items-center justify-center"
        onClick={() => handleOpen(!open)}
      >
        <IconMenu className='w-[24px] h-auto' menuState={open} />
      </button>

      {/* Render Menu In Portal */}
      <ClientOnly>
        {() => createPortal(
          <MobileMenuModal data={data} handleOpen={handleOpen} open={open} />,
          document.body
        )}
      </ClientOnly>
    </div>
  )
}

const mobileMenuLinkClass = cn([
  'text-cream',
  'mobile-nav-link' // Custom class
])

function MobileMenuModal(props: { data?: NavigationProps, handleOpen: (action: boolean) => void, open: boolean }) {
  useMobileMenuOffset();
  const { data, handleOpen, open } = props;
  return (
    <m.div
      animate={{
        opacity: open ? 1 : 0,
        transition: { duration: 0.2 },
        x: open ? 0 : '100%',
      }}
      className="bg-charcoal w-[100vw] h-[100vh] fixed z-50 top-[var(--mobile-menu-offset)]"
      id="mobile-menu"
      initial={false}
    >
      <ScrollArea
        className="h-full container-w-padding"
      >
        <nav className="mb-[var(--mobile-menu-offset)]">
          <ul className="mt-8 flex flex-col gap-4">
            {props.data &&
              props.data?.length > 0 &&
              props.data?.map((item) => (
                <li key={item._key}>
                  {item._type === 'internalLink' && (
                    <SanityInternalLink
                      className={mobileMenuLinkClass}
                      data={item}
                      onClick={() => handleOpen(false)}
                    />
                  )}
                  {item._type === 'externalLink' && (
                    <SanityExternalLink className={mobileMenuLinkClass} data={item} />
                  )}
                  {item._type === 'nestedNavigation' && (
                    <MobileNavigationNested data={item} handleOpen={handleOpen} />
                  )}
                </li>
              ))}
          </ul>
        </nav>
      </ScrollArea>
    </m.div>
  )
}

const mobileMenuSubLinkClass = cn([
  'text-cream',
  'mobile-nav-sub-link' // Custom class
])

// Accordion like nested navigation.
function MobileNavigationNested(props: {
  data: SanityNestedNavigationProps
  handleOpen: (action: boolean) => void
}) {
  const {
    data,
    handleOpen
  } = props;

  const uuid = data._key;
  if (!uuid) return null;

  return (
    <Accordion
      collapsible
      type='single'
    >
      <AccordionItem
        value={uuid}
      > 
        <AccordionTrigger
          className="text-cream mobile-nav-accordion flex flex-row justify-between items-center w-full"
        >
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
          <ul
            className="flex flex-col gap-4 mt-6"
          >
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
  )
}

const useMobileMenuOffset = () => {
  const calcOffset = useCallback(() => {
    const header = document.getElementById('main-header');
    const hHeight = header?.offsetHeight || 0;
    document.documentElement.style.setProperty('--mobile-menu-offset', `${hHeight}px`);
  }, [])

  useEffect(() => {
    calcOffset();
    window.addEventListener('resize', calcOffset);
    window.addEventListener('scroll', calcOffset);

    return () => {
      window.removeEventListener('resize', calcOffset);
      window.removeEventListener('scroll', calcOffset);
    }
  }, [calcOffset])
}
