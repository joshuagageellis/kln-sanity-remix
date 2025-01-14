import type {VariantProps} from 'class-variance-authority';

import {Slot} from '@radix-ui/react-slot';
import {cva} from 'class-variance-authority';
import * as React from 'react';

import {cn} from '~/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center select-none justify-center whitespace-nowrap ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'btn-text px-2 py-2 min-h-[48px] md:px-4 md:py-4 md:min-h-[60px]',
        icon: 'size-11',
        iconOutline: 'size-11',
        lg: 'btn-text h-[60px] px-8',
        primitive: 'h-auto p-0',
        sm: 'btn-text-sm min-h-[48px] px-3 py-1',
      },
      variant: {
        default: 'bg-amethyst text-charcoal hover:bg-citrus focus:bg-citrus',
        ghost: '',
        link: 'btn-text underline hover:text-panther focus:text-panther',
        outline:
          'border-[2px] border-charcoal bg-transparent text-charcoal hover:bg-charcoal focus:bg-charcoal focus:text-marble hover:text-marble',
        outlineDark:
          'border-[2px] border-marble bg-transparent text-marble hover:bg-amethyst focus:bg-amethyst focus:text-charcoal hover:text-charcoal hover:border-amethyst',
      },
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
  }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({asChild = false, className, size, variant, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        // .customButton for custom styles
        className={cn('customButton', buttonVariants({className, size, variant}))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  buttonProps?: VariantProps<typeof buttonVariants>|null;
}

export const iconButtonClass = buttonVariants({size: 'icon', variant: 'ghost'});

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({asChild = false, buttonProps = null, className, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonProps ? buttonVariants(buttonProps) : iconButtonClass, className)} ref={ref} {...props} />
    );
  },
);
IconButton.displayName = 'IconButton';

export {Button, IconButton, buttonVariants};
