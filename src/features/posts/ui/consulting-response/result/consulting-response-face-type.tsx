import Image from 'next/image';

import type { ValueOf } from '@/shared/type/types';

import { FACE_SHAPE, FACE_SHAPE_OPTION } from '../../../constants/face-shape';
import ConsultingResponseItem from '../consulting-response-item';

type ConsultingResponseFaceTypeProps = {
  faceShape: ValueOf<typeof FACE_SHAPE>;
};

export default function ConsultingResponseFaceType({ faceShape }: ConsultingResponseFaceTypeProps) {
  const { label, description, selectedImage } = FACE_SHAPE_OPTION[faceShape];

  return (
    <ConsultingResponseItem
      title="얼굴형 진단"
      content="올려주신 사진을 바탕으로 얼굴형을 진단했어요"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center rounded-6 size-22 bg-label-default">
          <Image
            src={selectedImage}
            alt={label}
            width={50.6}
            height={89.4}
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-0.75">
          <p className="typo-body-2-medium text-label-default">{label}</p>
          <p className="typo-body-3-regular text-label-sub">{description}</p>
        </div>
      </div>
    </ConsultingResponseItem>
  );
}
