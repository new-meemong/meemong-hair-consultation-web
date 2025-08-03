import { Button } from '@/shared';
import { useOverlayContext } from '@/shared/context/overlay-context';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';

function useShowImageUploadLimitSheet() {
  const { showBottomSheet } = useOverlayContext();

  const showImageUploadLimitSheet = () => {
    showBottomSheet({
      id: 'image-upload-limit-sheet',
      children: (
        <>
          <DrawerHeader>
            <DrawerTitle>이미지는 최대 10장 업로드 가능합니다</DrawerTitle>
            <DrawerDescription>
              이미지는 최대 10개 업로드 가능합니다.
              <br />
              기존 이미지를 삭제해주세요
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter
            buttons={[
              <DrawerClose asChild key="close">
                <Button size="lg">완료</Button>
              </DrawerClose>,
            ]}
          ></DrawerFooter>
        </>
      ),
    });
  };

  return showImageUploadLimitSheet;
}

export default useShowImageUploadLimitSheet;
