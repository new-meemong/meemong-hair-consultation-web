'use client';

import { Button, ROUTES } from '@/shared';
import { useMemo, useState } from 'react';

import { AppTypography } from '@/shared/styles/typography';
import { DEFAULT_HAIR_CONSULTATION_FORM_VALUES } from '@/features/posts/constants/hair-consultation-form-default-values';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '@/features/posts/constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '@/features/posts/types/hair-consultation-form-values';
import type { HairConsultationHairTexture } from '@/entities/posts/api/create-hair-consultation-request';
import { SiteHeader } from '@/widgets/header';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useSearchParams } from 'next/navigation';
import useWritingContent from '@/shared/hooks/use-writing-content';
import RoundCheckboxEmptyIcon from '@/assets/icons/round-checkbox-empty.svg';
import RoundCheckboxIcon from '@/assets/icons/round-checkbox.svg';

const HAIR_TEXTURE_OPTIONS: Array<{
  value: HairConsultationHairTexture;
  label: string;
  description: string;
}> = [
  { value: '강한 직모', label: '강한 직모', description: '곡선이 거의 없고 뻗치는 머리' },
  { value: '직모', label: '직모', description: '약한 볼륨감이 있는 표준적인 생머리' },
  {
    value: '반곱슬',
    label: '반곱슬',
    description: '습하면 부스스해지고, C컬 정도로 휘어지는 모발',
  },
  { value: '곱슬', label: '곱슬', description: 'S컬 형태로 뚜렷하게 웨이브가 지며 붕 뜨는 모발' },
  { value: '강한 곱슬', label: '강한 곱슬', description: '뿌리부터 회전하며 자라는 꼬불거리는 모발' },
];

export default function HairTextureSelectPage() {
  const { replace } = useRouterWithUser();
  const searchParams = useSearchParams();
  const { savedContent, saveContent } = useWritingContent(USER_WRITING_CONTENT_KEYS.hairConsultation);

  const initialValue = useMemo(() => {
    return (
      savedContent?.content?.[HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_TEXTURE] ??
      DEFAULT_HAIR_CONSULTATION_FORM_VALUES[HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_TEXTURE]
    );
  }, [savedContent]);

  const [selectedTexture, setSelectedTexture] =
    useState<HairConsultationHairTexture>(initialValue);

  const handleSelect = (value: HairConsultationHairTexture) => {
    setSelectedTexture(value);
  };

  const handleComplete = () => {
    const baseContent = savedContent?.content ?? DEFAULT_HAIR_CONSULTATION_FORM_VALUES;
    const nextContent: HairConsultationFormValues = {
      ...baseContent,
      [HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_TEXTURE]: selectedTexture,
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
        title="모발 타입"
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
              가장 가까운 모질을 선택해주세요
            </span>
            <span className={`${AppTypography.body2SemiBold} text-cautionary`}>필수</span>
          </div>
          <span className={`${AppTypography.body2LongRegular} text-label-info`}>
            정보가 현재와 다르면 상담 결과가 달라질 수 있어요.
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {HAIR_TEXTURE_OPTIONS.map((option) => {
            const checked = selectedTexture === option.value;
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
        <Button className="w-full" size="lg" onClick={handleComplete}>
          완료
        </Button>
      </div>
    </div>
  );
}
