'use client';

import {
  FEMALE_HAIR_LENGTH_OPTIONS,
  MALE_HAIR_LENGTH_OPTIONS,
} from '@/features/posts/constants/hair-length-options';

import { AppTypography } from '@/shared/styles/typography';
import { DEFAULT_HAIR_CONSULTATION_FORM_VALUES } from '@/features/posts/constants/hair-consultation-form-default-values';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '@/features/posts/constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '@/features/posts/types/hair-consultation-form-values';
import Image from 'next/image';
import { ROUTES } from '@/shared';
import RoundCheckboxEmptyIcon from '@/assets/icons/round-checkbox-empty.svg';
import RoundCheckboxIcon from '@/assets/icons/round-checkbox.svg';
import { SiteHeader } from '@/widgets/header';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useMemo } from 'react';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useSearchParams } from 'next/navigation';
import useWritingContent from '@/shared/hooks/use-writing-content';

export default function HairLengthSelectPage() {
  const { replace } = useRouterWithUser();
  const searchParams = useSearchParams();
  const { user } = useAuthContext();
  const { savedContent, saveContent } = useWritingContent(
    USER_WRITING_CONTENT_KEYS.hairConsultation,
  );
  const isMale = user.sex === '남자';

  const currentValue = useMemo(() => {
    const savedHairLength =
      savedContent?.content?.[HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_LENGTH] ?? null;
    if (!isMale && savedHairLength === '장발') return '롱';
    return savedHairLength;
  }, [isMale, savedContent]);

  const options = useMemo(
    () => (isMale ? MALE_HAIR_LENGTH_OPTIONS : FEMALE_HAIR_LENGTH_OPTIONS),
    [isMale],
  );

  const handleSelect = (
    value: HairConsultationFormValues[typeof HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_LENGTH],
  ) => {
    const baseContent = savedContent?.content ?? DEFAULT_HAIR_CONSULTATION_FORM_VALUES;
    const nextContent = {
      ...baseContent,
      [HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_LENGTH]: value,
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
        title="머리기장"
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
              현재 머리 기장을 1개만 선택해주세요
            </span>
            <span className={`${AppTypography.body2SemiBold} text-cautionary`}>필수</span>
          </div>
          <span className={`${AppTypography.body2LongRegular} text-label-info`}>
            정보가 현재와 다르면 상담 결과가 달라질 수 있어요.
          </span>
        </div>
        {options.map((option) => {
          const isSelected = option.value === currentValue;
          return (
            <button
              key={option.value}
              type="button"
              className="flex w-full items-center gap-4 rounded-8 px-0 h-32"
              onClick={() => handleSelect(option.value)}
            >
              <div className="relative w-[100px] h-[128px] flex-shrink-0 rounded-6 overflow-hidden bg-alternative">
                <Image src={option.image} alt={option.label} fill className="object-cover" />
              </div>
              <div className="flex flex-col items-start gap-0.5 flex-1 text-left">
                <span className={`${AppTypography.body1Medium} text-label-default`}>
                  {option.label}
                </span>
                <span className={`${AppTypography.body2Regular} text-label-sub`}>
                  {option.description}
                </span>
              </div>
              <div className="flex items-center justify-center">
                {isSelected ? (
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
  );
}
