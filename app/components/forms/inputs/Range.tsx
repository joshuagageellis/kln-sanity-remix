import type {FieldHookConfig} from 'formik';

import {useField} from 'formik';
import {useCallback, useRef} from 'react';

import {cn} from '~/lib/utils';

import {ErrorMessageWrapper, labelClass} from '../ContactForm';

const formatAsCurrency = (value: number) => {
  return value.toLocaleString('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: 'currency',
  });
};

export function SliderField({
  currency,
  label,
  max,
  min,
  postFix = '',
  unlimited,
  ...props
}: {
  currency?: boolean;
  label: string;
  max: number;
  min: number;
  postFix?: string;
  unlimited?: boolean; // Adds a '+' to the max value
} & FieldHookConfig<any> &
  JSX.IntrinsicElements['input']) {
  const [field, , helpers] = useField(props);
  const fieldValue = field.value as [number, number];
  const range = useRef<HTMLDivElement>(null);
  const step = Number(props.step || 1);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  );

  return (
    <>
      <div className={cn(['grow basis-1/2'])}>
        <label className={cn(labelClass)} htmlFor={field?.name}>
          {label}
        </label>
        <div className="relative mt-6 h-16">
          <input
            className={cn(['thumb'])}
            max={max}
            min={min}
            onChange={(event) => {
              const value = Math.min(
                Number(event.target.value),
                fieldValue[1] - step,
              );
              helpers.setValue([value, fieldValue[1]]);
            }}
            step={step}
            type="range"
            value={fieldValue[0]}
          />
          <input
            className={cn(['thumb'])}
            max={max}
            min={min}
            onChange={(event) => {
              const value = Math.max(
                Number(event.target.value),
                fieldValue[0] + step,
              );
              helpers.setValue([fieldValue[0], value]);
            }}
            step={step}
            type="range"
            value={fieldValue[1]}
          />
          <div className="[&>*]:absolute">
            {/* track */}
            <div className="rounded-2 top-0 z-10 h-2 w-full bg-panther" />
            {/* range */}
            <div
              className="rounded-2 top-0 z-20 h-2 bg-citrus"
              ref={range}
              style={{
                left: `${getPercent(fieldValue[0])}%`,
                width: `${getPercent(fieldValue[1]) - getPercent(fieldValue[0])}%`,
              }}
            />
            {/* left */}
            <div className="h6 left-0 mt-8 text-charcoal">
              {currency ? formatAsCurrency(fieldValue[0]) : fieldValue[0]}
              {` ${postFix}`}
            </div>
            {/* right */}
            <div className="h6 right-0 mt-8 text-charcoal">
              {unlimited && fieldValue[1] === max && '+'}
              {currency ? formatAsCurrency(fieldValue[1]) : fieldValue[1]}
              {` ${postFix}`}
            </div>
          </div>
        </div>
        <input className="hidden" tabIndex={-1} {...field} {...props} />
        <ErrorMessageWrapper name={field.name} />
      </div>
    </>
  );
}
