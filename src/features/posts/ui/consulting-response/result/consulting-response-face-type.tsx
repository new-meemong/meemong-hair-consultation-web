import Image from 'next/image';

import { FACE_TYPE, FACE_TYPE_OPTION } from '../../../constants/face-type';
import ConsultingResponseItem from '../consulting-response-item';

export default function ConsultingResponseFaceType() {
  const currentFaceType = FACE_TYPE.OVAL;

  const { label, description, selectedImage } = FACE_TYPE_OPTION[currentFaceType];

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
