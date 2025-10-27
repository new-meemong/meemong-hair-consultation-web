import { format } from 'date-fns';

import type { CreateConsultingPostRequest } from '@/entities/posts/api/create-consulting-post-request';

import useCreateConsultingPostMutation from '../api/use-create-consulting-post-mutation';
import useUploadPostImageMutation from '../api/use-upload-post-image';
import {
  HAIR_CONCERN_OPTION_LABEL,
  HAIR_CONCERN_OPTION_VALUE,
} from '../constants/hair-concern-option';
import { SKIN_TONE_OPTION_LABEL } from '../constants/skin-tone';
import type { ConsultingPostFormValues } from '../types/consulting-post-form-values';

function createTitle(data: ConsultingPostFormValues) {
  const { concern, title } = data;

  if (title) return title;

  if (concern.value === HAIR_CONCERN_OPTION_VALUE.ETC && concern.additional) {
    return concern.additional.slice(0, 22);
  }

  if (concern.value === HAIR_CONCERN_OPTION_VALUE.DESIGN_POSSIBLE) {
    return '원하는 스타일이 있는데 어울릴지, 가능할지 궁금해요';
  }

  if (concern.value === HAIR_CONCERN_OPTION_VALUE.RECOMMEND_STYLE) {
    return '어떤 스타일이 어울리는지 궁금해요';
  }

  return '';
}

export function useCreateConsultingPost() {
  const { mutateAsync: uploadImages, isPending: isUploadingImages } = useUploadPostImageMutation();
  const { mutate: createConsultingPost, isPending: isCreatingConsultingPost } =
    useCreateConsultingPostMutation();

  const handleCreateConsultingPost = async (
    data: ConsultingPostFormValues,
    { onSuccess }: { onSuccess: () => void },
  ) => {
    const myImageList = await Promise.all(
      data.myImages.map(async ({ type, image }) => ({
        type,
        imageUrl: (await uploadImages([image])).dataList[0].imageURL,
      })),
    );

    const uploadedAspirationImages =
      data.aspirationImages.images && data.aspirationImages.images.length > 0
        ? await uploadImages(data.aspirationImages.images)
        : undefined;

    const aspirationDescription = data.aspirationImages.description;

    const aspirations =
      uploadedAspirationImages || aspirationDescription
        ? {
            images: uploadedAspirationImages?.dataList.map((image) => image.imageURL) ?? [],
            description: aspirationDescription,
          }
        : undefined;

    const request: CreateConsultingPostRequest = {
      title: createTitle(data),
      content: data.content,
      hairConcern: HAIR_CONCERN_OPTION_LABEL[data.concern.value],
      hairConcernDetail:
        data.concern.value === HAIR_CONCERN_OPTION_VALUE.ETC ? data.concern.additional : undefined,
      hasNoRecentTreatment: data.treatments === null,
      skinTone: data.skinTone ? SKIN_TONE_OPTION_LABEL[data.skinTone] : undefined,
      treatments: data.treatments?.map(({ name, date }) => ({
        treatmentName: name,
        treatmentDate: format(date, 'yyyy.MM'),
      })),
      myImageList,
      aspirations,
      minPaymentPrice: data.price.minPaymentPrice,
      maxPaymentPrice: data.price.maxPaymentPrice,  
    };

    createConsultingPost(request, {
      onSuccess,
    });
  };

  return {
    handleCreateConsultingPost,
    isPending: isUploadingImages || isCreatingConsultingPost,
  };
}
