import type { ConsultingResponseTreatment } from '@/entities/posts/model/consulting-response';

import ConsultingInputResultListItem from '../../consulting-input-result-list-item';
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
      content={`${designerName}님이 제안한 시술 가격이에요`}
    >
      <div className="flex flex-col gap-4">
        {treatments.map(({ treatmentName, minPrice, maxPrice }, index) => (
          <ConsultingInputResultListItem
            key={`${treatmentName}-${minPrice}-${maxPrice}-${index}`}
            name={treatmentName}
            description={`${minPrice.toLocaleString()}원~${maxPrice.toLocaleString()}원`}
          />
        ))}
      </div>
    </ConsultingResponseItem>
  );
}
