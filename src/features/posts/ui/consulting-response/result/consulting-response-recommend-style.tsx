import Image from 'next/image';

import type { ConsultingResponseStyle } from '@/entities/posts/model/consulting-response';

import ConsultingResponseItem from '../consulting-response-item';

type ConsultingResponseStyleProps = {
  style: ConsultingResponseStyle;
};

export default function ConsultingResponseRecommendStyle({ style }: ConsultingResponseStyleProps) {
  const { description, images } = style;

  return (
    <ConsultingResponseItem title="스타일 추천" content="어울리는 스타일을 디자이너가 추천했어요">
      {description && (
        <div className="typo-body-2-long-regular text-label-default whitespace-pre-line">
          {description}
        </div>
      )}
      {images && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <Image
              key={`${image}-${index}`}
              src={image}
              alt="스타일 이미지"
              width={160}
              height={160}
              className="object-cover size-40 rounded-6"
            />
          ))}
        </div>
      )}
    </ConsultingResponseItem>
  );
}
