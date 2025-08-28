import type { ConsultingResponseTreatment } from '@/entities/posts/model/consulting-response';
import ConsultingResponseComment from '@/features/posts/ui/consulting-response/result/consulting-response-comment';
import ConsultingResponseTreatments from '@/features/posts/ui/consulting-response/result/consulting-response-treatments';
import { Separator } from '@/shared';

type ConsultingResponsePriceAndCommentContainerProps = {
  treatments: ConsultingResponseTreatment[];
  designerName: string;
  comment?: string;
};

export default function ConsultingResponsePriceAndCommentContainer({
  treatments,
  designerName,
  comment,
}: ConsultingResponsePriceAndCommentContainerProps) {
  return (
    <div className="flex flex-col gap-8">
      <ConsultingResponseTreatments designerName={designerName} treatments={treatments} />
      {comment && (
        <>
          <Separator />
          <ConsultingResponseComment comment={comment} />
        </>
      )}
    </div>
  );
}
