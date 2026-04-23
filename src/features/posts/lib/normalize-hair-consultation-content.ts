import type { HairConsultationFormValues } from '../types/hair-consultation-form-values';
import { MY_IMAGE_TYPE } from '../constants/my-image-type';

const MY_IMAGE_TYPE_SET: ReadonlySet<string> = new Set(Object.values(MY_IMAGE_TYPE));

export const isFile = (value: unknown): value is File =>
  typeof File !== 'undefined' && value instanceof File;

export function normalizeHairConsultationContent(
  content: HairConsultationFormValues,
): HairConsultationFormValues {
  const myImages = Array.isArray(content.myImages)
    ? content.myImages.filter(
        (item): item is HairConsultationFormValues['myImages'][number] =>
          !!item &&
          typeof item === 'object' &&
          'type' in item &&
          'image' in item &&
          MY_IMAGE_TYPE_SET.has((item as { type: string }).type) &&
          isFile((item as { image: unknown }).image),
      )
    : [];

  const aspirationSource =
    content.aspirationImages && typeof content.aspirationImages === 'object'
      ? content.aspirationImages
      : {
          images: [],
          resizedImages: [],
          description: '',
        };

  const aspirationImages = Array.isArray(aspirationSource.images)
    ? aspirationSource.images.filter(isFile)
    : [];
  const aspirationResizedImages = Array.isArray(aspirationSource.resizedImages)
    ? aspirationSource.resizedImages.filter(isFile)
    : [];
  const aspirationDescription =
    typeof aspirationSource.description === 'string' ? aspirationSource.description : '';

  return {
    ...content,
    myImages,
    aspirationImages: {
      ...aspirationSource,
      images: aspirationImages,
      resizedImages: aspirationResizedImages,
      description: aspirationDescription,
    },
  };
}

export function hasLostHairConsultationImages(
  original: HairConsultationFormValues,
  normalized: HairConsultationFormValues,
): boolean {
  const originalMyImageCount = Array.isArray(original.myImages) ? original.myImages.length : 0;
  const originalAspirationImageCount = Array.isArray(original.aspirationImages?.images)
    ? original.aspirationImages.images.length
    : 0;
  const normalizedAspirationImageCount = Array.isArray(normalized.aspirationImages.images)
    ? normalized.aspirationImages.images.length
    : 0;

  return (
    originalMyImageCount > normalized.myImages.length ||
    originalAspirationImageCount > normalizedAspirationImageCount
  );
}
