import * as AccordionPrimitive from '@radix-ui/react-accordion';
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

const AccordionTrigger = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({children, className, ...props}, ref) => (
  <AccordionPrimitive.Header asChild className="flex">
    <div className={cn([className])}>
      {children}
      <AccordionPrimitive.Trigger
        className={cn(
          'group flex flex-0 items-center justify-between transition-all',
        )}
        ref={ref}
        {...props}
      >
        <AccordionIcon />
      </AccordionPrimitive.Trigger>
    </div>
  </AccordionPrimitive.Header>
));
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
