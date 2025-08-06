'use client';

import { useEffect } from 'react';

import { createPortal } from 'react-dom';

import CheckIcon from '@/assets/icons/check.svg';
import { cn } from '@/lib/utils';

export const SNACK_BAR_ANIMATION_DURATION = 2000;

export interface SnackBarProps {
  id: string;
  type: 'success';
  message: string;
  open?: boolean;
  onClose?: () => void;
}

const getIcon = (type: SnackBarProps['type']) => {
  switch (type) {
    case 'success':
      return CheckIcon;
  }
};

export function SnackBar({ message, onClose, type, open = true }: SnackBarProps) {
  useEffect(() => {
    if (!onClose) return;

    const timer = setTimeout(() => {
      onClose();
    }, SNACK_BAR_ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = getIcon(type);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed bottom-10 left-0 right-0 flex justify-center px-5 z-50">
      <div
        className={cn(
          'flex gap-2 items-center justify-center bg-positive h-11 w-full rounded-10 text-white shadow-strong typo-body-2-regular',
          'transition-all duration-500',
          open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
        role="alert"
      >
        <Icon className="w-5 h-5 text-white" />
        {message}
      </div>
    </div>,
    document.body,
  );
}
