import { Button, ROUTES } from '@/shared';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';

import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { goStorePage } from '@/shared/lib/go-store-page';
import { useCallback } from 'react';
import useGetGrowthPassStatus from '@/features/growth-pass/api/use-get-growth-pass-status';
import useGetMongConsumePresets from '@/features/mong/api/use-get-mong-consume-presets';
import useGetMongCurrent from '@/features/mong/api/use-get-mong-current';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

type ShowCommentMongConsumeSheetParams = {
  postId: string;
  postListTab?: string;
  onSubmit: () => void;
};

export default function useShowCommentMongConsumeSheet() {
  const { showBottomSheet } = useOverlayContext();
  const { data: presetsData } = useGetMongConsumePresets();
  const { data: mongCurrentData } = useGetMongCurrent();
  const { data: growthPassStatusData } = useGetGrowthPassStatus();
  const { push } = useRouterWithUser();

  const showCommentMongConsumeSheet = useCallback(
    ({ postId, postListTab, onSubmit }: ShowCommentMongConsumeSheetParams) => {
      const isGrowthPassActive = growthPassStatusData?.data?.isActive === true;

      if (isGrowthPassActive) {
        onSubmit();
        return;
      }

      const hairConsultingPresets =
        presetsData?.dataList?.filter((p) => p.type === 'HAIR_CONSULTING') ?? [];
      const commentPreset = hairConsultingPresets.find(
        (p) => p.subType === 'HAIR_CONSULTATIONS_COMMENTS_DESIGNER',
      );
      const price = commentPreset?.price ?? 0;
      const currentMongAmount = mongCurrentData?.data?.currentTotalAmount ?? 0;

      const consultingCreateRoute = ROUTES.POSTS_CREATE_CONSULTING_POST(postId);

      showBottomSheet({
        id: 'comment-mong-consume-sheet',
        hideHandle: true,
        children: (
          <>
            <DrawerHeader>
              <DrawerTitle showCloseButton></DrawerTitle>
              <DrawerDescription>
                <span className="flex flex-col gap-2">
                  <span className="typo-title-2-semibold text-label-strong">
                    일반 댓글을 작성하시겠어요?
                  </span>
                  <span className="typo-body-1-long-regular text-label-sub">
                    컨설팅 답변을 작성하면{' '}
                    <span className="typo-body-1-semibold text-negative-light">최대 10몽</span>을
                    받을 수 있어요
                  </span>
                  <span className="typo-body-1-long-regular text-label-sub flex items-center justify-between">
                    <span>
                      내 잔여 몽:{' '}
                      <span className="typo-body-1-semibold text-negative-light">
                        {currentMongAmount}몽
                      </span>
                    </span>
                    <DrawerClose asChild>
                      <button
                        className="typo-body-2-medium text-label-info underline"
                        onClick={goStorePage}
                      >
                        무료 몽 받기
                      </button>
                    </DrawerClose>
                  </span>
                </span>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter
              buttons={[
                <DrawerClose asChild key="consulting">
                  <Button
                    theme="white"
                    size="lg"
                    className="rounded-4"
                    onClick={() => {
                      push(consultingCreateRoute, {
                        ...(postListTab ? { [SEARCH_PARAMS.POST_LIST_TAB]: postListTab } : {}),
                      });
                    }}
                  >
                    컨설팅 답변 쓰기
                  </Button>
                </DrawerClose>,
                <DrawerClose asChild key="submit">
                  <Button size="lg" className="rounded-4" onClick={onSubmit}>
                    작성하기
                    {price > 0 && <> ({price}몽 차감)</>}
                  </Button>
                </DrawerClose>,
              ]}
            />
          </>
        ),
      });
    },
    [showBottomSheet, push, presetsData, mongCurrentData, growthPassStatusData],
  );

  return showCommentMongConsumeSheet;
}
