import type {VariantProps} from 'class-variance-authority';

import {cva} from 'class-variance-authority';

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
		'flex flex-row transition-all duration-300'
	],
	{
		defaultVariants: {
			size: 'default',
		},
		variants: {
			size: {
				default: 'h-6 w-6 lg:h-8 lg:w-8 group-hover:translate-x-1 md:group-hover:translate-x-2',
				large: 'h-11 w-11 md:h-12 md:w-12 lg:h-16 lg:w-16 group-hover:translate-x-2 md:group-hover:translate-x-6',
			},
		},
	},
);

export interface ArrowLinkProps {
	children: React.ReactNode;
	size?: VariantProps<typeof arrowLinkVariants>['size'];
	variant?: VariantProps<typeof arrowLinkVariants>['variant'];
}

/**
 * Inner link component with arrow icon.
 */
export function ArrowLink({children, size, variant}: ArrowLinkProps) {
	return (
		<span className={arrowLinkVariants({size, variant})}>
			<span>{children}</span>
			<IconCircleArrow className={arrowLinkSVGVariants({size})}/>
		</span>
	)
}