import type {Location} from '@remix-run/react';

import {
  PrefetchPageLinks,
  useLocation,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import {AnimatePresence,m} from 'framer-motion';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {useOptimisticNavigationData} from '~/hooks/useOptimisticNavigationData';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';

import type {SortParam} from './SortFilterLayout';

import {IconSort} from '../icons/IconSort';
import {Label} from '../ui/Label';
import {RadioGroup, RadioGroupItem} from '../ui/RadioGroup';

type SortItem = {
  key: SortParam;
  label: string;
};

function useSortItems() {
  const {search} = useLocation();
  const {optimisticData: clearFilters} =
    useOptimisticNavigationData<boolean>('clear-all-filters');
  const {optimisticData} = useOptimisticNavigationData<SortParam>('sort-radio');
  const {themeContent} = useSanityThemeContent();

  const items: SortItem[] = useMemo(
    () => [
      {
        key: 'featured',
        label: themeContent?.collection?.sortFeatured || 'Featured',
      },
      {
        key: 'price-low-high',
        label: themeContent?.collection?.sortLowHigh || 'Price: Low - High',
      },
      {
        key: 'price-high-low',
        label: themeContent?.collection?.sortHighLow || 'Price: High - Low',
      },
      {
        key: 'best-selling',
        label: themeContent?.collection?.sortBestSelling || 'Best Selling',
      },
      {
        key: 'newest',
        label: themeContent?.collection?.sortNewest || 'Newest',
      },
    ],
    [themeContent],
  );

  if (optimisticData) {
    return {
      activeItem: items.find((item) => item.key === optimisticData),
      items,
    };
  }
  // Optimistically reset to default sort item when clearing all filters
  else if (clearFilters) {
    return {
      activeItem: items[0],
      items,
    };
  }

  return {
    activeItem:
      items.find((item) => search.includes(`?sort=${item.key}`)) || items[0],
    items,
  };
}

export function DesktopSort() {
  const {activeItem, items} = useSortItems();
  const {themeContent} = useSanityThemeContent();
  const [isOpen, setIsOpen] = useState(false);
  const sortPanel = useRef<HTMLDivElement>(null);

  const hideOnOuterClick = useMemo(() => (e: Event) => {
    if (
      isOpen && 
      e.target instanceof Element && 
      sortPanel.current &&
      ! sortPanel.current.contains(e.target)
    ) {
      setIsOpen(false);
    }
  }, [sortPanel, isOpen]);

  useEffect(() => {
    document.addEventListener('click', hideOnOuterClick);
    return () => {
      document.removeEventListener('click', hideOnOuterClick);
    };
  }, [hideOnOuterClick]);

  return (
    <>
      <div>
        <button
          className="flex items-center gap-3 h-11"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <IconSort strokeWidth={1} />
          <span className="info-16">
            <span className="px-2">
              {themeContent?.collection?.sortBy}
            </span>
            <span>{(activeItem || items[0]).label}</span>
          </span>
        </button>
      </div>
      <div className="relative w-full">
        <AnimatePresence>
          <m.div
            animate={{height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0}}
            className={cn([
              'hidden touch:hidden lg:block',
              'bg-cream border-charcoal border-2',
              'absolute top-0 right-0 z-20',
              'overflow-hidden',
              'w-[calc(100%-2rem)] max-w-96 shadow-panther shadow-sm',
            ])}
            exit={{height: 0, opacity: 0}}
            initial={{height: 0, opacity: 0}}
            key="drawer"
            ref={sortPanel}
          >
            <SortRadioGroup
              className="px-3 py-3"
            >
              {items.map((item) => (
                <SortRadioItem item={item} key={item.label} />
              ))}
              </SortRadioGroup>
          </m.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export function MobileSort() {
  const {items} = useSortItems();
  const {themeContent} = useSanityThemeContent();

  return (
    <div>
      <div className="flex items-center gap-3">
        <IconSort strokeWidth={1} />
        <span>
          <span className="px-2 h5">
            {themeContent?.collection?.sortBy}
          </span>
        </span>
      </div>
      <SortRadioGroup className="mt-3 flex flex-col gap-0">
        {items.map((item) => (
          <SortRadioItem item={item} key={item.key} />
        ))}
      </SortRadioGroup>
    </div>
  );
}

function SortRadioGroup(props: {
  children: React.ReactNode;
  className?: string;
}) {
  const {activeItem, items} = useSortItems();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleSort = useCallback(
    (value: SortParam) => {
      const to = getSortLink(value, params, location);
      navigate(to, {
        preventScrollReset: true,
        replace: true,
        state: {
          optimisticData: value,
          optimisticId: 'sort-radio',
        },
      });
    },
    [params, location, navigate],
  );

  return (
    <RadioGroup
      className={cn([props.className])}
      onValueChange={handleToggleSort}
      value={activeItem?.key || items[0].key}
    >
      {props.children}
    </RadioGroup>
  );
}

function SortRadioItem(props: {
  className?: string;
  item: SortItem;
}) {
  const {item} = props;
  const [prefetchPage, setPrefetchPage] = useState<null | string>(null);
  const location = useLocation();
  const [params] = useSearchParams();
  const {pending} = useOptimisticNavigationData<SortParam>('sort-radio');

  // Prefetch the page that will be navigated to when the user hovers or touches
  const handleSetPrefetch = useCallback(() => {
    const sortLink = getSortLink(item.key, params, location);
    setPrefetchPage(sortLink);
  }, [item.key, params, location]);

  return (
    <div
      className={cn([
        'flex items-center gap-x-3 py-3',
        // If the navigation is pending, animate after a delay
        // to avoid flickering when navigation is fast
        pending && 'pointer-events-none animate-pulse delay-500',
        props.className,
      ])}
      key={item.key}
      onMouseEnter={handleSetPrefetch}
      onTouchStart={handleSetPrefetch}
    >
      <RadioGroupItem id={item.key} value={item.key} />
      <Label className="w-full info-14" htmlFor={item.key}>
        {item.label}
      </Label>
      {prefetchPage && <PrefetchPageLinks page={prefetchPage} />}
    </div>
  );
}

function getSortLink(
  sort: SortParam,
  params: URLSearchParams,
  location: Location,
) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}
