import type {
  CreateHairConsultationRequest,
  HairConsultationMyImageRequest,
} from '@/entities/posts/api/create-hair-consultation-request';
import { format, subMonths } from 'date-fns';

import type { HairConsultationFormValues } from '../types/hair-consultation-form-values';
import { MY_IMAGE_TYPE } from '../constants/my-image-type';
import type { ValueOf } from '@/shared/type/types';
import { apiClient } from '@/shared/api/client';
import { resizeImageFile } from '@/shared/lib/resize-image-file';
import useCreateHairConsultationMutation from '../api/use-create-hair-consultation-mutation';
import { useState } from 'react';

const DECOLORIZATION_COUNT_TREATMENT_TYPES = new Set(['일반염색', '블랙염색', '블랙빼기']);

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
  const { mutate: createHairConsultation, isPending: isCreatingHairConsultation } =
    useCreateHairConsultationMutation();
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const uploadImageWithPresignedUrl = async (file: File) => {
    const { data } = await apiClient.get<{
      uploadData: { url: string; fields: Record<string, string> };
      uploadUrlList: string[];
      requestMethod: string;
    }>('uploads/images/s1024/presigned-url', {
      searchParams: {
        filename: file.name,
      },
    });

    const { uploadData, requestMethod } = data;

    const formData = new FormData();
    Object.entries(uploadData.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('file', file);

    const response = await fetch(uploadData.url, {
      method: requestMethod,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('이미지 업로드에 실패했습니다.');
    }

    return `${uploadData.url}/${uploadData.fields.key}`;
  };

  const getFileKey = (file: File) => `${file.name}-${file.lastModified}`;

  const ensureResizedImages = async (images: File[], resizedImages: File[] = []) => {
    const resizedMap = new Map(resizedImages.map((file) => [getFileKey(file), file]));

    return Promise.all(
      images.map(async (image) => {
        const key = getFileKey(image);
        const cached = resizedMap.get(key);
        if (cached) return cached;
        return resizeImageFile(image, 1024);
      }),
    );
  };

  const handleCreateHairConsultation = async (
    data: HairConsultationFormValues,
    { onSuccess, onError }: { onSuccess: () => void; onError?: (error: unknown) => void },
  ) => {
    setIsUploadingImages(true);
    try {
      const myImageOrder: ValueOf<typeof MY_IMAGE_TYPE>[] = [
        MY_IMAGE_TYPE.RECENT,
        MY_IMAGE_TYPE.FRONT,
        MY_IMAGE_TYPE.SIDE,
        MY_IMAGE_TYPE.WHOLE_BODY,
      ];
      const orderedMyImages = [...data.myImages].sort(
        (a, b) => myImageOrder.indexOf(a.type) - myImageOrder.indexOf(b.type),
      );

      const myImageList = await Promise.all(
        orderedMyImages.map(async ({ type, image }) => {
          const resizedImage = await resizeImageFile(image, 1024);
          const imageUrl = await uploadImageWithPresignedUrl(resizedImage);
          return {
            subType: mapMyImageTypeToRequestSubType(type),
            imageUrl,
          };
        }),
      );

      const aspirationOriginals = data.aspirationImages.images ?? [];
      const aspirationResized = data.aspirationImages.resizedImages ?? [];
      const aspirationFiles = await ensureResizedImages(aspirationOriginals, aspirationResized);

      const aspirationImages =
        aspirationFiles.length > 0
          ? await Promise.all(
              aspirationFiles.map(async (image) => ({
                imageUrl: await uploadImageWithPresignedUrl(image),
              })),
            )
          : undefined;
      const aspirationImageDescription = data.aspirationImages.description.trim() || undefined;
      const treatmentSummary =
        data.treatments && data.treatments.length > 0
          ? data.treatments.map((item) => item.treatmentType).join(', ')
          : undefined;
      const detailText = data.treatmentDetail?.trim();
      const hairConsultTreatmentDescription =
        treatmentSummary && detailText
          ? `${treatmentSummary} / ${detailText}`
          : (treatmentSummary ?? detailText ?? undefined);

      const treatments = data.treatments.map((item) => {
        const shouldSendDecolorizationCount = DECOLORIZATION_COUNT_TREATMENT_TYPES.has(
          item.treatmentType,
        );
        const request = {
          treatmentType: item.treatmentType,
          treatmentDate: format(subMonths(new Date(), item.monthsAgo), 'yyyy-MM'),
          isSelf: item.isSelf,
        } as const;

        return {
          ...request,
          ...(item.treatmentArea ? { treatmentArea: item.treatmentArea } : {}),
          ...(shouldSendDecolorizationCount
            ? { decolorizationCount: item.decolorizationCount ?? 0 }
            : {}),
        };
      });

      const desiredCostPrice = data.price.maxPaymentPrice ?? 0;

      const desiredDateType = data.desiredDateType ?? undefined;
      const desiredDateDescription =
        data.desiredDateType === '원하는 날짜 있음' &&
        data.desiredDate !== null &&
        data.desiredDate !== ''
          ? data.desiredDate
          : undefined;

      const request: CreateHairConsultationRequest = {
        title: data.title,
        content: data.content,
        hairConsultTreatmentDescription,
        hairConcerns: data.hairConcerns,
        hairLength: data.hairLength,
        skinBrightness: data.skinBrightness,
        hairTexture: data.hairTexture,
        personalColor: data.personalColor,
        desiredDateType,
        desiredCostPrice,
        aspirationImages,
        myImages: myImageList,
        treatments,
        ...(desiredDateDescription !== undefined ? { desiredDateDescription } : {}),
        ...(aspirationImageDescription ? { aspirationImageDescription } : {}),
      };

      await createHairConsultation(request, { onSuccess, onError });
    } catch (error) {
      onError?.(error);
    } finally {
      setIsUploadingImages(false);
    }
  };

  return {
    handleCreateHairConsultation,
    isPending: isUploadingImages || isCreatingHairConsultation,
  };
}
