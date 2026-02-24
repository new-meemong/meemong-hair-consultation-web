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
const getFileKey = (file: File) => `${file.name}-${file.lastModified}`;

export default function HairConsultationFormStepAspirationImages() {
  const { setValue, control, register, getValues } = useFormContext<HairConsultationFormValues>();
  const resizingKeysRef = useRef(new Set<string>());
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
    (file: File[]) => {
      const currentDescription = getValues(
        `${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.description`,
      );
      const currentResizedImages =
        getValues(`${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.resizedImages`) ?? [];
      const newImages = [...currentImages, ...file];

      setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES, {
        images: newImages,
        resizedImages: currentResizedImages,
        description: currentDescription,
      });

      void Promise.all(
        file.map(async (imageFile) => {
          const key = getFileKey(imageFile);
          const currentResizedKeys = new Set(currentResizedImages.map(getFileKey));

          if (currentResizedKeys.has(key) || resizingKeysRef.current.has(key)) {
            return;
          }

          resizingKeysRef.current.add(key);
          try {
            const resizedFile = await resizeImageFile(imageFile, RESIZE_MAX_SIZE);
            const latestValue = getValues(HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES);
            const latestImages = latestValue?.images ?? [];

            if (!latestImages.some((item) => getFileKey(item) === key)) {
              return;
            }

            const latestResizedImages = latestValue?.resizedImages ?? [];
            if (latestResizedImages.some((item) => getFileKey(item) === key)) {
              return;
            }

            setValue(
              HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES,
              {
                images: latestImages,
                resizedImages: [...latestResizedImages, resizedFile],
                description: latestValue?.description ?? '',
              },
              { shouldDirty: true },
            );
          } finally {
            resizingKeysRef.current.delete(key);
          }
        }),
      ).catch(() => {
        resizingKeysRef.current.clear();
      });
    },
    [currentImages, setValue, getValues],
  );

  const setImageFiles = useCallback(
    (newImageFiles: File[]) => {
      const currentDescription = getValues(
        `${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.description`,
      );
      const currentResizedImages =
        getValues(`${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.resizedImages`) ?? [];
      const imageKeys = new Set(newImageFiles.map(getFileKey));
      const nextResizedImages = currentResizedImages.filter((file) =>
        imageKeys.has(getFileKey(file)),
      );

      setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES, {
        images: newImageFiles,
        resizedImages: nextResizedImages,
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
