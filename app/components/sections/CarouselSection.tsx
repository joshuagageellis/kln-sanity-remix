import type {TypeFromSelection} from 'groqd';

import { cx } from 'class-variance-authority';
import Autoplay from 'embla-carousel-autoplay';
import {useInView} from 'framer-motion';
import {useMemo, useRef} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {CAROUSEL_SECTION_FRAGMENT} from '~/qroq/sections';

import {useDevice} from '~/hooks/useDevice';

import type { StructuredLinkProps } from '../sanity/link/StructuredLink';

import {SanityImage} from '../sanity/SanityImage';
import { StructuredLink } from '../sanity/link/StructuredLink';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPagination,
  CarouselPrevious,
} from '../ui/Carousel';

type CarouselSectionProps = TypeFromSelection<typeof CAROUSEL_SECTION_FRAGMENT>;

// const ProductCard
// const PageCard

export function CarouselSection(
  props: SectionDefaultProps & {data: CarouselSectionProps},
) {
  const {data} = props;
  const {displayStyle, introLinks, slides} = data;
  const ref = useRef<HTMLDivElement>(null);
  const slidesPerViewDesktop = 3;
  const inView = useInView(ref);

  const device = useDevice();

  console.log(introLinks, slides);


  return (
    <div className="container" ref={ref}>
      {introLinks.length && (
        <div className={cx(
          '',
          introLinks.length > 1 ? '' : '',
        )}>
          {introLinks.filter((l) => l.structuredLink).map((introLink) => (
            <StructuredLink
              className=""
              key={introLink._key}
              {...introLink.structuredLink as StructuredLinkProps}
            >
              {introLink.structuredLink?.title}
              Test
            </StructuredLink>
          ))}
        </div>
      )}
      {slides && slides?.length > 0 && (
        <Carousel
          className="mt-4 [--slide-spacing:12px]"
          opts={{
            loop: false,
          }}
          style={
            {
              '--slides-per-view': slidesPerViewDesktop,
            } as React.CSSProperties
          }
        >
          <div className="relative">
            <CarouselContent>
              {slides.map((slide) => (
                <CarouselItem className="[&>span]:h-full" key={slide._key}>
                  <SanityImage
                    className="size-full object-cover"
                    data={slide.image}
                    loading={inView ? 'eager' : 'lazy'}
                    showBorder={false}
                    showShadow={false}
                    // sizes={imageSizes}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>            
            <div className="hidden md:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>
          {/* {pagination && isActive && <CarouselPagination />} */}
        </Carousel>
      )}
    </div>
  );
}
