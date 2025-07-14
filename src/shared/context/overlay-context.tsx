'use client';

import { createContext, useContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { BottomSheet, type BottomSheetProps } from '@/shared/ui/bottom-sheet';
import { SNACK_BAR_ANIMATION_DURATION, SnackBar, type SnackBarProps } from '../ui/snack-bar';

type SnackBarWithId = Omit<SnackBarProps, 'onClose'> & {
  id: string;
  open: boolean;
};

type OverlayContextType = {
  showBottomSheet: (props: BottomSheetProps) => string;
  hideBottomSheet: (id: string) => void;
  showSnackBar: (props: Omit<SnackBarProps, 'id' | 'onClose'>) => void;
};

const OverlayContext = createContext<OverlayContextType | null>(null);

const BOTTOM_SHEET_ANIMATION_DURATION = 500;

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [bottomSheets, setBottomSheets] = useState<BottomSheetProps[]>([]);
  const [snackBars, setSnackBars] = useState<SnackBarWithId[]>([]);

  const showBottomSheet = useCallback((props: BottomSheetProps) => {
    const id = props.id || crypto.randomUUID();

    setBottomSheets((prev) => {
      if (prev.some((sheet) => sheet.id === id)) {
        return prev;
      }
      return [...prev, { ...props, id, open: true }];
    });

    return id;
  }, []);

  const hideBottomSheet = useCallback((id: string) => {
    setBottomSheets((prev) => {
      const sheet = prev.find((s) => s.id === id);
      if (!sheet) return prev;

      return prev.map((s) => (s.id === id ? { ...s, open: false } : s));
    });
    setTimeout(() => {
      setBottomSheets((prev) => prev.filter((s) => s.id !== id));
    }, BOTTOM_SHEET_ANIMATION_DURATION);
  }, []);

  const handleBottomSheetClose = (id: string) => {
    const sheet = bottomSheets.find((s) => s.id === id);
    if (!sheet) return;

    sheet.onClose?.();
    hideBottomSheet(id);
  };

  const showSnackBar = useCallback((props: Omit<SnackBarProps, 'id' | 'onClose'>) => {
    const id = crypto.randomUUID();

    setSnackBars((prev) => {
      if (prev.some((bar) => bar.id === id)) {
        return prev;
      }
      return [...prev, { ...props, id, open: true }];
    });
  }, []);

  const hideSnackBar = useCallback((id: string) => {
    setSnackBars((prev) => {
      const bar = prev.find((b) => b.id === id);
      if (!bar) return prev;

      return prev.map((b) => (b.id === id ? { ...b, open: false } : b));
    });
    setTimeout(() => {
      setSnackBars((prev) => prev.filter((b) => b.id !== id));
    }, SNACK_BAR_ANIMATION_DURATION);
  }, []);

  const handleSnackBarClose = (id: string) => {
    hideSnackBar(id);
  };

  return (
    <OverlayContext.Provider
      value={{
        showBottomSheet,
        hideBottomSheet,
        showSnackBar,
      }}
    >
      {children}

      {bottomSheets.map((bottomSheet) => (
        <BottomSheet
          key={bottomSheet.id}
          {...bottomSheet}
          open={bottomSheet.open}
          duration={BOTTOM_SHEET_ANIMATION_DURATION}
          onClose={() => handleBottomSheetClose(bottomSheet.id)}
        />
      ))}

      {snackBars.map((snackBar) => (
        <SnackBar
          key={snackBar.id}
          {...snackBar}
          onClose={() => handleSnackBarClose(snackBar.id)}
        />
      ))}
    </OverlayContext.Provider>
  );
}

export function useOverlayContext() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
}
