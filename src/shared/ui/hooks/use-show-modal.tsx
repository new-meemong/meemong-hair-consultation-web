import { useOverlayContext } from '@/shared/context/overlay-context';
import { useCallback } from 'react';
import Modal, { type ModalButtonProps } from '../modal';

type UseShowModalProps = {
  id: string;
  text: string;
  positiveButton: ModalButtonProps;
  negativeButton?: ModalButtonProps;
};

export default function useShowModal() {
  const { showModal: showOverlayModal } = useOverlayContext();

  const showModal = useCallback(
    ({ id, text, positiveButton, negativeButton }: UseShowModalProps) => {
      showOverlayModal({
        id,
        children: (
          <Modal
            id={id}
            text={text}
            positiveButton={positiveButton}
            negativeButton={negativeButton}
          />
        ),
      });
    },
    [showOverlayModal],
  );

  return showModal;
}
