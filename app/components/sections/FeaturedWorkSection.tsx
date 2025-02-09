import type { TypeFromSelection } from "groqd";

import {m} from 'framer-motion';

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
					/>
				</div>
				{sampleTitle && (
					<div className="text-on-dark flex flex-row gap-2 w-full items-center justify-between mt-1 sm:mt-2">
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
		<div className="relative flex flex-col w-full pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-20 lg:pb-20 bg-dark" data-section-bg="dark">
			<div className="container-w-padding site-grid">
				<div className="col-span-full lg:col-span-5 lg:row-start-1 lg:row-end-3 lg:pt-12">
					<div className="mb-8 text-on-dark pr-0 md:pr-6 max-w-[640px] lg:min-h-[200px] lg:flex-col lg:flex justify-end">
						{title && (
							<h2 className="h2">{title}</h2>
						)}
						{deck && (
							<p className="body-20 max-x-[478px] mt-2">{deck}</p>
						)}
					</div>
					{/* Work sample one */}
					{workSamples && workSamples.slice(0, 1).map((workSample) => (
						<m.div
							initial={{opacity: 0, scale: 0.99, y: 15}}
							key={workSample._key}
							transition={{delay: 0.2, duration: 0.6}}
							whileInView={{opacity: 1, scale: 1, y: 0}}
						>
							<WorkSample workSample={workSample} />
						</m.div>
					))}
				</div>
				{/* Work samples 2 and 3 */}
				<div className="col-span-full lg:col-start-6 lg:col-span-6 flex flex-col md:flex-row lg:flex-col site-grid-gap">
					{workSamples && workSamples.slice(1).map((workSample) => (
						<m.div
							className="flex-1"
							initial={{opacity: 0, scale: 0.99, y: 15}}
							key={workSample._key}
							transition={{delay: 0.2, duration: 0.6}}
							whileInView={{opacity: 1, scale: 1, y: 0}}
						>
							<WorkSample workSample={workSample} />
						</m.div>
					))}
				</div>
			</div>
		</div>
	);
}