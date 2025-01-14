import type {TypeFromSelection} from 'groqd';

import {cx} from 'class-variance-authority';
import {m, useInView} from 'framer-motion';
import {useRef} from 'react';

import type {ArrayMember, SectionDefaultProps} from '~/lib/type';
import type {CAROUSEL_SECTION_FRAGMENT} from '~/qroq/sections';

import {useDevice} from '~/hooks/useDevice';
import {cn} from '~/lib/utils';

import type {StructuredLinkProps} from '../sanity/link/StructuredLink';

import {SanityImage} from '../sanity/SanityImage';
import {StructuredLink} from '../sanity/link/StructuredLink';
import {ArrowLink} from '../ui/ArrowLink';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/Carousel';

type CarouselSectionProps = TypeFromSelection<typeof CAROUSEL_SECTION_FRAGMENT>;

export type CarouselCardProps = {
  inView: boolean;
  slide: ArrayMember<CarouselSectionProps['slides']>;
};

const PageCard = ({inView, slide}: CarouselCardProps) => {
  const title = slide.structuredLink?.title;

  return (
    <div className="group relative">
      {slide.structuredLink && title && (
        <StructuredLink
          className="overlay-link absolute left-0 top-0 z-10 h-full w-full"
          {...(slide.structuredLink as StructuredLinkProps)}
        >
          <span className="sr-only">{title}</span>
        </StructuredLink>
      )}
      <div className="">
        <div className="aspect-[5/4]">
          <SanityImage
            aspectRatio="5/4"
            className="size-full object-cover"
            data={slide.image}
            loading={inView ? 'eager' : 'lazy'}
          />
        </div>
        {title && (
          <div className="data-text mt-3 flex w-full flex-row items-center justify-between gap-2">
            <p className="h5 highlight-hover highlight-hover--citrus">
              <span>{title}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({inView, slide}: CarouselCardProps) => {
  const title =
    slide.structuredLink?.title ||
    slide.structuredLink?.reference?.product?.title ||
    '';

  return (
    <div className="group relative">
      {slide.structuredLink && (
        <StructuredLink
          className="overlay-link absolute left-0 top-0 z-10 h-full w-full"
          {...(slide.structuredLink as StructuredLinkProps)}
        >
          <span className="sr-only">{title}</span>
        </StructuredLink>
      )}
      <div className="">
        <div className="aspect-[5/4]">
          <SanityImage
            aspectRatio="5/4"
            className="size-full object-cover"
            data={slide.image}
            loading={inView ? 'eager' : 'lazy'}
          />
        </div>
        {slide.structuredLink?.reference && (
          <div className="data-text mt-3 flex w-full flex-row items-center justify-between gap-2">
            <p className="h5 highlight-hover highlight-hover--citrus">
              <span>{title}</span>
            </p>
            {slide.structuredLink?.reference?.product?.firstVariant && (
              <p className="mr-[0.5rem]">
                Starting at $
                {
                  slide.structuredLink.reference.product.firstVariant?.store
                    .price
                }
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export function CarouselSection(
  props: SectionDefaultProps & {data: CarouselSectionProps},
) {
  const {data} = props;
  const {darkMode, introLinks, slides} = data;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  let slidesPerViewDesktop = 3;
  const device = useDevice();
  if ('mobile' === device) {
    slidesPerViewDesktop = 1;
  } else if ('tablet' === device) {
    slidesPerViewDesktop = 2;
  }
  const useIntroLinks = introLinks || [];
  return (
    <div
      className="data-bg py-6 md:py-8 lg:py-12 [&[data-section-bg='dark']]:py-[var(--section-margin-half)]"
      data-section-bg={darkMode ? 'dark' : 'light'}
      ref={ref}
    >
      {slides && slides?.length > 0 ? (
        <Carousel
          className="[--slide-spacing:2rem] md:[--slide-spacing:1rem]"
          opts={{
            loop: device === 'mobile',
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
              useIntroLinks.length > 1
                ? 'flex-col gap-4 md:flex-row md:items-end md:justify-between'
                : 'mb-4 flex-col justify-between gap-4 md:flex-row md:items-center',
            )}
          >
            {useIntroLinks && useIntroLinks.length ? (
              <ul
                className={cx(
                  'flex flex-col gap-2 text-left md:gap-4',
                  introLinks.length > 1 ? 'md:order-2 md:mb-4' : 'order-1',
                )}
              >
                {useIntroLinks
                  .filter((l) => l.structuredLink)
                  .map((introLink, i) => (
                    <m.li
                      initial={{opacity: 0, y: 15}}
                      key={introLink._key}
                      transition={{delay: i * 0.1, duration: 0.4}}
                      whileInView={{opacity: 1, y: 0}}
                    >
                      <StructuredLink
                        className={cx('data-text', 'flex md:justify-end')}
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
                    </m.li>
                  ))}
              </ul>
            ) : null}
            <div
              className={cx(
                'data-text',
                useIntroLinks.length > 1
                  ? 'order-1 mb-4 ml-[-11px]'
                  : 'order-2 ml-[-11px] sm:mr-0 md:ml-0 md:mr-[-11px]',
              )}
            >
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>
          <m.div
            className="relative overflow-hidden"
            initial={{opacity: 0}}
            transition={{delay: 0.2, duration: 0.6}}
            whileInView={{opacity: 1}}
          >
            <span
              className={cn(
                'absolute right-[-1px] top-0 z-10 hidden h-full w-16 md:block',
                'to-transparent  bg-gradient-to-l via-10%',
                darkMode
                  ? 'from-charcoal via-charcoal'
                  : 'from-cream via-cream',
              )}
            ></span>
            <CarouselContent className="pl-[--container-padding] pr-[--container-padding] md:ml-[calc(var(--container-padding)-var(--slide-spacing))] md:pl-0 md:pr-0">
              {slides.map((slide) => (
                <CarouselItem className="[&>span]:h-full" key={slide._key}>
                  {slide?.structuredLink?.reference?.documentType ===
                  'product' ? (
                    <ProductCard inView={inView} slide={slide} />
                  ) : (
                    <PageCard inView={inView} slide={slide} />
                  )}
                </CarouselItem>
              ))}
              {device !== 'mobile' && <CarouselItem></CarouselItem>}
            </CarouselContent>
          </m.div>
        </Carousel>
      ) : null}
    </div>
  );
}
