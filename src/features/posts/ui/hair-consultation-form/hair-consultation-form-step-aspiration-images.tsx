import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import FormItem from '@/shared/ui/form-item';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';
import ImageUploaderList from '@/shared/ui/image-uploader-list';
import { Textarea } from '@/shared';

const MAX_IMAGE_COUNT = 3;

export default function HairConsultationFormStepAspirationImages() {
  const { setValue, control, register, getValues } = useFormContext<HairConsultationFormValues>();

  const watchedImages = useWatch({
    name: `${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.images`,
    control,
  });

  const currentImages = useMemo(() => watchedImages ?? [], [watchedImages]);

  const handleImageUpload = useCallback(
    (file: File[]) => {
      const currentDescription = getValues(
        `${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.description`,
      );
      const newImages = [...currentImages, ...file];

      setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES, {
        images: newImages,
        description: currentDescription,
      });
    },
    [currentImages, setValue, getValues],
  );

  const setImageFiles = useCallback(
    (newImageFiles: File[]) => {
      const currentDescription = getValues(
        `${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.description`,
      );

      setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES, {
        images: newImageFiles,
        description: currentDescription,
      });
    },
    [setValue, getValues],
  );

  return (
    <div className="flex flex-col gap-7">
      <FormItem label="이미지" description="원하는 머리 사진을 업로드해주세요 (최대 3개)">
        <ImageUploaderList
          imageFiles={currentImages}
          onUpload={handleImageUpload}
          setImageFiles={setImageFiles}
          maxImageCount={MAX_IMAGE_COUNT}
        />
      </FormItem>
      <FormItem label="상세 설명">
        <Textarea
          {...register(`${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.description`)}
          placeholder="추구하는 스타일에 대해 구체적으로 설명해주세요"
          className="min-h-38 typo-body-2-long-regular"
          hasBorder
        />
      </FormItem>
    </div>
  );
}
