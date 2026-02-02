import type { CreateHairConsultationRequest, HairConsultationMyImageRequest } from '@/entities/posts/api/create-hair-consultation-request';

import type { HairConsultationFormValues } from '../types/hair-consultation-form-values';
import { MY_IMAGE_TYPE } from '../constants/my-image-type';
import type { ValueOf } from '@/shared/type/types';
import { format } from 'date-fns';
import useCreateHairConsultationMutation from '../api/use-create-hair-consultation-mutation';
import useUploadPostImageMutation from '../api/use-upload-post-image';

const mapMyImageTypeToRequestSubType = (
  type: ValueOf<typeof MY_IMAGE_TYPE>,
): HairConsultationMyImageRequest['subType'] => {
  switch (type) {
    case MY_IMAGE_TYPE.RECENT:
      return 'CURRENT';
    case MY_IMAGE_TYPE.FRONT:
      return 'FRONT';
    case MY_IMAGE_TYPE.SIDE:
      return 'TIED_SIDE';
    case MY_IMAGE_TYPE.WHOLE_BODY:
      return 'UPPER_BODY';
    default:
      return 'CURRENT';
  }
};

export function useCreateHairConsultation() {
  const { mutateAsync: uploadImages, isPending: isUploadingImages } = useUploadPostImageMutation();
  const { mutate: createHairConsultation, isPending: isCreatingHairConsultation } =
    useCreateHairConsultationMutation();

  const handleCreateHairConsultation = async (
    data: HairConsultationFormValues,
    { onSuccess }: { onSuccess: () => void },
  ) => {
    const myImageList = await Promise.all(
      data.myImages.map(async ({ type, image }) => ({
        subType: mapMyImageTypeToRequestSubType(type),
        imageUrl: (await uploadImages([image])).dataList[0].imageURL,
      })),
    );

    const uploadedAspirationImages =
      data.aspirationImages.images && data.aspirationImages.images.length > 0
        ? await uploadImages(data.aspirationImages.images)
        : undefined;

    const aspirationImages = uploadedAspirationImages?.dataList.map((image) => ({
      imageUrl: image.imageURL,
    }));

    const treatmentDescription =
      data.treatments && data.treatments.length > 0
        ? data.treatments
            .map((item) => `${item.name} ${format(item.date, 'yyyy.MM')}`)
            .join(', ')
        : undefined;

    const desiredCostPrice =
      data.price.maxPaymentPrice ?? data.price.minPaymentPrice ?? 0;

    const request: CreateHairConsultationRequest = {
      title: data.title,
      content: data.content,
      hairConsultTreatmentDescription: treatmentDescription,
      hairConcerns: data.hairConcerns,
      hairLength: data.hairLength,
      skinBrightness: data.skinBrightness,
      hairTexture: data.hairTexture,
      personalColor: data.personalColor,
      aspirationImageTypes: [],
      aspirationImageDescription: data.aspirationImages.description,
      desiredCostPrice,
      aspirationImages,
      myImages: myImageList,
    };

    createHairConsultation(request, { onSuccess });
  };

  return {
    handleCreateHairConsultation,
    isPending: isUploadingImages || isCreatingHairConsultation,
  };
}
