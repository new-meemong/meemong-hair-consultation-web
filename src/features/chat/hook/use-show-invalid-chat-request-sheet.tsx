import React from 'react';

import { Button } from '@/shared';
import { useOverlayContext } from '@/shared/context/overlay-context';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';


export const useShowInvalidChatRequestSheet = () => {
  const { showBottomSheet } = useOverlayContext();

  const showInvalidChatRequestSheet = () => {
    showBottomSheet({
      id: 'invalid-chat-request-sheet',
      children: (
        <>
          <DrawerHeader>
            <DrawerTitle>채팅은 모델만 요청할 수 있어요</DrawerTitle>
            <DrawerDescription>
              상담하기에서 채팅은 모델만 시작할 수 있습니다.
              <br />
              진정성 있는 댓글로 모델의 채팅을 받아보세요!
            </DrawerDescription>
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
