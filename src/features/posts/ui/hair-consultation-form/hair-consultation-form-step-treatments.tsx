import { Button, Textarea } from '@/shared';
import { DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';
import { format, subMonths } from 'date-fns';
import { useFormContext, useWatch } from 'react-hook-form';
import { useMemo, useState } from 'react';

import { AppTypography } from '@/shared/styles/typography';
import Checkbox from '@/shared/ui/checkbox';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import CloseIcon from '@/assets/icons/close.svg';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';
import RoundCheckboxIcon from '@/assets/icons/round-checkbox.svg';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useOverlayContext } from '@/shared/context/overlay-context';

const MALE_TREATMENTS = [
  { value: '일반펌', label: '일반펌' },
  { value: '열펌/셋팅펌', label: '열펌/셋팅펌' },
  { value: '다운펌', label: '다운펌' },
  { value: '매직', label: '매직' },
  { value: '일반염색', label: '일반염색' },
  { value: '블랙염색', label: '블랙염색' },
  { value: '블랙빼기', label: '블랙빼기' },
  { value: '탈색', label: '탈색' },
] as const;

const FEMALE_TREATMENTS = [
  { value: '일반펌', label: '일반펌' },
  { value: '열펌/셋팅펌', label: '열펌/셋팅펌' },
  { value: '매직', label: '매직' },
  { value: '일반염색', label: '일반염색' },
  { value: '블랙염색', label: '블랙염색' },
  { value: '블랙빼기', label: '블랙빼기' },
  { value: '탈색', label: '탈색' },
  { value: '클리닉', label: '클리닉' },
  { value: '특수클리닉(신데렐라 등)', label: '특수클리닉(신데렐라 등)' },
] as const;

const TYPE1_TREATMENTS = ['일반염색', '블랙염색', '블랙빼기'] as const;
const TYPE2_TREATMENTS = ['일반펌', '열펌/셋팅펌', '매직', '탈색'] as const;
const TYPE3_FEMALE_TREATMENTS = ['클리닉', '특수클리닉(신데렐라 등)'] as const;

const TREATMENT_AREA_OPTIONS = [
  { value: '전체', label: '헤어 전체' },
  { value: '뿌리', label: '뿌리' },
  { value: '투톤', label: '투톤' },
  { value: '앞머리', label: '앞머리' },
  { value: '기타', label: '기타' },
] as const;

const SpecialTreatmentConfirmSheet = ({
  sheetId,
  label,
  onConfirm,
}: {
  sheetId: string;
  label: string;
  onConfirm: () => void;
}) => {
  const { closeBottomSheet } = useOverlayContext();
  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="typo-title-2-semibold text-label-strong">
          {label} 선택 시
          <br />
          입력 내용이 초기화됩니다
        </DrawerTitle>
        <DrawerDescription className="typo-body-2-regular text-label-sub">
          {label}를 선택하시겠습니까?
        </DrawerDescription>
      </DrawerHeader>
      <DrawerFooter
        className="pb-4"
        buttons={[
          <Button
            key="close"
            size="lg"
            theme="white"
            className="rounded-[4px]"
            onClick={() => closeBottomSheet(sheetId)}
          >
            닫기
          </Button>,
          <Button
            key="confirm"
            size="lg"
            className="rounded-[4px] bg-negative-light"
            onClick={() => {
              onConfirm();
              closeBottomSheet(sheetId);
            }}
          >
            선택 및 삭제
          </Button>,
        ]}
      />
    </>
  );
};

type TreatmentAreaValue = (typeof TREATMENT_AREA_OPTIONS)[number]['value'];

const TreatmentAreaSheet = ({
  sheetId,
  selected,
  onConfirm,
}: {
  sheetId: string;
  selected: TreatmentAreaValue | null | undefined;
  onConfirm: (value: TreatmentAreaValue | null) => void;
}) => {
  const { closeBottomSheet } = useOverlayContext();
  const [value, setValue] = useState<TreatmentAreaValue | null>(selected ?? null);

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>시술 부위</DrawerTitle>
      </DrawerHeader>
      <div className="flex flex-col gap-3">
        {TREATMENT_AREA_OPTIONS.map((area) => {
          const isSelected = value === area.value;
          return (
            <button
              key={area.value}
              type="button"
              className="flex items-center justify-between py-2"
              onClick={() => setValue(area.value)}
            >
              <span
                className={
                  isSelected
                    ? `${AppTypography.body2SemiBold} text-cautionary`
                    : `${AppTypography.body2Regular} text-label-default`
                }
              >
                {area.label}
              </span>
              {isSelected && <RoundCheckboxIcon className="text-cautionary" />}
            </button>
          );
        })}
      </div>
      <DrawerFooter
        className="pb-4"
        buttons={[
          <Button key="close" size="lg" theme="white" onClick={() => closeBottomSheet(sheetId)}>
            닫기
          </Button>,
          <Button
            key="confirm"
            size="lg"
            onClick={() => {
              onConfirm(value);
              closeBottomSheet(sheetId);
            }}
          >
            확인
          </Button>,
        ]}
      />
    </>
  );
};

export default function HairConsultationFormStepTreatments() {
  const { control, setValue } = useFormContext<HairConsultationFormValues>();
  const { user } = useAuthContext();
  const { showBottomSheet } = useOverlayContext();
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  const treatments = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS,
  });
  const treatmentDetail = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENT_DETAIL,
  });

  const isMale = user.sex === '남자';
  const specialTreatment = isMale ? '커트만 했어요' : '커트/드라이만 했어요';
  const treatmentOptions = isMale ? MALE_TREATMENTS : FEMALE_TREATMENTS;

  const treatmentLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    treatmentOptions.forEach((option) => {
      map.set(option.value, option.label);
    });
    map.set(specialTreatment, specialTreatment);
    return map;
  }, [specialTreatment, treatmentOptions]);

  const getTreatmentLabel = (
    value: HairConsultationFormValues['treatments'][number]['treatmentType'],
  ) => treatmentLabelMap.get(value) ?? value;

  const treatmentAreaLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    TREATMENT_AREA_OPTIONS.forEach((area) => {
      map.set(area.value, area.label);
    });
    return map;
  }, []);

  const getTreatmentAreaLabel = (value: string | null | undefined) =>
    value ? (treatmentAreaLabelMap.get(value) ?? value) : '시술부위 선택';

  const treatmentList = treatments ?? [];

  const hasSpecialTreatment = treatmentList.some((item) => item.treatmentType === specialTreatment);

  const createTreatment = (
    treatmentType: HairConsultationFormValues['treatments'][number]['treatmentType'],
  ) => ({
    treatmentType,
    monthsAgo: 0,
    isSelf: false,
    treatmentArea: null,
    decolorizationCount: TYPE1_TREATMENTS.includes(
      treatmentType as (typeof TYPE1_TREATMENTS)[number],
    )
      ? 0
      : null,
  });

  const setTreatments = (next: HairConsultationFormValues['treatments']) => {
    setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS, next, { shouldDirty: true });
  };

  const handleToggle = (
    value: HairConsultationFormValues['treatments'][number]['treatmentType'],
  ) => {
    if (value === specialTreatment) {
      if (!hasSpecialTreatment && treatmentList.length > 0) {
        const sheetId = `special-treatment-confirm-${specialTreatment}`;
        showBottomSheet({
          id: sheetId,
          children: (
            <SpecialTreatmentConfirmSheet
              sheetId={sheetId}
              label={specialTreatment}
              onConfirm={() => {
                setTreatments([createTreatment(specialTreatment)]);
              }}
            />
          ),
        });
        return;
      }
      setTreatments(hasSpecialTreatment ? [] : [createTreatment(specialTreatment)]);
      return;
    }

    const nextList = treatmentList.filter((item) => item.treatmentType !== specialTreatment);
    setTreatments([...nextList, createTreatment(value)]);
  };

  const updateTreatment = (
    targetIndex: number,
    updater: (
      item: HairConsultationFormValues['treatments'][number],
    ) => HairConsultationFormValues['treatments'][number],
  ) => {
    const next = treatmentList.map((item, index) => (index === targetIndex ? updater(item) : item));
    setTreatments(next);
  };

  const removeTreatment = (targetIndex: number) => {
    const next = treatmentList.filter((_, index) => index !== targetIndex);
    setTreatments(next);
  };

  const getCardType = (
    treatmentType: HairConsultationFormValues['treatments'][number]['treatmentType'],
  ) => {
    if (TYPE1_TREATMENTS.includes(treatmentType as (typeof TYPE1_TREATMENTS)[number])) {
      return 'TYPE1';
    }
    if (!isMale) {
      if (TYPE2_TREATMENTS.includes(treatmentType as (typeof TYPE2_TREATMENTS)[number])) {
        return 'TYPE2';
      }
      if (
        TYPE3_FEMALE_TREATMENTS.includes(treatmentType as (typeof TYPE3_FEMALE_TREATMENTS)[number])
      ) {
        return 'TYPE3';
      }
      return 'TYPE3';
    }
    return 'TYPE3';
  };

  const cardTreatments = useMemo(
    () =>
      treatmentList
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.treatmentType !== specialTreatment),
    [treatmentList, specialTreatment],
  );

  const handleMonthAdjust = (targetIndex: number, delta: number) => {
    updateTreatment(targetIndex, (item) => ({
      ...item,
      monthsAgo: Math.max(0, item.monthsAgo + delta),
    }));
  };

  const handleMonthQuickAdd = (targetIndex: number, delta: number) => {
    updateTreatment(targetIndex, (item) => ({
      ...item,
      monthsAgo: Math.max(0, item.monthsAgo + delta),
    }));
  };

  const handleMonthReset = (targetIndex: number) => {
    updateTreatment(targetIndex, (item) => ({ ...item, monthsAgo: 0 }));
  };

  const handleDecolorizationAdjust = (targetIndex: number, delta: number) => {
    updateTreatment(targetIndex, (item) => ({
      ...item,
      decolorizationCount: Math.max(0, (item.decolorizationCount ?? 0) + delta),
    }));
  };

  const handleSelfToggle = (targetIndex: number) => {
    updateTreatment(targetIndex, (item) => ({ ...item, isSelf: !item.isSelf }));
  };

  const handleAreaSelect = (targetIndex: number) => {
    const treatmentType = treatmentList[targetIndex]?.treatmentType;
    if (!treatmentType) return;

    const sheetId = `treatment-area-${treatmentType}-${targetIndex}`;
    showBottomSheet({
      id: sheetId,
      children: (
        <TreatmentAreaSheet
          sheetId={sheetId}
          selected={treatmentList[targetIndex]?.treatmentArea}
          onConfirm={(value) => {
            updateTreatment(targetIndex, (item) => ({
              ...item,
              treatmentArea: value,
            }));
          }}
        />
      ),
    });
  };

  const formatMonthLabel = (monthsAgo: number) => {
    const targetDate = subMonths(new Date(), monthsAgo);
    if (monthsAgo === 0) {
      return '이번달';
    }
    return `약 ${format(targetDate, 'yyyy년 MM월')}`;
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap gap-2">
        {treatmentOptions.map((option) => {
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              className={[
                'rounded-full px-4 py-2.5 h-auto border border-border-default bg-white text-label-sub',
                'typo-body-2-regular active:bg-alternative',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3">
        <label
          htmlFor="hair-treatment-special"
          className={`${AppTypography.body2Regular} text-label-sub cursor-pointer`}
        >
          {specialTreatment}
        </label>
        <Checkbox
          id="hair-treatment-special"
          shape="round"
          checked={hasSpecialTreatment}
          onChange={() => handleToggle(specialTreatment)}
        />
      </div>

      {cardTreatments.length > 0 && (
        <div className="flex flex-col gap-4">
          {cardTreatments.map(({ item, index }) => {
            const cardType = getCardType(item.treatmentType);
            const itemKey = `${item.treatmentType}-${index}`;
            const isOpen = openCards[itemKey] ?? true;
            const isIncomplete = cardType !== 'TYPE3' && !item.treatmentArea;
            return (
              <div key={itemKey} className="rounded-6 bg-alternative p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`${AppTypography.body2SemiBold} text-label-sub`}>
                      {getTreatmentLabel(item.treatmentType)}
                    </span>
                    {!isOpen && isIncomplete && (
                      <span className="ml-2 typo-body-3-medium text-negative-light">
                        내용을 모두 입력하세요
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={isOpen ? '카드 접기' : '카드 펼치기'}
                      className="w-6 h-6 flex items-center justify-center"
                      onClick={() =>
                        setOpenCards((prev) => ({
                          ...prev,
                          [itemKey]: !(prev[itemKey] ?? true),
                        }))
                      }
                    >
                      <ChevronRightIcon
                        className={`w-4 h-4 text-label-info transition-transform ${
                          isOpen ? '-rotate-90' : 'rotate-90'
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      className="w-6 h-6 flex items-center justify-center"
                      onClick={() => removeTreatment(index)}
                    >
                      <CloseIcon className="w-4 h-4 text-negative" />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center w-full bg-white px-2 py-2 rounded-6">
                        <button
                          type="button"
                          disabled={item.monthsAgo <= 0}
                          className={[
                            'w-8 h-8 rounded-4 text-white flex items-center justify-center',
                            item.monthsAgo > 0 ? 'bg-label-default' : 'bg-label-disable',
                          ].join(' ')}
                          onClick={() => handleMonthAdjust(index, -1)}
                        >
                          -
                        </button>
                        <span className="flex-1 text-center">
                          <span className={`${AppTypography.body2Regular} text-label-default`}>
                            {item.monthsAgo}
                          </span>
                          <span className={`${AppTypography.body2Medium} text-label-sub`}>
                            개월 전 ({formatMonthLabel(item.monthsAgo)})
                          </span>
                        </span>
                        <button
                          type="button"
                          className="w-8 h-8 rounded-4 bg-label-default text-white flex items-center justify-center"
                          onClick={() => handleMonthAdjust(index, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {cardType === 'TYPE1' && (
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {[3, 6, 12].map((months) => (
                            <button
                              key={months}
                              type="button"
                              className="px-3 py-1.5 rounded-full border border-border-default bg-white text-label-sub typo-body-3-regular"
                              onClick={() => handleMonthQuickAdd(index, months)}
                            >
                              {months === 12 ? '+1년전' : `+${months}개월`}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="w-[34px] h-[34px] rounded-full border border-border-default bg-white flex items-center justify-center"
                          aria-label="개월수 초기화"
                          onClick={() => handleMonthReset(index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <g clipPath="url(#clip0_10392_2433)">
                              <path
                                d="M13.2378 4.7625C12.1503 3.675 10.6578 3 9.00031 3C5.68531 3 3.00781 5.685 3.00781 9C3.00781 12.315 5.68531 15 9.00031 15C11.7978 15 14.1303 13.0875 14.7978 10.5H13.2378C12.6228 12.2475 10.9578 13.5 9.00031 13.5C6.51781 13.5 4.50031 11.4825 4.50031 9C4.50031 6.5175 6.51781 4.5 9.00031 4.5C10.2453 4.5 11.3553 5.0175 12.1653 5.835L9.75031 8.25H15.0003V3L13.2378 4.7625Z"
                                fill="#777777"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_10392_2433">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                      </div>
                    )}

                    {cardType === 'TYPE1' && <div className="border-t border-border-default" />}

                    {cardType === 'TYPE1' && (
                      <div className="flex items-center justify-between">
                        <span className={`${AppTypography.body2Medium} text-label-sub`}>
                          탈색 횟수
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-6 border border-border-default bg-white"
                            onClick={() => handleDecolorizationAdjust(index, -1)}
                          >
                            -
                          </button>
                          <span
                            className={`${AppTypography.body2Medium} text-label-sub w-[100px] text-center`}
                          >
                            {item.decolorizationCount ?? 0}
                          </span>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-6 border border-border-default bg-white"
                            onClick={() => handleDecolorizationAdjust(index, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {cardType !== 'TYPE3' && <div className="border-t border-border-default" />}

                    {cardType !== 'TYPE3' && (
                      <div className="flex items-center justify-between">
                        <span className="typo-body-2-medium text-label-sub">시술부위</span>
                        <button
                          type="button"
                          className="flex items-center justify-between w-[186px] px-3 py-2 border border-border-default rounded-6 bg-white"
                          onClick={() => handleAreaSelect(index)}
                        >
                          <span
                            className={`typo-body-2-regular ${
                              item.treatmentArea ? 'text-label-sub' : 'text-label-placeholder'
                            }`}
                          >
                            {item.treatmentArea
                              ? getTreatmentAreaLabel(item.treatmentArea)
                              : '시술부위를 선택하세요'}
                          </span>
                          <ChevronRightIcon className="w-4 h-4 text-label-sub rotate-90" />
                        </button>
                      </div>
                    )}

                    {cardType !== 'TYPE3' && (
                      <div className="flex items-center justify-end gap-3">
                        <label
                          htmlFor={`self-treatment-${item.treatmentType}-${index}`}
                          className={`${AppTypography.body2Regular} text-label-sub cursor-pointer`}
                        >
                          셀프시술 했어요
                        </label>
                        <Checkbox
                          id={`self-treatment-${item.treatmentType}-${index}`}
                          shape="round"
                          checked={item.isSelf}
                          onChange={() => handleSelfToggle(index)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

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
