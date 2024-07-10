import type {TypeFromSelection} from 'groqd';

import {cx} from 'class-variance-authority';
import Autoplay from 'embla-carousel-autoplay';
import {useInView} from 'framer-motion';
import {useMemo, useRef} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {CAROUSEL_SECTION_FRAGMENT} from '~/qroq/sections';

import {useDevice} from '~/hooks/useDevice';

import type {StructuredLinkProps} from '../sanity/link/StructuredLink';

import {SanityImage} from '../sanity/SanityImage';
import {StructuredLink} from '../sanity/link/StructuredLink';
import {ArrowLink} from '../ui/ArrowLink';
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
  const inView = useInView(ref);
  
  let slidesPerViewDesktop = 3;
  const device = useDevice();
  if ('mobile' === device) {
    slidesPerViewDesktop = 1;
  } else if ('tablet' === device) {
    slidesPerViewDesktop = 2;
  }

  return (
    <div className="pt-6 pb-6 md:pt-16 md:pb-16" ref={ref}>
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
          <div
            className={cx(
              'container-w-padding',
              'flex',
              introLinks.length > 1 ? 'flex-col md:flex-row gap-4 md:items-end md:justify-between' : 'flex-row gap-4 justify-between items-center mb-4',
            )}
          >
            {introLinks.length && (
              <ul
                className={cx(
                  'flex flex-col gap-2 text-left md:gap-4',
                  introLinks.length > 1 ? 'md:mb-8 md:order-2' : 'order-1',
                )}
              >
                {introLinks
                  .filter((l) => l.structuredLink)
                  .map((introLink) => (
                    <li key={introLink._key}>
                      <StructuredLink
                        className={cx('text-cream', 'flex md:justify-end')}
                        key={introLink._key}
                        {...(introLink.structuredLink as StructuredLinkProps)}
                      >
                        <ArrowLink
                          size={introLinks.length > 1 ? 'large' : 'default'}
                          variant="primary"
                        >
                          {introLink.structuredLink?.title}
                        </ArrowLink>
                      </StructuredLink>
                    </li>
                  ))}
              </ul>
            )}
            <div
              className={cx(
                'text-marble',
                introLinks.length > 1 ? 'order-1 mb-4 ml-[-11px] sm:ml-0' : 'order-2 mr-[-11px] sm:mr-0',
              )}
            >
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>
          <div className="relative">
            <CarouselContent
              className='md:ml-[--container-padding] md:pl-0 md:pr-0 pl-[--container-padding] pr-[--container-padding]'
            >
              {slides.map((slide) => (
                <CarouselItem className="[&>span]:h-full" key={slide._key}>
                  <SanityImage
                    aspectRatio='5/4'
                    className="size-full object-cover"
                    data={slide.image}
                    loading={inView ? 'eager' : 'lazy'}
                    showBorder={false}
                    showShadow={false}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </Carousel>
      )}
    </div>
  );
}
