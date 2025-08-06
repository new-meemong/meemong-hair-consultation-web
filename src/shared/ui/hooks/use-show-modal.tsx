import { useCallback } from 'react';

import { useOverlayContext } from '@/shared/context/overlay-context';

import Modal, { type ModalButtonProps } from '../modal';

type UseShowModalProps = {
  id: string;
  text: string;
  buttons: ModalButtonProps[];
};

export default function useShowModal() {
  const { showModal: showOverlayModal } = useOverlayContext();

  const showModal = useCallback(
    ({ id, text, buttons }: UseShowModalProps) => {
      showOverlayModal({
        id,
        children: <Modal id={id} text={text} buttons={buttons} />,
      });
    },
    [showOverlayModal],
  );

  return showModal;
}
