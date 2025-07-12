import { BottomSheet } from '@/shared';
import type { GuideComponentProps } from '@/shared/hooks/use-guide-popup';
import Image from 'next/image';

function WritePostGuide({ onClose }: GuideComponentProps) {
  return (
    <BottomSheet
      title="사진은 안전하게 보호돼요"
      description="버튼을 눌러 디자이너에게만 공개할 수 있어요"
      onClose={onClose}
      trigger={<div />}
    >
      <Image
        className="h-43 w-82 object-cover"
        src="/sample.png"
        alt="온보딩 이미지"
        width={384}
        height={192}
      />
    </BottomSheet>
  );
}

export default WritePostGuide;
