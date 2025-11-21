import { Button, ROUTES } from '@/shared';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';

import type { GetMongWithdrawResponse } from '@/entities/mong/api/get-mong-withdraw-response';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { apiClient } from '@/shared/api/client';
import { useCallback } from 'react';
import useGetMongConsumePresets from '@/features/mong/api/use-get-mong-consume-presets';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

type ShowMongConsumeSheetParams = {
  designerName: string;
  answerId: number;
  postId: string;
  postListTab: string;
};

export default function useShowMongConsumeSheet() {
  const { showBottomSheet } = useOverlayContext();
  const { data: presetsData } = useGetMongConsumePresets();
  const { push } = useRouterWithUser();

  const showMongConsumeSheet = useCallback(
    async ({ designerName, answerId, postId, postListTab }: ShowMongConsumeSheetParams) => {
      // 먼저 몽 차감 유무 조회 API 호출
      try {
        const withdrawResponse = await apiClient.get<GetMongWithdrawResponse>(
          'mong-moneys/withdraw',
          {
            searchParams: {
              createType: 'VIEW_MY_HAIR_CONSULTING_ANSWER_MODEL',
              refType: 'hairConsultPostingsAnswers',
              refId: answerId.toString(),
            },
          },
        );

        // 이미 결제한 적이 있으면 바텀시트를 열지 않고 바로 답변 페이지로 이동
        if (withdrawResponse?.data) {
          return { alreadyPaid: true };
        }
      } catch (error) {
        // API 호출 실패 시에도 바텀시트를 표시하도록 진행
        console.error('몽 차감 조회 API 호출 실패:', error);
      }

      // 결제한 적이 없으면 바텀시트 표시
      // 모든 프리셋을 가져온 후 클라이언트에서 HAIR_CONSULTING 관련 프리셋만 필터링
      const hairConsultingPresets =
        presetsData?.dataList?.filter((p) => p.type === 'HAIR_CONSULTING') ?? [];
      // subType이 VIEW_MY_HAIR_CONSULTING_ANSWER_MODEL이거나 title로 찾기
      const preset = hairConsultingPresets.find(
        (p) =>
          p.subType === 'VIEW_MY_HAIR_CONSULTING_ANSWER_MODEL' ||
          p.title === '내가 쓴 게시물 헤어컨설팅 답변 보기',
      );
      const price = preset?.price ?? 0;

      showBottomSheet({
        id: 'mong-consume-sheet',
        hideHandle: true,
        children: (
          <>
            <DrawerHeader>
              <DrawerTitle showCloseButton></DrawerTitle>
              <DrawerDescription>
                <span className="typo-title-2-semibold text-label-strong">
                  {designerName}님의
                  <br />
                  맞춤 컨설팅 답변을 조회할게요
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
                      push(ROUTES.POSTS_CONSULTING_RESPONSE(postId, answerId.toString()), {
                        [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
                      });
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
    [showBottomSheet, push, presetsData],
  );

  return showMongConsumeSheet;
}
