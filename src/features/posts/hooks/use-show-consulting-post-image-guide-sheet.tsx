import { useCallback } from 'react';

import Image from 'next/image';

import { useOverlayContext } from '@/shared/context/overlay-context';
import { Button } from '@/shared/ui/button';
import Dot from '@/shared/ui/dot';
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';

const guideContents = [
  <div key="1">
    <span className="typo-body-2-long-semibold">귀</span>가 보이는 사진 (얼굴형을 파악할 수 있어요)
  </div>,
  <div key="2">
    <span className="typo-body-2-long-semibold">머리 기장</span>이 보이는 사진
  </div>,
  <div key="3">
    <span className="typo-body-2-long-semibold">염색</span> 고민은 야외 자연광에서 찍은 사진
  </div>,
  <div key="4">
    머리가 짧은
    <span className="typo-body-2-long-semibold"> 남성</span>은 귀가 보이는 정면/측면으로 충분해요
  </div>,
];

export default function useShowConsultingPostImageGuideSheet() {
  const { showBottomSheet } = useOverlayContext();

  const showConsultingPostImageGuideSheet = useCallback(() => {
    showBottomSheet({
      id: 'consulting-post-image-guide-sheet',
      children: (
        <>
          <DrawerHeader className="gap-2">
            <DrawerTitle>인생머리 찾는 컨설팅 Tip!</DrawerTitle>
            <p className="typo-body-1-semibold text-label-strong">아래 사진이 포함되면 좋아요</p>
            <div className="pt-1 flex flex-col gap-1">
              {guideContents.map((content, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 typo-body-2-regular text-label-info"
                >
                  <Dot size="md" />
                  {content}
                </div>
              ))}
            </div>
          </DrawerHeader>
          <Image
            src="/consulting-post-image-guide.svg"
            alt="컨설팅 포스트 이미지 가이드"
            width={329}
            height={313}
            className="object-cover mx-auto"
          />
          <DrawerFooter
            buttons={[
              <DrawerClose asChild key="close">
                <Button size="lg">확인</Button>
              </DrawerClose>,
            ]}
          />
        </>
      ),
    });
  }, [showBottomSheet]);

  return showConsultingPostImageGuideSheet;
}
