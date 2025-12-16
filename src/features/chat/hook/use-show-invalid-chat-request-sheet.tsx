import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';

import { Button } from '@/shared';
import React from 'react';
import { useOverlayContext } from '@/shared/context/overlay-context';

export const useShowInvalidChatRequestSheet = () => {
  const { showBottomSheet } = useOverlayContext();

  const showInvalidChatRequestSheet = () => {
    showBottomSheet({
      id: 'invalid-chat-request-sheet',
      children: (
        <>
          <DrawerHeader>
            <DrawerTitle>채팅은 모델만 요청할 수 있어요</DrawerTitle>
            <DrawerDescription>진정성있는 컨설팅 답변을 작성해 채팅을 받아보세요</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter
            buttons={[
              <DrawerClose asChild key="close">
                <Button size="lg">확인</Button>
              </DrawerClose>,
            ]}
          ></DrawerFooter>
        </>
      ),
    });
  };

  return showInvalidChatRequestSheet;
};
