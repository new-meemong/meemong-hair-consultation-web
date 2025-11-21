import { useCallback, useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';

import FormItem from '@/shared/ui/form-item';
import ImageUploaderList from '@/shared/ui/image-uploader-list';

import { Textarea } from '@/shared';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import type { ConsultingPostFormValues } from '../../../types/consulting-post-form-values';

const MAX_IMAGE_COUNT = 6;

export default function ConsultingPostFormStepAspirationImages() {
  const { setValue, control, register, getValues } = useFormContext<ConsultingPostFormValues>();

  const watchedImages = useWatch({
    name: `${CONSULTING_POST_FORM_FIELD_NAME.ASPIRATION_IMAGES}.images`,
    control,
  });

  const currentImages = useMemo(() => watchedImages ?? [], [watchedImages]);

  const handleImageUpload = useCallback(
    (file: File[]) => {
      const currentDescription = getValues(
        `${CONSULTING_POST_FORM_FIELD_NAME.ASPIRATION_IMAGES}.description`,
      );
      const newImages = [...currentImages, ...file];

      setValue(CONSULTING_POST_FORM_FIELD_NAME.ASPIRATION_IMAGES, {
        images: newImages,
        description: currentDescription,
      });
    },
    [currentImages, setValue, getValues],
  );

  const setImageFiles = useCallback(
    (newImageFiles: File[]) => {
      const currentDescription = getValues(
        `${CONSULTING_POST_FORM_FIELD_NAME.ASPIRATION_IMAGES}.description`,
      );

      setValue(CONSULTING_POST_FORM_FIELD_NAME.ASPIRATION_IMAGES, {
        images: newImageFiles,
        description: currentDescription,
      });
    },
    [setValue, getValues],
  );

  return (
    <div className="flex flex-col gap-7">
      <FormItem label="이미지 첨부" description={`${MAX_IMAGE_COUNT}개까지 업로드 할 수 있어요`}>
        <ImageUploaderList
          imageFiles={currentImages}
          onUpload={handleImageUpload}
          setImageFiles={setImageFiles}
          maxImageCount={MAX_IMAGE_COUNT}
        />
      </FormItem>
      <FormItem label="추구미 설명">
        <Textarea
          {...register(`${CONSULTING_POST_FORM_FIELD_NAME.ASPIRATION_IMAGES}.description`)}
          placeholder="원하는 느낌, 추구미 등 디자이너가 추천에 참고할 내용을 입력해주세요."
          className="min-h-38"
          hasBorder
        />
      </FormItem>
    </div>
  );
}
