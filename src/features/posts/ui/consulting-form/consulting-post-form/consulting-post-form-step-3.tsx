import { Button } from '@/shared';
import { IMAGE_TYPE } from '@/shared/constants/image-type';
import type { ValueOf } from '@/shared/type/types';
import { useFormContext, useWatch } from 'react-hook-form';
import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import useShowConsultingPostImageGuideSheet from '../../../hooks/use-show-consulting-post-image-guide-sheet';
import {
  CONSULTING_POST_FORM_IMAGE_POSITION,
  type ConsultingPostFormValues,
} from '../../../types/consulting-post-form-values';
import ImageUploaderItem from '@/shared/ui/image-uploader-item';

export default function ConsultingPostFormStep3() {
  const { setValue, getValues, control } = useFormContext<ConsultingPostFormValues>();

  const showConsultingPostImageGuideSheet = useShowConsultingPostImageGuideSheet();
  const handleGuideClick = () => {
    showConsultingPostImageGuideSheet();
  };

  const currentImages = useWatch({
    control,
    name: CONSULTING_POST_FORM_FIELD_NAME.option3,
  });

  const getCurrentImage = (position: string) => {
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
  };

  const handleImageUpload = ({
    file,
    position,
  }: {
    file: File;
    position: ValueOf<typeof CONSULTING_POST_FORM_IMAGE_POSITION>;
  }) => {
    const currentImages = getValues(CONSULTING_POST_FORM_FIELD_NAME.option3) || [];
    const newImage = { position, image: file };

    setValue(CONSULTING_POST_FORM_FIELD_NAME.option3, [...currentImages, newImage]);
  };

  const handleImageDelete = ({
    position,
  }: {
    position: ValueOf<typeof CONSULTING_POST_FORM_IMAGE_POSITION>;
  }) => {
    const currentImages = getValues(CONSULTING_POST_FORM_FIELD_NAME.option3) || [];
    const newImages = currentImages.filter(
      (img: { position: string; image: File }) => img.position !== position,
    );
    setValue(CONSULTING_POST_FORM_FIELD_NAME.option3, newImages);
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="grid grid-cols-2 gap-6">
          <ImageUploaderItem
            currentImage={getCurrentImage(CONSULTING_POST_FORM_IMAGE_POSITION.FRONT)}
            onUpload={(file) =>
              handleImageUpload({ file, position: CONSULTING_POST_FORM_IMAGE_POSITION.FRONT })
            }
            onDelete={() =>
              handleImageDelete({ position: CONSULTING_POST_FORM_IMAGE_POSITION.FRONT })
            }
            label="푼머리 정면"
          />
          <ImageUploaderItem
            currentImage={getCurrentImage(CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_FRONT)}
            onUpload={(file) =>
              handleImageUpload({
                file,
                position: CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_FRONT,
              })
            }
            onDelete={() =>
              handleImageDelete({ position: CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_FRONT })
            }
            label="묶은 머리 정면"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <ImageUploaderItem
            currentImage={getCurrentImage(CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_SIDE)}
            onUpload={(file) =>
              handleImageUpload({
                file,
                position: CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_SIDE,
              })
            }
            label="묶은 머리 측면"
            onDelete={() =>
              handleImageDelete({ position: CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_SIDE })
            }
          />
          <ImageUploaderItem
            currentImage={getCurrentImage(CONSULTING_POST_FORM_IMAGE_POSITION.WHOLE) || null}
            onUpload={(file) =>
              handleImageUpload({ file, position: CONSULTING_POST_FORM_IMAGE_POSITION.WHOLE })
            }
            onDelete={() =>
              handleImageDelete({ position: CONSULTING_POST_FORM_IMAGE_POSITION.WHOLE })
            }
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
