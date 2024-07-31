import type {PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';
import type {TypeFromSelection} from 'groqd';

import {PortableText} from '@portabletext/react';
import {useMemo} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {IMAGE_BANNER_SECTION_FRAGMENT} from '~/qroq/sections';

import {cn} from '~/lib/utils';

import type {ButtonBlockProps} from '../sanity/richtext/components/ButtonBlock';

import {SanityImage} from '../sanity/SanityImage';
import {ButtonBlock} from '../sanity/richtext/components/ButtonBlock';

type ImageBannerSectionProps = TypeFromSelection<
  typeof IMAGE_BANNER_SECTION_FRAGMENT
>;

export function ImageBannerSection(
  props: SectionDefaultProps & {data: ImageBannerSectionProps},
) {
  const {data} = props;
  let {aspectRatioValues, contentAlignment} = data;
  aspectRatioValues = aspectRatioValues || '4/3';
  contentAlignment = contentAlignment || 'left';

  // Todo: add encodeDataAttribute to SanityImage
  return (
    <div
      className={cn(
        'site-grid container-w-padding text-on-light bg-light py-8 md:py-16 lg:py-24',
      )}
    >
      <div className={
        cn(
          'flex flex-col justify-end',
          'col-span-full md:col-span-5 lg:col-span-4',
          contentAlignment === 'left' ? 'md:pr-6 lg:pr-11' : 'md:col-start-7 lg:col-start-8 md:row-span-1 md:pl-6 lg:pl-11',
        )
      }>
        <BannerRichtext value={data.content as PortableTextBlock[]} />
      </div>
      <div className={
        cn(
          'col-span-full md:col-span-6 lg:col-span-7',
          contentAlignment === 'left' ? '' : 'md:col-start-1 md:row-end-1',
          `aspect-[${aspectRatioValues}]`
        )
      }>
        <SanityImage
          aspectRatio={aspectRatioValues || '4/3'}
          className='w-full'
          data={data.backgroundImage}
          decoding="sync"
          draggable={false}
          showBorder={false}
          showShadow={false}
          sizes="100vw"
        />
      </div>
    </div>
  );
}

function BannerRichtext(props: {value?: PortableTextBlock[] | null}) {
  const components = useMemo(
    () => ({
      types: {
        button: (props: {value: ButtonBlockProps}) => (
          <ButtonBlock {...props.value} />
        ),
      },
    }),
    [],
  );

  if (!props.value) return null;

  return (
    <div className="space-y-4 text-balance [&_a:not(last-child)]:mr-4">
      <PortableText
        components={components as PortableTextComponents}
        value={props.value}
      />
    </div>
  );
}
