import { useOverlayContext } from '@/shared/context/overlay-context';
import { Button } from '@/shared/ui/button';
import Dot from '@/shared/ui/dot';
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';
import Image from 'next/image';
import { useCallback } from 'react';

const guideContents = [
  <div key="1">
    <span className="typo-body-2-long-semibold">원하는 스타일</span>의 사진
  </div>,
  <div key="2">
    긴 이마, 광대 등 스스로 생각하는
    <span className="typo-body-2-long-semibold">외모 컴플렉스</span>
  </div>,
  <div key="3">
    머리 기장이 보이는 <span className="typo-body-2-long-semibold">정면, 묶은 정면, 측면</span> 사진
  </div>,
  <div key="4">
    <span className="typo-body-2-long-semibold">염색</span> 고민은 야외 자연광에서 찍은 사진
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
            <p className="typo-body-1-semibold text-label-strong">아래 내용을 준비하면 좋아요</p>
            <div className="pt-1 flex flex-col gap-1">
              {guideContents.map((content, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 typo-body-2-regular text-label-info"
                >
                  <Dot size="size-[5px]" />
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
