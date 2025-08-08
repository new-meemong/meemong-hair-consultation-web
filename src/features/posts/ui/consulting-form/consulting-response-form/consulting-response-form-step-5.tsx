import { useFormContext, useWatch } from 'react-hook-form';

import { Textarea } from '@/shared';
import FormItem from '@/shared/ui/form-item';
import ImageUploaderList from '@/shared/ui/image-uploader-list';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';

const MAX_IMAGE_COUNT = 6;

export default function ConsultingResponseFormStep5() {
  const { register, setValue, control } = useFormContext<ConsultingResponseFormValues>();

  const currentOptionValue = useWatch({
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option5,
    control,
  });
  const currentImages = currentOptionValue?.images ?? [];

  const handleImageUpload = (file: File) => {
    const newImages = [...currentImages, file];

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

  return (
    <div className="flex flex-col gap-7">
      <FormItem label="이미지 첨부" description={`${MAX_IMAGE_COUNT}개까지 업로드 할 수 있어요`}>
        <ImageUploaderList
          images={currentImages}
          onUpload={handleImageUpload}
          onDelete={handleImageDelete}
          maxImageCount={MAX_IMAGE_COUNT}
        />
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
