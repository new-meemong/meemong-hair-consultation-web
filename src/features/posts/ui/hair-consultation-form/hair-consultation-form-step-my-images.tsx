import { useFormContext, useWatch } from 'react-hook-form';

import { Button } from '@/shared';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';
import { IMAGE_TYPE } from '@/shared/constants/image-type';
import ImageUploaderItem from '@/shared/ui/image-uploader-item';
import { MY_IMAGE_TYPE } from '@/features/posts/constants/my-image-type';
import type { ValueOf } from '@/shared/type/types';
import { useCallback } from 'react';
import useShowConsultingPostImageGuideSheet from '../../hooks/use-show-consulting-post-image-guide-sheet';

export default function HairConsultationFormStepMyImages() {
  const { setValue, getValues, control } = useFormContext<HairConsultationFormValues>();

  const showConsultingPostImageGuideSheet = useShowConsultingPostImageGuideSheet();
  const handleGuideClick = () => {
    showConsultingPostImageGuideSheet();
  };

  const currentImages = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES,
  });

  const getCurrentImage = useCallback(
    (type: ValueOf<typeof MY_IMAGE_TYPE>) => {
      const currentImage = currentImages?.find(
        (img: { type: ValueOf<typeof MY_IMAGE_TYPE>; image: File }) => img.type === type,
      );

      return currentImage
        ? {
            type: IMAGE_TYPE.FILE,
            name: currentImage.image.name,
            src: URL.createObjectURL(currentImage.image),
          }
        : null;
    },
    [currentImages],
  );

  const handleImageUpload = useCallback(
    ({ file, type }: { file: File; type: ValueOf<typeof MY_IMAGE_TYPE> }) => {
      const currentImages = getValues(HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES) || [];
      const newImage = { type, image: file };

      setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES, [...currentImages, newImage]);
    },
    [getValues, setValue],
  );

  const handleImageDelete = useCallback(
    ({ type }: { type: ValueOf<typeof MY_IMAGE_TYPE> }) => {
      const currentImages = getValues(HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES) || [];
      const newImages = currentImages.filter(
        (img: { type: ValueOf<typeof MY_IMAGE_TYPE>; image: File }) => img.type !== type,
      );
      setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES, newImages);
    },
    [getValues, setValue],
  );

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="grid grid-cols-2 gap-6">
          <ImageUploaderItem
            currentImage={getCurrentImage(MY_IMAGE_TYPE.FRONT)}
            onUpload={(file: File) =>
              handleImageUpload({
                file,
                type: MY_IMAGE_TYPE.FRONT,
              })
            }
            onDelete={() => handleImageDelete({ type: MY_IMAGE_TYPE.FRONT })}
            label="정면 (필수)"
          />
          <ImageUploaderItem
            currentImage={getCurrentImage(MY_IMAGE_TYPE.SIDE)}
            onUpload={(file: File) =>
              handleImageUpload({
                file,
                type: MY_IMAGE_TYPE.SIDE,
              })
            }
            label="측면 (필수)"
            onDelete={() => handleImageDelete({ type: MY_IMAGE_TYPE.SIDE })}
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <ImageUploaderItem
            currentImage={getCurrentImage(MY_IMAGE_TYPE.RECENT)}
            onUpload={(file: File) => handleImageUpload({ file, type: MY_IMAGE_TYPE.RECENT })}
            onDelete={() => handleImageDelete({ type: MY_IMAGE_TYPE.RECENT })}
            label="현재 내 머리 (필수)"
          />
          <ImageUploaderItem
            currentImage={getCurrentImage(MY_IMAGE_TYPE.WHOLE_BODY) || null}
            onUpload={(file: File) => handleImageUpload({ file, type: MY_IMAGE_TYPE.WHOLE_BODY })}
            onDelete={() => handleImageDelete({ type: MY_IMAGE_TYPE.WHOLE_BODY })}
            label="전신 (선택)"
          />
        </div>
      </div>
      <Button theme="white" onClick={handleGuideClick}>
        사진 가이드 확인
      </Button>
    </div>
  );
}
