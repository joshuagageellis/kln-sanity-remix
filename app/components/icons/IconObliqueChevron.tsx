import {cn} from '~/lib/utils';

import type {IconProps} from './Icon';

import {Icon} from './Icon';

export function IconObliqueChevron(
  props: IconProps,
) {
  return (
    <Icon
      className={cn('size-6', props.className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 16 26"
    >
      <title>Chevron</title>
			<path d="M1 25L15 13L1 0.999999" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
    </Icon>
  );
}

