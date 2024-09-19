import type {VariantProps} from 'class-variance-authority';
import type {TypeFromSelection} from 'groqd';

import {cva} from 'class-variance-authority';
import {useEffect} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {CASE_STUDY_TOPPER_SECTION_FRAGMENT} from '~/qroq/sections';

import {cn} from '~/lib/utils';

import { StructuredLink } from '../sanity/link/StructuredLink';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/Carousel';
import { SanityImage } from '../sanity/SanityImage';

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
  useHeaderColors(bgColor);
  const useBgColor = bgColor || 'citrus';
  return (
    <div data-color={useBgColor}>
			<div
				className={cn(
					topperVariants({
						bgColor: useBgColor as VariantProps<typeof topperVariants>['bgColor'],
					}),
				)}
			>
				<div className="container-w-padding site-grid md:text-right pb-14 md:pb-24">
					{title && <div className="col-span-10 md:col-span-9 lg:col-span-8 md:col-start-3 lg:col-start-4 flex flex-row md:justify-end">
						<h1 className="h1-super">{title}</h1>
						</div>
					}
					{(link || location || collaborators || date) && (
						<ul className="col-span-full flex-wrap md:justify-end row-start-2 info-16 flex flex-col gap-2 md:flex-row md:gap-x-4 lg:gap-x-7">
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
						</ul>
					)}
				</div>
			</div>
			{slides && slides.length > 0 && (
				<div className="container-w-padding">
					<Carousel
          className="mt-4 [--slide-spacing:2rem] md:[--slide-spacing:1rem]"
          opts={{
            loop: true,
          }}
          style={
            {
              '--slides-per-view': 1,
            } as React.CSSProperties
          }
        >
          <div className="relative gird">
            <CarouselContent
              // className='md:ml-[calc(var(--container-padding)-var(--slide-spacing))] md:pl-0 md:pr-0 pl-[--container-padding] pr-[--container-padding]'
              className="w-100"
            >
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
                    {slide.title && (
                      <div className="text-on-light mt-4 md:mt-7">
                        <h2 className="body-20 mt-0">{title}</h2>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </Carousel>
				</div>
			)}
    </div>
  );
}
