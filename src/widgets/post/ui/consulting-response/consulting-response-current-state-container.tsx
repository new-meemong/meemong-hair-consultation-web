import type { FACE_SHAPE } from '@/features/posts/constants/face-shape';
import { Separator } from '@/shared';
import type { ValueOf } from '@/shared/type/types';

import { HAIR_TYPE } from '../../../../features/posts/constants/hair-type';
import ConsultingResponseFaceType from '../../../../features/posts/ui/consulting-response/result/consulting-response-face-type';
import ConsultingResponseHairCondition from '../../../../features/posts/ui/consulting-response/result/consulting-response-hair-condition';
import ConsultingResponseHairType from '../../../../features/posts/ui/consulting-response/result/consulting-response-hair-type';

type ConsultingResponseCurrentStateContainerProps = {
  faceShape: ValueOf<typeof FACE_SHAPE> | null;
  hairType: ValueOf<typeof HAIR_TYPE> | null;
  damageLevel?: number | null;
};

export default function ConsultingResponseCurrentStateContainer({
  faceShape,
  hairType,
  damageLevel,
}: ConsultingResponseCurrentStateContainerProps) {
  return (
    <div className="flex flex-col gap-8">
      {faceShape && <ConsultingResponseFaceType faceShape={faceShape} />}
      {hairType && (
        <>
          <Separator />
          <ConsultingResponseHairType value={hairType} />
        </>
      )}
      {damageLevel && (
        <>
          <Separator />
          <ConsultingResponseHairCondition damageLevel={damageLevel} />
        </>
      )}
    </div>
  );
}
