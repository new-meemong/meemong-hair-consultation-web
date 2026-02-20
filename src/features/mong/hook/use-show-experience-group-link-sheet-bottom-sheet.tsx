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

// Legacy flow kept for reuse:
// growth pass -> free open, otherwise mong withdraw + bottom sheet.
export default function useShowExperienceGroupLinkSheetBottomSheet() {
  const { showBottomSheet } = useOverlayContext();
  const { data: presetsData } = useGetMongConsumePresets();
  const { data: mongCurrentData } = useGetMongCurrent();
  const { data: growthPassStatus } = useGetGrowthPassStatus();
  const { mutateAsync: createMongWithdraw } = useCreateMongWithdrawMutation();
  const showMongInsufficientSheet = useShowMongInsufficientSheet();

  const showExperienceGroupLinkSheet = useCallback(
    async ({ designerName, experienceGroupId, url }: ShowExperienceGroupLinkSheetParams) => {
      if (growthPassStatus?.data?.isActive) {
        openUrlInApp(url);
        return { alreadyPaid: false, growthPassActive: true };
      }

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

        if (withdrawResponse?.data?.isPaid === true) {
          openUrlInApp(url);
          return { alreadyPaid: true };
        }
      } catch (error) {
        if (error && typeof error === 'object' && 'response' in error) {
          const httpError = error as HTTPError;
          if (httpError.response?.status === 404) {
            isMongConsumeDisabled = true;
          }
        }
      }

      if (isMongConsumeDisabled) {
        openUrlInApp(url);
        return { alreadyPaid: false, mongConsumeDisabled: true };
      }

      const experienceGroupPresets =
        presetsData?.dataList?.filter((p) => p.type === 'EXPERIENCE_GROUPS') ?? [];
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
                    onClick={async () => {
                      try {
                        await createMongWithdraw({
                          createType: 'EXPERIENCE_GROUPS_LINK_DESIGNER',
                          refId: experienceGroupId,
                          refType: 'ExperienceGroups',
                        });
                        openUrlInApp(url);
                      } catch (error) {
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
    [
      showBottomSheet,
      presetsData,
      mongCurrentData,
      growthPassStatus,
      createMongWithdraw,
      showMongInsufficientSheet,
    ],
  );

  return showExperienceGroupLinkSheet;
}
