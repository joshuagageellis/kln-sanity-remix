import type {TypeFromSelection} from 'groqd';

import {m} from 'framer-motion';

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
				<m.div
					className="col-span-full md:col-span-10 xl:col-span-8"
					initial={{opacity: 0, scale: 0.98, translateX: '-10px', translateY: '25px'}}
					transition={{duration: 0.6}}
					whileInView={{opacity: 1, scale: 1, translateX: '0px', translateY: '0px'}}
				>
					{content && (
						<h2 className="text-pretty leading-tight">
							{content}
						</h2>
					)}			
				</m.div>
			</div>
		</div>
	);
}