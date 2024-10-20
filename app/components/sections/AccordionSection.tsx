import type {PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';
import type {TypeFromSelection} from 'groqd';

import {PortableText} from '@portabletext/react';
import {useMemo} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {ACCORDION_SECTION} from '~/qroq/sections';

import {cn} from '~/lib/utils';

import type {ButtonBlockProps} from '../sanity/richtext/components/ButtonBlock';
import type {ExternalLinkAnnotationProps} from '../sanity/richtext/components/ExternalLinkAnnotation';
import type {ImageBlockProps} from '../sanity/richtext/components/ImageBlock';
import type {InternalLinkAnnotationProps} from '../sanity/richtext/components/InternalLinkAnnotation';

import {SanityImage} from '../sanity/SanityImage';
import {StructuredLink, hasLink} from '../sanity/link/StructuredLink';
import {RichtextLayout} from '../sanity/richtext/RichTextLayout';
import {ButtonBlock} from '../sanity/richtext/components/ButtonBlock';
import {ExternalLinkAnnotation} from '../sanity/richtext/components/ExternalLinkAnnotation';
import {ImageBlock} from '../sanity/richtext/components/ImageBlock';
import {InternalLinkAnnotation} from '../sanity/richtext/components/InternalLinkAnnotation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/Accordion';
import {ArrowLink} from '../ui/ArrowLink';

type AccordionSectionProps = TypeFromSelection<typeof ACCORDION_SECTION>;

export function AccordionSection(
  props: SectionDefaultProps & {data: AccordionSectionProps},
) {
  const {data} = props;

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
          <ImageBlock {...props.value} />
        ),
      },
    }),
    [],
  );

  // Essentially no render, satisfies type checker since _key is nullable.
  if (!data._key) return null;
  return (
    <div className="text-on-light accordion-section-stack bg-light">
      <div className="container-w-padding">
        <Accordion type="multiple">
          <AccordionItem value={data._key}>
            <AccordionTrigger
              className="flex flex-row-reverse items-center justify-end gap-4 md:gap-10"
              hoverColor="amethyst"
              hoverEffect
              triggerSize="large"
            >
              {data.title && (
                <h2 className="h2-super left-[-0.5rem]">{data.title}</h2>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="site-grid mt-6 gap-6 md:mt-9 md:gap-12">
                <div
                  className={cn(
                    'col-span-full',
                    data.image ? 'md:col-span-6' : 'lg:col-span-7',
                  )}
                >
                  <RichtextLayout>
                    {data.content && (
                      <PortableText
                        components={components as PortableTextComponents}
                        value={data.content as PortableTextBlock[]}
                      />
                    )}
                  </RichtextLayout>
                </div>
                <div className="group col-span-full md:col-span-5">
                  <span className="relative">
                    {data.image &&
                      data.structuredLink &&
                      hasLink(data.structuredLink) && (
                        <StructuredLink
                          {...data.structuredLink}
                          className="overlay-link"
                        >
                          <span className="sr-only">
                            {data.structuredLink?.title}
                          </span>
                        </StructuredLink>
                      )}
                    {data.image && (
                      <div>
                        <SanityImage
                          aspectRatio="4/3"
                          className="size-full object-cover"
                          data={data.image}
                          loading={'lazy'}
                          showBorder={false}
                          showShadow={false}
                        />
                      </div>
                    )}
                    {hasLink(data.structuredLink) && (
                      <div
                        className={cn(
                          data.image
                            ? 'absolute bottom-2 left-2 right-2 z-[5]'
                            : '',
                        )}
                      >
                        <p className="h4 highlight highlight--wide highlight--amethyst inline-flex">
                          <ArrowLink size="small">
                            <span>{data.structuredLink?.title}</span>
                          </ArrowLink>
                        </p>
                      </div>
                    )}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
