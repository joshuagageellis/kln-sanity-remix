import {vercelStegaCleanAll} from '@sanity/client/stega';
import {cx} from 'class-variance-authority';

import type {contentAlignmentValues} from '~/qroq/sections';

import {contentAlignment} from '~/components/cva/contentAlignment';

type AlignmentValues = (typeof contentAlignmentValues)[number];

export function RichtextLayout(props: {
  children: React.ReactNode;
  contentAligment?: AlignmentValues | null;
  desktopContentPosition?: AlignmentValues | null;
  maxWidth?: null | number;
}) {
  const style = {
    '--maxWidth': props.maxWidth ? `${props.maxWidth}px` : 'auto',
  } as React.CSSProperties;

  const cleanContentAlignement = vercelStegaCleanAll(props.contentAligment);
  const cleanContentPosition = vercelStegaCleanAll(
    props.desktopContentPosition,
  );

  return (
    <div
      className={cx([
        contentAlignment({
          required: cleanContentAlignement,
        }),
        cleanContentPosition === 'left' && 'mr-auto',
        cleanContentPosition === 'right' && 'ml-auto',
        cleanContentPosition === 'center' && 'mx-auto',
        'max-w-[var(--maxWidth)] space-y-4 rich-text',
      ])}
      style={style}
    >
      {props.children}
    </div>
  );
}
