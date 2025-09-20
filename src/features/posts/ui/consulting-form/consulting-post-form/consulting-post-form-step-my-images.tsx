import { useCallback } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';

import { HAIR_IMAGE_POSITION } from '@/features/posts/constants/hair-image-position';
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
    (position: string) => {
      const currentImage = currentImages?.find(
        (img: { position: string; image: File }) => img.position === position,
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
    ({ file, position }: { file: File; position: ValueOf<typeof HAIR_IMAGE_POSITION> }) => {
      const currentImages = getValues(CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES) || [];
      const newImage = { position, image: file };

      setValue(CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES, [...currentImages, newImage]);
    },
    [getValues, setValue],
  );

  const handleImageDelete = useCallback(
    ({ position }: { position: ValueOf<typeof HAIR_IMAGE_POSITION> }) => {
      const currentImages = getValues(CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES) || [];
      const newImages = currentImages.filter(
        (img: { position: string; image: File }) => img.position !== position,
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
            currentImage={getCurrentImage(HAIR_IMAGE_POSITION.FRONT_LOOSE)}
            onUpload={(file: File) =>
              handleImageUpload({ file, position: HAIR_IMAGE_POSITION.FRONT_LOOSE })
            }
            onDelete={() => handleImageDelete({ position: HAIR_IMAGE_POSITION.FRONT_LOOSE })}
            label="푼머리 정면"
          />
          <ImageUploaderItem
            currentImage={getCurrentImage(HAIR_IMAGE_POSITION.FRONT_TIED)}
            onUpload={(file: File) =>
              handleImageUpload({
                file,
                position: HAIR_IMAGE_POSITION.FRONT_TIED,
              })
            }
            onDelete={() => handleImageDelete({ position: HAIR_IMAGE_POSITION.FRONT_TIED })}
            label="묶은 머리 정면"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <ImageUploaderItem
            currentImage={getCurrentImage(HAIR_IMAGE_POSITION.SIDE_TIED)}
            onUpload={(file: File) =>
              handleImageUpload({
                file,
                position: HAIR_IMAGE_POSITION.SIDE_TIED,
              })
            }
            label="묶은 머리 측면"
            onDelete={() => handleImageDelete({ position: HAIR_IMAGE_POSITION.SIDE_TIED })}
          />
          <ImageUploaderItem
            currentImage={getCurrentImage(HAIR_IMAGE_POSITION.UPPER_BODY) || null}
            onUpload={(file: File) =>
              handleImageUpload({ file, position: HAIR_IMAGE_POSITION.UPPER_BODY })
            }
            onDelete={() => handleImageDelete({ position: HAIR_IMAGE_POSITION.UPPER_BODY })}
            label="상반신 전체"
          />
        </div>
      </div>
      <Button theme="white" onClick={handleGuideClick}>
        사진 가이드 확인
      </Button>
    </div>
  );
}
