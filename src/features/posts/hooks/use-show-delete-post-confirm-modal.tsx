import { useOverlayContext } from '@/shared/context/overlay-context';
import Modal from '@/shared/ui/modal';
import { useCallback } from 'react';

const MODAL_ID = 'delete-post-confirm-modal';

export default function useShowDeletePostConfirmModal() {
  const { showModal } = useOverlayContext();

  const showDeletePostConfirmModal = useCallback(
    ({ onDelete }: { onDelete: () => void }) => {
      showModal({
        id: MODAL_ID,
        children: (
          <Modal
            id={MODAL_ID}
            text="해당 게시글을 삭제하시겠습니까?"
            positiveButton={{
              label: '삭제',
              onClick: onDelete,
              textColor: 'text-negative',
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

  return showDeletePostConfirmModal;
}
