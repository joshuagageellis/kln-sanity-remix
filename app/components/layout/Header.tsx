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

  const [scrollPos, setScrollPos] = useState(0);
  useEffect(() => {
    return scrollY.on('change', (current) => {
      setScrollPos(current);
    });
  }, [scrollY, setScrollPos]);

  const classes = cx([
    'text-cream sticky bg-charcoal top-0 z-[88] group lg:mb-[40px] lg:h-[86px] transition-all',
    scrollPos > 126 ? 'shadow-sm shadow-charcoal scrolled' : '',
  ]);

  return (
    <header className={classes} id="main-header">
      <div className="container-w-padding flex w-full flex-row content-center justify-between gap-4 bg-charcoal pt-2 pb-2 transition-all duration-300 lg:h-[126px] lg:justify-normal lg:gap-12 lg:group-[.scrolled]:h-[86px]">
        <Link
          className="flex origin-left flex-col content-center justify-center transition-all duration-500"
          // Used in mobile menu.
          id="main-logo-link"
          to="/"
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
