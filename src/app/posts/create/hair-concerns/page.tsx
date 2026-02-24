'use client';

import { Button, ROUTES, ToggleChip, ToggleChipGroup } from '@/shared';
import { useMemo, useState } from 'react';

import { AppTypography } from '@/shared/styles/typography';
import Checkbox from '@/shared/ui/checkbox';
import { DEFAULT_HAIR_CONSULTATION_FORM_VALUES } from '@/features/posts/constants/hair-consultation-form-default-values';
import { HAIR_CONSULTATION_CONCERN_OPTIONS } from '@/features/posts/constants/hair-consultation-create-options';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '@/features/posts/constants/hair-consultation-form-field-name';
import type { HairConsultationConcern } from '@/entities/posts/api/create-hair-consultation-request';
import type { HairConsultationFormValues } from '@/features/posts/types/hair-consultation-form-values';
import { SiteHeader } from '@/widgets/header';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useSearchParams } from 'next/navigation';
import useWritingContent from '@/shared/hooks/use-writing-content';

const SPECIAL_CONCERN = '특별한 문제는 없어요';

export default function HairConcernSelectPage() {
  const { replace } = useRouterWithUser();
  const searchParams = useSearchParams();
  const { savedContent, saveContent } = useWritingContent(
    USER_WRITING_CONTENT_KEYS.hairConsultation,
  );

  const initialValue = useMemo(() => {
    return savedContent?.content?.[HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_CONCERNS] ?? [];
  }, [savedContent]);

  const [selectedConcerns, setSelectedConcerns] = useState<HairConsultationConcern[]>(initialValue);

  const handleToggle = (value: HairConsultationConcern) => {
    setSelectedConcerns((prev) => {
      if (value === SPECIAL_CONCERN) {
        return prev.includes(SPECIAL_CONCERN) ? [] : [SPECIAL_CONCERN];
      }
      if (prev.includes(SPECIAL_CONCERN)) {
        return [value];
      }
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
  };

  const handleComplete = () => {
    const baseContent = savedContent?.content ?? DEFAULT_HAIR_CONSULTATION_FORM_VALUES;
    const nextContent: HairConsultationFormValues = {
      ...baseContent,
      [HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_CONCERNS]: selectedConcerns,
    };

    saveContent({
      step: savedContent?.step ?? 1,
      content: nextContent,
    });

    replace(ROUTES.POSTS_CREATE, { skipReload: '1' });
  };

  return (
    <div className="min-w-[375px] w-full h-screen mx-auto flex flex-col bg-white">
      <SiteHeader
        title="헤어 고민"
        showBackButton
        onBackClick={() =>
          replace(ROUTES.POSTS_CREATE, {
            skipReload: '1',
            ...Object.fromEntries(searchParams.entries()),
          })
        }
      />
      <div className="flex flex-col gap-7 px-5 pt-7 pb-6 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className={`${AppTypography.headlineSemiBold} text-label-default`}>
              평소 헤어 고민을 모두 골라주세요
            </span>
            <span className={`${AppTypography.body2SemiBold} text-cautionary`}>필수</span>
          </div>
          <span className={`${AppTypography.body2LongRegular} text-label-info`}>
            정보가 현재와 다르면 상담 결과가 달라질 수 있어요.
          </span>
        </div>

        <div className="flex flex-col gap-0">
          <ToggleChipGroup className="flex flex-wrap gap-2">
            {HAIR_CONSULTATION_CONCERN_OPTIONS.filter((option) => option !== SPECIAL_CONCERN).map(
              (option) => {
                const checked = selectedConcerns.includes(option);
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
              },
            )}
          </ToggleChipGroup>
          <div className="mt-[28px] flex items-center justify-end gap-3">
            <label
              htmlFor="hair-concern-special"
              className={`${AppTypography.body2Regular} text-label-sub cursor-pointer`}
            >
              {SPECIAL_CONCERN}
            </label>
            <Checkbox
              id="hair-concern-special"
              shape="round"
              checked={selectedConcerns.includes(SPECIAL_CONCERN)}
              onChange={() => handleToggle(SPECIAL_CONCERN)}
            />
          </div>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-1 border-border-default">
        <Button
          className="w-full"
          size="lg"
          disabled={selectedConcerns.length === 0}
          onClick={handleComplete}
        >
          완료
        </Button>
      </div>
    </div>
  );
}
