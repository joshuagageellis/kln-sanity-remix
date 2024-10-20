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

/**
 * Rich Text Section.
 * The alignment and content position attributes ar  disbled to enforce center alignment.
 * The commentted out code can be used to enable these attributes.
 * (See Sanity schema)
 */
export function RichtextSection(
  props: SectionDefaultProps & {data: RichtextSectionProps},
) {
  const {data} = props;
  const {darkMode} = data;
  const containerMaxWidth = 882;

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
    <div 
      className="container-w-padding site-grid data-bg data-text [&[data-section-bg='dark']]:py-[var(--section-margin-half)]"
      data-section-bg={darkMode ? 'dark' : 'light'}
    >
      <div className={cn(
        "col-span-full md:col-span-9 lg:col-span-7",
        'md:col-start-2 lg:col-start-3 flex justify-center',
        // props.data.desktopContentPosition === 'center' && 'md:col-start-2 lg:col-start-3 flex justify-center',
        // props.data.desktopContentPosition === 'left' && '',
        // props.data.desktopContentPosition === 'right' && 'md:col-start-3 lg:col-start-5 flex justify-end flex-row',
      )}>
        <RichtextLayout
          contentAligment={'left'}
          // contentAligment={props.data.contentAlignment}
          maxWidth={containerMaxWidth}
        >
          {data.richtext && (
            <PortableText
              components={components as PortableTextComponents}
              value={data.richtext as PortableTextBlock[]}
            />
          )}
        </RichtextLayout>
      </div>
    </div>
  );
}
