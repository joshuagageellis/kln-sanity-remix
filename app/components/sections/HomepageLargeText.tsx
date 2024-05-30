import type {TypeFromSelection} from 'groqd';

import type {SectionDefaultProps} from '~/lib/type';
import type {HOMEPAGE_LARGE_TEXT_SECTION} from '~/qroq/sections';

type HomepageLargeTextProps = TypeFromSelection<
	typeof HOMEPAGE_LARGE_TEXT_SECTION
>;

export function HomepageLargeText(
	props: SectionDefaultProps & {data: HomepageLargeTextProps},
) {
	return (
		<div className="homepage-large-text mb-16 md:mb-32">
			<div className="site-grid container-w-padding">
				<div className="col-span-full md:col-span-10 xl:col-span-8">
					{props.data.content && (
						<h2 className="text-marble text-pretty leading-snug">
							{props.data.content}
						</h2>
					)}			
				</div>
			</div>
		</div>
	);
}