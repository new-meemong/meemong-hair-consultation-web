import {
  FEMALE_HAIR_LENGTH_OPTIONS,
  MALE_HAIR_LENGTH_OPTIONS,
} from '../../constants/hair-length-options';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui';
import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { AppTypography } from '@/shared/styles/typography';
import EditIcon from '@/assets/icons/edit.svg';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';
import Image from 'next/image';
import { ROUTES } from '@/shared';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useWritingContent from '@/shared/hooks/use-writing-content';

export default function HairConsultationFormStepProfile() {
  const { control, getValues } = useFormContext<HairConsultationFormValues>();
  const { user } = useAuthContext();
  const { push } = useRouterWithUser();
  const { saveContent } = useWritingContent(USER_WRITING_CONTENT_KEYS.hairConsultation);

  const selectedConcerns = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_CONCERNS,
  });

  const selectedHairTexture = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_TEXTURE,
  });

  const selectedSkinBrightness = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.SKIN_BRIGHTNESS,
  });

  const selectedPersonalColor = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.PERSONAL_COLOR,
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

  const handleHairLengthEdit = useCallback(() => {
    const writingContent = {
      step: 1,
      content: getValues(),
    };
    saveContent(writingContent);
    push(ROUTES.POSTS_NEW_CREATE_HAIR_LENGTH, { skipReload: '1' });
  }, [getValues, push, saveContent]);

  const handleHairConcernEdit = useCallback(() => {
    const writingContent = {
      step: 1,
      content: getValues(),
    };
    saveContent(writingContent);
    push(ROUTES.POSTS_NEW_CREATE_HAIR_CONCERNS, { skipReload: '1' });
  }, [getValues, push, saveContent]);

  const handleHairTextureEdit = useCallback(() => {
    const writingContent = {
      step: 1,
      content: getValues(),
    };
    saveContent(writingContent);
    push(ROUTES.POSTS_NEW_CREATE_HAIR_TEXTURE, { skipReload: '1' });
  }, [getValues, push, saveContent]);

  const handleSkinBrightnessEdit = useCallback(() => {
    const writingContent = {
      step: 1,
      content: getValues(),
    };
    saveContent(writingContent);
    push(ROUTES.POSTS_NEW_CREATE_SKIN_BRIGHTNESS, { skipReload: '1' });
  }, [getValues, push, saveContent]);

  const handlePersonalColorEdit = useCallback(() => {
    const writingContent = {
      step: 1,
      content: getValues(),
    };
    saveContent(writingContent);
    push(ROUTES.POSTS_NEW_CREATE_PERSONAL_COLOR, { skipReload: '1' });
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

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className={`${AppTypography.body1SemiBold} text-label-default`}>헤어 고민</p>
          <button
            type="button"
            aria-label="헤어 고민 수정"
            className="flex items-center justify-center w-[22px] h-[22px] flex-shrink-0 overflow-visible"
            onClick={handleHairConcernEdit}
          >
            <EditIcon className="block w-[22px] h-[22px] text-label-info" />
          </button>
        </div>
        {selectedConcerns && selectedConcerns.length > 0 && (
          <ToggleChipGroup className="flex flex-wrap gap-2">
            {selectedConcerns.map((option) => (
              <ToggleChip
                key={option}
                disabled
                className={[
                  'rounded-full px-4 py-2.5 h-auto',
                  'bg-alternative text-label-sub border-0',
                  'data-[state=off]:bg-alternative data-[state=off]:text-label-sub data-[state=off]:border-0',
                  'typo-body-2-regular',
                  'disabled:opacity-100',
                ].join(' ')}
              >
                {option}
              </ToggleChip>
            ))}
          </ToggleChipGroup>
        )}
      </div>

      <div className="border-t border-border-default" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className={`${AppTypography.body1SemiBold} text-label-default`}>모발 타입</p>
          <button
            type="button"
            aria-label="모발 타입 수정"
            className="flex items-center justify-center w-[22px] h-[22px] flex-shrink-0 overflow-visible"
            onClick={handleHairTextureEdit}
          >
            <EditIcon className="block w-[22px] h-[22px] text-label-info" />
          </button>
        </div>
        {selectedHairTexture && (
          <ToggleChipGroup className="flex flex-wrap gap-2">
            <ToggleChip
              pressed={false}
              disabled
              className={[
                'rounded-full px-4 py-2.5 h-auto',
                'bg-alternative text-label-sub border-0',
                'data-[state=off]:bg-alternative data-[state=off]:text-label-sub data-[state=off]:border-0',
                'typo-body-2-regular',
                'disabled:opacity-100',
              ].join(' ')}
            >
              {selectedHairTexture}
            </ToggleChip>
          </ToggleChipGroup>
        )}
      </div>

      <div className="border-t border-border-default" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className={`${AppTypography.body1SemiBold} text-label-default`}>피부톤</p>
          <button
            type="button"
            aria-label="피부톤 수정"
            className="flex items-center justify-center w-[22px] h-[22px] flex-shrink-0 overflow-visible"
            onClick={handleSkinBrightnessEdit}
          >
            <EditIcon className="block w-[22px] h-[22px] text-label-info" />
          </button>
        </div>
        {selectedSkinBrightness && (
          <ToggleChipGroup className="flex flex-wrap gap-2">
            <ToggleChip
              pressed={false}
              disabled
              className={[
                'rounded-full px-4 py-2.5 h-auto',
                'bg-alternative text-label-sub border-0',
                'data-[state=off]:bg-alternative data-[state=off]:text-label-sub data-[state=off]:border-0',
                'typo-body-2-regular',
                'disabled:opacity-100',
              ].join(' ')}
            >
              {selectedSkinBrightness}
            </ToggleChip>
          </ToggleChipGroup>
        )}
      </div>

      <div className="border-t border-border-default" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className={`${AppTypography.body1SemiBold} text-label-default`}>퍼스널 컬러</p>
          <button
            type="button"
            aria-label="퍼스널 컬러 수정"
            className="flex items-center justify-center w-[22px] h-[22px] flex-shrink-0 overflow-visible"
            onClick={handlePersonalColorEdit}
          >
            <EditIcon className="block w-[22px] h-[22px] text-label-info" />
          </button>
        </div>
        {selectedPersonalColor && (
          <ToggleChipGroup className="flex flex-wrap gap-2">
            <ToggleChip
              pressed={false}
              disabled
              className={[
                'rounded-full px-4 py-2.5 h-auto',
                'bg-alternative text-label-sub border-0',
                'data-[state=off]:bg-alternative data-[state=off]:text-label-sub data-[state=off]:border-0',
                'typo-body-2-regular',
                'disabled:opacity-100',
              ].join(' ')}
            >
              {selectedPersonalColor}
            </ToggleChip>
          </ToggleChipGroup>
        )}
      </div>
    </div>
  );
}
