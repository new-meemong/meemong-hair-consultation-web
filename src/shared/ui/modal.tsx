'use client';

import { cn } from '@/shared/lib/utils';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import React from 'react';

export type ModalProps = {
  id: string;
  title?: string;
  open: boolean;
  children: React.ReactNode;
  className?: string;
  backgroundColor: 'bg-black';
  onClose?: () => void;
};

export function Modal({
  title,
  open = true,
  children,
  className,
  backgroundColor,
  onClose,
}: ModalProps) {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogTitle hidden={!title}>{title}</DialogTitle>
      <DialogContent
        className={cn('p-0 max-w-full h-full sm:h-auto', backgroundColor, className)}
        showCloseButton={false}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
