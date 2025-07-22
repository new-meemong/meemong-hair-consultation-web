import { useOverlayContext } from '../context/overlay-context';
import { cn } from '../lib/utils';
import { DialogContent } from './dialog';

export type ModalButtonProps = {
  label: string;
  textColor?: 'text-label-default' | 'text-negative';
  onClick?: () => void;
};

type ModalProps = {
  id: string;
  text: string;
  positiveButton: ModalButtonProps;
  negativeButton?: ModalButtonProps;
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

export default function Modal({ id, text, positiveButton, negativeButton }: ModalProps) {
  const { closeModal } = useOverlayContext();

  const handleClose = () => {
    closeModal(id);
  };

  return (
    <DialogContent showCloseButton={false}>
      <div className="bg-white rounded-12">
        <div className="pt-8 pb-7 px-7 typo-body-1-long-regular text-center whitespace-pre-line">
          {text}
        </div>
        <Separator />
        <ModalButton {...positiveButton} onClose={handleClose} />
        {negativeButton && (
          <>
            <Separator />
            <ModalButton {...negativeButton} onClose={handleClose} />
          </>
        )}
      </div>
    </DialogContent>
  );
}
