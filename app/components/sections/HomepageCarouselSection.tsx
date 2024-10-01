import type {TypeFromSelection} from 'groqd';

import Autoplay from 'embla-carousel-autoplay';

import type {SectionDefaultProps} from '~/lib/type';
import type {HOMEPAGE_CAROUSEL_SECTION_FRAGMENT} from '~/qroq/sections';

import {StructuredLink} from '~/components/sanity/link/StructuredLink';
import {useSanityRoot} from '~/hooks/useSanityRoot';

import {SanityImage} from '../sanity/SanityImage';
import { Button } from '../ui/Button';
import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/Carousel';

type HomepageCarouselSectionProps = TypeFromSelection<
  typeof HOMEPAGE_CAROUSEL_SECTION_FRAGMENT
>;

export function HomepageCarouselSection(
  props: SectionDefaultProps & {data: HomepageCarouselSectionProps},
) {
  const rootData = useSanityRoot();

  return (
    <div className="homepage-carousel relative flex flex-col mb-12 md:mb-16">
      {rootData?.data?.settings?.siteName && (
        <h1 className="sr-only">{rootData.data.settings?.siteName}</h1>
      )}
      <Carousel
        plugins={[Autoplay({
					delay: 5000,
					stopOnInteraction: true,
				})]}
        style={
          {
            '--slide-spacing': 'var(--container-padding)',
						'--slides-per-view': 1,
          } as React.CSSProperties
        }
      >
				<div className="hidden md:grid site-grid container-w-padding absolute top-0 left-0">
					{/* Essentially a fake slide, spaces the navigation */}
					<span className="row-start-1 col-start-1 col-span-9">
						<span className="block w-[calc(100%+var(--container-padding))] ml-[calc(-1*var(--container-padding))]">
							<span className="block aspect-video w-full h-full"></span>
						</span>
					</span>
					<div className="flex flex-col justify-end pb-12 row-start-1 col-start-10 col-span-2">
						<div className="flex-row flex justify-between gap-2 text-marble relative bg-charcoal p-2 z-10">
							<CarouselPrevious />
							<CarouselCounter>
								{props.data.slides && (
									<span>
										{props.data.slides.length}
									</span>
								)}
							</CarouselCounter>
							<CarouselNext />
						</div>
					</div>
				</div>

        <CarouselContent>
          {props.data.slides?.map((slide, index) => (
            <CarouselItem fullWidth={true} key={index}>
							<div className="site-grid gap-y-0 container-w-padding overflow-hidden">
								<div className="row-start-1 col-start-1 col-span-10 md:col-span-9">
									<div className="w-[calc(100%+var(--container-padding))] ml-[calc(-1*var(--container-padding))]">
										<SanityImage
											aspectRatio="16/9"
											className="h-full w-full object-cover"
											data={slide.image}
											decoding="async"
											draggable={false}
											fetchpriority={index === 0 ? 'high' : 'low'}
											loading={index === 0 ? 'eager' : 'lazy'}
											sizes="100vw"
										/>
									</div>
								</div>
								<div className="row-start-2 col-span-full">
									{slide.title && (
										<div className="flex w-full justify-end z-10 mt-[-20px] relative text-right">
											<h2 className="text-pretty highlight highlight--amethyst h1-super mr-[calc(-1*var(--container-padding))] md:max-w-[90%]">
												<span>
													<span className="pr-[var(--container-padding)] pl-[var(--container-padding)]">
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

				{/* Mobile only slider nav */}
				<div className="text-marble mt-4 site-grid container-w-padding relative md:hidden">
					<div className="flex-row flex justify-between gap-6">
						<CarouselPrevious />
						<CarouselCounter>
							{props.data.slides && (
								<span>
									{props.data.slides.length}
								</span>
							)}
						</CarouselCounter>
						<CarouselNext />
					</div>
				</div>
      </Carousel>
    </div>
  );
}
