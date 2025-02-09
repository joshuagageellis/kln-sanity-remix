import type {TypeFromSelection} from 'groqd';

import {Link, useLocation} from '@remix-run/react';
import {cx} from 'class-variance-authority';

import type {ANNOUCEMENT_BAR_FRAGMENT} from '~/qroq/fragments';

import {ArrowLink} from '~/components/ui/ArrowLink';
import { useLocalePath } from '~/hooks/useLocalePath';
import {useSanityRoot} from '~/hooks/useSanityRoot';

import {SanityInternalLink} from '../sanity/link/SanityInternalLink';

type AnnoucementBarProps = TypeFromSelection<typeof ANNOUCEMENT_BAR_FRAGMENT>;

export function AnnouncementBar() {
  const {data} = useSanityRoot();
  const {pathname} = useLocation();
  const path = useLocalePath({
    path: pathname
  });
  const header = data?.header;
  const annoucementBar = header?.annoucementBar;
  if (!annoucementBar || !annoucementBar.length) return null;
  const annoucementBarItem = annoucementBar[0];

  /**
   * Hide alert bar if on route.
   */
  if (path.replace(/^\/+/g, '') === annoucementBarItem.link?.slug?.current) {
    return null;
  }

  return (
    <section id="announcement-bar">
      <div className="group transition-all duration-300 bg-citrus text-charcoal relative flex justify-center p-3 pr-6 pl-6 has-[a:hover]:bg-amethyst has-[a:focus]:bg-amethyst">
        <AnnouncementBarLink {...annoucementBarItem as AnnoucementBarProps} />
        {!(annoucementBarItem.link || annoucementBarItem.externalLink) ? (
          <p className="body-20"><span>{annoucementBarItem.text}</span></p>
        ) : (
          <ArrowLink
            className=""
            size="small"
            variant="primary"
          >
            {annoucementBarItem.text}
          </ArrowLink>
        )}
      </div>
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
