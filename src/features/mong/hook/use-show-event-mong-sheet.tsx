import type { CreateEventMongResponse } from '@/entities/mong/api/create-event-mong-response';
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

export default function useShowEventMongSheet() {
  const { showBottomSheet } = useOverlayContext();

  const showEventMongSheet = (data: CreateEventMongResponse) => {
    if (data === null) return;

    showBottomSheet({
      id: 'event-mong-sheet',
      children: (
        <>
          <DrawerHeader>
            <DrawerTitle showCloseButton></DrawerTitle>
            <DrawerDescription>
              <span className="flex flex-col gap-2">
                <span className="typo-title-2-bold text-label-strong">
                  헤어컨설팅 리워드 <span className="typo-title-2-semibold">{data.amount}몽</span>
                  이
                  <br />
                  지급되었습니다!
                </span>
                <span className="typo-body-1-long-regular text-label-sub">
                  현재 내 몽:{' '}
                  <span className="typo-body-1-semibold text-negative-light">
                    {data.depositSum} 개
                  </span>
                </span>
              </span>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter
            buttons={[
              <DrawerClose asChild key="store">
                <Button theme="white" size="lg" className="rounded-4" onClick={goStorePage}>
                  스토어 가기
                </Button>
              </DrawerClose>,
              <DrawerClose asChild key="close">
                <Button size="lg" className="rounded-4">
                  닫기
                </Button>
              </DrawerClose>,
            ]}
          ></DrawerFooter>
        </>
      ),
    });
  };

  return showEventMongSheet;
}
