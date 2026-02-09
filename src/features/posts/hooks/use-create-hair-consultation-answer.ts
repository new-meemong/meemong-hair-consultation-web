import { BANG_STYLE, BANG_STYLE_LABEL } from '../constants/bang-style';

import type { ConsultingResponseFormValues } from '../types/consulting-response-form-values';
import type { CreateHairConsultationAnswerRequest } from '@/entities/posts/api/create-hair-consultation-answer-request';
import { FACE_SHAPE_LABEL } from '../constants/face-shape';
import useCreateHairConsultationAnswerMutation from '../api/use-create-hair-consultation-answer-mutation';
import useUploadPostImageMutation from '../api/use-upload-post-image';

export default function useCreateHairConsultationAnswer(hairConsultationId: string) {
  const { mutateAsync: uploadImages, isPending: isUploadingImages } = useUploadPostImageMutation();
  const { mutateAsync: createHairConsultationAnswer, isPending: isCreatingHairConsultationAnswer } =
    useCreateHairConsultationAnswerMutation(hairConsultationId);

  const handleCreateHairConsultationAnswer = async (
    data: ConsultingResponseFormValues,
    { onSuccess }: { onSuccess: () => void },
  ) => {
    const bangStyleServerLabelMap: Record<keyof typeof BANG_STYLE_LABEL, string> = {
      ...BANG_STYLE_LABEL,
      [BANG_STYLE.FEMALE_NO_BANGS]: '노 뱅',
      [BANG_STYLE.FEMALE_FULL]: '풀 뱅',
    };

    const uploadedStyleImageUrls =
      data.style.imageFiles.length > 0 ? await uploadImages(data.style.imageFiles) : null;
    const styleImages = [
      ...data.style.imageUrls,
      ...(uploadedStyleImageUrls?.dataList.map((image) => image.imageURL) ?? []),
    ];

    const bangsTypesFromValues = data.bangsRecommendation.values.map(
      (value) => bangStyleServerLabelMap[value],
    );
    const bangsTypes =
      bangsTypesFromValues.length > 0
        ? bangsTypesFromValues
        : data.bangsRecommendation.value != null
          ? [bangStyleServerLabelMap[data.bangsRecommendation.value]]
          : undefined;

    const title = data.answerTreatmentName.trim() || '컨설팅 답변';
    const description = data.comment?.trim() || undefined;
    const isFaceShapeAdvice = data.isFaceShapeAdvice ?? false;
    const hasHairLengthAdvice =
      data.hairLengthsRecommendation.values.length > 0 ||
      data.hairLengthsRecommendation.needStoreConsulting;
    const hasHairLayerAdvice =
      data.hairLayersRecommendation.values.length > 0 ||
      data.hairLayersRecommendation.needStoreConsulting;
    const hasHairCurlAdvice =
      data.hairCurlsRecommendation.values.length > 0 ||
      data.hairCurlsRecommendation.needStoreConsulting;

    const request: CreateHairConsultationAnswerRequest = {
      faceShape: isFaceShapeAdvice ? undefined : FACE_SHAPE_LABEL[data.faceShape],
      isFaceShapeAdvice,
      bangsTypes: data.bangsRecommendation.needStoreConsulting ? undefined : bangsTypes,
      isBangsTypeAdvice: data.bangsRecommendation.needStoreConsulting,
      hairLengths: data.hairLengthsRecommendation.needStoreConsulting
        ? undefined
        : data.hairLengthsRecommendation.values.length > 0
          ? data.hairLengthsRecommendation.values
          : undefined,
      isHairLengthAdvice: hasHairLengthAdvice
        ? data.hairLengthsRecommendation.needStoreConsulting
        : undefined,
      hairLayers: data.hairLayersRecommendation.needStoreConsulting
        ? undefined
        : data.hairLayersRecommendation.values.length > 0
          ? data.hairLayersRecommendation.values
          : undefined,
      isHairLayerAdvice: hasHairLayerAdvice
        ? data.hairLayersRecommendation.needStoreConsulting
        : undefined,
      hairCurls: data.hairCurlsRecommendation.needStoreConsulting
        ? undefined
        : data.hairCurlsRecommendation.values.length > 0
          ? data.hairCurlsRecommendation.values
          : undefined,
      isHairCurlAdvice: hasHairCurlAdvice
        ? data.hairCurlsRecommendation.needStoreConsulting
        : undefined,
      title,
      styleImages: styleImages.length > 0 ? styleImages : undefined,
      priceType: data.answerPriceInfo.priceType,
      price:
        data.answerPriceInfo.priceType === 'SINGLE'
          ? (data.answerPriceInfo.singlePrice ?? undefined)
          : undefined,
      minPrice:
        data.answerPriceInfo.priceType === 'RANGE'
          ? (data.answerPriceInfo.minPrice ?? undefined)
          : undefined,
      maxPrice:
        data.answerPriceInfo.priceType === 'RANGE'
          ? (data.answerPriceInfo.maxPrice ?? undefined)
          : undefined,
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
