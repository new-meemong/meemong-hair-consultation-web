import type { CreateConsultingResponseRequest } from '@/entities/posts/api/create-consulting-response-request';

import usePutConsultingResponseMutation from '../api/use-put-consulting-response-mutation';
import useUploadPostImageMutation from '../api/use-upload-post-image';
import { BANG_STYLE_LABEL } from '../constants/bang-style';
import { FACE_SHAPE_LABEL } from '../constants/face-shape';
import { HAIR_TYPE_LABEL } from '../constants/hair-type';
import type { ConsultingResponseFormValues } from '../types/consulting-response-form-values';

export default function useEditConsultingResponse({
  postId,
  responseId,
}: {
  postId: string;
  responseId: string;
}) {
  const { mutateAsync: uploadImages, isPending: isUploadingImages } = useUploadPostImageMutation();
  const { mutate: editConsultingResponseMutate, isPending: isEditingConsultingResponse } =
    usePutConsultingResponseMutation({ postId, responseId });

  const editConsultingResponse = async (
    data: ConsultingResponseFormValues,
    { onSuccess }: { onSuccess: () => void },
  ) => {
    if (!responseId) return;

    try {
      const newImageUrls =
        data.style.imageFiles.length > 0
          ? (await uploadImages(data.style.imageFiles)).dataList.map((img) => img.imageURL)
          : [];

      const request: CreateConsultingResponseRequest = {
        faceShape: FACE_SHAPE_LABEL[data.faceShape],
        hairType: data.hairType.value ? HAIR_TYPE_LABEL[data.hairType.value] : null,
        isHairTypeStoreConsultNeed: data.hairType.needStoreConsulting,
        damageLevel: data.damageLevel.value ?? null,
        isDamageLevelConsultNeed: data.damageLevel.needStoreConsulting,
        bangsRecommendation: data.bangsRecommendation.value
          ? BANG_STYLE_LABEL[data.bangsRecommendation.value]
          : null,
        isBangRecommendationConsultNeed: data.bangsRecommendation.needStoreConsulting,
        style: {
          images: [...data.style.imageUrls, ...newImageUrls],
          description: data.style.description ? data.style.description : '',
        },
        treatments: data.treatments.map((treatment) => ({
          treatmentName: treatment.treatmentName,
          minPrice: treatment.minPrice,
          maxPrice: treatment.maxPrice,
        })),
        comment: data.comment ? data.comment : '',
      };

      editConsultingResponseMutate(request, { onSuccess });
    } catch (error) {
      console.error('컨설팅 답변 수정 중 오류:', error);
    }
  };

  return {
    editConsultingResponse,
    isPending: isUploadingImages || isEditingConsultingResponse,
  };
}
