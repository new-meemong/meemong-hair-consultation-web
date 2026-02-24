import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { AppTypography } from '@/shared/styles/typography';
import { HAIR_CONSULTATION_DESIRED_DATE_TYPE_VALUES } from '../../constants/hair-consultation-create-options';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';
import { Input } from '@/shared';
import RoundCheckboxEmptyIcon from '@/assets/icons/round-checkbox-empty.svg';
import RoundCheckboxIcon from '@/assets/icons/round-checkbox.svg';

const PRICE_STEP = 10000;
const MIN_PRICE = 10000;
const QUICK_ADD_AMOUNTS = [30000, 50000, 100000];
const FREE_INPUT_DESIRED_DATE_TYPE = '원하는 날짜 있음';

export default function HairConsultationFormStepPrice() {
  const { control, setValue } = useFormContext<HairConsultationFormValues>();
  const desiredDateInputRef = useRef<HTMLInputElement | null>(null);

  const price = useWatch({
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.PRICE,
    control,
  });

  const desiredDateType = useWatch({
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.DESIRED_DATE_TYPE,
    control,
  });

  const desiredDate = useWatch({
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.DESIRED_DATE,
    control,
  });

  const currentPrice = price ?? { minPaymentPrice: null, maxPaymentPrice: null };
  const maxPaymentPrice = currentPrice.maxPaymentPrice ?? MIN_PRICE;
  const priceInMan = Math.floor(maxPaymentPrice / PRICE_STEP);
  const displayPrice = priceInMan.toLocaleString();
  const canDecrease = maxPaymentPrice > MIN_PRICE;

  const setMaxPaymentPrice = (nextPrice: number) => {
    setValue(
      HAIR_CONSULTATION_FORM_FIELD_NAME.PRICE,
      {
        ...currentPrice,
        minPaymentPrice: null,
        maxPaymentPrice: Math.max(MIN_PRICE, nextPrice),
      },
      { shouldDirty: true },
    );
  };

  const handlePriceAdjust = (delta: number) => {
    setMaxPaymentPrice(maxPaymentPrice + delta);
  };

  const handleQuickAdd = (amount: number) => {
    setMaxPaymentPrice(maxPaymentPrice + amount);
  };

  const handlePriceReset = () => {
    setMaxPaymentPrice(MIN_PRICE);
  };

  const handleDesiredDateSelect = (
    value: (typeof HAIR_CONSULTATION_DESIRED_DATE_TYPE_VALUES)[number],
  ) => {
    setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.DESIRED_DATE_TYPE, value, {
      shouldDirty: true,
    });

    if (value !== FREE_INPUT_DESIRED_DATE_TYPE) {
      setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.DESIRED_DATE, null, {
        shouldDirty: true,
      });
      return;
    }
    requestAnimationFrame(() => {
      desiredDateInputRef.current?.focus();
      desiredDateInputRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTimeout(() => {
        desiredDateInputRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 200);
    });
  };

  useEffect(() => {
    if (desiredDateType !== FREE_INPUT_DESIRED_DATE_TYPE) return;
    const visualViewport = window.visualViewport;
    if (!visualViewport) return;

    const handleResize = () => {
      desiredDateInputRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };

    visualViewport.addEventListener('resize', handleResize);
    return () => visualViewport.removeEventListener('resize', handleResize);
  }, [desiredDateType]);

  const getDesiredDateTypeLabel = (
    value: (typeof HAIR_CONSULTATION_DESIRED_DATE_TYPE_VALUES)[number],
  ) =>
    value === FREE_INPUT_DESIRED_DATE_TYPE ? `${FREE_INPUT_DESIRED_DATE_TYPE}(자유입력)` : value;

  return (
    <div className="flex flex-col">
      <div className="flex items-center w-full bg-alternative px-2 py-2 rounded-[5px]">
        <button
          type="button"
          disabled={!canDecrease}
          className={[
            'w-8 h-8 rounded-4 text-white flex items-center justify-center',
            canDecrease ? 'bg-label-default' : 'bg-label-disable',
          ].join(' ')}
          onClick={() => handlePriceAdjust(-PRICE_STEP)}
        >
          -
        </button>
        <span className="flex-1 text-center">
          <span className={`${AppTypography.body2Regular} text-label-default`}>{displayPrice}</span>
          <span className={`${AppTypography.body2Medium} text-label-sub`}> 만원</span>
        </span>
        <button
          type="button"
          className="w-8 h-8 rounded-4 bg-label-default text-white flex items-center justify-center"
          onClick={() => handlePriceAdjust(PRICE_STEP)}
        >
          +
        </button>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          {QUICK_ADD_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              className="px-3 py-1.5 rounded-full border border-border-default bg-white text-label-sub typo-body-3-regular"
              onClick={() => handleQuickAdd(amount)}
            >
              +{amount / PRICE_STEP}만원
            </button>
          ))}
        </div>
        <button
          type="button"
          className="w-[34px] h-[34px] rounded-full border border-border-default bg-white flex items-center justify-center"
          aria-label="금액 초기화"
          onClick={handlePriceReset}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <g clipPath="url(#clip0_10392_2433)">
              <path
                d="M13.2378 4.7625C12.1503 3.675 10.6578 3 9.00031 3C5.68531 3 3.00781 5.685 3.00781 9C3.00781 12.315 5.68531 15 9.00031 15C11.7978 15 14.1303 13.0875 14.7978 10.5H13.2378C12.6228 12.2475 10.9578 13.5 9.00031 13.5C6.51781 13.5 4.50031 11.4825 4.50031 9C4.50031 6.5175 6.51781 4.5 9.00031 4.5C10.2453 4.5 11.3553 5.0175 12.1653 5.835L9.75031 8.25H15.0003V3L13.2378 4.7625Z"
                fill="#777777"
              />
            </g>
            <defs>
              <clipPath id="clip0_10392_2433">
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <span className={`${AppTypography.headlineSemiBold} text-label-default`}>
            언제 시술 받고 싶으신가요?
          </span>
          <span className="typo-body-2-semibold text-cautionary">선택</span>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          {HAIR_CONSULTATION_DESIRED_DATE_TYPE_VALUES.map((value) => {
            const checked = desiredDateType === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={checked}
                className="flex items-center justify-between px-4 py-3.5 border border-border-default rounded-6 bg-white"
                onClick={() => handleDesiredDateSelect(value)}
              >
                <span className="flex-1 text-left typo-body-2-long-medium text-label-sub">
                  {getDesiredDateTypeLabel(value)}
                </span>
                {checked ? <RoundCheckboxIcon /> : <RoundCheckboxEmptyIcon />}
              </button>
            );
          })}
        </div>

        {desiredDateType === FREE_INPUT_DESIRED_DATE_TYPE && (
          <div className="border-b-1 border-border-strong mt-3">
            <Input
              type="text"
              ref={desiredDateInputRef}
              value={desiredDate ?? ''}
              onChange={(e) => {
                const nextValue = e.target.value;
                setValue(
                  HAIR_CONSULTATION_FORM_FIELD_NAME.DESIRED_DATE,
                  nextValue === '' ? null : nextValue,
                  { shouldDirty: true },
                );
              }}
              aria-label="원하는 시술일"
              placeholder="원하는 시술일을 설명해주세요"
              className="h-9"
            />
          </div>
        )}
      </div>
    </div>
  );
}
