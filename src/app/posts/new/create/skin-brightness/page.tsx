'use client';

import { Button, ROUTES } from '@/shared';
import { useMemo, useState } from 'react';

import { AppTypography } from '@/shared/styles/typography';
import { DEFAULT_HAIR_CONSULTATION_FORM_VALUES } from '@/features/posts/constants/hair-consultation-form-default-values';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '@/features/posts/constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '@/features/posts/types/hair-consultation-form-values';
import type { HairConsultationSkinBrightness } from '@/entities/posts/api/create-hair-consultation-request';
import RoundCheckboxEmptyIcon from '@/assets/icons/round-checkbox-empty.svg';
import RoundCheckboxIcon from '@/assets/icons/round-checkbox.svg';
import { SiteHeader } from '@/widgets/header';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useSearchParams } from 'next/navigation';
import useWritingContent from '@/shared/hooks/use-writing-content';

const FEMALE_SKIN_BRIGHTNESS_OPTIONS: Array<{
  value: HairConsultationSkinBrightness;
  label: string;
  description: string;
}> = [
  { value: '18호 이하', label: '18호 이하', description: '매우 하얗고 투명한 피부' },
  { value: '19~21호', label: '19~21호', description: '화사하고 밝은 피부' },
  { value: '22~23호', label: '22~23호', description: '자연스럽고 차분한 피부' },
  { value: '24~25호', label: '24~25호', description: '건강하고 생기있는 피부' },
  { value: '26호 이상', label: '26호 이상', description: '탄력있고 깊이감 있는 피부' },
];

const MALE_SKIN_BRIGHTNESS_OPTIONS: Array<{
  value: HairConsultationSkinBrightness;
  label: string;
  description: string;
}> = [
  { value: '매우 밝은/하얀 피부', label: '매우 밝은/하얀 피부', description: '22호 이하' },
  { value: '밝은 피부', label: '밝은 피부', description: '22~23호' },
  { value: '보통 피부', label: '보통 피부', description: '24~25호' },
  { value: '까만 피부', label: '까만 피부', description: '26~27호' },
  { value: '매우 어두운/까만 피부', label: '매우 어두운/까만 피부', description: '28호 이상' },
];

export default function SkinBrightnessSelectPage() {
  const { user } = useAuthContext();
  const { replace } = useRouterWithUser();
  const searchParams = useSearchParams();
  const { savedContent, saveContent } = useWritingContent(
    USER_WRITING_CONTENT_KEYS.hairConsultation,
  );

  const initialValue = useMemo(() => {
    return savedContent?.content?.[HAIR_CONSULTATION_FORM_FIELD_NAME.SKIN_BRIGHTNESS] ?? null;
  }, [savedContent]);

  const [selectedBrightness, setSelectedBrightness] =
    useState<HairConsultationSkinBrightness | null>(initialValue);
  const skinBrightnessOptions = useMemo(
    () => (user.sex === '남자' ? MALE_SKIN_BRIGHTNESS_OPTIONS : FEMALE_SKIN_BRIGHTNESS_OPTIONS),
    [user.sex],
  );

  const handleSelect = (value: HairConsultationSkinBrightness) => {
    setSelectedBrightness(value);
  };

  const handleComplete = () => {
    if (!selectedBrightness) return;

    const baseContent = savedContent?.content ?? DEFAULT_HAIR_CONSULTATION_FORM_VALUES;
    const nextContent: HairConsultationFormValues = {
      ...baseContent,
      [HAIR_CONSULTATION_FORM_FIELD_NAME.SKIN_BRIGHTNESS]: selectedBrightness,
    };

    saveContent({
      step: savedContent?.step ?? 1,
      content: nextContent,
    });

    replace(ROUTES.POSTS_NEW_CREATE, { skipReload: '1' });
  };

  return (
    <div className="min-w-[375px] w-full h-screen mx-auto flex flex-col bg-white">
      <SiteHeader
        title="피부톤"
        showBackButton
        onBackClick={() =>
          replace(ROUTES.POSTS_NEW_CREATE, {
            skipReload: '1',
            ...Object.fromEntries(searchParams.entries()),
          })
        }
      />
      <div className="flex flex-col gap-7 px-5 pt-7 pb-6 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className={`${AppTypography.headlineSemiBold} text-label-default`}>
              피부 밝기를 선택해주세요
            </span>
            <span className={`${AppTypography.body2SemiBold} text-cautionary`}>필수</span>
          </div>
          <span className={`${AppTypography.body2LongRegular} text-label-info`}>
            정보가 현재와 다르면 상담 결과가 달라질 수 있어요.
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {skinBrightnessOptions.map((option) => {
            const checked = selectedBrightness === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className="flex w-full items-center gap-4 px-0 py-3"
                onClick={() => handleSelect(option.value)}
              >
                <div className="flex flex-col items-start gap-2 flex-1 text-left">
                  <span className={`${AppTypography.body1Medium} text-label-default`}>
                    {option.label}
                  </span>
                  <span className={`${AppTypography.body2Regular} text-label-sub`}>
                    {option.description}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  {checked ? (
                    <RoundCheckboxIcon className="text-label-default" />
                  ) : (
                    <RoundCheckboxEmptyIcon />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="px-5 py-3 border-t border-1 border-border-default">
        <Button
          className="w-full"
          size="lg"
          onClick={handleComplete}
          disabled={!selectedBrightness}
        >
          완료
        </Button>
      </div>
    </div>
  );
}
