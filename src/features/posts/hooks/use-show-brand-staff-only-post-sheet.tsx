import { useCallback } from 'react';

import { Button } from '@/shared';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { goMyPage } from '@/shared/lib/go-my-page';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';

export default function useShowBrandStaffOnlyPostSheet() {
  const { showBottomSheet } = useOverlayContext();

  const showBrandStaffOnlyPostSheet = useCallback(
    (brandName: string) => {
      showBottomSheet({
        id: 'brand-staff-only-post-sheet',
        hideHandle: true,
        children: (
          <>
            <DrawerHeader className="gap-2">
              <DrawerTitle>{brandName} 전용 게시물입니다</DrawerTitle>
              <DrawerDescription className="whitespace-pre-line">
                마이페이지&gt;브랜드코드 입력을 통해 {brandName} 직원 인증을 진행해주세요
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter
              buttons={[
                <DrawerClose asChild key="my-page">
                  <Button size="lg" theme="white" className="rounded-4" onClick={goMyPage}>
                    마이페이지 이동
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
    [showBottomSheet],
  );

  return showBrandStaffOnlyPostSheet;
}
