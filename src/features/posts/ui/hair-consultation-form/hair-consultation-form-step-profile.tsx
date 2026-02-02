import {
  FEMALE_HAIR_LENGTH_OPTIONS,
  MALE_HAIR_LENGTH_OPTIONS,
} from '../../constants/hair-length-options';
import {
  HAIR_CONSULTATION_CONCERN_OPTIONS,
  HAIR_CONSULTATION_HAIR_TEXTURE_OPTIONS,
  HAIR_CONSULTATION_PERSONAL_COLOR_OPTIONS,
  HAIR_CONSULTATION_SKIN_BRIGHTNESS_OPTIONS,
} from '../../constants/hair-consultation-create-options';
import { Label, ROUTES } from '@/shared';
import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { AppTypography } from '@/shared/styles/typography';
import Checkbox from '@/shared/ui/checkbox';
import ConsultingFormOptionList from '../consulting-form/consulting-form-option-list';
import EditIcon from '@/assets/icons/edit.svg';
import FormItem from '@/shared/ui/form-item';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import type { HairConsultationConcern } from '@/entities/posts/api/create-hair-consultation-request';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';
import Image from 'next/image';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useWritingContent from '@/shared/hooks/use-writing-content';

export default function HairConsultationFormStepProfile() {
  const { control, setValue, getValues } = useFormContext<HairConsultationFormValues>();
  const { user } = useAuthContext();
  const { push } = useRouterWithUser();
  const { saveContent } = useWritingContent(USER_WRITING_CONTENT_KEYS.hairConsultation);

  const selectedConcerns = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_CONCERNS,
  });

  const selectedHairLength = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_LENGTH,
  });

  const hairLengthOptions = useMemo(
    () => (user.sex === '남자' ? MALE_HAIR_LENGTH_OPTIONS : FEMALE_HAIR_LENGTH_OPTIONS),
    [user.sex],
  );

  const selectedHairLengthOption = useMemo(() => {
    if (!selectedHairLength) return null;
    const option =
      hairLengthOptions.find((item) => item.value === selectedHairLength) ??
      [...MALE_HAIR_LENGTH_OPTIONS, ...FEMALE_HAIR_LENGTH_OPTIONS].find(
        (item) => item.value === selectedHairLength,
      );
    return option ?? null;
  }, [hairLengthOptions, selectedHairLength]);

  const handleConcernToggle = useCallback(
    (value: HairConsultationConcern) => {
      const current = getValues(HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_CONCERNS) ?? [];
      if (current.includes(value)) {
        setValue(
          HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_CONCERNS,
          current.filter((item) => item !== value),
          { shouldDirty: true },
        );
        return;
      }
      setValue(
        HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_CONCERNS,
        [...current, value],
        { shouldDirty: true },
      );
    },
    [getValues, setValue],
  );

  const handleHairLengthEdit = useCallback(() => {
    const writingContent = {
      step: 1,
      content: getValues(),
    };
    saveContent(writingContent);
    push(ROUTES.POSTS_NEW_CREATE_HAIR_LENGTH, { skipReload: '1' });
  }, [getValues, push, saveContent]);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 mt-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <p className={`${AppTypography.body1SemiBold} text-label-default`}>머리기장</p>
            <span className="w-1 h-1 rounded-full bg-negative-light" />
          </div>
          <button
            type="button"
            aria-label="머리기장 수정"
            className="flex items-center justify-center w-[22px] h-[22px] flex-shrink-0 overflow-visible"
            onClick={handleHairLengthEdit}
          >
            <EditIcon className="block w-[22px] h-[22px] text-label-info" />
          </button>
        </div>
        {selectedHairLengthOption && (
          <div className="flex items-center gap-4">
            <div className="relative w-[100px] h-[100px] flex-shrink-0 rounded-6 overflow-hidden bg-alternative">
              <Image
                src={selectedHairLengthOption.image}
                alt={selectedHairLengthOption.label}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className={`${AppTypography.body1Medium} text-label-default`}>
                {selectedHairLengthOption.label}
              </span>
              <span className={`${AppTypography.body2Regular} text-label-sub`}>
                {selectedHairLengthOption.description}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border-default" />

      <FormItem label="헤어 고민" required>
        <div className="flex flex-col gap-2">
          {HAIR_CONSULTATION_CONCERN_OPTIONS.map((option, index) => {
            const checked = selectedConcerns?.includes(option) ?? false;
            const optionId = `hair-concern-${index}`;
            return (
              <div key={option} className="flex items-center gap-3">
                <Checkbox
                  id={optionId}
                  shape="round"
                  checked={checked}
                  onChange={() => handleConcernToggle(option)}
                />
                <Label htmlFor={optionId} className="typo-body-2-regular text-label-default">
                  {option}
                </Label>
              </div>
            );
          })}
        </div>
      </FormItem>

      <FormItem label="모발 타입" required>
        <ConsultingFormOptionList
          options={HAIR_CONSULTATION_HAIR_TEXTURE_OPTIONS}
          name={HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_TEXTURE}
        />
      </FormItem>

      <FormItem label="피부톤" required>
        <ConsultingFormOptionList
          options={HAIR_CONSULTATION_SKIN_BRIGHTNESS_OPTIONS}
          name={HAIR_CONSULTATION_FORM_FIELD_NAME.SKIN_BRIGHTNESS}
        />
      </FormItem>

      <FormItem label="퍼스널 컬러" required>
        <ConsultingFormOptionList
          options={HAIR_CONSULTATION_PERSONAL_COLOR_OPTIONS}
          name={HAIR_CONSULTATION_FORM_FIELD_NAME.PERSONAL_COLOR}
        />
      </FormItem>
    </div>
  );
}
