import { useOverlayContext } from '@/shared/context/OverlayContext';
import type { UseGuidePopupProps } from '@/shared/hooks/use-guide-popup';
import Image from 'next/image';
import { useCallback } from 'react';

function useShowCreatePostGuideSheet() {
  const { showBottomSheet } = useOverlayContext();

  const showCreatePostGuideSheet = useCallback(
    ({ onClose }: UseGuidePopupProps) => {
      showBottomSheet({
        id: 'create-post-guide-sheet',
        title: '사진은 안전하게 보호돼요',
        description: '버튼을 눌러 디자이너에게만 공개할 수 있어요',
        onClose,
        children: (
          <Image
            className="h-43 w-82 object-cover"
            src="/sample.png"
            alt="온보딩 이미지"
            width={384}
            height={192}
          />
        ),
      });
    },
    [showBottomSheet],
  );

  return showCreatePostGuideSheet;
}

export default useShowCreatePostGuideSheet;
