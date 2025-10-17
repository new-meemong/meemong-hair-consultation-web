import { useCallback, useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';

import { Textarea } from '@/shared';
import FormItem from '@/shared/ui/form-item';
import ImageUploaderList from '@/shared/ui/image-uploader-list';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';

const MAX_IMAGE_COUNT = 6;

export default function ConsultingResponseFormStepStyle() {
  const { register, setValue, control, getValues } = useFormContext<ConsultingResponseFormValues>();

  const currentWatchedImageFiles = useWatch({
    name: `${CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE}.imageFiles`,
    control,
  });

  const currentWatchedImageUrls = useWatch({
    name: `${CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE}.imageUrls`,
    control,
  });

  const currentImageFiles = useMemo(() => {
    return currentWatchedImageFiles ?? [];
  }, [currentWatchedImageFiles]);

  const currentImageUrls = useMemo(() => {
    return currentWatchedImageUrls ?? [];
  }, [currentWatchedImageUrls]);

  const handleImageUpload = useCallback(
    (file: File[]) => {
      const newImages = [...currentImageFiles, ...file];
      const currentStyleValue = getValues(CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE);

      setValue(
        CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE,
        {
          ...currentStyleValue,
          imageFiles: newImages,
        },
        { shouldDirty: true },
      );
    },
    [currentImageFiles, getValues, setValue],
  );

  const setImageFiles = useCallback(
    (newImageFiles: File[]) => {
      const currentStyleValue = getValues(CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE);

      setValue(
        CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE,
        {
          ...currentStyleValue,
          imageFiles: newImageFiles,
        },
        { shouldDirty: true },
      );
    },
    [getValues, setValue],
  );

  const setImageUrls = useCallback(
    (newImageUrls: string[]) => {
      const currentStyleValue = getValues(CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE);

      setValue(
        CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE,
        {
          ...currentStyleValue,
          imageUrls: newImageUrls,
        },
        { shouldDirty: true },
      );
    },
    [getValues, setValue],
  );

  return (
    <div className="flex flex-col gap-7">
      <FormItem label="이미지 첨부" description={`${MAX_IMAGE_COUNT}개까지 업로드 할 수 있어요`}>
        <ImageUploaderList
          imageFiles={currentImageFiles}
          imageUrls={currentImageUrls}
          onUpload={handleImageUpload}
          setImageFiles={setImageFiles}
          setImageUrls={setImageUrls}
          maxImageCount={MAX_IMAGE_COUNT}
        />
      </FormItem>
      <FormItem label="스타일 설명">
        <Textarea
          {...register(`${CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE}.description`)}
          placeholder="어울리는 스타일을 설명해주세요"
          className="min-h-38"
          hasBorder
        />
      </FormItem>
    </div>
  );
}
