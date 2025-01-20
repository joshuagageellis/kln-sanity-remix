import {Link} from '@remix-run/react';
import {cx} from 'class-variance-authority';
import {useScroll} from 'framer-motion';
import {useEffect, useState} from 'react';

import {CartDrawer} from '~/components/layout/CartDrawer';
import {Logo} from '~/components/layout/Logo';
import {DesktopNavigation} from '~/components/navigation/DesktopNavigation';
import {MobileNavigation} from '~/components/navigation/MobileNavigation';
import {useSanityRoot} from '~/hooks/useSanityRoot';


export const Header = () => {
  const {data} = useSanityRoot();
  const {scrollY} = useScroll();
  const headerData = data?.header;
  
  /**
   * Match the header background color to the theme color.
   * Only applies to page & case study routes.
   */
  const [scrollPos, setScrollPos] = useState(0);
  useEffect(() => {
    return scrollY.on('change', (current) => {
      setScrollPos(current);
    });
  }, [scrollY, setScrollPos]);

  const classes = cx([
    'main-header', // Used in stylesheet.
    'text-[--header-color]',
    'bg-[--header-bg]',
    'sticky top-0 z-[88] group lg:mb-[40px] lg:h-[86px]',
    scrollPos > 126 ? 'scrolled' : '',
  ]);

  return (
    <header className={classes} id="main-header">
      <div
        className={
          cx([
            "container-w-padding pt-2 pb-2 lg:h-[126px] lg:group-[.scrolled]:h-[86px]",      
            "flex w-full flex-row content-center justify-between gap-4 lg:justify-normal lg:gap-12",
            "transition-all duration-300",
            'bg-[--header-bg]',
          ])}
      >
        <Link
          className="flex origin-left flex-col content-center justify-center transition-all duration-300"
          // Used in mobile menu.
          id="main-logo-link"
          to="/"
          unstable_viewTransition
        >
          <span className="sr-only">Home</span>
          <Logo
            className="h-auto w-full max-w-[140px] md:max-w-[180px] lg:max-w-[220px]"
            loading="eager"
          />
        </Link>
        <DesktopNavigation data={headerData?.menu} />
        <div className="flex flex-row justify-center">
          <MobileNavigation callToAction={headerData?.callToAction} data={headerData?.menu} />
          <div className="flex flex-col justify-center content-center">
            <CartDrawer />
          </div>
        </div>
      </div>
    </header>
  );
};
