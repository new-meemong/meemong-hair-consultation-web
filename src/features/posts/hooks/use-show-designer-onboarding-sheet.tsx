// 당분간 사용하지 않음
// import { useCallback } from 'react';

// import { useOverlayContext } from '@/shared/context/overlay-context';
// import type { UseGuidePopupProps } from '@/shared/hooks/use-show-guide';

// import DesignerOnboardingSheetContent from '../ui/designer-onboarding-sheet-content';

// function useShowDesignerOnboardingSheet() {
//   const { showBottomSheet } = useOverlayContext();

//   const showDesignerOnboardingSheet = useCallback(
//     ({ onClose }: UseGuidePopupProps) => {
//       showBottomSheet({
//         id: `designer-onboarding-sheet-step`,
//         onClose,
//         children: <DesignerOnboardingSheetContent />,
//       });
//     },
//     [showBottomSheet],
//   );

//   return showDesignerOnboardingSheet;
// }

// export default useShowDesignerOnboardingSheet;

// 임시로 빈 함수 반환 (타입 에러 방지)
function useShowDesignerOnboardingSheet() {
  return () => {};
}

export default useShowDesignerOnboardingSheet;
