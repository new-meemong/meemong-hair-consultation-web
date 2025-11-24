import type { ReactNode } from 'react';

import { DialogContent } from './dialog';
import { useOverlayContext } from '../context/overlay-context';
import { cn } from '../lib/utils';


export type ModalButtonProps = {
  label: string;
  textColor?: 'text-label-default' | 'text-negative' | 'text-positive';
  onClick?: () => void;
};

type ModalProps = {
  id: string;
  text: string | ReactNode;
  buttons: ModalButtonProps[];
};

function Separator() {
  return <div className="h-px bg-border-default" />;
}

function ModalButton({
  label,
  textColor = 'text-label-default',
  onClick,
  onClose,
}: ModalButtonProps & { onClose: () => void }) {
  const handleClick = () => {
    onClick?.();
    onClose();
  };

  return (
    <button
      className={cn('w-full px-7 py-5 text-center typo-headline-medium', textColor)}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

export default function Modal({ id, text, buttons }: ModalProps) {
  const { closeModal } = useOverlayContext();

  const handleClose = () => {
    closeModal(id);
  };

  console.log(typeof text === 'string');

  return (
    <DialogContent showCloseButton={false}>
      <div className="bg-white rounded-12">
        <div className="pt-8 pb-7 px-7 text-center">
          {typeof text === 'string' ? (
            <div className="typo-body-1-long-regular whitespace-pre-line">{text}</div>
          ) : (
            text
          )}
        </div>
        {buttons.map((button, index) => (
          <div key={index}>
            <Separator />
            <ModalButton {...button} onClose={handleClose} />
          </div>
        ))}
      </div>
    </DialogContent>
  );
}
