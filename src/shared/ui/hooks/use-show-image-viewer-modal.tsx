import { useCallback } from 'react';

import { useOverlayContext } from '@/shared/context/overlay-context';

import { DialogContent } from '../dialog';
import ImageViewerModalContent, {
  type ImageViewerModalContentProps,
} from '../image-viewer-modal-content';

const MODAL_ID = 'image-viewer-modal';

function useShowImageViewerModal() {
  const { showModal } = useOverlayContext();

  const showImageViewerModal = useCallback(
    ({ images, initialIndex, iconType = 'close' }: Omit<ImageViewerModalContentProps, 'id'>) => {
      showModal({
        id: MODAL_ID,
        children: (
          <DialogContent
            className="p-0 max-w-full h-full sm:h-auto bg-black"
            showCloseButton={false}
          >
            <ImageViewerModalContent
              id={MODAL_ID}
              images={images}
              initialIndex={initialIndex}
              iconType={iconType}
            />
          </DialogContent>
        ),
      });
    },
    [showModal],
  );

  return showImageViewerModal;
}

export default useShowImageViewerModal;
