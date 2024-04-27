import {cn} from '~/lib/utils';

import type {IconProps} from './Icon';

import {Icon} from './Icon';

export function IconChevron(
  props: IconProps,
) {
  return (
    <Icon
      className={cn('size-6', props.className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 14 8"
    >
      <title>Chevron</title>
      <path d="M0.999999 1.33342L7 6.66675L13 1.33341" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"/>
    </Icon>
  );
}

