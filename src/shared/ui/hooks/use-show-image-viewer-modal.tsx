import { useOverlayContext } from '@/shared/context/overlay-context';
import { useCallback } from 'react';
import { DialogContent } from '../dialog';
import ImageViewerModalContent from '../image-viewer-modal-content';

const MODAL_ID = 'image-viewer-modal';

function useShowImageViewerModal() {
  const { showModal } = useOverlayContext();

  const showImageViewerModal = useCallback(
    ({ imageUrl, title }: { imageUrl: string; title: string }) => {
      showModal({
        id: MODAL_ID,
        children: (
          <DialogContent
            className="p-0 max-w-full h-full sm:h-auto bg-black"
            showCloseButton={false}
          >
            <ImageViewerModalContent id={MODAL_ID} imageUrl={imageUrl} title={title} />
          </DialogContent>
        ),
      });
    },
    [showModal],
  );

  return showImageViewerModal;
}

export default useShowImageViewerModal;
