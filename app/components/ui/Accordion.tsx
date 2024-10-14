import type {VariantProps} from 'class-variance-authority';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cva} from 'class-variance-authority';
import {forwardRef} from 'react';

import {cn} from '~/lib/utils';

import {AccordionIcon} from '../icons/IconAccordion';

const Accordion = AccordionPrimitive.Root;

const AccordionHeader = AccordionPrimitive.AccordionHeader;

const AccordionItem = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({className, ...props}, ref) => (
  <AccordionPrimitive.Item className={cn(className)} ref={ref} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

const triggerVariants = cva(
  [],
  {
    defaultVariants: {
      size: 'small',
    },
    variants: {
      size: {
        large: 'w-14 h-14 md:w-24 md:h-24',
        small: 'w-9 h-9 md:w-[50px] md:h-[50px]',
      },
    },
  }
);

/**
 * Accordion Trigger
 * 
 * @param {props.triggerSize} - Size of the trigger icon. 'large' or 'small'.
 * @param {props.hoverEffect} - Whether to show hover effect on the trigger icon.
 */
const AccordionTrigger = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {hoverColor?: 'amethyst' | 'citrus', hoverEffect?: boolean, triggerSize: VariantProps<typeof triggerVariants>['size']} 
>(({children, className, hoverColor = 'citrus', hoverEffect = false, triggerSize, ...props}, ref) => {
  return (
    <AccordionPrimitive.Header asChild className="flex">
      <div className={cn([
        className,
        hoverEffect ? `highlight-hover-action highlight-hover--${hoverColor}` : '',
      ])}>
        <span>
          {children}
        </span>
        <AccordionPrimitive.Trigger
          className={cn(
            'group flex flex-0 items-center justify-between transition-all',
          )}
          ref={ref}
          {...props}
        >
          <AccordionIcon
            className={cn(triggerVariants({size: triggerSize}))}
          />
        </AccordionPrimitive.Trigger>
      </div>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({children, className, ...props}, ref) => (
  <AccordionPrimitive.Content
    className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    ref={ref}
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
};
