import type { TypeFromSelection } from "groqd";

import type {ArrayMember, SectionDefaultProps} from '~/lib/type';
import type {FEATURED_WORK_SECTION_FRAGMENT} from '~/qroq/sections';

import type {StructuredLinkProps} from '../sanity/link/StructuredLink';

import { SanityImage } from "../sanity/SanityImage";
import { StructuredLink } from "../sanity/link/StructuredLink";
import {ArrowLink} from '../ui/ArrowLink';

export type FeaturedWorkSectionProps = TypeFromSelection<typeof FEATURED_WORK_SECTION_FRAGMENT>;
export type WorkSampleProps = ArrayMember<FeaturedWorkSectionProps['workSamples']>;

const WorkSample = ({workSample}: {workSample: WorkSampleProps}) => {
	const sampleTitle = workSample.structuredLink?.title || workSample.structuredLink?.reference?.product?.title || '';
	return (
		<div className="relative group">
			{workSample.structuredLink && sampleTitle && (
				<StructuredLink
					className="absolute top-0 left-0 w-full h-full z-10 overlay-link"
					{...(workSample.structuredLink as StructuredLinkProps)}
				>
					<span className="sr-only">{sampleTitle}</span>
				</StructuredLink>
			)}
			<div>
				<div className="aspect-[3/2]">
					<SanityImage
						aspectRatio='3/2'
						className="size-full object-cover"
						data={workSample.image}
						loading={'lazy'}
						showBorder={false}
						showShadow={false}
					/>
				</div>
				{sampleTitle && (
					<div className="text-on-dark flex flex-row gap-2 w-full items-center justify-between mt-3">
						{workSample.structuredLink ? (
							<span className="highlight-hover highlight-hover--citrus">
								<ArrowLink
									size={'small'}
									variant="primary"
								>
									{sampleTitle}
								</ArrowLink>
							</span>
						) : (
							<p className="h5">
								<span>{sampleTitle}</span>
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export function FeaturedWorkSection(props: SectionDefaultProps & {data: FeaturedWorkSectionProps}) {
	const {data} = props;
	const {deck, title, workSamples} = data;

	return (
		<section className="relative flex flex-col w-full pt-16 pb-16 md:pt-32 md:pb-32 lg:pt-52 lg:pb-52">
			<div className="container-w-padding site-grid">
				<div className="col-span-full lg:col-span-5 lg:row-start-1 lg:row-end-3 lg:pt-12">
					<div className="mb-8 md:mb-12 lg:mb-20 text-on-dark pr-0 md:pr-6 max-w-[640px] lg:min-h-[200px] lg:flex-col lg:flex justify-end">
						{title && (
							<h2 className="h2">{title}</h2>
						)}
						{deck && (
							<p className="body-20 max-x-[478px] mt-3 md:mt-4">{deck}</p>
						)}
					</div>
					{/* Work sample one */}
					{workSamples && workSamples.slice(0, 1).map((workSample) => (
						<WorkSample key={workSample._key} workSample={workSample} />
					))}
				</div>
				{/* Work samples 2 and 3 */}
				<div className="col-span-full lg:col-start-6 lg:col-span-6 flex flex-col md:flex-row lg:flex-col site-grid-gap">
					{workSamples && workSamples.slice(1).map((workSample) => (
						<div
							className="flex-1"
							key={workSample._key}
						>
							<WorkSample workSample={workSample} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}