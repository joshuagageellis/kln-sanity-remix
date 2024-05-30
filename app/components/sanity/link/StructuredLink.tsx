import type {TypeFromSelection} from 'groqd';

import type {STRUCTURED_LINK_FRAGMENT} from '~/qroq/links';

import {SanityExternalLink} from './SanityExternalLink';
import {SanityInternalLink} from './SanityInternalLink';

type StructuredLinkProps = TypeFromSelection<typeof STRUCTURED_LINK_FRAGMENT>;

export function StructuredLink(
  props: StructuredLinkProps & {
    children?: React.ReactNode;
    className?: string;
  },
) {
  const isExternal = props.externalLink;

  // Valid check.
  if (isExternal && !props.manualLink) {
    return null;
  } else if (!isExternal && !props.reference) {
    return null;
  }

  return (
    <>
      {isExternal ? (
        <SanityExternalLink
          className={props.className}
          data={{
            _key: null,
            _type: 'externalLink',
            link: props.manualLink,
            name: props.title,
            openInNewTab: false,
          }}
        >
          {props.children}
        </SanityExternalLink>
      ) : (
        <SanityInternalLink
          className={props.className}
          data={{
            _key: null,
            _type: 'internalLink',
            anchor: null,
            link: props.reference,
            name: props.title,
          }}
        >
          {props.children}
        </SanityInternalLink>
      )}
    </>
  );
}
