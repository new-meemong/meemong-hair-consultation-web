import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';

import { Button } from '@/shared/ui/button';
import type { CreateEventMongResponse } from '@/entities/mong/api/create-event-mong-response';
import { useCallback } from 'react';
import { useOverlayContext } from '@/shared/context/overlay-context';

const COMPLETE_SHEET_ID = 'consulting-answer-complete-sheet';
const CRITERIA_SHEET_ID = 'consulting-answer-reward-criteria-sheet';

const criteriaItems = [
  {
    label: '이미지 포함',
    value: '10몽',
  },
  {
    label: '이미지 미포함 · 성실작성',
    value: '3몽',
  },
  {
    label: '이미지 미포함 · 성실작성 X',
    value: '0몽',
  },
];

const sincereWritingCriteria = [
  "여성 고객: '매장 상담이 필요해요' 응답 2건 이하",
  "남성 고객: '매장 상담이 필요해요' 응답 1건 이하",
];

export default function useShowConsultingAnswerCompleteSheet() {
  const { showBottomSheet, closeBottomSheet } = useOverlayContext();

  const showCriteriaSheet = useCallback(
    (onNavigate: () => void) => {
      showBottomSheet({
        id: CRITERIA_SHEET_ID,
        children: (
          <>
            <DrawerHeader className="gap-3">
              <DrawerTitle>리워드 지급 기준</DrawerTitle>
              <div className="flex flex-col gap-2">
                {criteriaItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between typo-body-1-long-regular text-label-default"
                  >
                    <span>{item.label}</span>
                    <span className="typo-body-1-semibold text-label-strong">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <p className="typo-body-2-long-semibold text-label-sub">성실작성 기준</p>
                {sincereWritingCriteria.map((criterion) => (
                  <p key={criterion} className="typo-body-2-long-regular text-label-info">
                    {criterion}
                  </p>
                ))}
              </div>
            </DrawerHeader>
            <DrawerFooter
              buttons={[
                <DrawerClose asChild key="close">
                  <Button size="lg" onClick={onNavigate}>
                    닫기
                  </Button>
                </DrawerClose>,
              ]}
            />
          </>
        ),
      });
    },
    [showBottomSheet],
  );

  const showConsultingAnswerCompleteSheet = useCallback(
    ({
      eventMongData,
      onNavigate,
    }: {
      eventMongData: CreateEventMongResponse;
      onNavigate: () => void;
    }) => {
      const amount = eventMongData?.amount ?? 0;
      const balance = eventMongData
        ? eventMongData.depositTotalSum - eventMongData.withdrawTotalSum
        : 0;

      showBottomSheet({
        id: COMPLETE_SHEET_ID,
        children: (
          <>
            <DrawerHeader className="gap-2">
              <DrawerTitle>컨설팅 작성이 완료되었습니다!</DrawerTitle>
              {amount > 0 && (
                <div className="flex flex-col gap-1 pt-1">
                  <p className="typo-body-1-long-semibold text-label-strong">
                    리워드 <span className="text-primary">{amount}몽</span> 지급해드렸어요!
                  </p>
                  <p className="typo-body-1-long-regular text-label-sub">
                    내 잔여 몽:{' '}
                    <span className="typo-body-1-semibold text-negative-light">{balance}몽</span>
                  </p>
                </div>
              )}
            </DrawerHeader>
            <DrawerFooter
              buttons={[
                <Button
                  key="criteria"
                  theme="white"
                  size="lg"
                  className="rounded-4"
                  onClick={() => {
                    closeBottomSheet(COMPLETE_SHEET_ID);
                    showCriteriaSheet(onNavigate);
                  }}
                >
                  리워드 기준보기
                </Button>,
                <DrawerClose asChild key="close">
                  <Button size="lg" className="rounded-4" onClick={onNavigate}>
                    닫기
                  </Button>
                </DrawerClose>,
              ]}
            />
          </>
        ),
      });
    },
    [showBottomSheet, closeBottomSheet, showCriteriaSheet],
  );

  return showConsultingAnswerCompleteSheet;
}
