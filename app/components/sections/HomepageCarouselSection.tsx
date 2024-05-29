import type {TypeFromSelection} from 'groqd';

import Autoplay from 'embla-carousel-autoplay';

import type {SectionDefaultProps} from '~/lib/type';
import type {HOMEPAGE_CAROUSEL_SECTION_FRAGMENT} from '~/qroq/sections';

import {StructuredLink} from '~/components/ui/StructuredLink';
import {useSanityRoot} from '~/hooks/useSanityRoot';

import {SanityImage} from '../sanity/SanityImage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPagination,
  CarouselPrevious,
} from '../ui/Carousel';
import { Button } from '../ui/Button';

type HomepageCarouselSectionProps = TypeFromSelection<
  typeof HOMEPAGE_CAROUSEL_SECTION_FRAGMENT
>;

export function HomepageCarouselSection(
  props: SectionDefaultProps & {data: HomepageCarouselSectionProps},
) {
  const rootData = useSanityRoot();

  return (
    <div>
      {rootData?.data?.settings?.siteName && (
        <h1 className="sr-only">{rootData.data.settings?.siteName}</h1>
      )}
      <Carousel
        // plugins={[Autoplay()]}
        style={
          {
            '--slides-per-view': 1,
          } as React.CSSProperties
        }
      >
        <CarouselContent>
          {props.data.slides?.map((slide, index) => (
            <CarouselItem key={index}>
							<div className="site-grid gap-y-0 container-w-padding">
								<div className="col-start-1 col-span-10 md:col-span-9">
									<SanityImage
										aspectRatio="16/9"
										className="w-full h-full"
										data={slide.image}
										decoding="async"
										draggable={false}
										fetchpriority={index === 0 ? 'high' : 'low'}
										loading={index === 0 ? 'eager' : 'lazy'}
										sizes="100vw"
									/>
								</div>
								<div className="row-start-2 col-span-full">
									{slide.title && (
										<div className="flex w-full justify-end z-10 mt-[-20px] relative">
											<h2 className="highlight highlight--amethyst h1-super">
												<span>
													<span className="pr-4">
														{slide.title}
													</span>
												</span>
											</h2>
										</div>
									)}
								</div>
								<div className="col-span-full md:col-start-5 lg:col-start-6 md:col-span-7 lg:col-span-6 gap-y-0 mt-6 md:mt-10 md:flex flex-col items-end">
									{slide.description && (
										<div className="text-marble max-w-[598px]">
											<p className="body-20">
												{slide.description}
											</p>
										</div>
									)}
									{slide.link && (
										<div className="mt-6 md:mt-8 lg:mt-12">
											<Button asChild variant="outlineDark">
												<StructuredLink
													className="min-w-[180px] lg:min-w-[220px]"
													{...slide.link}
												>
													{slide.link.title}
												</StructuredLink>
											</Button>
										</div>
									)}
								</div>
							</div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPagination />
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
