import { useOverlayContext } from '@/shared/context/overlay-context';
import { useCallback } from 'react';
import ImageViewerModalContent from '../image-viewer-modal-content';

const MODAL_ID = 'image-viewer-modal';

function useShowImageViewerModal() {
  const { showModal } = useOverlayContext();

  const showImageViewerModal = useCallback(
    (images: string[], initialIndex: number) => {
      showModal({
        id: MODAL_ID,
        backgroundColor: 'bg-black',
        children: (
          <ImageViewerModalContent id={MODAL_ID} images={images} initialIndex={initialIndex} />
        ),
      });
    },
    [showModal],
  );

  return showImageViewerModal;
}

export default useShowImageViewerModal;
