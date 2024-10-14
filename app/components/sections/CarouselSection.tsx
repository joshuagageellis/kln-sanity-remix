import type {TypeFromSelection} from 'groqd';

import {cx} from 'class-variance-authority';
import {useInView} from 'framer-motion';
import {useRef} from 'react';

import type {ArrayMember, SectionDefaultProps} from '~/lib/type';
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
    <div className="relative group">
      {slide.structuredLink && title && (
        <StructuredLink
          className="absolute top-0 left-0 w-full h-full z-10 overlay-link"
          {...(slide.structuredLink as StructuredLinkProps)}
        >
          <span className="sr-only">{title}</span>
        </StructuredLink>
      )}
      <div className="">
        <div className="aspect-[5/4]">
          <SanityImage
            aspectRatio='5/4'
            className="size-full object-cover"
            data={slide.image}
            loading={inView ? 'eager' : 'lazy'}
            showBorder={false}
            showShadow={false}
          />
        </div>
        {title && (
          <div className="text-on-dark flex flex-row gap-2 w-full items-center justify-between mt-3">
            <p className="h5 highlight-hover highlight-hover--citrus">
              <span>{title}</span>  
            </p>
          </div>
        )}
      </div>
    </div>
  )
};

const ProductCard = ({inView, slide}: CarouselCardProps) => {
  const title = slide.structuredLink?.title || slide.structuredLink?.reference?.product?.title || '';

  return (
    <div className="relative group">
      {slide.structuredLink && (
        <StructuredLink
          className="absolute top-0 left-0 w-full h-full z-10 overlay-link"
          {...(slide.structuredLink as StructuredLinkProps)}
        >
          <span className="sr-only">{title}</span>
        </StructuredLink>
      )}
      <div className="">
        <div className="aspect-[5/4]">
          <SanityImage
            aspectRatio='5/4'
            className="size-full object-cover"
            data={slide.image}
            loading={inView ? 'eager' : 'lazy'}
            showBorder={false}
            showShadow={false}
          />
        </div>
        {slide.structuredLink?.reference && (
          <div className="text-on-dark flex flex-row gap-2 w-full items-center justify-between mt-3">
            <p className="h5 highlight-hover highlight-hover--citrus">
              <span>{title}</span>  
            </p>
            {slide.structuredLink?.reference?.product?.firstVariant && (
              <p className="mr-[0.5rem]">
                Starting at $
                {slide.structuredLink.reference.product.firstVariant?.store.price}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
};

export function CarouselSection(
  props: SectionDefaultProps & {data: CarouselSectionProps},
) {
  const {data} = props;
  const {introLinks, slides} = data;
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
    <div className="pt-6 pb-6 md:pt-16 md:pb-16" ref={ref}>
      {slides && slides?.length > 0 && (
        <Carousel
          className="mt-4 [--slide-spacing:2rem] md:[--slide-spacing:1rem]"
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
              useIntroLinks.length > 1 ? 'flex-col md:flex-row gap-4 md:items-end md:justify-between' : 'flex-row gap-4 justify-between items-center mb-4',
            )}
          >
            {useIntroLinks.length && (
              <ul
                className={cx(
                  'flex flex-col gap-2 text-left md:gap-4',
                  introLinks.length > 1 ? 'md:mb-8 md:order-2' : 'order-1',
                )}
              >
                {useIntroLinks
                  .filter((l) => l.structuredLink)
                  .map((introLink) => (
                    <li key={introLink._key}>
                      <StructuredLink
                        className={cx('text-on-dark', 'flex md:justify-end')}
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
                useIntroLinks.length > 1 ? 'order-1 mb-4 ml-[-11px]' : 'order-2 mr-[-11px] sm:mr-0',
              )}
            >
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>
          <div className="relative overflow-hidden">
            <span className="bg-gradient-to-l from-charcoal via-charcoal via-10% to-transparent absolute md:block hidden top-0 right-[-1px] h-full w-16 z-10"></span>
            <CarouselContent
              className='md:ml-[calc(var(--container-padding)-var(--slide-spacing))] md:pl-0 md:pr-0 pl-[--container-padding] pr-[--container-padding]'
            >
              {slides.map((slide) => (
                <CarouselItem className="[&>span]:h-full" key={slide._key}>
                  {slide?.structuredLink?.reference?.documentType === 'product' ? (
                    <ProductCard inView={inView} slide={slide} /> 
                  ) : (
                    <PageCard inView={inView} slide={slide} />
                  )}
                </CarouselItem>
              ))}
              {device !== 'mobile' && (
                <CarouselItem></CarouselItem>
              )}
            </CarouselContent>
          </div>
        </Carousel>
      )}
    </div>
  );
}
