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

interface BottomSheetProps {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footerContent?: React.ReactNode;
  showCloseButton?: boolean;
  closeButtonText?: string;
  closeButtonClassName?: string;
  onClose?: () => void;
  defaultOpen?: boolean;
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
  defaultOpen = true,
}: BottomSheetProps) {
  return (
    <Drawer direction="bottom" defaultOpen={defaultOpen} onClose={onClose}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent
        className={cn('w-full bg-white border-none rounded-t-12 px-6 pb-5', className)}
      >
        <div className="flex flex-col gap-6 pt-6 mx-auto w-full max-w-screen-sm bg-white">
          {(title || description) && (
            <DrawerHeader>
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && <DrawerDescription>{description}</DrawerDescription>}
            </DrawerHeader>
          )}

          {children}

          {(showCloseButton || footerContent) && (
            <DrawerFooter>
              {footerContent}
              {showCloseButton && (
                <DrawerClose asChild>
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
