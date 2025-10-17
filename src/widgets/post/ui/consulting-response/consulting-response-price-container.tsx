import type { ConsultingResponseTreatment } from '@/entities/posts/model/consulting-response';
import ConsultingResponseTreatments from '@/features/posts/ui/consulting-response/result/consulting-response-treatments';

type ConsultingResponsePriceAndCommentContainerProps = {
  treatments: ConsultingResponseTreatment[];
  designerName: string;
  comment?: string;
};

export default function ConsultingResponsePriceContainer({
  treatments,
  designerName,
}: ConsultingResponsePriceAndCommentContainerProps) {
  return (
    <div className="flex flex-col gap-8">
      <ConsultingResponseTreatments designerName={designerName} treatments={treatments} />
    </div>
  );
}
