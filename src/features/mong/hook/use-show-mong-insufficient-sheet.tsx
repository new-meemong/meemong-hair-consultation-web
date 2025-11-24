
import { useCallback } from 'react';

import { Button } from '@/shared';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { goStorePage } from '@/shared/lib/go-store-page';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';

export default function useShowMongInsufficientSheet() {
  const { showBottomSheet } = useOverlayContext();

  const showMongInsufficientSheet = useCallback(() => {
    showBottomSheet({
      id: 'mong-insufficient-sheet',
      hideHandle: true,
      children: (
        <>
          <DrawerHeader>
            <DrawerTitle showCloseButton></DrawerTitle>
            <DrawerDescription>
              <span className="typo-title-2-semibold text-label-strong">
                몽이 부족합니다! 몽을 충전해주세요
              </span>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter
            buttons={[
              <DrawerClose asChild key="store">
                <Button size="lg" className="rounded-4" onClick={goStorePage}>
                  몽 스토어 가기
                </Button>
              </DrawerClose>,
            ]}
          />
        </>
      ),
    });
  }, [showBottomSheet]);

  return showMongInsufficientSheet;
}
