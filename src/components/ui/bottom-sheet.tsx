"use client";

import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
}

export function BottomSheet({
  trigger,
  title,
  description,
  children,
  className,
  footerContent,
  showCloseButton = true,
  closeButtonText = "완료",
  closeButtonClassName,
}: BottomSheetProps) {
  return (
    <Drawer direction="bottom">
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent
        className={cn("w-full bg-white border-none rounded-12", className)}
      >
        <div className="mx-auto w-full max-w-screen-sm bg-white">
          {(title || description) && (
            <DrawerHeader>
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>
          )}

          <div className="p-4 pb-0">{children}</div>

          {(showCloseButton || footerContent) && (
            <DrawerFooter>
              {footerContent}
              {showCloseButton && (
                <DrawerClose asChild>
                  <Button className={closeButtonClassName}>
                    {closeButtonText}
                  </Button>
                </DrawerClose>
              )}
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
