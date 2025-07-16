import { useOverlayContext } from '@/shared/context/overlay-context';
import Modal from '@/shared/ui/modal';
import { useCallback } from 'react';

const MODAL_ID = 'edit-post-confirm-modal';

export default function useShowEditPostConfirmModal() {
  const { showModal } = useOverlayContext();

  const showEditPostConfirmModal = useCallback(
    ({ onEdit }: { onEdit: () => void }) => {
      showModal({
        id: MODAL_ID,
        children: (
          <Modal
            id={MODAL_ID}
            text="해당 게시글을 수정하시겠습니까?"
            positiveButton={{
              label: '수정하기',
              onClick: onEdit,
            }}
            negativeButton={{
              label: '취소',
            }}
          />
        ),
      });
    },
    [showModal],
  );

  return showEditPostConfirmModal;
}
