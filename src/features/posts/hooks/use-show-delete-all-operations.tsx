import WarnIcon from '@/assets/icons/warn.svg';

import { useOverlayContext } from '@/shared/context/overlay-context';
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';

import { Button } from '@/shared';

export default function useShowDeleteAllOperations() {
  const { showBottomSheet } = useOverlayContext();

  const showDeleteAllOperations = ({ onConfirm }: { onConfirm: () => void }) => {
    showBottomSheet({
      id: 'delete-all-operations',
      className: 'gap-2',
      children: (
        <>
          <DrawerHeader>
            <DrawerTitle>
              <div className="flex gap-2">
                <WarnIcon />
                <p className="typo-title-2-semibold">받은 시술이 없으신가요?</p>
              </div>
            </DrawerTitle>
          </DrawerHeader>
          <div className="typo-body-2-long-regular text-label-default pb-5">
            현재까지 작성한 시술 내역이 지워집니다!
            <br />
            삭제를 진행할까요?
          </div>
          <DrawerFooter
            buttons={[
              <DrawerClose asChild key="close">
                <Button size="lg">취소</Button>
              </DrawerClose>,
              <DrawerClose asChild key="delete">
                <Button size="lg" className="bg-negative-light" onClick={onConfirm}>
                  삭제하기
                </Button>
              </DrawerClose>,
            ]}
          ></DrawerFooter>
        </>
      ),
    });
  };

  return showDeleteAllOperations;
}
