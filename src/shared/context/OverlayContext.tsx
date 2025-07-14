'use client';

import { createContext, useContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { BottomSheet, type BottomSheetProps } from '@/shared/ui/bottom-sheet';

type OverlayContextType = {
  showBottomSheet: (props: BottomSheetProps) => string;
  hideBottomSheet: (id: string) => void;
};

const OverlayContext = createContext<OverlayContextType | null>(null);

const BOTTOM_SHEET_ANIMATION_DURATION = 500;

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [bottomSheets, setBottomSheets] = useState<BottomSheetProps[]>([]);

  const showBottomSheet = useCallback((props: BottomSheetProps) => {
    const id = props.id || crypto.randomUUID();
    setBottomSheets((prev) => [...prev, { ...props, id, open: true }]);
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

  return (
    <OverlayContext.Provider
      value={{
        showBottomSheet,
        hideBottomSheet,
      }}
    >
      {children}

      {bottomSheets.map((bottomSheet) => (
        <BottomSheet
          key={bottomSheet.id}
          {...bottomSheet}
          open={bottomSheet.open}
          duration={BOTTOM_SHEET_ANIMATION_DURATION}
          onClose={() => hideBottomSheet(bottomSheet.id)}
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
