import { Button } from '@/shared';
import { useOverlayContext } from '@/shared/context/overlay-context';
import type { UseGuidePopupProps } from '@/shared/hooks/use-guide-popup';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';
import Image from 'next/image';
import { useCallback } from 'react';

function useShowCreatePostGuideSheet() {
  const { showBottomSheet } = useOverlayContext();

  const showCreatePostGuideSheet = useCallback(
    ({ onClose }: UseGuidePopupProps) => {
      showBottomSheet({
        id: 'create-post-guide-sheet',
        onClose,
        children: (
          <>
            <DrawerHeader>
              <DrawerTitle>사진은 안전하게 보호돼요</DrawerTitle>
              <DrawerDescription>버튼을 눌러 디자이너에게만 공개할 수 있어요</DrawerDescription>
            </DrawerHeader>
            <Image
              className="h-43 w-82 object-cover"
              src="/sample.png"
              alt="온보딩 이미지"
              width={384}
              height={192}
            />
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>완료</Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ),
      });
    },
    [showBottomSheet],
  );

  return showCreatePostGuideSheet;
}

export default useShowCreatePostGuideSheet;
