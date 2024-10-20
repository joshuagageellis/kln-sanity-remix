import type {TypeFromSelection} from 'groqd';

import type {SectionDefaultProps} from '~/lib/type';
import type {HOMEPAGE_LARGE_TEXT_SECTION} from '~/qroq/sections';

type HomepageLargeTextProps = TypeFromSelection<
	typeof HOMEPAGE_LARGE_TEXT_SECTION
>;

export function HomepageLargeText(
	props: SectionDefaultProps & {data: HomepageLargeTextProps},
) {
	const {data} = props;
	const {content, darkMode} = data;
	return (
		<div className="homepage-large-text data-bg data-text [&[data-section-bg='dark']]:py-[var(--section-margin-half)]" data-section-bg={darkMode ? 'dark' : 'light'}>
			<div className="site-grid container-w-padding py-12 md:py-16 lg:py-20">
				<div className="col-span-full md:col-span-10 xl:col-span-8 max-w-[970px]">
					{content && (
						<h2 className="text-pretty leading-snug">
							{content}
						</h2>
					)}			
				</div>
			</div>
		</div>
	);
}