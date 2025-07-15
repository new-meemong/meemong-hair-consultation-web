import { useOverlayContext } from '@/shared/context/overlay-context';
import type { UseGuidePopupProps } from '@/shared/hooks/use-guide-popup';
import { useCallback } from 'react';
import DesignerOnboardingSheetContent from '../ui/designer-onboarding-sheet-content';

function useShowDesignerOnboardingSheet() {
  const { showBottomSheet } = useOverlayContext();

  const showDesignerOnboardingSheet = useCallback(
    ({ onClose }: UseGuidePopupProps) => {
      showBottomSheet({
        id: `designer-onboarding-sheet-step`,
        onClose,
        children: <DesignerOnboardingSheetContent />,
      });
    },
    [showBottomSheet],
  );

  return showDesignerOnboardingSheet;
}

export default useShowDesignerOnboardingSheet;
