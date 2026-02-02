'use client';

import { Button, ROUTES } from '@/shared';
import { useMemo, useState } from 'react';

import { AppTypography } from '@/shared/styles/typography';
import CheckIcon from '@/assets/icons/check.svg';
import { DEFAULT_HAIR_CONSULTATION_FORM_VALUES } from '@/features/posts/constants/hair-consultation-form-default-values';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '@/features/posts/constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '@/features/posts/types/hair-consultation-form-values';
import type { HairConsultationPersonalColor } from '@/entities/posts/api/create-hair-consultation-request';
import RoundCheckboxEmptyIcon from '@/assets/icons/round-checkbox-empty.svg';
import RoundCheckboxIcon from '@/assets/icons/round-checkbox.svg';
import { SiteHeader } from '@/widgets/header';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useSearchParams } from 'next/navigation';
import useWritingContent from '@/shared/hooks/use-writing-content';

type PersonalColorGroup = {
  key: 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'UNKNOWN';
  label: string;
  colors?: [string, string, string];
  subOptions?: Array<{
    key: 'LIGHT' | 'BRIGHT' | 'MUTE' | 'DEEP' | 'COOL' | 'UNKNOWN_DETAIL';
    label: string;
    value: HairConsultationPersonalColor;
  }>;
  value?: HairConsultationPersonalColor;
};

const PERSONAL_COLOR_GROUPS: PersonalColorGroup[] = [
  {
    key: 'SPRING',
    label: '봄웜',
    colors: ['#FAC4A8', '#FFAA89', '#FFB854'],
    subOptions: [
      { key: 'LIGHT', label: '라이트', value: '봄웜,봄라이트' },
      { key: 'BRIGHT', label: '브라이트', value: '봄웜,봄브라이트' },
      { key: 'UNKNOWN_DETAIL', label: '모르겠음', value: '봄웜,상세분류모름' },
    ],
  },
  {
    key: 'SUMMER',
    label: '여름 쿨',
    colors: ['#F1D0E3', '#DDB0CA', '#AC9CCE'],
    subOptions: [
      { key: 'LIGHT', label: '라이트', value: '여름쿨,여름라이트' },
      { key: 'MUTE', label: '뮤트', value: '여름쿨,여름뮤트' },
      { key: 'UNKNOWN_DETAIL', label: '모르겠음', value: '여름쿨,상세분류모름' },
    ],
  },
  {
    key: 'AUTUMN',
    label: '가을웜',
    colors: ['#EBB295', '#E1874E', '#B55A2C'],
    subOptions: [
      { key: 'MUTE', label: '뮤트', value: '가을웜,가을뮤트' },
      { key: 'DEEP', label: '딥', value: '가을웜,가을딥' },
      { key: 'UNKNOWN_DETAIL', label: '모르겠음', value: '가을웜,상세분류모름' },
    ],
  },
  {
    key: 'WINTER',
    label: '겨울쿨',
    colors: ['#E6447A', '#6B1435', '#262524'],
    subOptions: [
      { key: 'BRIGHT', label: '브라이트', value: '겨울쿨,겨울브라이트' },
      { key: 'DEEP', label: '딥', value: '겨울쿨,겨울딥' },
      { key: 'UNKNOWN_DETAIL', label: '모르겠음', value: '겨울쿨,상세분류모름' },
    ],
  },
  {
    key: 'UNKNOWN',
    label: '퍼스널 컬러를 몰라요',
    value: '잘모름',
  },
];

const findGroupByValue = (value: HairConsultationPersonalColor) => {
  for (const group of PERSONAL_COLOR_GROUPS) {
    if (group.value === value) return group;
    const matched = group.subOptions?.find((option) => option.value === value);
    if (matched) return group;
  }
  return PERSONAL_COLOR_GROUPS.find((group) => group.key === 'UNKNOWN') ?? PERSONAL_COLOR_GROUPS[0];
};

const findSubOptionByValue = (value: HairConsultationPersonalColor) => {
  for (const group of PERSONAL_COLOR_GROUPS) {
    const matched = group.subOptions?.find((option) => option.value === value);
    if (matched) return matched;
  }
  return null;
};

export default function PersonalColorSelectPage() {
  const { replace } = useRouterWithUser();
  const searchParams = useSearchParams();
  const { savedContent, saveContent } = useWritingContent(USER_WRITING_CONTENT_KEYS.hairConsultation);

  const initialValue = useMemo(() => {
    return (
      savedContent?.content?.[HAIR_CONSULTATION_FORM_FIELD_NAME.PERSONAL_COLOR] ??
      DEFAULT_HAIR_CONSULTATION_FORM_VALUES[HAIR_CONSULTATION_FORM_FIELD_NAME.PERSONAL_COLOR]
    );
  }, [savedContent]);

  const [selectedGroupKey, setSelectedGroupKey] = useState<PersonalColorGroup['key']>(() => {
    return findGroupByValue(initialValue).key;
  });
  const [selectedSubValue, setSelectedSubValue] = useState<HairConsultationPersonalColor | null>(
    () => findSubOptionByValue(initialValue)?.value ?? null,
  );

  const handleGroupSelect = (group: PersonalColorGroup) => {
    setSelectedGroupKey(group.key);
    if (group.key === 'UNKNOWN') {
      setSelectedSubValue(null);
    } else {
      const defaultSub = group.subOptions?.[2]?.value ?? null;
      setSelectedSubValue(defaultSub);
    }
  };

  const handleSubSelect = (value: HairConsultationPersonalColor) => {
    setSelectedSubValue(value);
  };

  const handleComplete = () => {
    const baseContent = savedContent?.content ?? DEFAULT_HAIR_CONSULTATION_FORM_VALUES;
    const selectedGroup = PERSONAL_COLOR_GROUPS.find((group) => group.key === selectedGroupKey);
    const nextPersonalColor =
      selectedGroup?.key === 'UNKNOWN'
        ? selectedGroup.value ?? '잘모름'
        : (selectedSubValue ?? selectedGroup?.subOptions?.[2]?.value ?? '잘모름');

    const nextContent: HairConsultationFormValues = {
      ...baseContent,
      [HAIR_CONSULTATION_FORM_FIELD_NAME.PERSONAL_COLOR]: nextPersonalColor,
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
        title="퍼스널 컬러"
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
              나의 퍼스널 컬러를 선택해주세요
            </span>
            <span className={`${AppTypography.body2SemiBold} text-cautionary`}>필수</span>
          </div>
          <span className={`${AppTypography.body2LongRegular} text-label-info`}>
            세부 톤을 안다면 세부톤까지 선택해주세요
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {PERSONAL_COLOR_GROUPS.map((group) => {
            const checked = group.key === selectedGroupKey;
            const hasColors = !!group.colors;
            return (
              <div key={group.key} className="flex flex-col gap-2">
                <button
                  type="button"
                  className={`flex w-full items-center px-0 py-3 ${hasColors ? 'gap-4' : 'gap-0'}`}
                  onClick={() => handleGroupSelect(group)}
                >
                  {hasColors && (
                    <div className="flex items-center gap-1">
                      {group.colors?.map((color, index) => (
                        <span
                          key={`${group.key}-${index}`}
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center flex-1 text-left">
                    <span className={`${AppTypography.body1Medium} text-label-default`}>
                      {group.label}
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

                {checked && group.subOptions && (
                  <div className="flex gap-3 justify-center">
                    {group.subOptions.map((option) => {
                      const subChecked = selectedSubValue === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          className={[
                            'flex items-center justify-center gap-0.5 rounded-6 px-3 py-2 w-[104px]',
                            subChecked
                              ? 'bg-label-sub text-white'
                              : 'bg-white text-label-sub border border-border-default',
                            'typo-body-2-regular',
                          ].join(' ')}
                          onClick={() => handleSubSelect(option.value)}
                        >
                          {subChecked && <CheckIcon className="block w-[14px] h-[14px] text-white" />}
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
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
