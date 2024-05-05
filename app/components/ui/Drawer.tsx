import {cn} from 'app/lib/utils';
import * as React from 'react';
import {forwardRef, useCallback, useEffect, useState} from 'react';
import {Drawer as DrawerPrimitive} from 'vaul';

import {AccordionIconClose} from '../icons/IconAccordion';
import {iconButtonClass} from './Button';

const Drawer = ({
  onOpenChange,
  open,
  preventScrollRestoration = false,
  shouldScaleBackground = false,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => {
  const handleOpen = React.useCallback(($open: boolean) => {
    if (!document) return;
    const body = document.body;

    if (!$open) {
      body.removeAttribute('data-drawer-open');
      return;
    }

    body.setAttribute('data-drawer-open', String($open));
  }, []);

  return (
    <DrawerPrimitive.Root
      onOpenChange={($open) => {
        onOpenChange?.($open);
        handleOpen($open);
      }}
      open={open}
      preventScrollRestoration={preventScrollRestoration}
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  );
};
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerNestedRoot = DrawerPrimitive.NestedRoot;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({className, ...props}, ref) => (
  <DrawerPrimitive.Overlay
    className={cn('bg-black/80 fixed inset-0 z-[98] h-full w-full', className)}
    ref={ref}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({children, className, ...props}, ref) => {


  // Ensure drawer content is always below the header
  const headerHeight = useHeaderHeight();
  const cssVar = `
    :root {
      --header-height: ${headerHeight}px
    }
  `;

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <style dangerouslySetInnerHTML={{__html: cssVar}} />
      <DrawerPrimitive.Content
        className={cn(
          'fixed right-0 bottom-0 z-[99] h-full w-full sm:max-w-[90%] bg-charcoal',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
        <DrawerClose
          className={cn(
            iconButtonClass,
            'absolute right-2 top-2 lg:inline-flex',
            'text-charcoal hover:text-panther transition-all duration-200 hover:rotate-90'
          )}
        >
          <AccordionIconClose />
          <span className="sr-only">Close</span>
        </DrawerClose>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
});

DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({className, ...props}, ref) => (
  <DrawerPrimitive.Title
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    ref={ref}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

// Calculate the header + alert height and return it
const useHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const getHeaderHeight = useCallback(() => {
    const header = document.querySelector('header');
    const alert = document.querySelector('#announcement-bar') as HTMLElement | null;
    if (!header) return;
    const combinedHeight = header.offsetHeight + (alert ? alert.offsetHeight : 0);
    setHeaderHeight(combinedHeight);
  }, [setHeaderHeight]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    getHeaderHeight();
    window.addEventListener('scroll', getHeaderHeight);
    window.addEventListener('resize', getHeaderHeight);

    return () => {
      window.removeEventListener('scroll', getHeaderHeight);
      window.removeEventListener('resize', getHeaderHeight);
    };
  }, [getHeaderHeight]);

  return headerHeight;
};

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerNestedRoot,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
