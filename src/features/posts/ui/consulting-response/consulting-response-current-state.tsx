import { Separator } from '@/shared';
import ConsultingResponseFaceType from './consulting-response-face-type';
import ConsultingResponseHairType from './consulting-response-hair-type';
import ConsultingResponseHairCondition from './consulting-response-hair-condition';
import { HAIR_TYPE } from '../../constants/hair-type';

export default function ConsultingResponseCurrentState() {
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
