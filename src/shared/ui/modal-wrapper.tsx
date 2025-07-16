'use client';

import { Dialog, DialogTitle } from '@/shared/ui/dialog';
import React from 'react';

export type ModalWrapperProps = {
  id: string;
  title?: string;
  open: boolean;
  children: React.ReactNode;
};

export function ModalWrapper({ title, open = true, children }: ModalWrapperProps) {
  return (
    <Dialog open={open}>
      <DialogTitle hidden={!title}>{title}</DialogTitle>
      {children}
    </Dialog>
  );
}
