import type {
  CreateHairConsultationAnswerRequest,
  HairConsultationAnswerHairCurl,
} from '@/entities/posts/api/create-hair-consultation-answer-request';

import { BANG_STYLE_LABEL } from '../constants/bang-style';
import type { ConsultingResponseFormValues } from '../types/consulting-response-form-values';
import { FACE_SHAPE_LABEL } from '../constants/face-shape';
import { HAIR_TYPE } from '../constants/hair-type';
import useCreateHairConsultationAnswerMutation from '../api/use-create-hair-consultation-answer-mutation';
import useUploadPostImageMutation from '../api/use-upload-post-image';

const HAIR_TYPE_TO_HAIR_CURL_MAP: Record<string, HairConsultationAnswerHairCurl> = {
  [HAIR_TYPE.STRAIGHT]: '스트레이트',
  [HAIR_TYPE.SEMI_CURLY]: 'C컬',
  [HAIR_TYPE.CURLY]: 'S컬',
  [HAIR_TYPE.MALIGNANT_CURLY]: 'SS컬',
};

export default function useCreateHairConsultationAnswer(hairConsultationId: string) {
  const { mutateAsync: uploadImages, isPending: isUploadingImages } = useUploadPostImageMutation();
  const { mutateAsync: createHairConsultationAnswer, isPending: isCreatingHairConsultationAnswer } =
    useCreateHairConsultationAnswerMutation(hairConsultationId);

  const handleCreateHairConsultationAnswer = async (
    data: ConsultingResponseFormValues,
    { onSuccess }: { onSuccess: () => void },
  ) => {
    const uploadedStyleImageUrls =
      data.style.imageFiles.length > 0 ? await uploadImages(data.style.imageFiles) : null;
    const styleImages = [
      ...data.style.imageUrls,
      ...(uploadedStyleImageUrls?.dataList.map((image) => image.imageURL) ?? []),
    ];

    const bangsType =
      data.bangsRecommendation.value != null
        ? BANG_STYLE_LABEL[data.bangsRecommendation.value]
        : null;

    const selectedHairCurl =
      data.hairType.value != null ? HAIR_TYPE_TO_HAIR_CURL_MAP[data.hairType.value] : null;

    const treatmentMinPrices = data.treatments.map((treatment) => treatment.minPrice);
    const treatmentMaxPrices = data.treatments.map((treatment) => treatment.maxPrice);
    const minPrice = Math.min(...treatmentMinPrices);
    const maxPrice = Math.max(...treatmentMaxPrices);

    const title = data.style.description?.trim() || data.comment?.trim() || '컨설팅 답변';
    const description = data.comment?.trim() || data.style.description?.trim() || undefined;

    const request: CreateHairConsultationAnswerRequest = {
      faceShape: FACE_SHAPE_LABEL[data.faceShape],
      isFaceShapeAdvice: false,
      bangsTypes: bangsType ? [bangsType] : undefined,
      isBangsTypeAdvice: data.bangsRecommendation.needStoreConsulting,
      hairCurls: selectedHairCurl ? [selectedHairCurl] : undefined,
      isHairCurlAdvice: data.hairType.needStoreConsulting,
      title,
      styleImages: styleImages.length > 0 ? styleImages : undefined,
      priceType: 'RANGE',
      minPrice,
      maxPrice,
      description,
    };

    const response = await createHairConsultationAnswer(request);

    onSuccess();

    return response.data.data.id;
  };

  return {
    handleCreateHairConsultationAnswer,
    isPending: isUploadingImages || isCreatingHairConsultationAnswer,
  };
}
