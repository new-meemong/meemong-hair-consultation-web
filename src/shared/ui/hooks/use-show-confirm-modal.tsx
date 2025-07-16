import { useOverlayContext } from '@/shared/context/overlay-context';
import Modal from '../modal';
import { useCallback } from 'react';

const MODAL_ID = 'confirm-modal';

export default function useShowConfirmModal() {
  const { showModal } = useOverlayContext();

  const showConfirmModal = useCallback(
    ({ text, onConfirm }: { text: string; onConfirm: () => void }) => {
      showModal({
        id: MODAL_ID,
        children: (
          <Modal
            id={MODAL_ID}
            text={text}
            positiveButton={{
              label: '확인',
              onClick: onConfirm,
            }}
          />
        ),
      });
    },
    [showModal],
  );

  return showConfirmModal;
}
