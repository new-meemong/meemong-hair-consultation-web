'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import useGetConsultingResponse from '@/features/posts/api/use-get-consulting-response';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '@/features/posts/constants/consulting-response-form-field-name';
import { FACE_SHAPE } from '@/features/posts/constants/face-shape';
import useConsultingResponseForm from '@/features/posts/hooks/use-consulting-response-form';
import getBangsStyleValue from '@/features/posts/lib/get-bangs-style-value';
import getFaceShapeValue from '@/features/posts/lib/get-face-shape-value';
import getHairTypeValue from '@/features/posts/lib/get-hair-type-value';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import ConsultingResponseFormContainer from '@/widgets/post/ui/consulting-response/consulting-response-form-container';

export default function ConsultingResponseEditPage() {
  const { postId, responseId } = useParams();

  const { data: consultingResponse } = useGetConsultingResponse(
    postId?.toString() ?? '',
    responseId?.toString() ?? '',
  );

  const { method } = useConsultingResponseForm({
    postId: postId?.toString() ?? '',
  });

  useEffect(() => {
    if (consultingResponse?.data && postId) {
      const {
        faceShape,
        hairType,
        damageLevel,
        bangsRecommendation,
        style,
        treatments,
        comment,
        isHairTypeStoreConsultNeed,
        isDamageLevelConsultNeed,
        isBangRecommendationConsultNeed,
      } = consultingResponse.data;

      method.reset({
        [CONSULTING_RESPONSE_FORM_FIELD_NAME.FACE_SHAPE]:
          getFaceShapeValue(faceShape) ?? FACE_SHAPE.OVAL,
        [CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_TYPE]: {
          value: getHairTypeValue(hairType),
          needStoreConsulting: isHairTypeStoreConsultNeed,
        },
        [CONSULTING_RESPONSE_FORM_FIELD_NAME.DAMAGE_LEVEL]: {
          value: damageLevel,
          needStoreConsulting: isDamageLevelConsultNeed,
        },
        [CONSULTING_RESPONSE_FORM_FIELD_NAME.BANGS_RECOMMENDATION]: {
          value: getBangsStyleValue(bangsRecommendation),
          needStoreConsulting: isBangRecommendationConsultNeed,
        },
        [CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE]: {
          imageFiles: [],
          imageUrls: style.images,
          description: style.description ?? '',
        },
        [CONSULTING_RESPONSE_FORM_FIELD_NAME.TREATMENTS]: treatments,
        [CONSULTING_RESPONSE_FORM_FIELD_NAME.COMMENT]: comment,
        [CONSULTING_RESPONSE_FORM_FIELD_NAME.POST_ID]: postId.toString(),
      });
    }
  }, [consultingResponse, method, postId]);

  const { back } = useRouterWithUser();

  const [currentStep, setCurrentStep] = useState(1);

  if (!postId) return null;

  const handleBackClick = () => {
    back();
  };

  if (!responseId) return null;

  return (
    <ConsultingResponseFormContainer
      method={method}
      responseId={responseId.toString()}
      onBackClick={handleBackClick}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
    />
  );
}
