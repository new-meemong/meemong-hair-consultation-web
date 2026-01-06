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
import useCreateMongWithdrawMutation from '@/features/mong/api/use-create-mong-withdraw-mutation';
import useGetMongConsumePresets from '@/features/mong/api/use-get-mong-consume-presets';
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
  const { mutateAsync: createMongWithdraw } = useCreateMongWithdrawMutation();
  const showMongInsufficientSheet = useShowMongInsufficientSheet();

  const showExperienceGroupLinkSheet = useCallback(
    async ({ designerName, experienceGroupId, url }: ShowExperienceGroupLinkSheetParams) => {
      // 먼저 몽 차감 유무 조회 API 호출
      let currentMongAmount = 0;
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

        // 몽 잔여량 가져오기
        if (withdrawResponse?.data?.currentTotalAmount !== undefined) {
          currentMongAmount = withdrawResponse.data.currentTotalAmount;
        }
      } catch (error) {
        // 404 에러는 몽 소비 비활성화 상태
        if (error && typeof error === 'object' && 'response' in error) {
          const httpError = error as HTTPError;
          if (httpError.response?.status === 404) {
            isMongConsumeDisabled = true;
            console.log('몽 소비 비활성화 상태');
          }
        }

        // API 호출 실패 시에도 바텀시트를 표시하도록 진행
        console.error('몽 차감 조회 API 호출 실패:', error);
        // 몽 잔여량 조회를 위해 다른 createType으로 시도
        if (!isMongConsumeDisabled) {
          try {
            const anyWithdrawResponse = await apiClient.get<GetMongWithdrawResponse>(
              'mong-moneys/withdraw',
              {
                searchParams: {
                  createType: 'RECOMMEND_MODEL_CHAT',
                },
              },
            );
            if (anyWithdrawResponse?.data?.currentTotalAmount !== undefined) {
              currentMongAmount = anyWithdrawResponse.data.currentTotalAmount;
            }
          } catch {
            // 실패해도 계속 진행 (0으로 표시)
          }
        }
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
                    onClick={async () => {
                      try {
                        await createMongWithdraw({
                          createType: 'EXPERIENCE_GROUPS_LINK_DESIGNER',
                          refId: experienceGroupId,
                          refType: 'ExperienceGroups',
                        });
                        // 몽 차감 성공 후 링크로 이동
                        openUrlInApp(url);
                      } catch (error) {
                        // 몽 부족 에러 처리
                        if (error && typeof error === 'object' && 'response' in error) {
                          const httpError = error as HTTPError;
                          if (httpError.response?.status === 409) {
                            showMongInsufficientSheet();
                          }
                        }
                      }
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
    [showBottomSheet, presetsData, createMongWithdraw, showMongInsufficientSheet],
  );

  return showExperienceGroupLinkSheet;
}
