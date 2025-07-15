'use client';

import { createContext, useContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { BottomSheet, type BottomSheetProps } from '@/shared/ui/bottom-sheet';
import { SNACK_BAR_ANIMATION_DURATION, SnackBar, type SnackBarProps } from '../ui/snack-bar';
import { Modal, type ModalProps } from '../ui/modal';

type SnackBarWithId = Omit<SnackBarProps, 'onClose'> & {
  id: string;
  open: boolean;
};

type ShowModalProps = Omit<ModalProps, 'open'>;
type ShowBottomSheetProps = Omit<BottomSheetProps, 'open'>;

type OverlayContextType = {
  showModal: (props: ShowModalProps) => string;
  closeModal: (id: string) => void;
  showBottomSheet: (props: ShowBottomSheetProps) => string;
  closeBottomSheet: (id: string) => void;
  showSnackBar: (props: Omit<SnackBarProps, 'id' | 'onClose'>) => void;
};

const OverlayContext = createContext<OverlayContextType | null>(null);

const BOTTOM_SHEET_ANIMATION_DURATION = 500;
const MODAL_ANIMATION_DURATION = 200;

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalProps[]>([]);
  const [bottomSheets, setBottomSheets] = useState<BottomSheetProps[]>([]);
  const [snackBars, setSnackBars] = useState<SnackBarWithId[]>([]);

  const showModal = useCallback((props: ShowModalProps) => {
    const id = props.id ?? crypto.randomUUID();

    setModals((prev) => {
      if (prev.some((modal) => modal.id === id)) {
        return prev;
      }
      return [...prev, { ...props, id, open: true }];
    });

    return id;
  }, []);

  const hideModal = useCallback((id: string) => {
    setModals((prev) => {
      const modal = prev.find((modal) => modal.id === id);
      if (!modal) return prev;

      return prev.map((modal) => (modal.id === id ? { ...modal, open: false } : modal));
    });
    setTimeout(() => {
      setModals((prev) => prev.filter((modal) => modal.id !== id));
    }, MODAL_ANIMATION_DURATION);
  }, []);

  const closeModal = (id: string) => {
    const modal = modals.find((modal) => modal.id === id);
    if (!modal) return;

    modal.onClose?.();
    hideModal(id);
  };

  const showBottomSheet = useCallback((props: ShowBottomSheetProps) => {
    const id = props.id ?? crypto.randomUUID();

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

  const closeBottomSheet = (id: string) => {
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
        showModal,
        closeModal,
        showBottomSheet,
        closeBottomSheet,
        showSnackBar,
      }}
    >
      {children}

      {modals.map((modal) => (
        <Modal key={modal.id} {...modal} open={modal.open} onClose={() => closeModal(modal.id)} />
      ))}

      {bottomSheets.map((bottomSheet) => (
        <BottomSheet
          key={bottomSheet.id}
          {...bottomSheet}
          open={bottomSheet.open}
          duration={BOTTOM_SHEET_ANIMATION_DURATION}
          onClose={() => closeBottomSheet(bottomSheet.id)}
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
