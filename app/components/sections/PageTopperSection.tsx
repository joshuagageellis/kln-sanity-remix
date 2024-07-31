import type {VariantProps} from 'class-variance-authority';
import type {TypeFromSelection} from 'groqd';

import { cva} from 'class-variance-authority';
import { useEffect } from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {PAGE_TOPPER_SECTION_FRAGMENT} from '~/qroq/sections';

import {cn} from '~/lib/utils';

import { StructuredLink } from '../sanity/link/StructuredLink';
import {Button} from '../ui/Button';

type PageTopperSectionProps = TypeFromSelection<
	typeof PAGE_TOPPER_SECTION_FRAGMENT
>;

const useHeaderColors = (color: null | string ) => {
	useEffect(() => {
		const colors = ['charcoal', 'citrus', 'salsa' ];
		if (!color || !colors.includes(color)) return;
		document.documentElement.setAttribute('data-topper-color', color);
		return () => {
			document.documentElement.removeAttribute('data-topper-color');
		}
	}, [color]);
}

const topperVariants = cva(
	[],
	{
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
	},
);

export function PageTopperSection(
	props: SectionDefaultProps & {data: PageTopperSectionProps},
) {
	const {data} = props;
	const {bgColor, deck, displayButton, link, subtitle, title} = data;
	useHeaderColors(bgColor);
	const useBgColor = bgColor || 'citrus';
	return (
		<section className={
			cn(
				topperVariants({bgColor: useBgColor as VariantProps<typeof topperVariants>['bgColor']}),
			)
		} data-color={useBgColor}>
			<div className='container-w-padding site-grid pt-16 md:pt-24 lg:pt-32 pb-6 md:pb-12'>
				<div className='flex flex-col col-span-full'>
					{title && <h1 className='order-2 h1-super'>{title}</h1>}
					{subtitle && <h2 className='order-1 mb-1 uppercase h6'>{subtitle}</h2>}
					{deck && <p className='order-3 mt-2 md:mt-4 max-w-[480px] lg:max-w-[640px]'>{deck}</p>}
				</div>
				{displayButton && link && (
					<div className="col-span-full mt-8 md:mt-0">
						<Button asChild variant="default">
							<StructuredLink
								className="min-w-[180px] lg:min-w-[220px]"
								{...link}
							>
								{link.title}
							</StructuredLink>
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}