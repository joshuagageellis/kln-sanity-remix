import type {TypeFromSelection} from 'groqd';

import {useLoaderData} from '@remix-run/react';
import {AnimatePresence, m} from 'framer-motion';
import {useContext, useEffect} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {COLLECTION_BANNER_SECTION_FRAGMENT} from '~/qroq/sections';
import type {loader} from '~/routes/($locale).collections.$collectionHandle';

import { ThemeContext, ThemeContextActionType } from '~/root';

// import {ShopifyImage} from '../ShopifyImage';

type CollectionBannerSectionProps = TypeFromSelection<
  typeof COLLECTION_BANNER_SECTION_FRAGMENT
>;

export function CollectionBannerSection(
  props: SectionDefaultProps & {data: CollectionBannerSectionProps},
) {
  const loaderData = useLoaderData<typeof loader>();
  const collection = loaderData.collection;
  const {setTheme} = useContext(ThemeContext);

  useEffect(() => {
    setTheme({payload: 'charcoal', type: ThemeContextActionType.SET_TOPPER});
  }, [setTheme]);

  if (!collection) return null;

  return (
    <div className="bg-charcoal text-cream">
      <div className="container-w-padding site-grid pb-6 pt-16 md:pb-12 md:pt-24 lg:pt-32">
        <div
          className="relative z-10 col-span-full flex flex-col"
        >
          <AnimatePresence>
            <m.h1
              animate={{opacity: 1}}
              className="text-pretty highlight highlight--amethyst h1-super max-w-[max(80%,980px)]"
              initial={{opacity: 0}}
              key='collection-title'
              transition={{delay: 0.2, duration: 0.6}}
            >
              <span>
                {collection.title}
              </span>
            </m.h1>
            {props.data.showDescription && collection.description && (
              <m.p
                animate={{opacity: 1}}
                className="mt-6 max-w-[480px] lg:max-w-[640px] md:mt-10"
                initial={{opacity: 0}}
                key='collection-deck'
                transition={{delay: 0.6, duration: 0.6}}
              >
                {collection.description}
              </m.p>
            )}
          </AnimatePresence>
        </div>
        {/* {props.data.showImage && collection.image && (
          <m.div
            className="col-span-full md:row-start-1 md:col-span-9"
            initial={{opacity: 0}}
            transition={{duration: 0.6}}
            whileInView={{opacity: 1}}
          >
            <div className="w-[calc(100%+var(--container-padding))] ml-[calc(-1*var(--container-padding))]">
              <ShopifyImage
                aspectRatio="16/9"
                crop="center"
                data={collection.image}
                decoding="sync"
                fetchpriority="high"
                loading="eager"
                sizes="100vw"
              />
            </div>
          </m.div>
        )} */}
      </div>
    </div>
  );
}
