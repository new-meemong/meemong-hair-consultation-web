import { Separator } from '@/shared';
import ConsultingResponseFaceType from '../../../../features/posts/ui/consulting-response/result/consulting-response-face-type';
import ConsultingResponseHairType from '../../../../features/posts/ui/consulting-response/result/consulting-response-hair-type';
import ConsultingResponseHairCondition from '../../../../features/posts/ui/consulting-response/result/consulting-response-hair-condition';
import { HAIR_TYPE } from '../../../../features/posts/constants/hair-type';

export default function ConsultingResponseCurrentStateContainer() {
  //   const currentHairType = null;
  const currentHairType = HAIR_TYPE.MALIGNANT_CURLY;

  return (
    <div className="flex flex-col gap-8">
      <ConsultingResponseFaceType />
      <Separator />
      <ConsultingResponseHairType value={currentHairType} />
      <Separator />
      <ConsultingResponseHairCondition />
    </div>
  );
}
