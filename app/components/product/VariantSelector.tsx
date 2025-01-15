import type {ProductOption} from '@shopify/hydrogen/storefront-api-types';
import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';
import type {PartialDeep} from 'type-fest';
import type {PartialObjectDeep} from 'type-fest/source/partial-deep';

import {Link, useNavigate} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {m} from 'framer-motion';
import {useCallback, useMemo} from 'react';

import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useOptimisticNavigationData} from '~/hooks/useOptimisticNavigationData';
import {useSelectedVariant} from '~/hooks/useSelectedVariant';

import {useSection} from '../CmsSection';

export type VariantOptionValue = {
  isActive: boolean;
  isAvailable: boolean;
  search: string;
  value: string;
};

export function VariantSelector(props: {
  options:
    | (
        | PartialObjectDeep<
            ProductOption,
            {
              recurseIntoArrays: true;
            }
          >
        | undefined
      )[]
    | undefined;
  variants?: Array<PartialDeep<ProductVariantFragmentFragment>>;
}) {
  const selectedVariant = useSelectedVariant({variants: props.variants});

  const options = useMemo(
    () =>
      props.options
        ?.filter((option) => option?.values && option.values?.length > 1)
        .map((option) => {
          let activeValue;
          const optionValues: VariantOptionValue[] = [];
          const variantSelectedOptions = selectedVariant?.selectedOptions;

          for (const value of option?.values ?? []) {
            const valueIsActive =
              value ===
              variantSelectedOptions?.find(
                (selectedOption) => selectedOption.name === option?.name,
              )?.value;

            if (valueIsActive) {
              activeValue = value;
            }

            const newOptions = variantSelectedOptions?.map((selectedOption) => {
              if (selectedOption.name === option?.name) {
                return {
                  ...selectedOption,
                  value,
                };
              }

              return selectedOption;
            });

            const matchedVariant = props.variants?.find((variant) =>
              variant?.selectedOptions?.every((selectedOption) => {
                return newOptions?.find(
                  (newOption) =>
                    newOption.name === selectedOption.name &&
                    newOption.value === selectedOption.value,
                );
              }),
            );

            const matchedVariantId = parseGid(matchedVariant?.id)?.id;

            if (value) {
              optionValues.push({
                isActive: valueIsActive,
                isAvailable: matchedVariant?.availableForSale ?? true,
                search: `?variant=${matchedVariantId}`,
                value,
              });
            }
          }

          return {
            name: option?.name,
            value: activeValue,
            values: optionValues,
          };
        }),
    [props.options, selectedVariant, props.variants],
  );

  return options?.map((option) => (
    <div key={option.name}>
      <div className="info-16">{option.name}</div>
      <Pills handle={selectedVariant?.product?.handle} option={option} />
    </div>
  ));
}

function Pills(props: {
  handle: string | undefined;
  option: {
    name: string | undefined;
    value: string | undefined;
    values: VariantOptionValue[];
  };
}) {
  const navigate = useNavigate();
  const optimisticId = `${props.option.name}-selected-variant`;
  const {optimisticData, pending} =
    useOptimisticNavigationData<string>(optimisticId);

  let values = props.option.values;

  if (optimisticData) {
    // Replace the active value with the optimistic value
    const optimisticValues = values.map((value) => {
      if (value.value === optimisticData) {
        return {
          ...value,
          isActive: true,
        };
      }

      return {
        ...value,
        isActive: false,
      };
    }, []);

    values = optimisticValues;
  }

  const handleSelectVariant = useCallback(
    (value: string, search: string) => {
      navigate(search, {
        preventScrollReset: true,
        replace: true,
        state: {
          optimisticData: value,
          optimisticId,
        },
      });
    },
    [navigate, optimisticId],
  );

  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-3">
      {values.map((value) => (
        <Pill
          handle={props.handle}
          key={value.value}
          onSelectVariant={handleSelectVariant}
          option={props.option}
          pending={pending}
          {...value}
        />
      ))}
    </div>
  );
}

function Pill(props: {
  handle?: string;
  isActive: boolean;
  isAvailable: boolean;
  onSelectVariant: (value: string, search: string) => void;
  option: {
    name: string | undefined;
    value: string | undefined;
    values: VariantOptionValue[];
  };
  pending: boolean;
  search: string;
  value: string;
}) {
  const {
    handle,
    isActive,
    isAvailable,
    onSelectVariant,
    option,
    pending,
    search,
    value,
  } = props;
  const isHydrated = useIsHydrated();
  const section = useSection();
  const layoutId = handle! + option.name + section?.id;

  const buttonClass = cx([
    'border-[2px] border-charcoal bg-transparent text-charcoal hover:bg-charcoal focus:bg-charcoal focus:text-marble hover:text-marble',
    'btn-text-sm min-h-[48px] px-3 py-1',
    'transition-colors duration-200 ease-in-out',
    isActive && 'pointer-events-none bg-charcoal text-marble',
    !isAvailable && 'opacity-50 pointer-events-none',
  ]);

  // Animated tabs implementation inspired by the fantastic Build UI recipes
  // (Check out the original at: https://buildui.com/recipes/animated-tabs)
  // Credit to the Build UI team for the awesome Pills animation.
  return isHydrated ? (
    <m.button
      className={buttonClass}
      disabled={pending}
      layout
      layoutRoot
      onClick={() => onSelectVariant(value, search)}
    >
      <span className="relative">
        {value}
      </span>
    </m.button>
  ) : (
    <Link className={buttonClass} to={search}>
      <span className="relative">
        {value}
      </span>
    </Link>
  );
}
