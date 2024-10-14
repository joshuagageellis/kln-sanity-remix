import type {TypeFromSelection} from 'groqd';

import type {STRUCTURED_LINK_FRAGMENT} from '~/qroq/links';

import {cn} from '~/lib/utils';

import {SanityExternalLink} from './SanityExternalLink';
import {SanityInternalLink} from './SanityInternalLink';

export type StructuredLinkProps = TypeFromSelection<typeof STRUCTURED_LINK_FRAGMENT>;

export const hasLink = (props: StructuredLinkProps|null|undefined) => {
  if (!props) return false;
  return props?.manualLink || props?.reference;
};

export function StructuredLink(
  props: StructuredLinkProps & {
    children?: React.ReactNode;
    className?: string;
  }|null|undefined,
) {
  if (!props) return null;
  const isExternal = props.externalLink;

  // Valid check.
  if (isExternal && !props.manualLink) {
    return null;
  } else if (!isExternal && !props.reference) {
    return null;
  }

  const className = cn(props.className, 'group');

  return (
    <>
      {isExternal ? (
        <SanityExternalLink
          className={className}
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
          className={className}
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
