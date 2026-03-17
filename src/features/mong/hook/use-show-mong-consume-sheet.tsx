import { Button, ROUTES } from '@/shared';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';

import type { GetMongWithdrawResponse } from '@/entities/mong/api/get-mong-withdraw-response';
import { MEEMONG_PASS_CREATE_TYPES } from '@/features/ad-block/lib/meemong-pass-policy';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import type { USER_SEX } from '@/entities/user/constants/user-sex';
import type { ValueOf } from '@/shared/type/types';
import { apiClient } from '@/shared/api/client';
import { getApiError } from '@/shared/lib/error-handler';
import { goStorePage } from '@/shared/lib/go-store-page';
import { useCallback } from 'react';
import useCreateMongWithdrawMutation from '@/features/mong/api/use-create-mong-withdraw-mutation';
import useGetMongConsumePresets from '@/features/mong/api/use-get-mong-consume-presets';
import useGetMongCurrent from '@/features/mong/api/use-get-mong-current';
import useMeemongPassPolicy from '@/features/ad-block/hook/use-meemong-pass-policy';
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
  const { canSkipMong } = useMeemongPassPolicy();
  const { mutateAsync: createMongWithdraw } = useCreateMongWithdrawMutation();
  const showMongInsufficientSheet = useShowMongInsufficientSheet();
  const { push } = useRouterWithUser();

  const showMongConsumeSheet = useCallback(
    async ({
      designerName: _designerName,
      answerId,
      postId,
      postListTab,
      postWriterSex,
    }: ShowMongConsumeSheetParams) => {
      const targetRoute = ROUTES.POSTS_CONSULTING_RESPONSE(postId, answerId.toString());
      const createType = MEEMONG_PASS_CREATE_TYPES.VIEW_MY_HAIR_CONSULTATIONS_ANSWERS_MODEL;
      const responseNavigationParams = {
        [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
        ...(postWriterSex ? { [SEARCH_PARAMS.POST_WRITER_SEX]: postWriterSex } : {}),
      };
      const withdrawQueryCandidates = [
        {
          createType,
          refType: 'HairConsultationsAnswers',
          refId: answerId.toString(),
        },
      ] as const;

      // 이미 결제한 답변인지 확인하고, 실패해도 바텀시트는 노출합니다.
      let withdrawResponse: GetMongWithdrawResponse = null;
      let withdrawError: unknown = null;

      for (const query of withdrawQueryCandidates) {
        try {
          const response = await apiClient.get<GetMongWithdrawResponse>('mong-moneys/withdraw', {
            searchParams: query,
          });
          withdrawResponse = response.data;
          break;
        } catch (error) {
          withdrawError = error;
        }
      }

      // API 호출 실패 시에도 바텀시트를 표시하도록 진행
      if (!withdrawResponse && withdrawError) {
        console.error('몽 차감 조회 API 호출 실패:', withdrawError);
      }

      const hairConsultingPresets =
        presetsData?.dataList?.filter((p) => p.type === 'HAIR_CONSULTING') ?? [];
      const preset = hairConsultingPresets.find(
        (p) =>
          p.subType === MEEMONG_PASS_CREATE_TYPES.VIEW_MY_HAIR_CONSULTATIONS_ANSWERS_MODEL ||
          p.title === '내가 쓴 게시물 헤어컨설팅 답변 보기',
      );
      const price = withdrawResponse?.price ?? preset?.price ?? 0;
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
                    퍼스널 컨설팅 답변을 확인할까요?
                  </span>
                  <span className="typo-body-1-long-regular text-label-sub">
                    내 잔여 몽:{' '}
                    <span className="typo-body-1-semibold text-negative-light">
                      {currentMongAmount}몽
                    </span>
                  </span>
                </span>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter
              buttons={[
                <DrawerClose asChild key="meemong-pass">
                  <Button
                    theme="white"
                    size="lg"
                    className="rounded-4"
                    onClick={() => {
                      if (canSkipMong(createType)) {
                        push(targetRoute, responseNavigationParams);
                        return;
                      }

                      goStorePage();
                    }}
                  >
                    미몽패스 이용하기
                  </Button>
                </DrawerClose>,
                <DrawerClose asChild key="confirm">
                  <Button
                    size="lg"
                    className="rounded-4"
                    onClick={async () => {
                      if (withdrawResponse?.isPaid === true) {
                        push(targetRoute, responseNavigationParams);
                        return;
                      }

                      try {
                        await createMongWithdraw({
                          createType: 'VIEW_MY_HAIR_CONSULTATIONS_ANSWERS_MODEL',
                          refId: answerId,
                          refType: 'HairConsultationsAnswers',
                        });
                        push(targetRoute, responseNavigationParams);
                      } catch (error) {
                        const apiError = getApiError(error);
                        if (
                          apiError.code === 'NOT_ENOUGH_MONG_MONEY' ||
                          apiError.httpCode === 409
                        ) {
                          showMongInsufficientSheet();
                          return;
                        }

                        console.error('몽 차감 실패:', error);
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
      push,
      presetsData,
      mongCurrentData,
      canSkipMong,
      createMongWithdraw,
      showMongInsufficientSheet,
    ],
  );

  return showMongConsumeSheet;
}
