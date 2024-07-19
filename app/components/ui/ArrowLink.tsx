import type {VariantProps} from 'class-variance-authority';

import {cva} from 'class-variance-authority';

import {cn} from '~/lib/utils';

import { IconArrowRight } from '../icons/IconArrowRight';
import {IconCircleArrow} from '../icons/IconCircleArrow';

const arrowLinkVariants = cva(
	[
		'flex flex-row items-center'
	],
	{
		defaultVariants: {
			size: 'default',
			variant: 'default',
		},
		variants: {
			size: {
				default: 'h2 gap-2 md:gap-3 lg:gap-4',
				large: 'gap-2 md:gap-4 lg:gap-6 h2-super',
				small: 'gap-1 md:gap-2 lg:gap-3 h5',
			},
			variant: {
				default: '',
				primary: '',
			},
		},
	},
);

const arrowLinkSVGVariants = cva(
	[
		'flex flex-row transition-all ease-in-out'
	],
	{
		defaultVariants: {
			size: 'default',
		},
		variants: {
			size: {
				default: 'duration-200 h-6 w-6 md:h-8 md:w-8 group-hover:translate-x-[4px] md:group-hover:translate-x-1',
				large: 'duration-200 h-11 w-11 md:h-12 md:w-12 lg:h-16 lg:w-16 group-hover:translate-x-2 md:group-hover:translate-x-6',
				small: 'duration-100 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 md:group-hover:translate-x-2',
			},
		},
	},
);

export interface ArrowLinkProps {
	children: React.ReactNode;
	className?: string;
	size?: VariantProps<typeof arrowLinkVariants>['size'];
	variant?: VariantProps<typeof arrowLinkVariants>['variant'];
}

/**
 * Inner link component with arrow icon.
 */
export function ArrowLink({children, className  = '', size, variant}: ArrowLinkProps) {
	return (
		<span className={cn(className, arrowLinkVariants({size, variant}))}>
			<span>{children}</span>
			{'small' == size ? (
				<IconArrowRight className={arrowLinkSVGVariants({size})}/>
			) : (
				<IconCircleArrow className={arrowLinkSVGVariants({size})}/>
			)}
		</span>
	)
}