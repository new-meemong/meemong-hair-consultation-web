import FormItemWithLabel from '@/shared/ui/form-item-with-label';
import ImageUploaderItem from '@/shared/ui/image-uploader-item';
import { useFormContext } from 'react-hook-form';
import type { ConsultingPostFormValues } from '../../types/consulting-post-form-values';
import { CONSULTING_POST_FORM_FIELD_NAME } from '../../constants/consulting-post-form-field-name';
import type { Image } from '@/shared/ui/image-item';
import { IMAGE_TYPE } from '@/shared/constants/image-type';

const MAX_IMAGE_COUNT = 3;

export default function ConsultingPostFormStep4() {
  const { setValue, getValues } = useFormContext<ConsultingPostFormValues>();

  const currentOptionValue = getValues(CONSULTING_POST_FORM_FIELD_NAME.option4);
  const currentImages = currentOptionValue?.images ?? [];

  const handleImageUpload = (file: File, index: number) => {
    const newImages = [...currentImages];
    newImages[index] = file;

    setValue(CONSULTING_POST_FORM_FIELD_NAME.option4, {
      images: newImages,
      description: currentOptionValue?.description,
    });
  };

  const handleImageDelete = (index: number) => {
    const newImages = [...currentImages];
    newImages.splice(index, 1);

    setValue(CONSULTING_POST_FORM_FIELD_NAME.option4, {
      images: newImages,
      description: currentOptionValue?.description,
    });
  };

  const getCurrentImage = (index: number): Image | null => {
    const file = currentImages[index];
    if (!file) return null;

    return {
      type: IMAGE_TYPE.FILE,
      name: file.name,
      src: URL.createObjectURL(file),
    };
  };

  return (
    <div className="flex flex-col gap-7">
      <FormItemWithLabel
        label="이미지 첨부"
        description={`${MAX_IMAGE_COUNT}개까지 업로드 할 수 있어요`}
      >
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: MAX_IMAGE_COUNT }).map((_, index) => (
            <ImageUploaderItem
              key={index}
              onUpload={(file) => handleImageUpload(file, index)}
              currentImage={getCurrentImage(index)}
              onDelete={() => handleImageDelete(index)}
            />
          ))}
        </div>
      </FormItemWithLabel>
    </div>
  );
}
