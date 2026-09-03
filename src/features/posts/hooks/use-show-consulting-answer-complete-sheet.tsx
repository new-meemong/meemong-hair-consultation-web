import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';

import { Button } from '@/shared/ui/button';
import type { CreateEventMongResponse } from '@/entities/mong/api/create-event-mong-response';
import useGetMongRewardPresets from '@/entities/mong/api/use-get-mong-reward-presets';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOverlayContext } from '@/shared/context/overlay-context';

import { HAIR_CONSULTATION_ANSWER_SINCERE_WRITING_CRITERIA } from '../constants/hair-consultation-answer-reward-copy';
import { getHairConsultationAnswerRewardCriteria } from '../lib/get-hair-consultation-answer-reward-criteria';

const COMPLETE_SHEET_ID = 'consulting-answer-complete-sheet';
const CRITERIA_SHEET_ID = 'consulting-answer-reward-criteria-sheet';

function ConsultingAnswerRewardCriteriaSheetContent({
  initialRewardCriteria,
  loadRewardCriteria,
}: {
  initialRewardCriteria: ReturnType<typeof getHairConsultationAnswerRewardCriteria>;
  loadRewardCriteria: () => Promise<ReturnType<
    typeof getHairConsultationAnswerRewardCriteria
  > | null>;
}) {
  const [rewardCriteria, setRewardCriteria] = useState(initialRewardCriteria);
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    void loadRewardCriteria()
      .then((latestRewardCriteria) => {
        if (isCancelled || latestRewardCriteria === null) return;
        setRewardCriteria(latestRewardCriteria);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!isCancelled) setIsRefreshing(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [loadRewardCriteria]);

  return (
    <>
      <DrawerHeader className="gap-3">
        <DrawerTitle>리워드 지급 기준</DrawerTitle>
        <DrawerDescription className="sr-only">
          컨설팅 답변 유형별 리워드와 성실작성 기준을 안내합니다.
        </DrawerDescription>
        <div className="flex flex-col gap-2">
          {rewardCriteria.map((criterion) => (
            <div
              key={criterion.presetCode}
              className="flex items-center justify-between typo-body-1-long-regular text-label-default"
            >
              <span>{criterion.label}</span>
              <span className="typo-body-1-semibold text-label-strong">
                {criterion.rewardAmount !== null
                  ? `${criterion.rewardAmount}몽`
                  : isRefreshing
                    ? '확인 중'
                    : '확인 불가'}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 pt-1">
          <p className="typo-body-2-long-semibold text-label-sub">성실작성 기준</p>
          {HAIR_CONSULTATION_ANSWER_SINCERE_WRITING_CRITERIA.map((criterion) => (
            <p key={criterion} className="typo-body-2-long-regular text-label-info">
              {criterion}
            </p>
          ))}
        </div>
      </DrawerHeader>
      <DrawerFooter
        buttons={[
          <DrawerClose asChild key="close">
            <Button size="lg">닫기</Button>
          </DrawerClose>,
        ]}
      />
    </>
  );
}

export default function useShowConsultingAnswerCompleteSheet() {
  const { showBottomSheet } = useOverlayContext();
  const { data: rewardPresetsData, refetch: refetchRewardPresets } = useGetMongRewardPresets({
    isActive: true,
  });
  const currentRewardCriteria = useMemo(
    () => getHairConsultationAnswerRewardCriteria(rewardPresetsData?.dataList),
    [rewardPresetsData?.dataList],
  );

  const loadRewardCriteria = useCallback(async () => {
    try {
      const latestRewardPresets = await refetchRewardPresets();
      if (latestRewardPresets.isError) return null;

      return getHairConsultationAnswerRewardCriteria(latestRewardPresets.data?.dataList);
    } catch {
      return null;
    }
  }, [refetchRewardPresets]);

  const showCriteriaSheet = useCallback(
    (onNavigate: () => void) => {
      showBottomSheet({
        id: CRITERIA_SHEET_ID,
        onClose: onNavigate,
        children: (
          <ConsultingAnswerRewardCriteriaSheetContent
            initialRewardCriteria={currentRewardCriteria}
            loadRewardCriteria={loadRewardCriteria}
          />
        ),
      });
    },
    [currentRewardCriteria, loadRewardCriteria, showBottomSheet],
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
      let isOpeningRewardCriteriaSheet = false;

      showBottomSheet({
        id: COMPLETE_SHEET_ID,
        onClose: () => {
          if (!isOpeningRewardCriteriaSheet) onNavigate();
        },
        children: (
          <>
            <DrawerHeader className="gap-2">
              <DrawerTitle>컨설팅 작성이 완료되었습니다!</DrawerTitle>
              <DrawerDescription className="sr-only">
                컨설팅 답변 작성 완료와 지급된 리워드를 안내합니다.
              </DrawerDescription>
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
                <DrawerClose asChild key="criteria">
                  <Button
                    theme="white"
                    size="lg"
                    className="rounded-4"
                    onClick={() => {
                      isOpeningRewardCriteriaSheet = true;
                      showCriteriaSheet(onNavigate);
                    }}
                  >
                    리워드 기준보기
                  </Button>
                </DrawerClose>,
                <DrawerClose asChild key="close">
                  <Button size="lg" className="rounded-4">
                    닫기
                  </Button>
                </DrawerClose>,
              ]}
            />
          </>
        ),
      });
    },
    [showBottomSheet, showCriteriaSheet],
  );

  return showConsultingAnswerCompleteSheet;
}
