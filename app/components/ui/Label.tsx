import * as LabelPrimitive from '@radix-ui/react-label';
import {cn} from 'app/lib/utils';
import {type VariantProps, cva} from 'class-variance-authority';
import {forwardRef} from 'react';

const labelVariants = cva(
  'info-16 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({className, ...props}, ref) => (
  <LabelPrimitive.Root
    className={cn(labelVariants(), className)}
    ref={ref}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export {Label};
