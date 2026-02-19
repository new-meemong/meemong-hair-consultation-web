import { useFormContext, useWatch } from 'react-hook-form';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import Checkbox from '@/shared/ui/checkbox';
import ConsultingResponseFormOptionNeedConsultation from './consulting-response-form-option-need-consultation';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import { Label } from '@/shared/ui/label';
import { cn } from '@/lib/utils';
import { isUserMale } from '@/entities/user/lib/user-sex';
import { usePostDetail } from '@/features/posts/context/post-detail-context';

type HairLengthRecommendationValue =
  ConsultingResponseFormValues[typeof CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LENGTHS_RECOMMENDATION]['values'][number];
type HairLayerRecommendationValue =
  ConsultingResponseFormValues[typeof CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LAYERS_RECOMMENDATION]['values'][number];
type HairCurlRecommendationValue =
  ConsultingResponseFormValues[typeof CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_CURLS_RECOMMENDATION]['values'][number];

type RecommendationRowOption<T extends string> = {
  value: T;
  label: string;
  description: string;
};

const MALE_HAIR_LENGTH_OPTIONS: readonly RecommendationRowOption<HairLengthRecommendationValue>[] =
  [
    { value: '크롭', label: '크롭', description: '3mm~1cm, 반삭 등' },
    { value: '숏', label: '숏', description: '세워지는 머리, 가일컷 등' },
    { value: '미디엄', label: '미디엄', description: '눈썹에 닿는 기장, 댄디컷 등' },
    { value: '미디엄롱', label: '미디엄롱', description: '눈에 닿는 기장, 리프컷 등' },
    { value: '롱', label: '롱', description: '어깨에 닿는 머리' },
    { value: '장발', label: '장발', description: '어깨에 닿는 머리' },
  ] as const;

const FEMALE_HAIR_LENGTH_OPTIONS: readonly RecommendationRowOption<HairLengthRecommendationValue>[] =
  [
    { value: '숏컷', label: '숏컷', description: '귀 라인 끝보다 짧은 기장' },
    { value: '단발', label: '단발', description: '귀와 턱 사이 기장' },
    { value: '중단발', label: '중단발', description: '턱과 어깨 사이 기장' },
    { value: '미디엄', label: '미디엄', description: '어깨와 쇄골 사이 기장' },
    { value: '미디엄롱', label: '미디엄롱', description: '쇄골과 가슴 사이 기장' },
    { value: '롱', label: '롱', description: '가슴 아래보다 긴 기장' },
  ] as const;

const HAIR_LAYER_OPTIONS: readonly HairLayerRecommendationValue[] = [
  '원랭스',
  '로우 레이어드',
  '미디엄 레이어드',
  '하이 레이어드',
];
const HAIR_CURL_OPTIONS: readonly HairCurlRecommendationValue[] = [
  '스트레이트',
  'J컬',
  'C컬',
  'CS컬',
  'S컬',
  'SS컬',
];

type RecommendationRowsProps<T extends string> = {
  options: readonly RecommendationRowOption<T>[];
  selectedValues: T[];
  onToggle: (value: T) => void;
  idPrefix: string;
};

function RecommendationRows({
  options,
  selectedValues,
  onToggle,
  idPrefix,
}: RecommendationRowsProps<HairLengthRecommendationValue>) {
  return (
    <div className="flex flex-col gap-4">
      {options.map((option, index) => {
        const id = `${idPrefix}-${index}`;
        const isSelected = selectedValues.includes(option.value);

        return (
          <div key={option.value} className="flex items-center gap-3">
            <Label htmlFor={id} className="flex flex-1 items-center gap-1 cursor-pointer min-w-0">
              <span className="typo-body-2-semibold text-label-sub whitespace-nowrap">
                {option.label}
              </span>
              <span className="typo-body-2-semibold text-label-sub">·</span>
              <span className="typo-body-2-regular text-label-sub truncate">
                {option.description}
              </span>
            </Label>
            <Checkbox
              id={id}
              shape="square"
              checked={isSelected}
              onChange={() => onToggle(option.value)}
            />
          </div>
        );
      })}
    </div>
  );
}

type RecommendationChipSectionProps<T extends string> = {
  options: readonly T[];
  selectedValues: T[];
  onToggle: (value: T) => void;
};

function RecommendationChipSection({
  options,
  selectedValues,
  onToggle,
}: RecommendationChipSectionProps<HairLayerRecommendationValue>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option);

        return (
          <button
            key={option}
            type="button"
            className={cn(
              'px-4 py-2 rounded-full border typo-body-2-medium',
              isSelected
                ? 'bg-label-default text-white border-label-default'
                : 'bg-white text-label-sub border-border-default',
            )}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function RecommendationCurlChipSection({
  options,
  selectedValues,
  onToggle,
}: RecommendationChipSectionProps<HairCurlRecommendationValue>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option);

        return (
          <button
            key={option}
            type="button"
            className={cn(
              'px-4 py-2 rounded-full border typo-body-2-medium',
              isSelected
                ? 'bg-label-default text-white border-label-default'
                : 'bg-white text-label-sub border-border-default',
            )}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="typo-body-1-semibold text-label-default">{title}</h3>
      <span className="typo-body-2-semibold text-cautionary">필수</span>
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="py-10">
      <div className="h-px bg-border-default" />
    </div>
  );
}

export default function ConsultingResponseFormStepHairRecommendationNew() {
  const { postDetail } = usePostDetail();
  const isMale = isUserMale(postDetail.hairConsultPostingCreateUserSex);

  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const hairLengthsRecommendation = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LENGTHS_RECOMMENDATION,
  });
  const hairLayersRecommendation = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LAYERS_RECOMMENDATION,
  });
  const hairCurlsRecommendation = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_CURLS_RECOMMENDATION,
  });

  const lengthOptions = isMale ? MALE_HAIR_LENGTH_OPTIONS : FEMALE_HAIR_LENGTH_OPTIONS;

  const lengthValues = hairLengthsRecommendation.values ?? [];
  const layerValues = hairLayersRecommendation.values ?? [];
  const curlValues = hairCurlsRecommendation.values ?? [];

  const toggleLength = (value: HairLengthRecommendationValue) => {
    const nextValues = lengthValues.includes(value)
      ? lengthValues.filter((currentValue) => currentValue !== value)
      : [...lengthValues, value];

    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LENGTHS_RECOMMENDATION,
      { values: nextValues, needStoreConsulting: false },
      { shouldDirty: true },
    );
  };

  const toggleLayer = (value: HairLayerRecommendationValue) => {
    const nextValues = layerValues.includes(value)
      ? layerValues.filter((currentValue) => currentValue !== value)
      : [...layerValues, value];

    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LAYERS_RECOMMENDATION,
      { values: nextValues, needStoreConsulting: false },
      { shouldDirty: true },
    );
  };

  const toggleCurl = (value: HairCurlRecommendationValue) => {
    const nextValues = curlValues.includes(value)
      ? curlValues.filter((currentValue) => currentValue !== value)
      : [...curlValues, value];

    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_CURLS_RECOMMENDATION,
      { values: nextValues, needStoreConsulting: false },
      { shouldDirty: true },
    );
  };

  const handleNeedLengthConsultationChange = (value: boolean) => {
    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LENGTHS_RECOMMENDATION,
      {
        values: value ? [] : lengthValues,
        needStoreConsulting: value,
      },
      { shouldDirty: true },
    );
  };

  const handleNeedLayerConsultationChange = (value: boolean) => {
    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LAYERS_RECOMMENDATION,
      {
        values: value ? [] : layerValues,
        needStoreConsulting: value,
      },
      { shouldDirty: true },
    );
  };

  const handleNeedCurlConsultationChange = (value: boolean) => {
    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_CURLS_RECOMMENDATION,
      {
        values: value ? [] : curlValues,
        needStoreConsulting: value,
      },
      { shouldDirty: true },
    );
  };

  return (
    <div className="pb-28">
      <RecommendationRows
        options={lengthOptions}
        selectedValues={lengthValues}
        onToggle={toggleLength}
        idPrefix="hair-length-recommendation"
      />

      <div className="mt-7">
        <ConsultingResponseFormOptionNeedConsultation
          value={hairLengthsRecommendation.needStoreConsulting}
          onChange={handleNeedLengthConsultationChange}
          id={CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LENGTHS_RECOMMENDATION}
        />
      </div>

      <SectionDivider />

      {!isMale && (
        <>
          <SectionHeader title="추천하는 레이어를 모두 골라주세요" />
          <div className="mt-7 flex flex-col gap-7">
            <RecommendationChipSection
              options={HAIR_LAYER_OPTIONS}
              selectedValues={layerValues}
              onToggle={toggleLayer}
            />
            <ConsultingResponseFormOptionNeedConsultation
              value={hairLayersRecommendation.needStoreConsulting}
              onChange={handleNeedLayerConsultationChange}
              id={CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LAYERS_RECOMMENDATION}
            />
          </div>
          <SectionDivider />
        </>
      )}

      <SectionHeader title="추천하는 컬을 모두 골라주세요" />
      <div className="mt-7 flex flex-col gap-7">
        <RecommendationCurlChipSection
          options={HAIR_CURL_OPTIONS}
          selectedValues={curlValues}
          onToggle={toggleCurl}
        />
        <ConsultingResponseFormOptionNeedConsultation
          value={hairCurlsRecommendation.needStoreConsulting}
          onChange={handleNeedCurlConsultationChange}
          id={CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_CURLS_RECOMMENDATION}
        />
      </div>
    </div>
  );
}
