import { Input, Textarea } from '@/shared';
import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import CloseIcon from '@/assets/icons/close.svg';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import FormItem from '@/shared/ui/form-item';
import ImageUploaderList from '@/shared/ui/image-uploader-list';
import { cn } from '@/lib/utils';

const MAX_IMAGE_COUNT = 6;
const PRICE_STEP_BUTTONS = [10000, 30000, 50000, 100000] as const;

type PriceType =
  ConsultingResponseFormValues[typeof CONSULTING_RESPONSE_FORM_FIELD_NAME.ANSWER_PRICE_INFO]['priceType'];

function PriceAdjustButtons({
  onAdd,
  className,
}: {
  onAdd: (amount: number) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {PRICE_STEP_BUTTONS.map((amount) => (
        <button
          key={amount}
          type="button"
          className="px-3 py-1.5 rounded-full border border-border-default bg-white text-label-sub typo-body-3-regular active:bg-alternative"
          onClick={() => onAdd(amount)}
        >
          +{(amount / 10000).toLocaleString()}만원
        </button>
      ))}
    </div>
  );
}

function UnderlinePriceInput({
  label,
  value,
  placeholder,
  onChange,
  onClear,
}: {
  label?: string;
  value: number | null;
  placeholder: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex gap-4 items-center">
      {label && (
        <div className="px-4 py-1.5 typo-body-2-long-medium text-label-info bg-alternative rounded-6 whitespace-nowrap">
          {label}
        </div>
      )}
      <div className="flex gap-2 typo-body-2-regular flex-1 items-center">
        <div className="border-b-1 border-border-strong flex-1">
          <Input
            value={value != null ? value.toLocaleString() : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-9"
            inputMode="numeric"
          />
        </div>
        {value != null && (
          <button type="button" onClick={onClear} className="size-5 flex items-center justify-center">
            <CloseIcon className="size-4 text-label-sub" />
          </button>
        )}
        <span className="text-label-info">원</span>
      </div>
    </div>
  );
}

export default function ConsultingResponseFormStepTreatmentsNew() {
  const { control, register, setValue, getValues } = useFormContext<ConsultingResponseFormValues>();

  const priceInfo = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.ANSWER_PRICE_INFO,
  });
  const currentWatchedImageFiles = useWatch({
    name: `${CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE}.imageFiles`,
    control,
  });
  const currentWatchedImageUrls = useWatch({
    name: `${CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE}.imageUrls`,
    control,
  });

  const currentImageFiles = useMemo(
    () => currentWatchedImageFiles ?? [],
    [currentWatchedImageFiles],
  );
  const currentImageUrls = useMemo(() => currentWatchedImageUrls ?? [], [currentWatchedImageUrls]);

  const priceType: PriceType = priceInfo?.priceType ?? 'SINGLE';
  const singlePrice = priceInfo?.singlePrice ?? null;
  const minPrice = priceInfo?.minPrice ?? null;
  const maxPrice = priceInfo?.maxPrice ?? null;

  const setPriceInfo = (next: Partial<ConsultingResponseFormValues['answerPriceInfo']>) => {
    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.ANSWER_PRICE_INFO,
      {
        priceType,
        singlePrice,
        minPrice,
        maxPrice,
        ...next,
      },
      { shouldDirty: true },
    );
  };

  const handlePriceTypeChange = (nextType: PriceType) => {
    if (nextType === 'SINGLE') {
      setPriceInfo({
        priceType: 'SINGLE',
        minPrice: null,
        maxPrice: null,
      });
      return;
    }
    setPriceInfo({
      priceType: 'RANGE',
      singlePrice: null,
    });
  };

  const handleSinglePriceInput = (value: string) => {
    const digits = value.replace(/\D/g, '');
    setPriceInfo({ singlePrice: digits ? Number(digits) : null });
  };
  const handleRangePriceInput = (name: 'minPrice' | 'maxPrice', value: string) => {
    const digits = value.replace(/\D/g, '');
    const parsedValue = digits ? Number(digits) : null;

    if (name === 'minPrice') {
      setPriceInfo({ minPrice: parsedValue });
      return;
    }

    setPriceInfo({ maxPrice: parsedValue });
  };

  const handleSinglePriceAdd = (amount: number) => {
    setPriceInfo({ singlePrice: Math.max(0, (singlePrice ?? 0) + amount) });
  };

  const handleRangeAdd = (target: 'minPrice' | 'maxPrice', amount: number) => {
    const currentValue = target === 'minPrice' ? minPrice : maxPrice;
    const nextValue = Math.max(0, (currentValue ?? 0) + amount);

    if (target === 'minPrice') {
      setPriceInfo({
        minPrice: nextValue,
        maxPrice: maxPrice != null && maxPrice < nextValue ? nextValue : maxPrice,
      });
      return;
    }
    setPriceInfo({
      maxPrice: nextValue,
      minPrice: minPrice != null && minPrice > nextValue ? nextValue : minPrice,
    });
  };

  const handleImageUpload = useCallback(
    (files: File[]) => {
      const styleValue = getValues(CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE);
      setValue(
        CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE,
        { ...styleValue, imageFiles: [...currentImageFiles, ...files] },
        { shouldDirty: true },
      );
    },
    [currentImageFiles, getValues, setValue],
  );

  const setImageFiles = useCallback(
    (newImageFiles: File[]) => {
      const styleValue = getValues(CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE);
      setValue(
        CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE,
        { ...styleValue, imageFiles: newImageFiles },
        { shouldDirty: true },
      );
    },
    [getValues, setValue],
  );

  const setImageUrls = useCallback(
    (newImageUrls: string[]) => {
      const styleValue = getValues(CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE);
      setValue(
        CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE,
        { ...styleValue, imageUrls: newImageUrls },
        { shouldDirty: true },
      );
    },
    [getValues, setValue],
  );

  return (
    <div className="flex flex-col gap-8 pb-28">
      <section className="flex flex-col gap-3">
        <FormItem label="시술명" required hasUnderline>
          <Input
            {...register(CONSULTING_RESPONSE_FORM_FIELD_NAME.ANSWER_TREATMENT_NAME)}
            maxLength={22}
            placeholder="시술명을 입력해주세요"
            className="h-9"
          />
        </FormItem>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <p className="typo-body-2-medium text-label-default">가격정보</p>
          <span className="size-1 rounded-full bg-negative-light" />
        </div>
        <div className="grid grid-cols-2 rounded-6 bg-alternative p-1">
          <button
            type="button"
            className={cn(
              'h-9 rounded-6 typo-body-2-medium',
              priceType === 'SINGLE'
                ? 'bg-white text-label-default shadow-[2px_2px_20px_0_rgba(0,0,0,0.06),2px_2px_10px_0_rgba(0,0,0,0.04)]'
                : 'bg-transparent text-label-sub',
            )}
            onClick={() => handlePriceTypeChange('SINGLE')}
          >
            단일가격
          </button>
          <button
            type="button"
            className={cn(
              'h-9 rounded-6 typo-body-2-medium',
              priceType === 'RANGE'
                ? 'bg-white text-label-default shadow-[2px_2px_20px_0_rgba(0,0,0,0.06),2px_2px_10px_0_rgba(0,0,0,0.04)]'
                : 'bg-transparent text-label-sub',
            )}
            onClick={() => handlePriceTypeChange('RANGE')}
          >
            범위
          </button>
        </div>

        {priceType === 'SINGLE' ? (
          <div className="mt-1">
            <UnderlinePriceInput
              value={singlePrice}
              onChange={handleSinglePriceInput}
              onClear={() => setPriceInfo({ singlePrice: null })}
              placeholder="예상 시술금액을 입력해주세요"
            />
            <PriceAdjustButtons onAdd={handleSinglePriceAdd} className="mt-3" />
          </div>
        ) : (
          <div className="mt-1 flex flex-col gap-9">
            <div className="flex flex-col gap-3">
              <UnderlinePriceInput
                label="최소"
                value={minPrice}
                onChange={(value) => handleRangePriceInput('minPrice', value)}
                onClear={() => setPriceInfo({ minPrice: null })}
                placeholder="금액을 숫자로 입력해주세요"
              />
              <PriceAdjustButtons onAdd={(amount) => handleRangeAdd('minPrice', amount)} />
            </div>
            <div className="flex flex-col gap-3">
              <UnderlinePriceInput
                label="최대"
                value={maxPrice}
                onChange={(value) => handleRangePriceInput('maxPrice', value)}
                onClear={() => setPriceInfo({ maxPrice: null })}
                placeholder="금액을 숫자로 입력해주세요"
              />
              <PriceAdjustButtons onAdd={(amount) => handleRangeAdd('maxPrice', amount)} />
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <p className="typo-body-2-medium text-label-default">참고 이미지</p>
        <p className="typo-body-2-regular text-label-info">이미지가 있으면 매장 방문 확률이 높아져요</p>
        <ImageUploaderList
          imageFiles={currentImageFiles}
          imageUrls={currentImageUrls}
          onUpload={handleImageUpload}
          setImageFiles={setImageFiles}
          setImageUrls={setImageUrls}
          maxImageCount={MAX_IMAGE_COUNT}
          itemSize={100}
        />
      </section>

      <section className="flex flex-col gap-3">
        <p className="typo-body-2-medium text-label-default">종합의견</p>
        <div>
          <Textarea
            {...register(CONSULTING_RESPONSE_FORM_FIELD_NAME.COMMENT)}
            hasBorder
            maxRows={8}
            placeholder="위 시술에 대해서 더 설명하고픈 내용을 작성해주세요. 외부 아이디, 연락처를 작성하면 계정이 정지될 수 있습니다."
            className="min-h-[152px] typo-body-2-long-regular text-label-default placeholder:text-label-placeholder"
          />
          <div className="mt-2 rounded-6 bg-focused p-2">
            <p className="typo-body-2-long-regular text-negative-light">
              외부 연락처(인스타, 카톡 등) 공유 시 계정이 정지될 수 있습니다
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
