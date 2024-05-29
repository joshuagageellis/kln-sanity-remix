import type {EncodeDataAttributeCallback} from '@sanity/react-loader';
import type {InferType} from 'groqd';

import {createContext, useContext, useMemo} from 'react';

import type {FOOTERS_FRAGMENT} from '~/qroq/footers';
import type {
  COLLECTION_SECTIONS_FRAGMENT,
  PRODUCT_SECTIONS_FRAGMENT,
  SECTIONS_FRAGMENT,
} from '~/qroq/sections';

import {useIsDev} from '~/hooks/useIsDev';
import {sections} from '~/lib/sectionRelsolver';

type CmsSectionsProps =
  | NonNullable<InferType<typeof COLLECTION_SECTIONS_FRAGMENT>>[0]
  | NonNullable<InferType<typeof FOOTERS_FRAGMENT>>
  | NonNullable<InferType<typeof PRODUCT_SECTIONS_FRAGMENT>>[0]
  | NonNullable<InferType<typeof SECTIONS_FRAGMENT>>[0];

type CmsSectionType = 'footer' | 'section';

export function CmsSection(props: {
  data: CmsSectionsProps;
  encodeDataAttribute?: EncodeDataAttributeCallback;
  type?: CmsSectionType;
}) {
  const {data, encodeDataAttribute} = props;
  const isDev = useIsDev();
  const type = data._type;
  const Section = useMemo(() => sections[type], [type]);

  if (data?.settings?.hide) return null;

  return Section ? (
    <SectionWrapper
      data={data}
      encodeDataAttribute={encodeDataAttribute}
      type={props.type}
    >
      <Section data={data} encodeDataAttribute={encodeDataAttribute} />
    </SectionWrapper>
  ) : isDev ? (
    <MissingSection type={type} />
  ) : null;
}

function SectionWrapper(props: {
  children: React.ReactNode;
  data: CmsSectionsProps;
  encodeDataAttribute?: EncodeDataAttributeCallback;
  type?: CmsSectionType;
}) {
  const {children, data} = props;
  const isDev = useIsDev();
  const sectionType = data._type;

  return props.type === 'footer' ? (
    <footer
      className="section-padding relative bg-background text-foreground [content-visibility:auto]"
      data-footer-type={isDev ? sectionType : null}
    >
      {children}
    </footer>
  ) : (
    <SectionContext.Provider
      value={{encodeDataAttribute: props.encodeDataAttribute, id: data._key}}
    >
      <section
        className="section-padding relative bg-background text-foreground [content-visibility:auto]"
        data-section-type={isDev ? sectionType : null}
        id={`section-${data._key}`}
      >
        {children}
      </section>
    </SectionContext.Provider>
  );
}

export const SectionContext = createContext<{
  encodeDataAttribute?: EncodeDataAttributeCallback;
  id: null | string;
} | null>(null);

export function useSection() {
  return useContext(SectionContext);
}

function MissingSection(props: {type?: string}) {
  return (
    <section className="w-full bg-slate-800 text-white">
      <div className="container py-10 text-center">
        <div className="rounded-md border-2 border-dashed border-gray-400 px-5 py-10">
          <div>
            The section component{' '}
            {props.type && (
              <strong className="px-2 text-xl">{props.type}</strong>
            )}{' '}
            does not exist yet.
          </div>
        </div>
      </div>
    </section>
  );
}
