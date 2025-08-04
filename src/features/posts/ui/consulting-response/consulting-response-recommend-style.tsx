import Image from 'next/image';
import ConsultingResponseItem from './consulting-response-item';

type ConsultingResponseStyleProps = {
  value: string | null;
  images: string[] | null;
};

export default function ConsultingResponseRecommendStyle({
  value,
  images,
}: ConsultingResponseStyleProps) {
  return (
    <ConsultingResponseItem title="스타일 추천" content="어울리는 스타일을 디자이너가 추천했어요">
      {value && (
        <div className="typo-body-2-long-regular text-label-default whitespace-pre-line">
          {value}
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
