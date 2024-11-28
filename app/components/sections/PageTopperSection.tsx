import type {VariantProps} from 'class-variance-authority';
import type {TypeFromSelection} from 'groqd';

import {cva} from 'class-variance-authority';
import {m} from 'framer-motion';
import {useContext, useEffect} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {PAGE_TOPPER_SECTION_FRAGMENT} from '~/qroq/sections';

import {cleanString} from '~/components/sanity/CleanString';
import {cn} from '~/lib/utils';
import { ThemeContext, ThemeContextActionType } from '~/root';

import {StructuredLink} from '../sanity/link/StructuredLink';
import {Button} from '../ui/Button';

type PageTopperSectionProps = TypeFromSelection<
  typeof PAGE_TOPPER_SECTION_FRAGMENT
>;

const topperVariants = cva([], {
  defaultVariants: {
    bgColor: 'citrus',
  },
  variants: {
    bgColor: {
      charcoal: 'bg-charcoal text-cream',
      citrus: 'bg-citrus text-charcoal',
      salsa: 'bg-salsa text-charcoal',
    },
  },
});

export function PageTopperSection(
  props: SectionDefaultProps & {data: PageTopperSectionProps},
) {
  const {setTheme} = useContext(ThemeContext);
  const {data} = props;
  const {bgColor, deck, displayButton, link, subtitle, title} = data;
  const useBgColor = cleanString(bgColor) || 'citrus';

  useEffect(() => {
    setTheme({payload: useBgColor, type: ThemeContextActionType.SET_TOPPER});

    return () => {
      setTheme({type: ThemeContextActionType.RESET_TOPPER});
    };
  }, [useBgColor, setTheme]);

  return (
    <div
      className={cn(
        topperVariants({
          bgColor: useBgColor as VariantProps<typeof topperVariants>['bgColor'],
        }),
      )}
      data-color={useBgColor}
    >
      <div className="container-w-padding site-grid pb-6 pt-16 md:pb-12 md:pt-24 lg:pt-32">
        <div
          className="col-span-full flex flex-col"
        >
          {title && (
            <m.h1
              animate={{opacity: 1}}
              className="h1-super order-2 max-w-[980px]"
              initial={{opacity: 0}}
              transition={{delay: 0.2, duration: 0.6}}
            >
              {title}
            </m.h1>
          )}
          {subtitle && (
            <m.h2
              animate={{opacity: 1}}
              className="h6 order-1 mb-1 uppercase"
              initial={{opacity: 0}}
              transition={{delay: 0.6, duration: 0.6}}
            >
              {subtitle}
            </m.h2>
          )}
          {deck && (
            <m.p
              animate={{opacity: 1}}
              className="order-3 mt-2 max-w-[480px] md:mt-4 lg:max-w-[640px]"
              initial={{opacity: 0}}
              transition={{delay: 0.6, duration: 0.6}}
            >
              {deck}
            </m.p>
          )}
        </div>
        {displayButton && link && (
          <m.div
						animate={{opacity: 1}}
						className="col-span-full mt-8"
						initial={{opacity: 0}}
						transition={{delay: 0.6, duration: 0.6}}>
            <Button
              asChild
              variant={useBgColor === 'charcoal' ? 'outlineDark' : 'outline'}
            >
              <StructuredLink
                className="min-w-[180px] lg:min-w-[220px]"
                {...link}
              >
                {link.title}
              </StructuredLink>
            </Button>
          </m.div>
        )}
      </div>
    </div>
  );
}
