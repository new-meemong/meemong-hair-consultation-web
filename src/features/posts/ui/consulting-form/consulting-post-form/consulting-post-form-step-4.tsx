import { Textarea } from '@/shared';
import FormItem from '@/shared/ui/form-item';
import ImageUploaderList from '@/shared/ui/image-uploader-list';
import { useFormContext, useWatch } from 'react-hook-form';
import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import type { ConsultingPostFormValues } from '../../../types/consulting-post-form-values';

const MAX_IMAGE_COUNT = 6;

export default function ConsultingPostFormStep4() {
  const { setValue, control, register } = useFormContext<ConsultingPostFormValues>();

  const currentOptionValue = useWatch({
    name: CONSULTING_POST_FORM_FIELD_NAME.option4,
    control,
  });
  const currentImages = currentOptionValue?.images ?? [];

  const handleImageUpload = (file: File) => {
    const newImages = [...currentImages, file];

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
      <FormItem label="추구미 설명">
        <Textarea
          {...register(`${CONSULTING_POST_FORM_FIELD_NAME.option4}.description`)}
          placeholder="어떤 고민이 있는지 상세히 설명해주세요"
          className="min-h-38"
          hasBorder
        />
      </FormItem>
    </div>
  );
}
