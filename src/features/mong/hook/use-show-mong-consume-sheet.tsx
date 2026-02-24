import { Button, ROUTES } from '@/shared';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';

import type { GetMongWithdrawResponse } from '@/entities/mong/api/get-mong-withdraw-response';
import type { HTTPError } from 'ky';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import type { USER_SEX } from '@/entities/user/constants/user-sex';
import type { ValueOf } from '@/shared/type/types';
import { apiClient } from '@/shared/api/client';
import { useCallback } from 'react';
import useGetMongConsumePresets from '@/features/mong/api/use-get-mong-consume-presets';
import useGetMongCurrent from '@/features/mong/api/use-get-mong-current';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowMongInsufficientSheet from '@/features/mong/hook/use-show-mong-insufficient-sheet';

type ShowMongConsumeSheetParams = {
  designerName: string;
  answerId: number;
  postId: string;
  postListTab: string;
  postWriterSex?: ValueOf<typeof USER_SEX>;
};

export default function useShowMongConsumeSheet() {
  const { showBottomSheet } = useOverlayContext();
  const { data: presetsData } = useGetMongConsumePresets();
  const { data: mongCurrentData } = useGetMongCurrent();
  const showMongInsufficientSheet = useShowMongInsufficientSheet();
  const { push } = useRouterWithUser();

  const showMongConsumeSheet = useCallback(
    async ({
      designerName,
      answerId,
      postId,
      postListTab,
      postWriterSex,
    }: ShowMongConsumeSheetParams) => {
      const targetRoute = ROUTES.POSTS_CONSULTING_RESPONSE(postId, answerId.toString());
      const responseNavigationParams = {
        [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
        ...(postWriterSex ? { [SEARCH_PARAMS.POST_WRITER_SEX]: postWriterSex } : {}),
      };
      const withdrawQueryCandidates = [
        {
          createType: 'VIEW_MY_HAIR_CONSULTATIONS_ANSWERS_MODEL',
          refType: 'HairConsultationsAnswers',
          refId: answerId.toString(),
        },
      ] as const;

      // 먼저 몽 차감 유무 조회 API 호출 (자동결제 처리)
      let isMongConsumeDisabled = false;
      let withdrawResponse: GetMongWithdrawResponse = null;
      let withdrawError: unknown = null;
      let hasNotFoundPresetError = false;

      for (const query of withdrawQueryCandidates) {
        try {
          const response = await apiClient.get<GetMongWithdrawResponse>('mong-moneys/withdraw', {
            searchParams: query,
          });
          withdrawResponse = response.data;
          break;
        } catch (error) {
          withdrawError = error;

          if (error && typeof error === 'object' && 'response' in error) {
            const httpError = error as HTTPError;
            if (httpError.response?.status === 404) {
              hasNotFoundPresetError = true;
              continue;
            }
            if (httpError.response?.status === 409) {
              showMongInsufficientSheet();
              return { alreadyPaid: false, mongInsufficient: true };
            }
          }
        }
      }

      // 이미 결제한 적이 있으면 바텀시트를 열지 않고 바로 답변 페이지로 이동
      if (withdrawResponse?.isPaid === true) {
        push(targetRoute, responseNavigationParams);
        return { alreadyPaid: true };
      }

      // API 호출 실패 시에도 바텀시트를 표시하도록 진행
      if (!withdrawResponse && !isMongConsumeDisabled && withdrawError) {
        console.error('몽 차감 조회 API 호출 실패:', withdrawError);
      }

      if (!withdrawResponse && hasNotFoundPresetError) {
        isMongConsumeDisabled = true;
        console.log('몽 소비 비활성화 상태');
      }

      // 몽 소비가 비활성화된 경우 바로 답변 페이지로 이동
      if (isMongConsumeDisabled) {
        push(targetRoute, responseNavigationParams);
        return { alreadyPaid: false, mongConsumeDisabled: true };
      }

      // 결제한 적이 없으면 바텀시트 표시
      // 모든 프리셋을 가져온 후 클라이언트에서 HAIR_CONSULTING 관련 프리셋만 필터링
      const hairConsultingPresets =
        presetsData?.dataList?.filter((p) => p.type === 'HAIR_CONSULTING') ?? [];
      // subType이 최신/레거시 답변 조회 키이거나 title로 찾기
      const preset = hairConsultingPresets.find(
        (p) =>
          p.subType === 'VIEW_MY_HAIR_CONSULTATIONS_ANSWERS_MODEL' ||
          p.title === '내가 쓴 게시물 헤어컨설팅 답변 보기',
      );
      const price = preset?.price ?? 0;
      const currentMongAmount = mongCurrentData?.data?.currentTotalAmount ?? 0;

      showBottomSheet({
        id: 'mong-consume-sheet',
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
                    맞춤 컨설팅 답변을 조회할게요
                  </span>
                  <span className="typo-body-1-long-regular text-label-sub">
                    내 잔여 몽: <span className="typo-body-1-semibold">{currentMongAmount}몽</span>
                  </span>
                </span>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter
              buttons={[
                <DrawerClose asChild key="confirm">
                  <Button
                    size="lg"
                    className="rounded-4"
                    onClick={() => {
                      // 자동결제이므로 GET 요청에서 이미 결제 처리됨
                      // 바로 답변 페이지로 이동
                      push(targetRoute, responseNavigationParams);
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
    [showBottomSheet, push, presetsData, mongCurrentData, showMongInsufficientSheet],
  );

  return showMongConsumeSheet;
}
