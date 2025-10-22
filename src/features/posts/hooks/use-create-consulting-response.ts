import type { CreateConsultingResponseRequest } from '@/entities/posts/api/create-consulting-response-request';
import useSendConsultingAnswerPushNotification from '@/features/chat/api/use-send-consulting-answer-push-notification';

import useCreateConsultingResponseMutation from '../api/use-create-consulting-response-mutation';
import useUploadPostImageMutation from '../api/use-upload-post-image';
import { BANG_STYLE_LABEL } from '../constants/bang-style';
import { FACE_SHAPE_LABEL } from '../constants/face-shape';
import { HAIR_TYPE_LABEL } from '../constants/hair-type';
import type { ConsultingResponseFormValues } from '../types/consulting-response-form-values';

export default function useCreateConsultingResponse(
  hairConsultPostingId: string,
  receiverId?: string,
) {
  const { mutateAsync: uploadImages, isPending: isUploadingImages } = useUploadPostImageMutation();
  const { mutate: createConsultingResponse, isPending: isCreatingConsultingResponse } =
    useCreateConsultingResponseMutation(hairConsultPostingId);
  const { mutate: sendNotification } = useSendConsultingAnswerPushNotification();

  const handleCreateConsultingResponse = async (
    data: ConsultingResponseFormValues,
    { onSuccess }: { onSuccess: () => void },
  ) => {
    const styleImageUrls =
      data.style.imageFiles.length > 0 ? await uploadImages(data.style.imageFiles) : null;

    const request: CreateConsultingResponseRequest = {
      faceShape: FACE_SHAPE_LABEL[data.faceShape],
      hairType: data.hairType.value ? HAIR_TYPE_LABEL[data.hairType.value] : undefined,
      isHairTypeStoreConsultNeed: data.hairType.needStoreConsulting,
      damageLevel: data.damageLevel.value ?? undefined,
      isDamageLevelConsultNeed: data.damageLevel.needStoreConsulting,
      bangsRecommendation: data.bangsRecommendation.value
        ? BANG_STYLE_LABEL[data.bangsRecommendation.value]
        : undefined,
      isBangRecommendationConsultNeed: data.bangsRecommendation.needStoreConsulting,
      style: {
        images: styleImageUrls?.dataList.map((image) => image.imageURL) ?? [],
        description: data.style.description ? data.style.description : undefined,
      },
      treatments: data.treatments.map((treatment) => ({
        treatmentName: treatment.treatmentName,
        minPrice: treatment.minPrice,
        maxPrice: treatment.maxPrice,
      })),
      comment: data.comment ? data.comment : undefined,
    };

    createConsultingResponse(request, {
      onSuccess: () => {
        // 컨설팅 답변 작성 성공 시 푸시 알림 발송
        if (receiverId) {
          sendNotification({
            userId: receiverId,
          });
        }
        onSuccess();
      },
    });
  };

  return {
    handleCreateConsultingResponse,
    isPending: isUploadingImages || isCreatingConsultingResponse,
  };
}
