import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import FormItem from '@/shared/ui/form-item';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';
import ImageUploaderList from '@/shared/ui/image-uploader-list';
import { Textarea } from '@/shared';
import { resizeImageFile } from '@/shared/lib/resize-image-file';

const MAX_IMAGE_COUNT = 3;
const RESIZE_MAX_SIZE = 1024;

export default function HairConsultationFormStepAspirationImages() {
  const { setValue, control, register, getValues } = useFormContext<HairConsultationFormValues>();
  const aspirationDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const [isAspirationDescriptionFocused, setIsAspirationDescriptionFocused] = useState(false);

  const aspirationDescriptionField = register(
    `${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.description`,
  );

  const watchedImages = useWatch({
    name: `${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.images`,
    control,
  });

  const currentImages = useMemo(() => watchedImages ?? [], [watchedImages]);

  const handleImageUpload = useCallback(
    async (files: File[]) => {
      const currentDescription = getValues(
        `${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.description`,
      );
      const resizedFiles = await Promise.all(
        files.map((file) => resizeImageFile(file, RESIZE_MAX_SIZE)),
      );
      const newImages = [...currentImages, ...resizedFiles];

      setValue(
        HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES,
        {
          images: newImages,
          resizedImages: newImages,
          description: currentDescription,
        },
        { shouldDirty: true },
      );
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
        resizedImages: newImageFiles,
        description: currentDescription,
      });
    },
    [setValue, getValues],
  );

  const scrollAspirationDescriptionIntoView = useCallback(() => {
    aspirationDescriptionRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, []);

  const handleAspirationDescriptionFocus = useCallback(() => {
    setIsAspirationDescriptionFocused(true);
    requestAnimationFrame(() => {
      scrollAspirationDescriptionIntoView();
      setTimeout(() => scrollAspirationDescriptionIntoView(), 200);
      setTimeout(() => scrollAspirationDescriptionIntoView(), 450);
    });
  }, [scrollAspirationDescriptionIntoView]);

  useEffect(() => {
    if (!isAspirationDescriptionFocused) return;

    const handleResize = () => {
      scrollAspirationDescriptionIntoView();
    };

    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, [isAspirationDescriptionFocused, scrollAspirationDescriptionIntoView]);

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
          {...aspirationDescriptionField}
          ref={(node) => {
            aspirationDescriptionField.ref(node);
            aspirationDescriptionRef.current = node;
          }}
          placeholder="추구하는 스타일에 대해 구체적으로 설명해주세요"
          className="min-h-38 typo-body-2-long-regular"
          hasBorder
          onFocus={handleAspirationDescriptionFocus}
          onBlur={(e) => {
            setIsAspirationDescriptionFocused(false);
            aspirationDescriptionField.onBlur(e);
          }}
        />
      </FormItem>
    </div>
  );
}
