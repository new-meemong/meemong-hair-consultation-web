import { useOverlayContext } from '@/shared/context/OverlayContext';

function useShowImageUploadLimitSheet() {
  const { showBottomSheet } = useOverlayContext();

  const showImageUploadLimitSheet = () => {
    showBottomSheet({
      id: 'image-upload-limit-sheet',
      title: '이미지는 최대 10장 업로드 가능합니다',
      description: '이미지는 최대 10개 업로드 가능합니다.\n기존 이미지를 삭제해주세요',
    });
  };

  return showImageUploadLimitSheet;
}

export default useShowImageUploadLimitSheet;
