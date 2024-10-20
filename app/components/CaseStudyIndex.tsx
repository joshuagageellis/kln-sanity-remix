import type { InferType } from "groqd";

import { Link } from "@remix-run/react";

import type {ArrayMember} from '~/lib/type';
import type {CASE_STUDY_INDEX_PAGE} from '~/qroq/queries';

import {SanityImage} from '~/components/sanity/SanityImage';
import {StructuredLink} from '~/components/sanity/link/StructuredLink';
import { cn } from "~/lib/utils";

import { ArrowLink } from "./ui/ArrowLink";

export type CaseStudyIndexPage = InferType<typeof CASE_STUDY_INDEX_PAGE>;
export type CaseStudyCardProps = ArrayMember<NonNullable<CaseStudyIndexPage>['caseStudies']>;

// Get array of post topper images.
const pluckTopperImages = (caseStudy: CaseStudyCardProps) => {
  if (!caseStudy.sections || !caseStudy.sections.length) {
    return false;
  }
  const possible = caseStudy.sections.find((section) => section._type === 'caseStudyTopperSection')?.slides?.map((slide) => slide.image);
  if (!possible || !possible.length) {
    return false;
  }
  return possible;
}

const CaseStudyCard = (
	{
		caseStudy
	} : {
		caseStudy: CaseStudyCardProps;
	}
) => {
  const images = pluckTopperImages(caseStudy);
  return (
    <div className="relative group overflow-hidden sm:h-full">
      {caseStudy.title && (
        <StructuredLink
          _type="structuredLink"
          className="overlay-link"
          externalLink={false}
          manualLink={null}
          reference={{
            documentType: 'caseStudy',
            product: null,
            slug: {...caseStudy.slug, _type: 'slug'}
          }}
          title={caseStudy.title}
        >
          <span className="sr-only">{caseStudy.title}</span>
        </StructuredLink>
      )}
      <div className="sm:h-full">
        <div className="[&>span]:sm:h-full sm:h-full [&>span]:aspect-[4/3] [&>span]:sm:aspect-auto">
          {images && images.length && (
            <SanityImage
              className="size-full object-cover"
              data={images[0]}
              loading={'lazy'}
              showBorder={false}
              showShadow={false}
            />
          )}
        </div>
        {caseStudy.title && (
          <>
            <div className="hidden sm:block absolute left-2 bottom-2 right-2 z-[5] duration-300 opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-6 group-hover:translate-y-0 group-focus:translate-y-0">
              <p className="h5 highlight-hover highlight-hover--amethyst inline-flex">
                <ArrowLink size="small">
                  <span>{caseStudy.title}</span>  
                </ArrowLink>
              </p>
            </div>
            <div className="mt-4 mb-2 sm:hidden">
              <ArrowLink size="small">
                <span>{caseStudy.title}</span>  
              </ArrowLink>
            </div>
          </>
        )}
      </div>
    </div>
  )
};

const Pagination = ({
  page,
  perPage,
  total,
}: {
  page: number;
  perPage: number;
  total: number;
}) => {
  const totalPages = Math.ceil(total / perPage);
  const previousLink = `/case-studies?page=${page - 1}`;
  const nextLink = `/case-studies?page=${page + 1}`;
  return (
    <div className="flex flex-row gap-4 mt-4 items-baseline">
      {page > 1 && <Link className="body-link" to={previousLink}>Previous</Link>}
      <span className="body-20">{page}&nbsp;/&nbsp;{totalPages}</span>
      {page < totalPages && <Link className="body-link" to={nextLink}>Next</Link>}
    </div>
  )
}

export function CaseStudyIndex({
	caseStudies,
  caseStudiesTotal,
  page,
  perPage,
}: {
	caseStudies: NonNullable<CaseStudyIndexPage>['caseStudies'];
  caseStudiesTotal: NonNullable<CaseStudyIndexPage>['caseStudiesTotal'];
  page: number;
  perPage: number;
}) {
  // Filter out section-less case studies.
  caseStudies = caseStudies.filter((caseStudy) => {
    return caseStudy.sections && caseStudy.sections.length;
  });

	return (
		<section className="container-w-padding pb-12 bg-dark text-on-dark">
			<div>
				<ul
          className={cn(
            'site-grid gap-4',
            // 0
            '[&>*]:col-span-full',
            // 1
            '[&>*:nth-child(1)]:md:col-span-6 [&>*:nth-child(1)]:md:row-span-2 [&>*:nth-child(6)]:md:row-start-0',
            '[&>*:nth-child(1)]:lg:col-span-7 [&>*:nth-child(1)]:lg:row-span-2',
            // 6
            '[&>*:nth-child(6)]:md:col-span-6 [&>*:nth-child(6)]:md:row-span-2 [&>*:nth-child(6)]:md:row-start-3',
            '[&>*:nth-child(6)]:lg:col-span-7 [&>*:nth-child(6)]:lg:row-span-2',
            // 2, 3
            '[&>*:nth-child(2)]:md:col-span-5 [&>*:nth-child(2)]:md:row-span-1',
            '[&>*:nth-child(3)]:md:col-span-5 [&>*:nth-child(3)]:md:row-span-1',
            '[&>*:nth-child(2)]:lg:col-span-4',
            '[&>*:nth-child(3)]:lg:col-span-4',
            // 4, 5
            '[&>*:nth-child(4)]:md:col-span-5 [&>*:nth-child(4)]:md:row-span-1 [&>*:nth-child(4)]:md:row-start-3',
            '[&>*:nth-child(5)]:md:col-span-5 [&>*:nth-child(5)]:md:row-span-1 [&>*:nth-child(5)]:md:row-start-4',
            '[&>*:nth-child(4)]:lg:col-span-4',
            '[&>*:nth-child(5)]:lg:col-span-4',
          )}
        >
					{caseStudies.map((caseStudy) => {
						return (
							<li key={caseStudy._id}>
								<CaseStudyCard caseStudy={caseStudy} />
							</li>
						);
					})}
				</ul>
        <div>
          <Pagination
            page={page}
            perPage={perPage}
            total={caseStudiesTotal as number}
          />
        </div>
			</div>
		</section>
	);
}