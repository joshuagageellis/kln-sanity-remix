import type {TypeFromSelection} from 'groqd';

import {Link} from '@remix-run/react';
import {cx} from 'class-variance-authority';
import {m} from 'framer-motion';

import type {ANNOUCEMENT_BAR_FRAGMENT} from '~/qroq/fragments';

import {useSanityRoot} from '~/hooks/useSanityRoot';

import {SanityInternalLink} from '../sanity/link/SanityInternalLink';

type AnnoucementBarProps = TypeFromSelection<typeof ANNOUCEMENT_BAR_FRAGMENT>;

export function AnnouncementBar() {
  const {data} = useSanityRoot();
  const header = data?.header;
  const annoucementBar = header?.annoucementBar;
  if (!annoucementBar || !annoucementBar.length) return null;
  const annoucementBarItem = annoucementBar[0];
  return (
    <section id="announcement-bar">
      <m.div
        animate={{opacity: [0, 1], y: [-100, 0]}}
        transition={{delay: 0.3, duration: 0.5, ease: 'easeOut'}}
      >
        <div className="transition-all duration-300 bg-citrus text-panther relative flex justify-center p-3 pr-6 pl-6 has-[a:hover]:bg-yellow">
          <AnnouncementBarLink {...annoucementBarItem as AnnoucementBarProps} />
          <p className="body-20"><span>{annoucementBarItem.text}</span></p>
        </div>
      </m.div>
    </section>
  );
}

const AnnouncementBarLink = (props:  AnnoucementBarProps) => {
  const linkClass = "w-full h-full absolute top-0 left-0 z-10"
  return props.link ? (
    <SanityInternalLink
      className={cx(linkClass)}
      data={{
        _key: props.link.slug.current,
        _type: 'internalLink',
        anchor: null,
        link: props.link,
        name: props.text,
      }}
    >
      <span className="sr-only">{props.text}</span>
    </SanityInternalLink>
  ) : props.externalLink ? (
    <Link
      rel={props.openInNewTab ? 'noopener noreferrer' : ''}
      target={props.openInNewTab ? '_blank' : undefined}
      to={props.externalLink}
    >
      <span className="sr-only">{props.text}</span>
    </Link>
  ) : null;
};
