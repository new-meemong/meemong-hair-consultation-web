'use client';

import { cn } from '@/shared/lib/utils';
import { Drawer, DrawerContent, DrawerTrigger } from '@/shared/ui/drawer';
import React from 'react';

export interface BottomSheetProps {
  id: string;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  onClose?: () => void;
  open: boolean;
}

export function BottomSheet({ trigger, children, className, onClose, open }: BottomSheetProps) {
  return (
    <Drawer
      direction="bottom"
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose?.();
        }
      }}
    >
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent
        className={cn('w-full bg-white border-none rounded-t-12 px-6 pb-5', className)}
      >
        <div className="flex flex-col gap-6 pt-6 mx-auto w-full max-w-screen-sm bg-white">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
