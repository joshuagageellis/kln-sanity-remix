import {nanoid} from 'nanoid';
import {DEFAULT_LOCALE} from '../../countries';
import {setShowTrailingZeroKeyValue} from '../../app/lib/utils';

export const initialSingletonsValues = {} as const;

function generateIntString(value: string) {
  const locale = DEFAULT_LOCALE;
  return [
    {
      _key: locale.language.toLowerCase(),
      _type: 'internationalizedArrayStringValue',
      value: value,
    },
  ];
}
