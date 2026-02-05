'use client';

import ErrorIcon from '@/assets/icons/error.svg';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

export const SNACK_BAR_ANIMATION_DURATION = 2000;

export interface SnackBarProps {
  id: string;
  type: 'success' | 'error';
  message: string;
  open?: boolean;
  onClose?: () => void;
}

const getBackgroundColor = (type: SnackBarProps['type']) => {
  switch (type) {
    case 'success':
      return 'bg-positive';
    case 'error':
      return 'bg-negative-light';
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

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed bottom-25 left-0 right-0 flex justify-center px-5 z-50">
      <div
        className={cn(
          'flex gap-2 items-center justify-center rounded-10 text-white shadow-strong typo-body-2-regular px-4 py-3',
          'transition-all duration-500',
          getBackgroundColor(type),
          open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
        role="alert"
      >
        {type === 'error' && <ErrorIcon className="w-5 h-5 text-white fill-white" />}
        {message}
      </div>
    </div>,
    document.body,
  );
}
