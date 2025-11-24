import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { MY_IMAGE_TYPE } from '@/features/posts/constants/my-image-type';
import { Button } from '@/shared';
import { IMAGE_TYPE } from '@/shared/constants/image-type';
import type { ValueOf } from '@/shared/type/types';
import ImageUploaderItem from '@/shared/ui/image-uploader-item';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import useShowConsultingPostImageGuideSheet from '../../../hooks/use-show-consulting-post-image-guide-sheet';
import { type ConsultingPostFormValues } from '../../../types/consulting-post-form-values';

export default function ConsultingPostFormStepMyImages() {
  const { setValue, getValues, control } = useFormContext<ConsultingPostFormValues>();

  const showConsultingPostImageGuideSheet = useShowConsultingPostImageGuideSheet();
  const handleGuideClick = () => {
    showConsultingPostImageGuideSheet();
  };

  const currentImages = useWatch({
    control,
    name: CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES,
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
      const currentImages = getValues(CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES) || [];
      const newImage = { type, image: file };

      setValue(CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES, [...currentImages, newImage]);
    },
    [getValues, setValue],
  );

  const handleImageDelete = useCallback(
    ({ type }: { type: ValueOf<typeof MY_IMAGE_TYPE> }) => {
      const currentImages = getValues(CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES) || [];
      const newImages = currentImages.filter(
        (img: { type: ValueOf<typeof MY_IMAGE_TYPE>; image: File }) => img.type !== type,
      );
      setValue(CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES, newImages);
    },
    [getValues, setValue],
  );

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="grid grid-cols-2 gap-6">
          <ImageUploaderItem
            currentImage={getCurrentImage(MY_IMAGE_TYPE.RECENT)}
            onUpload={(file: File) => handleImageUpload({ file, type: MY_IMAGE_TYPE.RECENT })}
            onDelete={() => handleImageDelete({ type: MY_IMAGE_TYPE.RECENT })}
            label="최근"
          />
          <ImageUploaderItem
            currentImage={getCurrentImage(MY_IMAGE_TYPE.FRONT)}
            onUpload={(file: File) =>
              handleImageUpload({
                file,
                type: MY_IMAGE_TYPE.FRONT,
              })
            }
            onDelete={() => handleImageDelete({ type: MY_IMAGE_TYPE.FRONT })}
            label="정면"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <ImageUploaderItem
            currentImage={getCurrentImage(MY_IMAGE_TYPE.SIDE)}
            onUpload={(file: File) =>
              handleImageUpload({
                file,
                type: MY_IMAGE_TYPE.SIDE,
              })
            }
            label="측면"
            onDelete={() => handleImageDelete({ type: MY_IMAGE_TYPE.SIDE })}
          />
          <ImageUploaderItem
            currentImage={getCurrentImage(MY_IMAGE_TYPE.WHOLE_BODY) || null}
            onUpload={(file: File) => handleImageUpload({ file, type: MY_IMAGE_TYPE.WHOLE_BODY })}
            onDelete={() => handleImageDelete({ type: MY_IMAGE_TYPE.WHOLE_BODY })}
            label="상반신"
          />
        </div>
      </div>
      <Button theme="white" onClick={handleGuideClick}>
        사진 가이드 확인
      </Button>
    </div>
  );
}
