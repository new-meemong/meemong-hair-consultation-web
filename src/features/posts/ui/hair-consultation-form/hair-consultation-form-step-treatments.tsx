import { useFormContext, useWatch } from 'react-hook-form';

import { AppTypography } from '@/shared/styles/typography';
import Checkbox from '@/shared/ui/checkbox';
import { Textarea } from '@/shared';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';

const TREATMENT_OPTIONS = [
  '일반펌',
  '열펌/셋팅펌',
  '다운펌',
  '매직',
  '일반염색',
  '블랙염색',
  '블랙빼기',
  '탈색',
] as const;

const SPECIAL_TREATMENT = '커트/드라이만 했어요';

export default function HairConsultationFormStepTreatments() {
  const { control, setValue } = useFormContext<HairConsultationFormValues>();
  const selectedTreatments = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS,
  });
  const treatmentDetail = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENT_DETAIL,
  });

  const handleToggle = (value: string) => {
    const current = selectedTreatments ?? [];

    if (value === SPECIAL_TREATMENT) {
      const next = current.includes(SPECIAL_TREATMENT) ? [] : [SPECIAL_TREATMENT];
      setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS, next, { shouldDirty: true });
      return;
    }

    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current.filter((item) => item !== SPECIAL_TREATMENT), value];

    setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS, next, { shouldDirty: true });
  };

  return (
    <div className="flex flex-col gap-7">
      <ToggleChipGroup className="flex flex-wrap gap-2">
        {TREATMENT_OPTIONS.map((option) => {
          const checked = selectedTreatments?.includes(option) ?? false;
          return (
            <ToggleChip
              key={option}
              pressed={checked}
              onPressedChange={() => handleToggle(option)}
              className={[
                'rounded-full px-4 py-2.5 h-auto',
                'data-[state=off]:bg-white data-[state=off]:border data-[state=off]:border-border-default data-[state=off]:text-label-sub',
                'data-[state=on]:bg-label-default data-[state=on]:text-white data-[state=on]:border-transparent',
                'typo-body-2-regular data-[state=on]:typo-body-2-medium',
              ].join(' ')}
            >
              {option}
            </ToggleChip>
          );
        })}
      </ToggleChipGroup>

      <div className="flex items-center justify-end gap-3">
        <label
          htmlFor="hair-treatment-special"
          className={`${AppTypography.body2Regular} text-label-sub cursor-pointer`}
        >
          {SPECIAL_TREATMENT}
        </label>
        <Checkbox
          id="hair-treatment-special"
          shape="round"
          checked={selectedTreatments?.includes(SPECIAL_TREATMENT) ?? false}
          onChange={() => handleToggle(SPECIAL_TREATMENT)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className={`${AppTypography.body2Medium} text-label-default`}>세부 설명</span>
        <Textarea
          value={treatmentDetail ?? ''}
          placeholder="내 시술이력에 대해서 더 설명하고픈 내용을 작성해주세요."
          hasBorder
          maxRows={14}
          className="min-h-[150px] rounded-6"
          onChange={(e) =>
            setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENT_DETAIL, e.target.value, {
              shouldDirty: true,
            })
          }
        />
      </div>
    </div>
  );
}
