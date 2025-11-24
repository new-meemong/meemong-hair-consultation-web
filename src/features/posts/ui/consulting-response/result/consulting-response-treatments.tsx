import type { ConsultingResponseTreatment } from '@/entities/posts/model/consulting-response';
import { Separator } from '@/shared';

import ConsultingResponseItem from '../consulting-response-item';

type ConsultingResponsePriceProps = {
  designerName: string;
  treatments: ConsultingResponseTreatment[];
};

export default function ConsultingResponseTreatments({
  designerName,
  treatments,
}: ConsultingResponsePriceProps) {
  return (
    <ConsultingResponseItem
      title="시술 가격 견적"
      content={`${designerName}디자이너님께 시술 받으면\n이 정도 견적으로 예상할 수 있어요`}
    >
      <div className="flex flex-col">
        {treatments.map(({ treatmentName, minPrice, maxPrice }, index) => (
          <div key={`${treatmentName}-${minPrice}-${maxPrice}-${index}`}>
            <div className="py-4 flex gap-5 justify-between">
              <p className="typo-body-2-semibold text-label-sub">{treatmentName}</p>
              <p className="typo-body-2-regular text-label-default">
                {minPrice.toLocaleString()}원~{maxPrice.toLocaleString()}원
              </p>
            </div>
            {index !== treatments.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </ConsultingResponseItem>
  );
}
