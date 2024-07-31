import type {PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';
import type {TypeFromSelection} from 'groqd';

import {PortableText} from '@portabletext/react';
import {useMemo} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {RICHTEXT_SECTION_FRAGMENT} from '~/qroq/sections';

import {cn} from '~/lib/utils';

import type {ButtonBlockProps} from '../sanity/richtext/components/ButtonBlock';
import type {ExternalLinkAnnotationProps} from '../sanity/richtext/components/ExternalLinkAnnotation';
import type {ImageBlockProps} from '../sanity/richtext/components/ImageBlock';
import type {InternalLinkAnnotationProps} from '../sanity/richtext/components/InternalLinkAnnotation';

import {RichtextLayout} from '../sanity/richtext/RichTextLayout';
import {ButtonBlock} from '../sanity/richtext/components/ButtonBlock';
import {ExternalLinkAnnotation} from '../sanity/richtext/components/ExternalLinkAnnotation';
import {ImageBlock} from '../sanity/richtext/components/ImageBlock';
import {InternalLinkAnnotation} from '../sanity/richtext/components/InternalLinkAnnotation';

type RichtextSectionProps = TypeFromSelection<typeof RICHTEXT_SECTION_FRAGMENT>;

export function RichtextSection(
  props: SectionDefaultProps & {data: RichtextSectionProps},
) {
  const {data} = props;
  const containerMaxWidth = data.maxWidth;

  const components = useMemo(
    () => ({
      marks: {
        externalLink: (props: {
          children: React.ReactNode;
          value: ExternalLinkAnnotationProps;
        }) => {
          return (
            <ExternalLinkAnnotation {...props.value}>
              {props.children}
            </ExternalLinkAnnotation>
          );
        },
        internalLink: (props: {
          children: React.ReactNode;
          value: InternalLinkAnnotationProps;
        }) => {
          return (
            <InternalLinkAnnotation {...props.value}>
              {props.children}
            </InternalLinkAnnotation>
          );
        },
      },
      types: {
        button: (props: {value: ButtonBlockProps}) => (
          <ButtonBlock {...props.value} />
        ),
        image: (props: {value: ImageBlockProps}) => (
          <ImageBlock containerMaxWidth={containerMaxWidth} {...props.value} />
        ),
      },
    }),
    [containerMaxWidth],
  );

  return (
    <section className="py-12 md:py-14 lg:py-16 container-w-padding site-grid bg-light">
      <div className={cn(
        "text-on-light col-span-full md:col-span-9 lg:col-span-7",
        props.data.desktopContentPosition === 'center' && 'md:col-start-2 lg:col-start-3',
        props.data.desktopContentPosition === 'left' && '',
        props.data.desktopContentPosition === 'right' && 'md:col-start-3 lg:col-start-5 flex justify-end flex-row',
      )}>
        <RichtextLayout
          contentAligment={props.data.contentAlignment}
          maxWidth={882}
        >
          {data.richtext && (
            <PortableText
              components={components as PortableTextComponents}
              value={data.richtext as PortableTextBlock[]}
            />
          )}
        </RichtextLayout>
      </div>
    </section>
  );
}
