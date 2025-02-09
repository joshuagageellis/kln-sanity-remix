import type {PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';
import type {TypeFromSelection} from 'groqd';

import {PortableText} from '@portabletext/react';
import {useMemo} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {TWO_COLUMN_ACCORDION_SECTION_FRAGMENT} from '~/qroq/sections';

import type {ButtonBlockProps} from '../sanity/richtext/components/ButtonBlock';
import type {ExternalLinkAnnotationProps} from '../sanity/richtext/components/ExternalLinkAnnotation';
import type {ImageBlockProps} from '../sanity/richtext/components/ImageBlock';
import type {InternalLinkAnnotationProps} from '../sanity/richtext/components/InternalLinkAnnotation';

import {StructuredLink} from '../sanity/link/StructuredLink';
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
import {Button} from '../ui/Button';

export type TwoColumnAccordionSectionProps = TypeFromSelection<
  typeof TWO_COLUMN_ACCORDION_SECTION_FRAGMENT
>;

export function TwoColumnAccordionSection(
  props: SectionDefaultProps & {data: TwoColumnAccordionSectionProps},
) {
  const {data} = props;
  const {accordions, darkMode, deck, structuredLink, title} = data;

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
		[]
  );

  return (
    <div className="data-bg data-text [&[data-section-bg='dark']]:py-[var(--section-margin-half)]"  data-section-bg={darkMode ? 'dark' : 'light'}>
      <div className="container-w-padding site-grid py-6 md:py-8 lg:py-10">
        <div className="mb-8 lg:mb-0 col-span-full lg:col-span-5 lg:pr-6 lg:py-8 lg:mt-9">
          <h2>{title}</h2>
          {deck && <p className="body-20 mt-2 max-w-[480px]">{deck}</p>}
          {structuredLink && (
            <div className="mt-6 md:mt-8 lg:mt-12">
              <Button
                asChild
                variant={darkMode ? 'outlineDark' : 'outline'}
              >
                <StructuredLink
                  className="min-w-[180px] lg:min-w-[220px]"
                  {...structuredLink}
                >
                  {structuredLink.title}
                </StructuredLink>
              </Button>
            </div>
          )}
        </div>
        <div className="col-span-full lg:col-span-6 lg:col-start-6">
          <Accordion className="flex flex-col gap-2 md:gap-6 lg:gap-8" type="multiple">
            {accordions &&
              accordions.map((accordion) => (
                <AccordionItem key={accordion._key} value={accordion._key}>
                  <AccordionTrigger className="ml-[-0.5rem] lg:ml-0 flex flex-row gap-4 justify-between items-center" hoverEffect triggerSize="small">
                    <h3 className="left-[-0.5rem] text-pretty">{accordion.title}</h3>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-6 mb-2">
                      <RichtextLayout>
                        {accordion.content && (
                          <PortableText
                            components={components as PortableTextComponents}
                            value={accordion.content as PortableTextBlock[]}
                          />
                        )}
                      </RichtextLayout>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
