import type {InferType} from 'groqd';

import type {SETTINGS_FRAGMENT} from '~/qroq/fragments';

import {useSanityRoot} from '~/hooks/useSanityRoot';

import {SanityImage} from '../sanity/SanityImage';

type Logo = InferType<typeof SETTINGS_FRAGMENT.logo>;

export function Logo(props: {
  className?: string;
  loading?: 'eager' | 'lazy';
  sanityEncodeData?: string;
  sizes?: null | string;
  style?: React.CSSProperties;
}) {
  const {data, encodeDataAttribute} = useSanityRoot();
  const sanitySettings = data?.settings;
  const logo = sanitySettings?.logo;
  const siteName = sanitySettings?.siteName;

  if (!logo?._ref) {
    return (
      <div className="">
        {siteName}
      </div>
    );
  }

  const encodeData = encodeDataAttribute([
    // Path to the logo image in Sanity Studio
    'settings',
    'logo',
    '_ref',
    logo._ref,
  ]);

  return (
    <SanityImage
      data={{
        ...logo,
        altText: siteName || '',
      }}
      dataSanity={encodeData}
      loadingBefore={false}
      {...props}
    />
  );
}
