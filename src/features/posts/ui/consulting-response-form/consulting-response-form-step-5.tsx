import { Textarea } from '@/shared';
import FormItem from '@/shared/ui/form-item';
import ImageUploaderItem from '@/shared/ui/image-uploader-item';
import { useFormContext, useWatch } from 'react-hook-form';
import type { ConsultingResponseFormValues } from '../../types/consulting-response-form-values';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../constants/consulting-response-form-field-name';
import type { Image } from '@/shared/ui/image-item';
import { IMAGE_TYPE } from '@/shared/constants/image-type';

const MAX_IMAGE_COUNT = 6;

export default function ConsultingResponseFormStep5() {
  const { register, setValue, control } = useFormContext<ConsultingResponseFormValues>();

  const currentOptionValue = useWatch({
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option5,
    control,
  });
  const currentImages = currentOptionValue?.images ?? [];

  const handleImageUpload = (file: File, index: number) => {
    const newImages = [...currentImages];
    newImages[index] = file;

    setValue(CONSULTING_RESPONSE_FORM_FIELD_NAME.option5, {
      images: newImages,
      description: currentOptionValue?.description,
    });
  };

  const handleImageDelete = (index: number) => {
    const newImages = [...currentImages];
    newImages.splice(index, 1);

    setValue(CONSULTING_RESPONSE_FORM_FIELD_NAME.option5, {
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
      <FormItem label="이미지 첨부" description={`${MAX_IMAGE_COUNT}개까지 업로드 할 수 있어요`}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {Array.from({ length: MAX_IMAGE_COUNT }).map((_, index) => (
            <ImageUploaderItem
              key={index}
              onUpload={(file) => handleImageUpload(file, index)}
              currentImage={getCurrentImage(index)}
              onDelete={() => handleImageDelete(index)}
            />
          ))}
        </div>
      </FormItem>
      <FormItem label="스타일 설명">
        <Textarea
          {...register(`${CONSULTING_RESPONSE_FORM_FIELD_NAME.option5}.description`)}
          placeholder="추천하는 스타일을 설명해보세요"
          className="min-h-38"
          hasBorder
        />
      </FormItem>
    </div>
  );
}
