'use client';

import React from 'react';
import Image from 'next/image';
import { XIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { cn } from '@/shared/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function ImageViewer({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
  className,
}: ImageViewerProps) {
  // 이미지 배열이 비어있으면 렌더링하지 않음
  if (!images.length) return null;

  const totalImages = images.length;
  const currentImage = images[initialIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle hidden />
      <DialogContent
        className={cn('p-0 bg-black max-w-full h-full sm:h-auto', className)}
        showCloseButton={false}
      >
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          {/* 헤더 */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10 ">
            <div className="w-7 h-7" />
            <span className="flex-1 text-center text-white typo-title-3-semibold">
              {initialIndex + 1}/{totalImages}
            </span>
            <button onClick={() => onOpenChange(false)}>
              <XIcon className="w-7 h-7 text-label-info" />
            </button>
          </div>

          {/* 이미지 */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={currentImage}
                alt={`이미지 ${initialIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
