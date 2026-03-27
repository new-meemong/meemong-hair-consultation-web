import { Button, ROUTES } from '@/shared';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';
import {
  STORE_RETURN_STATUS_KEYS,
  markPendingStoreReturnStatusCheck,
} from '@/shared/lib/store-return-status';

import type { GetMongWithdrawResponse } from '@/entities/mong/api/get-mong-withdraw-response';
import { MEEMONG_PASS_CREATE_TYPES } from '@/features/ad-block/lib/meemong-pass-policy';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import type { USER_SEX } from '@/entities/user/constants/user-sex';
import type { ValueOf } from '@/shared/type/types';
import { apiClient } from '@/shared/api/client';
import { goStorePage } from '@/shared/lib/go-store-page';
import { useCallback } from 'react';
import useGetMongConsumePresets from '@/features/mong/api/use-get-mong-consume-presets';
import useGetMongCurrent from '@/features/mong/api/use-get-mong-current';
import useMeemongPassPolicy from '@/features/ad-block/hook/use-meemong-pass-policy';
import { useOptionalBrand } from '@/shared/context/brand-context';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

type ShowMongConsumeSheetParams = {
  designerName: string;
  answerId: number;
  postId: string;
  postListTab: string;
  postWriterSex?: ValueOf<typeof USER_SEX>;
};

export default function useShowMongConsumeSheet() {
  const brand = useOptionalBrand();
  const { showBottomSheet } = useOverlayContext();
  const { data: presetsData } = useGetMongConsumePresets();
  const { data: mongCurrentData } = useGetMongCurrent();
  const { canSkipMong } = useMeemongPassPolicy();
  const { push } = useRouterWithUser();

  const showMongConsumeSheet = useCallback(
    async ({
      designerName: _designerName,
      answerId,
      postId,
      postListTab,
      postWriterSex,
    }: ShowMongConsumeSheetParams) => {
      const targetRoute = brand
        ? ROUTES.WEB_CONSULTING_RESPONSE(brand.config.slug, postId, answerId.toString())
        : ROUTES.POSTS_CONSULTING_RESPONSE(postId, answerId.toString());
      const responseNavigationParams = {
        [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
        ...(postWriterSex ? { [SEARCH_PARAMS.POST_WRITER_SEX]: postWriterSex } : {}),
      };

      // 브랜드 웹 컨텍스트에서는 몽 없이 바로 이동
      if (brand) {
        push(targetRoute, responseNavigationParams);
        return { alreadyPaid: false };
      }
      const createType = MEEMONG_PASS_CREATE_TYPES.VIEW_MY_HAIR_CONSULTATIONS_ANSWERS_MODEL;
      // 이미 결제한 답변이면 바텀시트 없이 바로 이동
      let withdrawResponse: GetMongWithdrawResponse = null;
      try {
        const response = await apiClient.get<GetMongWithdrawResponse>('mong-moneys/withdraw', {
          searchParams: {
            createType: 'VIEW_MY_HAIR_CONSULTATIONS_ANSWERS_MODEL',
            refType: 'HairConsultationsAnswers',
            refId: answerId.toString(),
          },
        });
        withdrawResponse = response.data;
        if (withdrawResponse?.isPaid === true) {
          push(targetRoute, responseNavigationParams);
          return { alreadyPaid: true };
        }
      } catch {
        // GET 실패 시 바텀시트를 표시하도록 계속 진행
      }

      // 미몽패스 활성화 상태면 바텀시트 없이 바로 이동
      if (canSkipMong(createType)) {
        push(targetRoute, responseNavigationParams);
        return { alreadyPaid: false };
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

                      markPendingStoreReturnStatusCheck(STORE_RETURN_STATUS_KEYS.MEEMONG_PASS);
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
                    onClick={() => {
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
    [brand, showBottomSheet, push, presetsData, mongCurrentData, canSkipMong],
  );

  return showMongConsumeSheet;
}
