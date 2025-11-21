'use client';

import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Drawer, DrawerContent, DrawerTrigger } from '@/shared/ui/drawer';

export interface BottomSheetProps {
  id: string;
  trigger?: ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClose?: () => void;
  open: boolean;
  hideHandle?: boolean;
}

export function BottomSheet({
  trigger,
  children,
  className,
  onClose,
  open,
  hideHandle = false,
}: BottomSheetProps) {
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
        className={cn('w-full bg-white border-none rounded-t-12 px-6 pb-5')}
        hideHandle={hideHandle}
      >
        <div
          className={cn(
            'flex flex-col gap-6 pt-6 mx-auto w-full max-w-screen-sm bg-white',
            className,
          )}
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
