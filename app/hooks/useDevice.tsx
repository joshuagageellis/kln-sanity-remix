import {useMemo} from 'react';
import {useMedia} from 'react-use';

export function useDevice() {
  const isMobile = useMedia('(max-width: 768px)', false);
  const isTablet = useMedia(
    '(min-width: 768px) and (max-width: 1024px)',
    false,
  );

  const device = useMemo(() => {
    if (isMobile) {
      return 'mobile';
    } else if (isTablet) {
      return 'tablet';
    }
    return 'desktop';
  }, [isMobile, isTablet]);

  return device;
}
