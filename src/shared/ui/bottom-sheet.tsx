'use client';

import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

export interface BottomSheetProps {
  id: string;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  footerContent?: React.ReactNode;
  showCloseButton?: boolean;
  closeButtonText?: string;
  closeButtonClassName?: string;
  onClose?: () => void;
  open: boolean;
  duration?: number | { open: number; close: number };
}

export function BottomSheet({
  trigger,
  title,
  description,
  children,
  className,
  footerContent,
  showCloseButton = true,
  closeButtonText = '완료',
  closeButtonClassName,
  onClose,
  open,
  duration,
}: BottomSheetProps) {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Drawer
      direction="bottom"
      open={open}
      duration={duration}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent
        className={cn('w-full bg-white border-none rounded-t-12 px-6 pb-5', className)}
      >
        <div className="flex flex-col gap-6 pt-6 mx-auto w-full max-w-screen-sm bg-white">
          {(title || description) && (
            <DrawerHeader>
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && (
                <DrawerDescription className="whitespace-pre-wrap">{description}</DrawerDescription>
              )}
            </DrawerHeader>
          )}

          {children && children}

          {(showCloseButton || footerContent) && (
            <DrawerFooter>
              {footerContent}
              {showCloseButton && (
                <DrawerClose asChild onClick={handleClose}>
                  <Button className={closeButtonClassName}>{closeButtonText}</Button>
                </DrawerClose>
              )}
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
