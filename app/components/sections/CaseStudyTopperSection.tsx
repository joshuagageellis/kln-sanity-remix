import type {VariantProps} from 'class-variance-authority';
import type {TypeFromSelection} from 'groqd';

import {cva} from 'class-variance-authority';
import {m} from 'framer-motion';
import {useEffect} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {CASE_STUDY_TOPPER_SECTION_FRAGMENT} from '~/qroq/sections';

import {cn} from '~/lib/utils';

import { cleanString } from '../sanity/CleanString';
import { SanityImage } from '../sanity/SanityImage';
import { StructuredLink } from '../sanity/link/StructuredLink';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/Carousel';

type CaseStudyTopperSectionProps = TypeFromSelection<
  typeof CASE_STUDY_TOPPER_SECTION_FRAGMENT
>;

const useHeaderColors = (color: null | string) => {
  useEffect(() => {
    const colors = ['charcoal', 'citrus', 'salsa'];
    if (!color || !colors.includes(color)) return;
    document.documentElement.setAttribute('data-topper-color', color);
    return () => {
      document.documentElement.removeAttribute('data-topper-color');
    };
  }, [color]);
};

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

export function CaseStudyTopperSection(
  props: SectionDefaultProps & {data: CaseStudyTopperSectionProps},
) {
  const {data} = props;
  const {bgColor, collaborators, date, link, location, slides, title} = data;
  const useBgColor = cleanString(bgColor) || 'citrus';
  useHeaderColors(useBgColor);
  return (
    <div className='bg-cream' data-color={useBgColor}>
			<div
				className={cn(
          'pt-12 lg:pt-16 pb-14 md:pb-24',
					topperVariants({
						bgColor: useBgColor as VariantProps<typeof topperVariants>['bgColor'],
					}),
				)}
			>
				<div className="container-w-padding site-grid md:text-right">
					{title && <m.div
            animate={{opacity: 1}}
            className="col-span-10 md:col-span-9 lg:col-span-8 md:col-start-3 lg:col-start-4 flex flex-row md:justify-end"
            initial={{opacity: 0}}
          transition={{delay: 0.2, duration: 0.4}}>
						<h1 className="h1-super text-balance">{title}</h1>
						</m.div>
					}
					{(link || location || collaborators || date) && (
						<m.ul
            animate={{opacity: 1, y: 0}}
            className="col-span-full flex-wrap md:justify-end row-start-2 info-16 flex flex-col gap-2 md:flex-row md:gap-x-4 lg:gap-x-7"
            initial={{opacity: 0, y: 15}}
            transition={{delay: 0.4, duration: 0.4}}>
							{link && (
								<li>
									<StructuredLink className="info-16-link" {...link}>{link.title}</StructuredLink>
								</li>
							)}
							{location && <li>{location}</li>}
							{date && <li>{new Date(date).toLocaleDateString('en-US', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							})}</li>}
							{collaborators && <li className="md:basis-full">{collaborators}</li>}
						</m.ul>
					)}
				</div>
			</div>
			{slides && slides.length ? (
        <m.div
        animate={{opacity: 1, y: 0}}
        className="container-w-padding -mt-7 md:-mt-16"
        initial={{opacity: 0, y: 25}}
        transition={{delay: 0.6, duration: 0.4, ease: 'easeOut'}}>
        {slides.length > 1 ? (
            <Carousel
              className="[--slide-spacing:2rem] md:[--slide-spacing:1rem]"
              opts={{
                loop: true,
              }}
              style={
                {
                  '--slides-per-view': 1,
                } as React.CSSProperties
              }
            >
              <div className="relative">
                <CarouselContent className="w-100">
                  {slides.map((slide, i) => (
                    <CarouselItem className="[&>span]:h-full" key={slide._key}>
                      <div>
                        {/* image */}
                        <SanityImage
                          aspectRatio='16/9'
                          className="size-full object-cover"
                          data={slide.image}
                          loading={i == 0 ? 'eager' : 'lazy'}
                          showBorder={false}
                          showShadow={false}
                        />
                        {/* desc */}
                        {slide.description && (
                          <div className="text-panther mt-2 max-w-[640px]">
                            <p className="info-16 mt-0">{slide.description}</p>
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {slides.length > 1 ? (
                  <div className="text-marble absolute right-0 w-full top-0">
                    <span className="w-full aspect-video block"></span>
                    <div className="mt-4 md:mt-7 flex flex-row justify-end relative z-20">
                      <CarouselPrevious />
                      <CarouselNext />
                    </div>
                  </div>
                ) : null}
              </div>
            </Carousel>
        ) : (
            <div className="w-100">
              {/* image */}
              <SanityImage
                aspectRatio='16/9'
                className="size-full object-cover"
                data={slides[0].image}
                loading='eager'
                showBorder={false}
                showShadow={false}
              />
              {/* desc */}
              {slides[0].description && (
                <div className="text-panther mt-2 max-w-[640px]">
                  <p className="info-16 mt-0">{slides[0].description}</p>
                </div>
              )}
            </div>
        )}
        </m.div>
			) : null}
    </div>
  );
}
