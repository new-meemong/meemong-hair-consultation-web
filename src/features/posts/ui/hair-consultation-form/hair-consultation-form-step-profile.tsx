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

const SKIN_BRIGHTNESS_DESCRIPTION_MAP: Record<string, string> = {
  '18호 이하': '매우 하얗고 투명한 피부',
  '19~21호': '화사하고 밝은 피부',
  '22~23호': '자연스럽고 차분한 피부',
  '24~25호': '건강하고 생기있는 피부',
  '26호 이상': '탄력있고 깊이감 있는 피부',
  '매우 밝은/하얀 피부': '22호 이하',
  '밝은 피부': '22~23호',
  '보통 피부': '24~25호',
  '까만 피부': '26~27호',
  '매우 어두운/까만 피부': '28호 이상',
};

const PERSONAL_COLOR_BASE_COLOR_MAP: Record<string, string> = {
  봄웜: '#FAC4A8',
  여름쿨: '#F1D0E3',
  가을웜: '#EBB295',
  겨울쿨: '#E6447A',
};

const formatPersonalColorDetailLabel = (value: string) => value.replace(/^(봄|여름|가을|겨울)/, '');
const EMPTY_FIELD_MESSAGE = '정보를 입력해주세요';

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
    const normalizedSelectedHairLength =
      user.sex !== '남자' && selectedHairLength === '장발' ? '롱' : selectedHairLength;
    const option = hairLengthOptions.find((item) => item.value === normalizedSelectedHairLength);
    return option ?? null;
  }, [hairLengthOptions, selectedHairLength, user.sex]);

  const skinBrightnessDescription = useMemo(
    () => SKIN_BRIGHTNESS_DESCRIPTION_MAP[selectedSkinBrightness ?? ''] ?? '',
    [selectedSkinBrightness],
  );

  const [personalColorType, personalColorDetail] = useMemo(() => {
    const [type = '', detail = ''] = (selectedPersonalColor ?? '')
      .split(',')
      .map((value) => value.trim());
    return [type, formatPersonalColorDetailLabel(detail)];
  }, [selectedPersonalColor]);
  const personalColorBaseColor = PERSONAL_COLOR_BASE_COLOR_MAP[personalColorType];

  const handleHairLengthEdit = useCallback(() => {
    const writingContent = {
      step: 1,
      content: getValues(),
    };
    saveContent(writingContent);
    push(ROUTES.POSTS_CREATE_HAIR_LENGTH, { skipReload: '1' });
  }, [getValues, push, saveContent]);

  const handleHairConcernEdit = useCallback(() => {
    const writingContent = {
      step: 1,
      content: getValues(),
    };
    saveContent(writingContent);
    push(ROUTES.POSTS_CREATE_HAIR_CONCERNS, { skipReload: '1' });
  }, [getValues, push, saveContent]);

  const handleHairTextureEdit = useCallback(() => {
    const writingContent = {
      step: 1,
      content: getValues(),
    };
    saveContent(writingContent);
    push(ROUTES.POSTS_CREATE_HAIR_TEXTURE, { skipReload: '1' });
  }, [getValues, push, saveContent]);

  const handleSkinBrightnessEdit = useCallback(() => {
    const writingContent = {
      step: 1,
      content: getValues(),
    };
    saveContent(writingContent);
    push(ROUTES.POSTS_CREATE_SKIN_BRIGHTNESS, { skipReload: '1' });
  }, [getValues, push, saveContent]);

  const handlePersonalColorEdit = useCallback(() => {
    const writingContent = {
      step: 1,
      content: getValues(),
    };
    saveContent(writingContent);
    push(ROUTES.POSTS_CREATE_PERSONAL_COLOR, { skipReload: '1' });
  }, [getValues, push, saveContent]);

  const renderEditHeader = (
    title: string,
    ariaLabel: string,
    onClick: () => void,
    hasValue: boolean,
    isRequired = false,
  ) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <p className={`${AppTypography.body1SemiBold} text-label-default`}>{title}</p>
        {isRequired && <span className="w-1 h-1 rounded-full bg-negative-light" />}
      </div>
      <div className="flex items-center gap-2">
        {!hasValue && (
          <span className={`${AppTypography.body2Regular} text-label-placeholder`}>
            {EMPTY_FIELD_MESSAGE}
          </span>
        )}
        <button
          type="button"
          aria-label={ariaLabel}
          className="flex items-center justify-center w-[22px] h-[22px] flex-shrink-0 overflow-visible"
          onClick={onClick}
        >
          <EditIcon className="block w-[22px] h-[22px] text-label-info" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 mt-7">
        {renderEditHeader(
          '머리기장',
          '머리기장 수정',
          handleHairLengthEdit,
          !!selectedHairLengthOption,
          true,
        )}
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
        {renderEditHeader(
          '헤어 고민',
          '헤어 고민 수정',
          handleHairConcernEdit,
          Array.isArray(selectedConcerns) && selectedConcerns.length > 0,
        )}
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
        {renderEditHeader(
          '모발 타입',
          '모발 타입 수정',
          handleHairTextureEdit,
          !!selectedHairTexture,
        )}
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
        {renderEditHeader(
          '피부톤',
          '피부톤 수정',
          handleSkinBrightnessEdit,
          !!selectedSkinBrightness,
        )}
        {selectedSkinBrightness && (
          <ToggleChipGroup className="flex flex-wrap items-center gap-2">
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
            {skinBrightnessDescription && (
              <p className={`${AppTypography.body2Regular} text-label-default`}>
                {skinBrightnessDescription}
              </p>
            )}
          </ToggleChipGroup>
        )}
      </div>

      <div className="border-t border-border-default" />

      <div className="flex flex-col gap-4">
        {renderEditHeader(
          '퍼스널 컬러',
          '퍼스널 컬러 수정',
          handlePersonalColorEdit,
          !!selectedPersonalColor,
        )}
        {selectedPersonalColor && (
          <ToggleChipGroup className="flex flex-wrap items-center gap-2">
            <ToggleChip
              pressed={false}
              disabled
              style={
                personalColorBaseColor ? { backgroundColor: personalColorBaseColor } : undefined
              }
              className={[
                'rounded-full px-4 py-2.5 h-auto',
                personalColorBaseColor
                  ? 'bg-alternative text-white border-0'
                  : 'bg-alternative text-label-sub border-0',
                personalColorBaseColor
                  ? 'data-[state=off]:bg-alternative data-[state=off]:text-white data-[state=off]:border-0'
                  : 'data-[state=off]:bg-alternative data-[state=off]:text-label-sub data-[state=off]:border-0',
                personalColorBaseColor ? 'typo-body-2-semibold' : 'typo-body-2-regular',
                'disabled:opacity-100',
              ].join(' ')}
            >
              {personalColorType || selectedPersonalColor}
            </ToggleChip>
            {personalColorDetail && (
              <p className={`${AppTypography.body2Regular} text-label-default`}>
                {personalColorDetail}
              </p>
            )}
          </ToggleChipGroup>
        )}
      </div>
    </div>
  );
}
