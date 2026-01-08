import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';

import { Button } from '@/shared';
import type { GetMongWithdrawResponse } from '@/entities/mong/api/get-mong-withdraw-response';
import type { HTTPError } from 'ky';
import { apiClient } from '@/shared/api/client';
import { goStorePage } from '@/shared/lib/go-store-page';
import openUrlInApp from '@/shared/lib/open-url-in-app';
import { useCallback } from 'react';
import useGetGrowthPassStatus from '@/features/growth-pass/api/use-get-growth-pass-status';
import useGetMongConsumePresets from '@/features/mong/api/use-get-mong-consume-presets';
import useGetMongCurrent from '@/features/mong/api/use-get-mong-current';
import { useOverlayContext } from '@/shared/context/overlay-context';
import useShowMongInsufficientSheet from '@/features/mong/hook/use-show-mong-insufficient-sheet';

type ShowExperienceGroupLinkSheetParams = {
  designerName: string;
  experienceGroupId: number;
  url: string;
};

export default function useShowExperienceGroupLinkSheet() {
  const { showBottomSheet } = useOverlayContext();
  const { data: presetsData } = useGetMongConsumePresets();
  const { data: mongCurrentData } = useGetMongCurrent();
  const { data: growthPassStatus } = useGetGrowthPassStatus();
  const showMongInsufficientSheet = useShowMongInsufficientSheet();

  const showExperienceGroupLinkSheet = useCallback(
    async ({ designerName, experienceGroupId, url }: ShowExperienceGroupLinkSheetParams) => {
      // 성장패스가 활성화되어 있으면 바로 링크로 이동
      if (growthPassStatus?.data?.isActive) {
        openUrlInApp(url);
        return { alreadyPaid: false, growthPassActive: true };
      }

      // 먼저 몽 차감 유무 조회 API 호출 (자동결제 처리)
      let isMongConsumeDisabled = false;
      try {
        const withdrawResponse = await apiClient.get<GetMongWithdrawResponse>(
          'mong-moneys/withdraw',
          {
            searchParams: {
              createType: 'EXPERIENCE_GROUPS_LINK_DESIGNER',
              refType: 'ExperienceGroups',
              refId: experienceGroupId.toString(),
            },
          },
        );

        // 이미 결제한 적이 있으면 바로 링크로 이동
        if (withdrawResponse?.data?.isPaid === true) {
          openUrlInApp(url);
          return { alreadyPaid: true };
        }
      } catch (error) {
        // 404 에러는 몽 소비 비활성화 상태
        if (error && typeof error === 'object' && 'response' in error) {
          const httpError = error as HTTPError;
          if (httpError.response?.status === 404) {
            isMongConsumeDisabled = true;
            console.log('몽 소비 비활성화 상태');
          }
          // 409 에러: 몽 부족
          if (httpError.response?.status === 409) {
            showMongInsufficientSheet();
            return { alreadyPaid: false, mongInsufficient: true };
          }
        }

        // API 호출 실패 시에도 바텀시트를 표시하도록 진행
        console.error('몽 차감 조회 API 호출 실패:', error);
      }

      // 몽 소비가 비활성화된 경우 바로 링크로 이동
      if (isMongConsumeDisabled) {
        openUrlInApp(url);
        return { alreadyPaid: false, mongConsumeDisabled: true };
      }

      // 결제한 적이 없으면 바텀시트 표시
      // 모든 프리셋을 가져온 후 클라이언트에서 EXPERIENCE_GROUPS 관련 프리셋만 필터링
      const experienceGroupPresets =
        presetsData?.dataList?.filter((p) => p.type === 'EXPERIENCE_GROUPS') ?? [];
      // subType이 EXPERIENCE_GROUPS_LINK_DESIGNER이거나 title로 찾기
      const preset = experienceGroupPresets.find(
        (p) => p.subType === 'EXPERIENCE_GROUPS_LINK_DESIGNER' || p.title === '체험단 링크 클릭',
      );
      const price = preset?.price ?? 0;
      const currentMongAmount = mongCurrentData?.data?.currentTotalAmount ?? 0;

      showBottomSheet({
        id: 'experience-group-link-sheet',
        hideHandle: true,
        children: (
          <>
            <DrawerHeader>
              <DrawerTitle showCloseButton></DrawerTitle>
              <DrawerDescription>
                <span className="flex flex-col gap-2">
                  <span className="typo-title-2-semibold text-label-strong">
                    {designerName}님의
                    <br />
                    협찬 링크로 이동합니다
                  </span>
                  <span className="typo-body-1-long-regular text-label-sub">
                    내 잔여 몽: <span className="typo-body-1-semibold">{currentMongAmount}몽</span>
                  </span>
                </span>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter
              buttons={[
                <DrawerClose asChild key="growth-pass">
                  <Button
                    size="lg"
                    theme="white"
                    className="rounded-4"
                    onClick={() => {
                      goStorePage();
                    }}
                  >
                    성장패스 이용하기
                  </Button>
                </DrawerClose>,
                <DrawerClose asChild key="use-mong">
                  <Button
                    size="lg"
                    className="rounded-4"
                    onClick={() => {
                      // 자동결제이므로 GET 요청에서 이미 결제 처리됨
                      // 바로 링크로 이동
                      openUrlInApp(url);
                    }}
                  >
                    {price}몽 사용
                  </Button>
                </DrawerClose>,
              ]}
            />
          </>
        ),
      });

      return { alreadyPaid: false };
    },
    [showBottomSheet, presetsData, mongCurrentData, growthPassStatus, showMongInsufficientSheet],
  );

  return showExperienceGroupLinkSheet;
}
